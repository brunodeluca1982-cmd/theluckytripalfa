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
    const { anchor, days = 3, userId } = await req.json();

    if (!anchor || !anchor.detected) {
      return new Response(
        JSON.stringify({ error: "Anchor data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── 1. Fetch catalog from both databases ────────────────────

    // Primary Supabase (experiences)
    const PRIMARY_URL = Deno.env.get("SUPABASE_URL")!;
    const PRIMARY_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const primary = createClient(PRIMARY_URL, PRIMARY_KEY);

    const { data: experiences } = await primary
      .from("experiences")
      .select("slug, title, neighborhood, category, short_description, city")
      .eq("is_active", true);

    // External Supabase (restaurants + hotels)
    const EXTERNAL_URL = "https://lsibzflaaqzvtzjlvrxw.supabase.co";
    const EXTERNAL_KEY = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");

    let restaurants: any[] = [];
    let hotels: any[] = [];

    if (EXTERNAL_KEY) {
      const ext = createClient(EXTERNAL_URL, EXTERNAL_KEY);
      const [restRes, hotelRes] = await Promise.all([
        ext.from("restaurantes").select("id, nome, bairro, categoria, meu_olhar, tipo_cozinha, preco").eq("ativo", true).limit(300),
        ext.from("hoteis").select("id, nome, bairro, meu_olhar, categoria, preco").eq("ativo", true).limit(200),
      ]);
      restaurants = restRes.data || [];
      hotels = hotelRes.data || [];
    }

    // ─── 2. Build catalog string ─────────────────────────────────

    const catalogLines: string[] = [];

    for (const e of (experiences || [])) {
      catalogLines.push(`EXP|${e.slug}|${e.title}|${e.neighborhood || ""}|${e.category || ""}|${e.short_description?.slice(0, 60) || ""}`);
    }
    for (const r of restaurants) {
      catalogLines.push(`REST|${r.id}|${r.nome}|${r.bairro || ""}|${r.categoria || ""}|${r.tipo_cozinha || ""}|${r.meu_olhar?.slice(0, 60) || ""}`);
    }
    for (const h of hotels) {
      catalogLines.push(`HOTEL|${h.id}|${h.nome}|${h.bairro || ""}|${h.categoria || ""}|${h.meu_olhar?.slice(0, 60) || ""}`);
    }

    const catalog = catalogLines.join("\n");

    // ─── 3. AI trip generation ───────────────────────────────────

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anchorContext = `
INSPIRATION ANCHOR:
- Interpretation: ${anchor.interpretation || "Travel inspiration"}
- City: ${anchor.detected?.city || "Rio de Janeiro"}
- Neighborhood: ${anchor.detected?.neighborhood || "Unknown"}
- Activity: ${anchor.detected?.activity || "general"}
- Source: ${anchor.source || "link"} (${anchor.sourceUrl || ""})
`;

    const systemPrompt = `You are the Lucky Trip itinerary engine for Rio de Janeiro.

Given a travel inspiration anchor and a catalog of REAL places, generate a complete ${days}-day trip itinerary.

${anchorContext}

RULES:
1. ONLY use places from the CATALOG below. Never invent places.
2. The anchor inspiration determines the trip's vibe and priority.
3. Every day MUST include: Morning experience, Lunch restaurant, Afternoon experience, Sunset experience, Dinner restaurant.
4. Include exactly ONE hotel recommendation for the entire trip.
5. Prioritize geographic proximity within each day (keep activities in nearby neighborhoods).
6. The anchor's neighborhood should anchor Day 1.
7. Adjacent neighborhoods: Ipanema↔Leblon↔Copacabana↔Botafogo, Centro↔Lapa↔Santa Teresa, Barra↔Recreio.
8. Never repeat the same place across days.
9. Balance the itinerary: mix nature, food, culture, and relaxation.

CATALOG FORMAT: TYPE|ID|NAME|NEIGHBORHOOD|CATEGORY|DESCRIPTION
${catalog}

OUTPUT: Return a structured trip using the suggest_trip tool.`;

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
          { role: "user", content: `Generate a complete ${days}-day trip itinerary for Rio de Janeiro inspired by: ${anchor.interpretation || "travel inspiration"}. Use only items from the catalog.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_trip",
              description: "Generate a structured multi-day trip itinerary",
              parameters: {
                type: "object",
                properties: {
                  hotel: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      neighborhood: { type: "string" },
                      reason: { type: "string" },
                    },
                    required: ["id", "name", "neighborhood"],
                    additionalProperties: false,
                  },
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        dayIndex: { type: "number" },
                        zone: { type: "string", description: "Primary neighborhood zone for this day" },
                        slots: {
                          type: "object",
                          properties: {
                            morning: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                neighborhood: { type: "string" },
                                type: { type: "string", enum: ["experience", "restaurant", "hotel"] },
                                note: { type: "string" },
                              },
                              required: ["id", "name", "neighborhood", "type"],
                              additionalProperties: false,
                            },
                            lunch: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                neighborhood: { type: "string" },
                                type: { type: "string", enum: ["experience", "restaurant", "hotel"] },
                                note: { type: "string" },
                              },
                              required: ["id", "name", "neighborhood", "type"],
                              additionalProperties: false,
                            },
                            afternoon: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                neighborhood: { type: "string" },
                                type: { type: "string", enum: ["experience", "restaurant", "hotel"] },
                                note: { type: "string" },
                              },
                              required: ["id", "name", "neighborhood", "type"],
                              additionalProperties: false,
                            },
                            sunset: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                neighborhood: { type: "string" },
                                type: { type: "string", enum: ["experience", "restaurant", "hotel"] },
                                note: { type: "string" },
                              },
                              required: ["id", "name", "neighborhood", "type"],
                              additionalProperties: false,
                            },
                            dinner: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                neighborhood: { type: "string" },
                                type: { type: "string", enum: ["experience", "restaurant", "hotel"] },
                                note: { type: "string" },
                              },
                              required: ["id", "name", "neighborhood", "type"],
                              additionalProperties: false,
                            },
                          },
                          required: ["morning", "lunch", "afternoon", "sunset", "dinner"],
                          additionalProperties: false,
                        },
                      },
                      required: ["dayIndex", "zone", "slots"],
                      additionalProperties: false,
                    },
                  },
                  tripSummary: { type: "string", description: "Brief editorial summary in Portuguese" },
                },
                required: ["hotel", "days", "tripSummary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_trip" } },
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
        JSON.stringify({ error: "Erro ao gerar roteiro" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    let tripResult: any = null;

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        tripResult = JSON.parse(toolCall.function.arguments);
      } catch {
        console.error("Failed to parse trip result");
      }
    }

    if (!tripResult) {
      return new Response(
        JSON.stringify({ error: "Não foi possível gerar o roteiro" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── 4. Validate IDs exist in catalog ────────────────────────

    const validExpIds = new Set((experiences || []).map((e: any) => e.slug));
    const validRestIds = new Set(restaurants.map((r: any) => r.id));
    const validHotelIds = new Set(hotels.map((h: any) => h.id));
    const allValidIds = new Set([...validExpIds, ...validRestIds, ...validHotelIds]);

    // Log validation
    let validationLog: string[] = [];
    for (const day of tripResult.days || []) {
      for (const [slotName, slot] of Object.entries(day.slots || {})) {
        const s = slot as any;
        if (s && s.id && !allValidIds.has(s.id)) {
          validationLog.push(`Day ${day.dayIndex} ${slotName}: ${s.id} NOT in catalog`);
        }
      }
    }

    if (validationLog.length > 0) {
      console.warn("Validation warnings:", validationLog);
    }

    // ─── 5. Persist to database ──────────────────────────────────

    let itineraryId: string | null = null;

    try {
      const { data: itinerary, error: insertErr } = await primary
        .from("user_itineraries")
        .insert({
          user_id: userId || null,
          destination_id: "rio-de-janeiro",
          destination_name: "Rio de Janeiro",
          travel_pace: "equilibrado",
          travel_intentions: [anchor.detected?.activity || "geral"],
          inspiration_tags: [anchor.detected?.activity, anchor.detected?.neighborhood].filter(Boolean),
          status: "active",
          generated_at: new Date().toISOString(),
          arrival_date: null,
          departure_date: null,
        })
        .select("id")
        .single();

      if (!insertErr && itinerary) {
        itineraryId = itinerary.id;

        // Save itinerary items
        const items: any[] = [];
        for (const day of tripResult.days || []) {
          const slotOrder = ["morning", "lunch", "afternoon", "sunset", "dinner"];
          for (let i = 0; i < slotOrder.length; i++) {
            const slot = day.slots?.[slotOrder[i]];
            if (slot) {
              items.push({
                roteiro_id: itinerary.id,
                day_index: day.dayIndex,
                order_in_day: i,
                name: slot.name,
                neighborhood: slot.neighborhood,
                source: "curated",
                time_slot: slotOrder[i],
                notes: slot.note || null,
                city: "Rio de Janeiro",
              });
            }
          }
        }

        if (items.length > 0) {
          await primary.from("roteiro_itens").insert(items);
        }
      }
    } catch (dbErr) {
      console.error("DB persistence error:", dbErr);
    }

    return new Response(
      JSON.stringify({
        ...tripResult,
        itineraryId,
        anchor: {
          interpretation: anchor.interpretation,
          source: anchor.source,
          sourceUrl: anchor.sourceUrl,
          detected: anchor.detected,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-inspiration-trip error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
