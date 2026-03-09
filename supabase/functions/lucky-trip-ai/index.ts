import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é Lucky, o concierge de viagens do The Lucky Trip.

Você NÃO é um chatbot genérico. Você é um curador especializado que TOMA DECISÕES de viagem pelo usuário.

═══════════════════════════════════════════
PRINCÍPIO CENTRAL — DECISÃO AUTOMÁTICA
═══════════════════════════════════════════
Lucky deve tomar o máximo de decisões possível automaticamente.
O usuário deve experimentar a SURPRESA de ver um roteiro completo já pronto.
Só depois ele pode ajustar ou refinar.

NUNCA peça ao usuário para escolher hotel, restaurantes ou experiências antes de montar o roteiro.
MONTE O ROTEIRO COMPLETO PRIMEIRO. O usuário ajusta depois.

═══════════════════════════════════════════
REGRA ABSOLUTA — FONTE DE DADOS
═══════════════════════════════════════════
- USE EXCLUSIVAMENTE os dados do campo "BANCO DE DADOS DO APP" fornecido abaixo.
- Os dados do banco são REAIS e EXISTEM no app.
- NUNCA invente lugares que não estejam listados no banco.
- Se o banco estiver vazio ou não tiver o tipo solicitado: "Esse conteúdo ainda não está disponível no app."
- Se o banco tiver poucos itens, use TODOS os disponíveis.
- IMPORTANTE: Se o banco tiver experiencias, restaurantes e hoteis listados, USE-OS. Não diga que não há dados.

═══════════════════════════════════════════
TRÊS PILARES OBRIGATÓRIOS
═══════════════════════════════════════════
Todo roteiro DEVE incluir:
1. 🏨 HOTEL — escolha automaticamente o melhor do banco
2. 🎯 EXPERIÊNCIAS — atividades e passeios do banco
3. 🍽️ RESTAURANTES — refeições do banco

Mesmo que o usuário forneça apenas UMA inspiração, preencha os três pilares.

═══════════════════════════════════════════
INTELIGÊNCIA GEOGRÁFICA (OBRIGATÓRIO)
═══════════════════════════════════════════
ZONAS DO RIO DE JANEIRO (agrupe por zona/dia):
- ZONA SUL: Ipanema, Leblon, Copacabana, Botafogo, Urca, Leme, Jardim Botânico, Gávea, Lagoa, São Conrado, Humaitá
- CENTRO: Centro, Lapa, Santa Teresa, Saúde, Porto Maravilha
- BARRA: Barra da Tijuca, Recreio dos Bandeirantes
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
- 1 atividade de pôr do sol (quando houver no banco)
- NUNCA sobrecarregue o dia com 5+ atividades

═══════════════════════════════════════════
INTELIGÊNCIA CLIMÁTICA
═══════════════════════════════════════════
Se o contexto incluir "weather_forecast":
- Dia com chuva → priorize museus, restaurantes com ambiente, experiências indoor
- Dia ensolarado → praias, mirantes, caminhadas, atividades ao ar livre
- Se não houver previsão: assuma clima bom (padrão Rio).

═══════════════════════════════════════════
LÓGICA DE ÂNCORA
═══════════════════════════════════════════
Se o usuário salvou ou mencionou um lugar:
1. Esse é o ÂNCORA da viagem
2. Identifique o bairro/zona do âncora
3. Priorize experiências e restaurantes na MESMA ZONA
4. Escolha hotel próximo à zona do âncora
5. Complete o roteiro ao redor do âncora

Se não há âncora: Lucky escolhe livremente os melhores do banco.

═══════════════════════════════════════════
CONTEXTO DO USUÁRIO
═══════════════════════════════════════════
- "minha_viagem_items": lugares salvos — ÂNCORAS do roteiro
- Se tiver itens salvos: inclua-os e complete com hotel + restaurantes + experiências
- Se não tiver: ESCOLHA AUTOMATICAMENTE os melhores do banco
- "auto_generate" = true: gere roteiro COMPLETO imediatamente

═══════════════════════════════════════════
FORMATO OBRIGATÓRIO PARA ROTEIROS
═══════════════════════════════════════════
SEMPRE gere neste formato:

**🏨 Base da viagem**

\`\`\`places
[{"type":"hotel","nome":"NOME EXATO DO BANCO","bairro":"Bairro","meu_olhar":"Por que este hotel"}]
\`\`\`

---

**Dia 1** — *Zona Sul*

☀️ **Manhã**

\`\`\`places
[{"type":"experience","nome":"NOME EXATO DO BANCO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🍽️ **Almoço**

\`\`\`places
[{"type":"restaurant","nome":"NOME EXATO DO BANCO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌤️ **Tarde**

\`\`\`places
[{"type":"experience","nome":"NOME EXATO DO BANCO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌅 **Pôr do sol**

\`\`\`places
[{"type":"experience","nome":"NOME EXATO DO BANCO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌙 **Jantar**

\`\`\`places
[{"type":"restaurant","nome":"NOME EXATO DO BANCO","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

Repita para Dia 2, Dia 3, etc.

REGRAS DO FORMATO:
- "nome" deve ser EXATAMENTE como aparece no banco de dados
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


// Geographic zone mapping for intelligent clustering
const ZONE_MAP: Record<string, string> = {
  "ipanema": "zona-sul", "leblon": "zona-sul", "copacabana": "zona-sul",
  "botafogo": "zona-sul", "urca": "zona-sul", "leme": "zona-sul",
  "jardim botânico": "zona-sul", "jardim botanico": "zona-sul",
  "gávea": "zona-sul", "gavea": "zona-sul", "lagoa": "zona-sul",
  "são conrado": "zona-sul", "sao conrado": "zona-sul",
  "humaitá": "zona-sul", "humaita": "zona-sul",
  "centro": "centro", "lapa": "centro", "santa teresa": "centro",
  "saúde": "centro", "saude": "centro", "porto maravilha": "centro",
  "barra da tijuca": "barra", "recreio dos bandeirantes": "barra",
  "recreio": "barra",
  "floresta da tijuca": "especial", "guaratiba": "especial",
  "maracanã": "especial", "maracana": "especial",
};

function getZone(bairro: string): string {
  const normalized = bairro.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ZONE_MAP[normalized] || "outro";
}

// Enrich items with zone data for the AI
function enrichWithZones(items: any[], type: string) {
  return items.map(item => ({
    ...item,
    _zone: item.bairro ? getZone(item.bairro) : "outro",
    _type: type,
  }));
}

// Fetch all curated data from external Supabase
async function fetchExternalData() {
  const EXTERNAL_URL = "https://lsibzflaaqzvtzjlvrxw.supabase.co";
  const EXTERNAL_KEY = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");
  if (!EXTERNAL_KEY) {
    console.error("EXTERNAL_SUPABASE_ANON_KEY not set — database will be empty!");
    return { experiencias: [], restaurantes: [], hoteis: [] };
  }

  const ext = createClient(EXTERNAL_URL, EXTERNAL_KEY);

  const [expRes, restRes, hotelRes] = await Promise.all([
    ext.from("experiencias")
      .select("nome, bairro, cidade, categoria, meu_olhar, vibe, tags, duracao, melhor_horario, com_criancas, nivel_esforco, precisa_reserva")
      .eq("ativo", true).order("nome").limit(500),
    ext.from("restaurantes")
      .select("nome, bairro, cidade, categoria, meu_olhar, preco_medio, tipo_cozinha, especialidade")
      .eq("ativo", true).order("nome").limit(500),
    ext.from("hoteis")
      .select("nome, bairro, cidade, meu_olhar, preco_medio_diaria, categoria, atmosfera, perfil_publico")
      .eq("ativo", true).order("nome").limit(200),
  ]);

  console.log(`Fetched: ${expRes.data?.length || 0} experiencias, ${restRes.data?.length || 0} restaurantes, ${hotelRes.data?.length || 0} hoteis`);

  if (expRes.error) console.error("Experiencias fetch error:", expRes.error);
  if (restRes.error) console.error("Restaurantes fetch error:", restRes.error);
  if (hotelRes.error) console.error("Hotels fetch error:", hotelRes.error);

  return {
    experiencias: enrichWithZones(expRes.data || [], "experience"),
    restaurantes: enrichWithZones(restRes.data || [], "restaurant"),
    hoteis: enrichWithZones(hotelRes.data || [], "hotel"),
  };
}

// Fetch events from the main Supabase project
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

// Build zone summary for the AI
function buildZoneSummary(database: any): string {
  const zoneCounts: Record<string, { exp: number; rest: number; hotel: number }> = {};

  for (const item of database.experiencias || []) {
    const z = item._zone || "outro";
    if (!zoneCounts[z]) zoneCounts[z] = { exp: 0, rest: 0, hotel: 0 };
    zoneCounts[z].exp++;
  }
  for (const item of database.restaurantes || []) {
    const z = item._zone || "outro";
    if (!zoneCounts[z]) zoneCounts[z] = { exp: 0, rest: 0, hotel: 0 };
    zoneCounts[z].rest++;
  }
  for (const item of database.hoteis || []) {
    const z = item._zone || "outro";
    if (!zoneCounts[z]) zoneCounts[z] = { exp: 0, rest: 0, hotel: 0 };
    zoneCounts[z].hotel++;
  }

  const lines = Object.entries(zoneCounts).map(([zone, counts]) =>
    `${zone}: ${counts.exp} experiências, ${counts.rest} restaurantes, ${counts.hotel} hotéis`
  );

  return `\nRESUMO POR ZONA:\n${lines.join("\n")}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch real database content in parallel
    const [externalData, eventData] = await Promise.all([
      fetchExternalData(),
      fetchEventData(),
    ]);

    const database = {
      ...externalData,
      ...eventData,
    };

    const totalItems = (database.experiencias?.length || 0) +
                       (database.restaurantes?.length || 0) +
                       (database.hoteis?.length || 0);

    console.log(`Total DB items injected: ${totalItems}`);

    // Build context-aware system message
    let systemMessage = SYSTEM_PROMPT;

    // Add zone summary
    systemMessage += buildZoneSummary(database);

    // Inject database content
    systemMessage += `\n\nBANCO DE DADOS DO APP (${totalItems} itens reais — use APENAS estes):\n${JSON.stringify(database, null, 0)}`;

    // Inject user context
    if (context) {
      // Add weather data if travel dates are available
      if (context.travel_dates?.startDate) {
        systemMessage += `\n\nDATAS DA VIAGEM: ${context.travel_dates.startDate} a ${context.travel_dates.endDate || "flexível"}`;
      }

      systemMessage += `\n\nCONTEXTO DO USUÁRIO:\n${JSON.stringify(context, null, 2)}`;
    }

    console.log(`System message length: ${systemMessage.length} chars`);

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
