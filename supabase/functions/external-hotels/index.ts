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

    const { data, error, count } = await externalClient
      .from("hoteis")
      .select("*", { count: "exact" })
      .eq("ativo", true)
      .order("ordem_bairro", { ascending: true })
      .order("nome", { ascending: true })
      .limit(100);

    console.log("External query result:", { count, dataLength: data?.length, error });

    if (error) {
      console.error("External DB error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ hotels: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("external-hotels error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
