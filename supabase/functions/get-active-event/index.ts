import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Simple in-memory cache (5 min TTL)
const cache = new Map<string, { data: unknown; expiresAt: number }>();
function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}
function setCache(key: string, data: unknown, ttlMs = 300000) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const destino = url.searchParams.get('destino');

    if (!destino) {
      return new Response(JSON.stringify({ error: 'Missing destino parameter' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check cache
    const cacheKey = `active-event:${destino}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const today = new Date().toISOString();

    // Get highest priority active event for this destination
    const { data: evento, error: eventoError } = await supabase
      .from('eventos')
      .select('*')
      .eq('destino', destino)
      .eq('ativo', true)
      .lte('data_inicio', today)
      .gte('data_fim', today)
      .order('prioridade', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (eventoError) {
      console.error('Error fetching event:', eventoError);
      return new Response(JSON.stringify({ evento: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!evento) {
      const result = { evento: null };
      setCache(cacheKey, result);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
      });
    }

    // Fetch sponsors
    const { data: sponsors } = await supabase
      .from('evento_sponsors')
      .select('*')
      .eq('evento_id', evento.id)
      .eq('ativo', true)
      .order('prioridade', { ascending: false });

    // Fetch placements with sponsor info
    const { data: placements } = await supabase
      .from('evento_sponsor_placements')
      .select('*, evento_sponsors(sponsor_nome, sponsor_slug, logo_url, badge_texto, link_url)')
      .eq('evento_id', evento.id)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    // Count items by type
    const { data: itemCounts } = await supabase
      .from('evento_itens')
      .select('tipo')
      .eq('evento_id', evento.id)
      .eq('ativo', true);

    const countsByType: Record<string, number> = {};
    for (const item of itemCounts || []) {
      countsByType[item.tipo] = (countsByType[item.tipo] || 0) + 1;
    }

    const result = {
      evento: {
        ...evento,
        sponsors: sponsors || [],
        placements: placements || [],
        item_counts: countsByType,
      },
    };

    setCache(cacheKey, result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
