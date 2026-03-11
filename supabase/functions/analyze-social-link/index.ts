import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Try to extract OG/meta info from an Instagram or TikTok page */
async function scrapePageMeta(url: string): Promise<{
  title: string;
  description: string;
  siteName: string;
}> {
  const defaults = { title: "", description: "", siteName: "" };
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (!resp.ok) return defaults;

    const html = await resp.text();

    const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/);
    const ogDesc = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"/);
    const ogSite = html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"/) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:site_name"/);
    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    return {
      title: ogTitle?.[1] || titleTag?.[1] || "",
      description: ogDesc?.[1] || "",
      siteName: ogSite?.[1] || "",
    };
  } catch (e) {
    console.error("scrapePageMeta error:", e);
    return defaults;
  }
}

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

    // 1. Scrape page metadata
    console.log("Scraping metadata for:", url);
    const meta = await scrapePageMeta(url);
    console.log("Metadata:", JSON.stringify(meta));

    // 2. Fetch curated data from both databases

    // Primary Supabase (experiences)
    const PRIMARY_URL = Deno.env.get("SUPABASE_URL")!;
    const PRIMARY_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const primaryDb = createClient(PRIMARY_URL, PRIMARY_KEY);

    const { data: primaryExperiences } = await primaryDb
      .from("experiences")
      .select("slug, title, neighborhood, category, short_description")
      .eq("is_active", true);

    // External Supabase (legacy restaurants + hotels)
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

    const catalog = [
      // Primary experiences first (canonical)
      ...(primaryExperiences || []).map((e: any) => `EXP|${e.slug}|${e.title}|${e.neighborhood || ""}|${e.category || ""}||${e.short_description?.slice(0, 80) || ""}`),
      // Legacy experiences
      ...experiencias.map((e: any) => `EXP|${e.id}|${e.nome}|${e.bairro}|${e.categoria}|${e.vibe || ""}|${e.meu_olhar?.slice(0, 80) || ""}`),
      ...restaurantes.map((r: any) => `REST|${r.id}|${r.nome}|${r.bairro}|${r.categoria}|${r.tipo_cozinha || ""}|${r.meu_olhar?.slice(0, 80) || ""}`),
      ...hoteis.map((h: any) => `HOTEL|${h.id}|${h.nome}|${h.bairro}|${h.categoria || ""}||${h.meu_olhar?.slice(0, 80) || ""}`),
    ].join("\n");

    // 3. Use AI to analyze the link + scraped metadata
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const metaContext = [
      meta.title && `Page title: "${meta.title}"`,
      meta.description && `Description/caption: "${meta.description}"`,
      meta.siteName && `Source: ${meta.siteName}`,
    ].filter(Boolean).join("\n");

    const systemPrompt = `You are a travel content analyzer for Rio de Janeiro.
The user will give you a social media URL and any metadata we could extract from the page.

SCRAPED METADATA:
${metaContext || "No metadata could be extracted. Analyze based on URL structure only."}

Based on the URL structure, metadata, caption text, hashtags, and location tags, identify:
1. What place, activity, or experience the post is about
2. The neighborhood or area in Rio de Janeiro
3. The type of activity (beach, restaurant, nightlife, viewpoint, culture, etc.)

Then match it against the CATALOG below and return 2-5 matching items.

CATALOG FORMAT: TYPE|ID|NAME|NEIGHBORHOOD|CATEGORY|EXTRA|DESCRIPTION
${catalog}

RULES:
- ONLY return items that exist in the catalog above
- Match by neighborhood, activity type, vibe, or theme
- If the content mentions a beach → match beach experiences
- If it mentions food/restaurant → match restaurants
- If it mentions a specific neighborhood → prioritize that area
- The "interpretation" field should be a clear, friendly sentence in Portuguese describing what the inspiration is about
- Include the detected location and activity type in the interpretation

OUTPUT FORMAT (strict JSON, no markdown):
{
  "interpretation": "Pôr do sol no Arpoador — mirante e experiência ao ar livre em Ipanema",
  "detected": {
    "location": "Arpoador",
    "city": "Rio de Janeiro",
    "activity": "sunset viewpoint",
    "neighborhood": "Ipanema"
  },
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
                    description: "Friendly sentence in Portuguese describing the travel inspiration",
                  },
                  detected: {
                    type: "object",
                    properties: {
                      location: { type: "string" },
                      city: { type: "string" },
                      activity: { type: "string" },
                      neighborhood: { type: "string" },
                    },
                    required: ["location", "city", "activity"],
                    additionalProperties: false,
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
                required: ["interpretation", "detected", "suggestions"],
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

    let result: any = { interpretation: "", detected: null, suggestions: [] };
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

    // Include scraped metadata in response for frontend display
    result.meta = {
      title: meta.title,
      description: meta.description,
      siteName: meta.siteName,
    };

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
