// batch-geocode v2
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

interface GeoResult {
  id: string;
  nome: string;
  lat: number | null;
  lng: number | null;
  geocode_status: 'ok' | 'not_found' | 'error';
  error?: string;
}

async function geocodeOne(exp: { id: string; nome: string; bairro?: string; cidade?: string }): Promise<GeoResult> {
  const base: GeoResult = { id: exp.id, nome: exp.nome, lat: null, lng: null, geocode_status: 'error' };

  try {
    const parts = [exp.nome, exp.bairro, exp.cidade, 'Brasil'].filter(Boolean);
    const q = parts.join(' ');

    const autoUrl = `${SUPABASE_URL}/functions/v1/places-autocomplete?input=${encodeURIComponent(q)}&city=${encodeURIComponent(exp.cidade || 'Rio de Janeiro')}`;
    const autoResp = await fetch(autoUrl, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    const autoData = await autoResp.json();

    if (!autoResp.ok || !autoData.predictions || autoData.predictions.length === 0) {
      return { ...base, geocode_status: 'not_found', error: 'places-autocomplete returned 0 results' };
    }

    const placeId = autoData.predictions[0].place_id;
    if (!placeId) {
      return { ...base, geocode_status: 'not_found', error: 'No place_id in first prediction' };
    }

    const detUrl = `${SUPABASE_URL}/functions/v1/places-details?place_id=${encodeURIComponent(placeId)}`;
    const detResp = await fetch(detUrl, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    const detData = await detResp.json();

    if (!detResp.ok || !detData.place) {
      return { ...base, geocode_status: 'not_found', error: 'places-details failed or returned no place' };
    }

    const lat = detData.place.lat;
    const lng = detData.place.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { ...base, geocode_status: 'not_found', error: 'places-details has no lat/lng' };
    }

    return { id: exp.id, nome: exp.nome, lat, lng, geocode_status: 'ok' };
  } catch (err) {
    return { ...base, geocode_status: 'error', error: String(err) };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '5', 10), 50);

    const expResp = await fetch(`${SUPABASE_URL}/functions/v1/external-experiencias`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const expJson = await expResp.json();
    const allExp = expJson.experiencias || [];

    if (allExp.length === 0) {
      return new Response(JSON.stringify({ results: [], message: 'No experiencias found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const toProcess = allExp.slice(0, limit);

    const results: GeoResult[] = [];
    for (const exp of toProcess) {
      const result = await geocodeOne(exp);
      console.log(`Geocode ${exp.id} (${exp.nome}): status=${result.geocode_status} lat=${result.lat} lng=${result.lng}`);
      results.push(result);

      if (toProcess.indexOf(exp) < toProcess.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    const summary = {
      total: toProcess.length,
      ok: results.filter(r => r.geocode_status === 'ok').length,
      not_found: results.filter(r => r.geocode_status === 'not_found').length,
      error: results.filter(r => r.geocode_status === 'error').length,
    };

    return new Response(JSON.stringify({ results, summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('batch-geocode error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
