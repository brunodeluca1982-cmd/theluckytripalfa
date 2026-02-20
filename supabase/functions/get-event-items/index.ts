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
    const url = new URL(req.url);
    const eventoSlug = url.searchParams.get('evento_slug');
    const tipo = url.searchParams.get('tipo');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (!eventoSlug) {
      return new Response(JSON.stringify({ error: 'Missing evento_slug parameter' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get evento by slug
    const { data: evento } = await supabase
      .from('eventos')
      .select('id')
      .eq('slug', eventoSlug)
      .eq('ativo', true)
      .maybeSingle();

    if (!evento) {
      return new Response(JSON.stringify({ items: [], total: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let query = supabase
      .from('evento_itens')
      .select('*, evento_item_sponsored(badge_texto, destaque, sponsor_id, evento_sponsors(sponsor_nome, logo_url, link_url))', { count: 'exact' })
      .eq('evento_id', evento.id)
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .order('data_inicio', { ascending: true })
      .range(offset, offset + limit - 1);

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data: items, count, error } = await query;

    if (error) {
      console.error('Error fetching items:', error);
      return new Response(JSON.stringify({ items: [], total: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ items: items || [], total: count || 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
