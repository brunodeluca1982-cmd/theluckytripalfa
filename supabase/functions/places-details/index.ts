import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const placeId = url.searchParams.get('place_id');

    if (!placeId || placeId.length > 300) {
      return new Response(JSON.stringify({ error: 'Invalid place_id' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_MAPS_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check cache first
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: cached } = await supabaseAdmin
      .from('places_cache')
      .select('*')
      .eq('place_id', placeId)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({ place: cached }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch from Google
    const apiUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    apiUrl.searchParams.set('place_id', placeId);
    apiUrl.searchParams.set('key', GOOGLE_MAPS_API_KEY);
    apiUrl.searchParams.set('language', 'pt-BR');
    apiUrl.searchParams.set('fields', 'place_id,name,types,formatted_address,geometry/location,rating,user_ratings_total,price_level,website,formatted_phone_number,url,photos');

    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google API error:', data.status, data.error_message);
      return new Response(JSON.stringify({ error: 'Details lookup failed' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const r = data.result;
    const photoRefs = (r.photos || []).slice(0, 5).map((p: any) => p.photo_reference);

    const normalized = {
      place_id: r.place_id,
      name: r.name,
      types: r.types || [],
      address: r.formatted_address || '',
      lat: r.geometry?.location?.lat || null,
      lng: r.geometry?.location?.lng || null,
      rating: r.rating || null,
      user_ratings_total: r.user_ratings_total || null,
      price_level: r.price_level || null,
      website: r.website || null,
      phone: r.formatted_phone_number || null,
      google_maps_url: r.url || null,
      photo_refs: photoRefs,
    };

    // Upsert into cache using service role
    const { data: upserted, error: upsertError } = await supabaseAdmin
      .from('places_cache')
      .upsert(normalized, { onConflict: 'place_id' })
      .select()
      .single();

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      // Still return the data even if cache fails
      return new Response(JSON.stringify({ place: normalized }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ place: upserted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
