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

    // Parse optional filters
    let filters: { cidade?: string; bairro?: string; categoria?: string } = {};
    if (req.method === "POST") {
      try { filters = await req.json(); } catch { /* ignore */ }
    } else {
      const url = new URL(req.url);
      if (url.searchParams.get("cidade")) filters.cidade = url.searchParams.get("cidade")!;
      if (url.searchParams.get("bairro")) filters.bairro = url.searchParams.get("bairro")!;
      if (url.searchParams.get("categoria")) filters.categoria = url.searchParams.get("categoria")!;
    }

    let query = externalClient
      .from("experiences")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    if (filters.cidade) query = query.eq("cidade", filters.cidade);
    if (filters.bairro) query = query.eq("bairro", filters.bairro);
    if (filters.categoria) query = query.eq("categoria", filters.categoria);

    query = query
      .order("ordem_bairro", { ascending: true })
      .order("nome", { ascending: true })
      .limit(200);

    const { data, error, count } = await query;

    console.log("External experiencias result:", { count, dataLength: data?.length, error });

    if (error) {
      console.error("External DB error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ experiencias: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("external-experiencias error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
