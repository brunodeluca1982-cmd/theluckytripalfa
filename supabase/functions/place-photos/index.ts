import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Basic in-memory rate limiter by IP (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. POST only
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // 2. Rate limit by IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return errorResponse('Rate limit exceeded. Try again later.', 429);
    }

    // 4. Parse and validate JSON body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Invalid JSON body', 400);
    }

    const { action } = body;

    // 5. Google API key (server-side only)
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_MAPS_API_KEY) {
      return errorResponse('API key not configured', 500);
    }

    // Admin client for DB writes
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // === Action: fetch-photo ===
    if (action === 'fetch-photo') {
      const { item_id, item_type, place_query } = body as {
        item_id?: string; item_type?: string; place_query?: string;
      };

      // Input validation
      if (!item_id || typeof item_id !== 'string' || item_id.length > 100) {
        return errorResponse('Invalid item_id', 400);
      }
      if (!item_type || !['hotel', 'restaurant', 'attraction', 'block'].includes(item_type as string)) {
        return errorResponse('Invalid item_type', 400);
      }
      if (!place_query || typeof place_query !== 'string' || place_query.length > 300) {
        return errorResponse('Invalid place_query', 400);
      }

      // Check cache first
      const { data: cached } = await supabaseAdmin
        .from('place_photos')
        .select('*')
        .eq('item_id', item_id)
        .eq('item_type', item_type)
        .maybeSingle();

      if (cached?.photo_url) {
        return new Response(JSON.stringify({ photo: cached }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Step 1: Try Google Places Text Search
      let placeId: string | null = null;
      let photoUrl: string | null = null;
      let photoSource: 'places' | 'streetview' | 'none' = 'none';

      try {
        const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
        searchUrl.searchParams.set('input', place_query);
        searchUrl.searchParams.set('inputtype', 'textquery');
        searchUrl.searchParams.set('fields', 'place_id,photos');
        searchUrl.searchParams.set('key', GOOGLE_MAPS_API_KEY);

        const searchRes = await fetch(searchUrl.toString());
        const searchData = await searchRes.json();

        if (searchData.candidates?.length > 0) {
          const candidate = searchData.candidates[0];
          placeId = candidate.place_id || null;

          if (candidate.photos?.length > 0) {
            const photoRef = candidate.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`;
            photoSource = 'places';
          }
        }
      } catch (e) {
        console.error('Places search failed');
      }

      // Step 2: Fallback to Street View
      if (!photoUrl) {
        try {
          const svMetaUrl = new URL('https://maps.googleapis.com/maps/api/streetview/metadata');
          svMetaUrl.searchParams.set('location', place_query);
          svMetaUrl.searchParams.set('key', GOOGLE_MAPS_API_KEY);

          const svRes = await fetch(svMetaUrl.toString());
          const svData = await svRes.json();

          if (svData.status === 'OK') {
            photoUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${encodeURIComponent(place_query)}&key=${GOOGLE_MAPS_API_KEY}`;
            photoSource = 'streetview';
          }
        } catch (e) {
          console.error('Street View fallback failed');
        }
      }

      // Step 3: Upsert cache
      const record = {
        item_id,
        item_type,
        place_query,
        place_id: placeId,
        photo_url: photoUrl,
        photo_source: photoSource,
        photo_last_fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabaseAdmin
        .from('place_photos')
        .upsert(record, { onConflict: 'item_id,item_type' });

      return new Response(JSON.stringify({ photo: record }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === Action: batch-lookup ===
    if (action === 'batch-lookup') {
      const { items } = body as { items?: Array<{ item_id: string }> };
      if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
        return errorResponse('Invalid items array (max 100)', 400);
      }

      const ids = items.map((i) => i.item_id);
      const { data } = await supabaseAdmin
        .from('place_photos')
        .select('*')
        .in('item_id', ids);

      return new Response(JSON.stringify({ photos: data || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === Action: proxy-photo ===
    if (action === 'proxy-photo') {
      const { url } = body as { url?: string };
      if (!url || typeof url !== 'string' || url.length > 500) {
        return errorResponse('Missing or invalid url', 400);
      }

      if (!url.startsWith('https://maps.googleapis.com/') && !url.startsWith('https://lh3.googleusercontent.com/')) {
        return errorResponse('Invalid URL domain', 400);
      }

      const imgRes = await fetch(url);
      const imgBuffer = await imgRes.arrayBuffer();
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';

      return new Response(imgBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return errorResponse('Invalid action', 400);
  } catch (error) {
    console.error('Internal error in place-photos function');
    return errorResponse('Internal server error', 500);
  }
});
