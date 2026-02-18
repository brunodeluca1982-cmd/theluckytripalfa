import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const EXTERNAL_URL = "https://lsibzflaaqzvtzjlvrxw.supabase.co";
    const EXTERNAL_KEY = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");
    if (!EXTERNAL_KEY) {
      throw new Error("EXTERNAL_SUPABASE_ANON_KEY is not configured");
    }

    const externalClient = createClient(EXTERNAL_URL, EXTERNAL_KEY);

    // Parse optional filters from query params or body
    let filters: { cidade?: string; bairro?: string } = {};
    if (req.method === "POST") {
      try {
        filters = await req.json();
      } catch { /* ignore parse errors */ }
    } else {
      const url = new URL(req.url);
      if (url.searchParams.get("cidade")) filters.cidade = url.searchParams.get("cidade")!;
      if (url.searchParams.get("bairro")) filters.bairro = url.searchParams.get("bairro")!;
    }

    let query = externalClient
      .from("restaurantes")
      .select("*", { count: "exact" })
      .eq("ativo", true);

    if (filters.cidade) {
      query = query.eq("cidade", filters.cidade);
    }
    if (filters.bairro) {
      query = query.eq("bairro", filters.bairro);
    }

    query = query
      .order("ordem_bairro", { ascending: true })
      .order("nome", { ascending: true })
      .limit(200);

    const { data, error, count } = await query;

    console.log("External restaurantes result:", { count, dataLength: data?.length, error });

    if (error) {
      console.error("External DB error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ restaurants: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("external-restaurantes error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
