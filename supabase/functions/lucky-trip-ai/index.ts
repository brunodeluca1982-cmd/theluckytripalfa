import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════════
// ZONE MAPPING — Geographic clustering for Rio de Janeiro
// ═══════════════════════════════════════════════════════════════

const ZONE_MAP: Record<string, string> = {
  "ipanema": "zona-sul", "leblon": "zona-sul", "copacabana": "zona-sul",
  "botafogo": "zona-sul", "urca": "zona-sul", "leme": "zona-sul",
  "jardim botânico": "zona-sul", "jardim botanico": "zona-sul",
  "gávea": "zona-sul", "gavea": "zona-sul", "lagoa": "zona-sul",
  "são conrado": "zona-sul", "sao conrado": "zona-sul",
  "humaitá": "zona-sul", "humaita": "zona-sul", "flamengo": "zona-sul",
  "centro": "centro", "lapa": "centro", "santa teresa": "centro",
  "saúde": "centro", "saude": "centro", "porto maravilha": "centro",
  "barra da tijuca": "barra", "recreio dos bandeirantes": "barra",
  "recreio": "barra", "jardim oceânico": "barra", "jardim oceanico": "barra",
  "floresta da tijuca": "especial", "guaratiba": "especial",
  "maracanã": "especial", "maracana": "especial",
};

const ADJACENT_ZONES: Record<string, string[]> = {
  "zona-sul": ["centro", "especial"],
  "centro": ["zona-sul", "especial"],
  "barra": [],
  "especial": ["zona-sul", "centro"],
};

function getZone(bairro: string): string {
  const normalized = bairro.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ZONE_MAP[normalized] || "outro";
}

function enrichWithZones(items: any[], type: string) {
  return items.map(item => ({
    ...item,
    _zone: item.bairro ? getZone(item.bairro) : "outro",
    _type: type,
  }));
}

// ═══════════════════════════════════════════════════════════════
// LAYER 1 — CURATION (Source of truth for places)
// ═══════════════════════════════════════════════════════════════
// Only this layer decides which places are eligible for itineraries.
// All data comes from the app's curated database — never invented.

async function runCurationLayer() {
  const EXTERNAL_URL = "https://lsibzflaaqzvtzjlvrxw.supabase.co";
  const EXTERNAL_KEY = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  const result: { experiencias: any[]; restaurantes: any[]; hoteis: any[]; lucky_list: any[] } = {
    experiencias: [], restaurantes: [], hoteis: [], lucky_list: [],
  };

  // 1. o_que_fazer_rio (local table — activities)
  if (SUPABASE_URL && SUPABASE_KEY) {
    const local = createClient(SUPABASE_URL, SUPABASE_KEY);
    const [oqfRes, llRes] = await Promise.all([
      local.from("o_que_fazer_rio")
        .select("nome, bairro, categoria, meu_olhar, vibe, energia, duracao_media, momento_ideal, como_fazer, tags_ia")
        .eq("ativo", true).order("ordem").limit(500),
      local.from("lucky_list_rio")
        .select("nome, bairro, categoria_experiencia, meu_olhar, tipo_item, como_fazer, tags_ia, nivel_esforco, horarios")
        .eq("ativo", true).limit(500),
    ]);
    if (oqfRes.error) console.error("Curation: o_que_fazer_rio error:", oqfRes.error);
    else result.experiencias = enrichWithZones(oqfRes.data || [], "experience");

    if (llRes.error) console.error("Curation: lucky_list_rio error:", llRes.error);
    else result.lucky_list = enrichWithZones(llRes.data || [], "lucky-list");
  }

  // 2. External restaurants + hotels
  if (EXTERNAL_KEY) {
    const ext = createClient(EXTERNAL_URL, EXTERNAL_KEY);
    const [restRes, hotelRes] = await Promise.all([
      ext.from("restaurantes")
        .select("nome, bairro, cidade, categoria, meu_olhar, tipo_cozinha, especialidade")
        .eq("ativo", true).order("nome").limit(500),
      ext.from("v_stay_hotels_full")
        .select("nome, bairro, cidade, meu_olhar, preco_medio_diaria, categoria, atmosfera, perfil_publico")
        .limit(200),
    ]);
    if (restRes.error) console.error("Curation: restaurantes error:", restRes.error);
    else result.restaurantes = enrichWithZones(restRes.data || [], "restaurant");

    if (hotelRes.error) console.error("Curation: hotels error:", hotelRes.error);
    else result.hoteis = enrichWithZones(hotelRes.data || [], "hotel");
  }

  console.log(`[Curation] ${result.experiencias.length} exp, ${result.restaurantes.length} rest, ${result.hoteis.length} hotels, ${result.lucky_list.length} lucky`);
  return result;
}

async function fetchEventData() {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  if (!SUPABASE_URL || !SUPABASE_KEY) return { eventos: [], evento_itens: [] };

  const client = createClient(SUPABASE_URL, SUPABASE_KEY);

  const [evtRes, itensRes] = await Promise.all([
    client.from("eventos")
      .select("titulo, slug, descricao_curta, data_inicio, data_fim, destino")
      .eq("ativo", true).limit(20),
    client.from("evento_itens")
      .select("titulo, tipo, bairro, local_nome, google_maps_url, descricao, tags, data_inicio, data_fim")
      .eq("ativo", true).limit(500),
  ]);

  return {
    eventos: evtRes.data || [],
    evento_itens: itensRes.data || [],
  };
}

// ═══════════════════════════════════════════════════════════════
// LAYER 2 — CONTEXT (Real-world validation — no new places)
// ═══════════════════════════════════════════════════════════════
// Adds geographic, temporal, and weather intelligence.
// This layer NEVER introduces new places — only validates and
// enriches the curated catalog.

function buildContextLayer(curatedData: any, userContext: any): string {
  const lines: string[] = [];

  // --- Zone density summary ---
  const zoneCounts: Record<string, { exp: number; rest: number; hotel: number }> = {};
  for (const item of curatedData.experiencias || []) {
    const z = item._zone || "outro";
    if (!zoneCounts[z]) zoneCounts[z] = { exp: 0, rest: 0, hotel: 0 };
    zoneCounts[z].exp++;
  }
  for (const item of curatedData.restaurantes || []) {
    const z = item._zone || "outro";
    if (!zoneCounts[z]) zoneCounts[z] = { exp: 0, rest: 0, hotel: 0 };
    zoneCounts[z].rest++;
  }
  for (const item of curatedData.hoteis || []) {
    const z = item._zone || "outro";
    if (!zoneCounts[z]) zoneCounts[z] = { exp: 0, rest: 0, hotel: 0 };
    zoneCounts[z].hotel++;
  }

  lines.push("RESUMO POR ZONA (densidade de conteúdo curado):");
  for (const [zone, counts] of Object.entries(zoneCounts)) {
    lines.push(`  ${zone}: ${counts.exp} experiências, ${counts.rest} restaurantes, ${counts.hotel} hotéis`);
  }

  // --- Geographic adjacency rules ---
  lines.push("");
  lines.push("ZONAS ADJACENTES (podem ser combinadas no mesmo dia):");
  for (const [zone, adj] of Object.entries(ADJACENT_ZONES)) {
    lines.push(`  ${zone} → ${adj.length > 0 ? adj.join(", ") : "nenhuma (isolada)"}`);
  }
  lines.push("  REGRA: Barra é ISOLADA — nunca combine com Centro ou Santa Teresa no mesmo dia.");

  // --- Travel dates ---
  if (userContext?.travel_dates?.startDate) {
    lines.push("");
    lines.push(`DATAS DA VIAGEM: ${userContext.travel_dates.startDate} a ${userContext.travel_dates.endDate || "flexível"}`);
    if (userContext.travel_dates.totalDays) {
      lines.push(`TOTAL DE DIAS: ${userContext.travel_dates.totalDays}`);
    }
  }

  // --- Anchor analysis ---
  if (userContext?.minha_viagem_items?.length > 0) {
    lines.push("");
    lines.push("ÂNCORAS DO USUÁRIO (inspirações salvas — prioridade máxima):");
    const anchorZones = new Set<string>();
    for (const item of userContext.minha_viagem_items) {
      const zone = item.neighborhood ? getZone(item.neighborhood) : "desconhecida";
      anchorZones.add(zone);
      lines.push(`  • "${item.title}" (${item.type}) → ${item.neighborhood || "sem bairro"} → zona: ${zone}`);
    }
    lines.push(`ZONAS ÂNCORA: ${[...anchorZones].join(", ")}`);
    lines.push("INSTRUÇÃO: Priorize hotel e atividades nas zonas âncora. O Dia 1 deve ser na zona âncora principal.");
  }

  // --- Weather context ---
  if (userContext?.weather_forecast) {
    lines.push("");
    lines.push("PREVISÃO DO TEMPO:");
    lines.push(JSON.stringify(userContext.weather_forecast));
    lines.push("INSTRUÇÃO: Dia com chuva → museus, restaurantes aconchegantes, experiências indoor. Dia ensolarado → praias, mirantes, caminhadas.");
  }

  // --- User preferences ---
  if (userContext?.user_preferences && Object.keys(userContext.user_preferences).length > 0) {
    lines.push("");
    lines.push("PREFERÊNCIAS DO USUÁRIO:");
    lines.push(JSON.stringify(userContext.user_preferences));
  }

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════
// LAYER 3 — LUCKY ORGANIZATION (Final itinerary assembly)
// ═══════════════════════════════════════════════════════════════
// Builds the system prompt that instructs the AI to organize the
// final trip using curated places + context validation.

function buildOrganizationPrompt(): string {
  return `Você é Lucky, o concierge de viagens do The Lucky Trip.

Você NÃO é um chatbot genérico. Você é um curador especializado que TOMA DECISÕES de viagem pelo usuário.

═══════════════════════════════════════════
ARQUITETURA DE 3 CAMADAS
═══════════════════════════════════════════
Você opera em três camadas integradas:

CAMADA 1 — CURADORIA (fonte de verdade)
• Os lugares disponíveis estão no "CATÁLOGO CURADO" abaixo.
• USE EXCLUSIVAMENTE esses dados. NUNCA invente lugares.
• Se o catálogo não tiver um tipo específico solicitado, recomende os itens mais próximos disponíveis ou encaminhe para o WhatsApp do concierge.
• Se tiver poucos itens, use TODOS os disponíveis.
• NUNCA diga que está indisponível, que não foi lançada, que não está pronta ou que não pode ajudar.

CAMADA 2 — CONTEXTO (validação do mundo real)
• O "CONTEXTO DE VALIDAÇÃO" contém dados geográficos, climáticos e de preferências.
• Use para VALIDAR e AJUSTAR a seleção — nunca para adicionar novos lugares.
• Respeite: zonas adjacentes, densidade por zona, clima previsto, âncoras do usuário.

CAMADA 3 — ORGANIZAÇÃO (montagem final)
• VOCÊ é esta camada. Monte o roteiro final combinando curadoria + contexto.
• Princípio: DECISÃO AUTOMÁTICA — o usuário vê o plano pronto primeiro, depois ajusta.

═══════════════════════════════════════════
PRINCÍPIO CENTRAL — DECISÃO AUTOMÁTICA
═══════════════════════════════════════════
Lucky deve tomar o máximo de decisões possível automaticamente.
O usuário deve experimentar a SURPRESA de ver um roteiro completo já pronto.
Só depois ele pode ajustar ou refinar.

NUNCA peça ao usuário para escolher hotel, restaurantes ou experiências antes de montar o roteiro.
MONTE O ROTEIRO COMPLETO PRIMEIRO. O usuário ajusta depois.

═══════════════════════════════════════════
TRÊS PILARES OBRIGATÓRIOS
═══════════════════════════════════════════
Todo roteiro DEVE incluir:
1. 🏨 HOTEL — escolha automaticamente o melhor do catálogo
2. 🎯 EXPERIÊNCIAS — atividades e passeios do catálogo
3. 🍽️ RESTAURANTES — refeições do catálogo

Mesmo que o usuário forneça apenas UMA inspiração, preencha os três pilares.

═══════════════════════════════════════════
LÓGICA DE ÂNCORA
═══════════════════════════════════════════
Se o usuário salvou ou mencionou um lugar:
1. Esse é o ÂNCORA da viagem
2. Identifique o bairro/zona do âncora
3. Priorize experiências e restaurantes na MESMA ZONA
4. Escolha hotel próximo à zona do âncora
5. Complete o roteiro ao redor do âncora

Se não há âncora: Lucky escolhe livremente os melhores do catálogo.

═══════════════════════════════════════════
INTELIGÊNCIA GEOGRÁFICA (OBRIGATÓRIO)
═══════════════════════════════════════════
ZONAS DO RIO DE JANEIRO (agrupe por zona/dia):
- ZONA SUL: Ipanema, Leblon, Copacabana, Botafogo, Urca, Leme, Jardim Botânico, Gávea, Lagoa, São Conrado, Humaitá, Flamengo
- CENTRO: Centro, Lapa, Santa Teresa, Saúde, Porto Maravilha
- BARRA: Barra da Tijuca, Recreio dos Bandeirantes, Jardim Oceânico
- ESPECIAL: Floresta da Tijuca, Guaratiba, Maracanã

REGRAS:
- Atividades no MESMO DIA devem ser na MESMA ZONA ou em zonas adjacentes.
- NUNCA misture Barra + Santa Teresa no mesmo dia.
- NUNCA misture Recreio + Centro no mesmo dia.
- Priorize a zona do hotel para o Dia 1.
- Restaurantes devem estar no mesmo bairro ou zona das experiências do dia.
- Hotel deve ser na zona com mais atividades planejadas.

═══════════════════════════════════════════
RITMO REALISTA DO DIA (OBRIGATÓRIO)
═══════════════════════════════════════════
Cada dia deve seguir este ritmo natural:

☀️ Manhã (8h–11h): atividades leves, caminhadas, natureza, praia
  → use campo "melhor_horario" = "manhã" quando disponível
🍽️ Almoço (12h–13h30): restaurante na mesma zona
🌤️ Tarde (14h–17h): experiências culturais, passeios, aventura
  → use campo "melhor_horario" = "tarde" quando disponível
🌅 Pôr do sol (17h–18h30): mirantes, praias, viewpoints
  → use campo "melhor_horario" = "fim de tarde" quando disponível
🌙 Jantar (19h30–21h): restaurante ou bar na mesma zona

LIMITES POR DIA:
- 2–3 experiências (não mais)
- 1 restaurante de almoço
- 1 restaurante de jantar
- 1 atividade de pôr do sol (quando houver no catálogo)
- NUNCA sobrecarregue o dia com 5+ atividades

═══════════════════════════════════════════
INTELIGÊNCIA CLIMÁTICA
═══════════════════════════════════════════
Se o contexto incluir previsão do tempo:
- Dia com chuva → priorize museus, restaurantes com ambiente, experiências indoor
- Dia ensolarado → praias, mirantes, caminhadas, atividades ao ar livre
- Se não houver previsão: assuma clima bom (padrão Rio).

═══════════════════════════════════════════
FORMATO OBRIGATÓRIO PARA ROTEIROS
═══════════════════════════════════════════
SEMPRE gere neste formato:

**🏨 Base da viagem**

\`\`\`places
[{"type":"hotel","nome":"NOME EXATO DO CATÁLOGO","bairro":"Bairro","meu_olhar":"Por que este hotel"}]
\`\`\`

---

**Dia 1** — *Zona Sul*

☀️ **Manhã**

\`\`\`places
[{"type":"experience","nome":"NOME EXATO DO CATÁLOGO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🍽️ **Almoço**

\`\`\`places
[{"type":"restaurant","nome":"NOME EXATO DO CATÁLOGO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌤️ **Tarde**

\`\`\`places
[{"type":"experience","nome":"NOME EXATO DO CATÁLOGO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌅 **Pôr do sol**

\`\`\`places
[{"type":"experience","nome":"NOME EXATO DO CATÁLOGO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌙 **Jantar**

\`\`\`places
[{"type":"restaurant","nome":"NOME EXATO DO CATÁLOGO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

Repita para Dia 2, Dia 3, etc.

REGRAS DO FORMATO:
- "nome" deve ser EXATAMENTE como aparece no catálogo curado
- Agrupe por zona geográfica
- SEMPRE inclua hotel no topo
- SEMPRE inclua pelo menos 1 restaurante por dia
- SEMPRE inclua pelo menos 2 experiências por dia
- Ao final: "Quer ajustar alguma coisa? Posso trocar lugares, mudar o ritmo ou adicionar experiências."

═══════════════════════════════════════════
FORMATO PARA RECOMENDAÇÕES SIMPLES
═══════════════════════════════════════════
\`\`\`places
[{"type":"restaurant","nome":"Nome","bairro":"Bairro","meu_olhar":"Descrição"}]
\`\`\`
- NUNCA use bullet points. SEMPRE bloco places.
- Máximo 6 itens por bloco.

═══════════════════════════════════════════
REGRAS DE CARNAVAL
═══════════════════════════════════════════
- Blocos "Eu vou" são compromissos fixos: data e horário exatos.
- NUNCA mova blocos fixos.

═══════════════════════════════════════════
ESTILO DE RESPOSTA
═══════════════════════════════════════════
- Conciso, editorial, confiante.
- Fale como concierge que DECIDE.
- Após roteiro, ofereça refinamento.`;
}

// ═══════════════════════════════════════════════════════════════
// HTTP HANDLER — Orchestrates the 3 layers
// ═══════════════════════════════════════════════════════════════

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // ── LAYER 1: CURATION ──
    // Fetch all curated places from the database (source of truth)
    const [curatedData, eventData] = await Promise.all([
      runCurationLayer(),
      fetchEventData(),
    ]);

    const catalog = { ...curatedData, ...eventData };
    const totalItems = (catalog.experiencias?.length || 0) +
                       (catalog.restaurantes?.length || 0) +
                       (catalog.hoteis?.length || 0);

    console.log(`[Layer 1 - Curation] ${totalItems} total curated items`);

    // ── LAYER 2: CONTEXT ──
    // Build real-world validation data (geography, weather, anchors)
    const contextValidation = buildContextLayer(catalog, context);
    console.log(`[Layer 2 - Context] ${contextValidation.length} chars of validation data`);

    // ── LAYER 3: ORGANIZATION ──
    // Assemble the system prompt with all three layers
    const organizationPrompt = buildOrganizationPrompt();

    const systemMessage = [
      organizationPrompt,
      "",
      "═══════════════════════════════════════════",
      "CONTEXTO DE VALIDAÇÃO (Camada 2 — mundo real)",
      "═══════════════════════════════════════════",
      contextValidation,
      "",
      "═══════════════════════════════════════════",
      `CATÁLOGO CURADO (Camada 1 — ${totalItems} itens reais)`,
      "═══════════════════════════════════════════",
      "Use APENAS estes dados. NUNCA invente lugares.",
      JSON.stringify(catalog, null, 0),
    ].join("\n");

    console.log(`[Layer 3 - Organization] System message: ${systemMessage.length} chars`);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemMessage },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos na sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erro no serviço de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("lucky-trip-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
