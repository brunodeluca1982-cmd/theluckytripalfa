import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_MAPS_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const body = await req.json();
    const { action } = body;

    // Action: fetch-photo — find a place photo and cache it
    if (action === 'fetch-photo') {
      const { item_id, item_type, place_query } = body;
      if (!item_id || !item_type || !place_query) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
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

        console.log('[place-photos] Searching for:', place_query);
        const searchRes = await fetch(searchUrl.toString());
        const searchData = await searchRes.json();
        console.log('[place-photos] Search result status:', searchData.status, 'candidates:', searchData.candidates?.length || 0);
        if (searchData.error_message) {
          console.error('[place-photos] API error:', searchData.error_message);
        }

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
        console.error('Places search error:', e);
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
          console.error('Street View error:', e);
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

    // Action: batch-lookup — check cache for multiple items
    if (action === 'batch-lookup') {
      const { items } = body; // [{item_id, item_type}]
      if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ photos: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const ids = items.map((i: { item_id: string }) => i.item_id);
      const { data } = await supabaseAdmin
        .from('place_photos')
        .select('*')
        .in('item_id', ids);

      return new Response(JSON.stringify({ photos: data || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: proxy-photo — proxy an image to avoid CORS
    if (action === 'proxy-photo') {
      const { url } = body;
      if (!url || typeof url !== 'string') {
        return new Response(JSON.stringify({ error: 'Missing url' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Only allow Google APIs URLs
      if (!url.startsWith('https://maps.googleapis.com/') && !url.startsWith('https://lh3.googleusercontent.com/')) {
        return new Response(JSON.stringify({ error: 'Invalid URL domain' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
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

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in place-photos function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
