import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch curated data from external Supabase
    const EXTERNAL_URL = "https://lsibzflaaqzvtzjlvrxw.supabase.co";
    const EXTERNAL_KEY = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");
    if (!EXTERNAL_KEY) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ext = createClient(EXTERNAL_URL, EXTERNAL_KEY);

    const [expRes, restRes, hotelRes] = await Promise.all([
      ext.from("experiencias").select("id, nome, bairro, categoria, meu_olhar, vibe, tags").eq("ativo", true).limit(500),
      ext.from("restaurantes").select("id, nome, bairro, categoria, meu_olhar, tipo_cozinha").eq("ativo", true).limit(500),
      ext.from("hoteis").select("id, nome, bairro, meu_olhar, categoria").eq("ativo", true).limit(200),
    ]);

    const experiencias = expRes.data || [];
    const restaurantes = restRes.data || [];
    const hoteis = hotelRes.data || [];

    // Build a compact catalog for the AI
    const catalog = [
      ...experiencias.map((e: any) => `EXP|${e.id}|${e.nome}|${e.bairro}|${e.categoria}|${e.vibe || ""}|${e.meu_olhar?.slice(0, 80) || ""}`),
      ...restaurantes.map((r: any) => `REST|${r.id}|${r.nome}|${r.bairro}|${r.categoria}|${r.tipo_cozinha || ""}|${r.meu_olhar?.slice(0, 80) || ""}`),
      ...hoteis.map((h: any) => `HOTEL|${h.id}|${h.nome}|${h.bairro}|${h.categoria || ""}||${h.meu_olhar?.slice(0, 80) || ""}`),
    ].join("\n");

    // 2. Use AI to analyze the link and match against catalog
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a travel content analyzer for Rio de Janeiro. 
The user will give you a social media URL (Instagram, TikTok, etc).

Based on the URL structure (location tags, hashtags in URL, username context), identify what place, activity, or experience the post is about.

Then match it against the CATALOG below and return 2-5 matching items from the catalog.

CATALOG FORMAT: TYPE|ID|NAME|NEIGHBORHOOD|CATEGORY|EXTRA|DESCRIPTION
${catalog}

RULES:
- ONLY return items that exist in the catalog above
- Match by neighborhood, activity type, vibe, or theme
- If the URL mentions a beach → match beach experiences
- If it mentions food/restaurant → match restaurants
- If it mentions a specific neighborhood → prioritize that area
- Return results as JSON array

OUTPUT FORMAT (strict JSON, no markdown):
{
  "interpretation": "Brief description of what the link seems to be about",
  "suggestions": [
    {
      "type": "experience" | "restaurant" | "hotel",
      "id": "catalog ID",
      "nome": "catalog name",
      "bairro": "neighborhood",
      "meu_olhar": "brief curator note from catalog"
    }
  ]
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this social media link and suggest matching experiences from the catalog: ${url}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_places",
              description: "Return matching places from the catalog based on the social media link analysis",
              parameters: {
                type: "object",
                properties: {
                  interpretation: {
                    type: "string",
                    description: "Brief description of what the link is about",
                  },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["experience", "restaurant", "hotel"] },
                        id: { type: "string" },
                        nome: { type: "string" },
                        bairro: { type: "string" },
                        meu_olhar: { type: "string" },
                      },
                      required: ["type", "id", "nome", "bairro"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["interpretation", "suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_places" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "Erro ao analisar o link" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();

    // Extract from tool call response
    let result = { interpretation: "", suggestions: [] };
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        result = JSON.parse(toolCall.function.arguments);
      } catch {
        console.error("Failed to parse tool call arguments");
      }
    }

    // Validate suggestions exist in catalog
    const validIds = new Set([
      ...experiencias.map((e: any) => e.id),
      ...restaurantes.map((r: any) => r.id),
      ...hoteis.map((h: any) => h.id),
    ]);

    result.suggestions = (result.suggestions || []).filter((s: any) => validIds.has(s.id));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-social-link error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
