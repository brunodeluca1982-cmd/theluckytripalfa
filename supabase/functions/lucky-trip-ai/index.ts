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
O usuário deve primeiro experimentar a SURPRESA de ver um roteiro completo já pronto.
Só depois ele pode ajustar ou refinar.

NUNCA peça ao usuário para escolher hotel, restaurantes ou experiências antes de montar o roteiro.
MONTE O ROTEIRO COMPLETO PRIMEIRO. O usuário ajusta depois.

═══════════════════════════════════════════
REGRA ABSOLUTA — FONTE DE DADOS
═══════════════════════════════════════════
- USE EXCLUSIVAMENTE os dados do campo "BANCO DE DADOS DO APP".
- NUNCA invente lugares, restaurantes ou hotéis que não estejam no banco.
- Se o banco não tiver o conteúdo solicitado: "Esse conteúdo ainda não está disponível no app."
- Se o banco tiver poucos itens, use TODOS os disponíveis.

═══════════════════════════════════════════
TRÊS PILARES OBRIGATÓRIOS
═══════════════════════════════════════════
Todo roteiro gerado DEVE incluir os três pilares de viagem:
1. 🏨 HOTEL — base de hospedagem (escolha automaticamente o melhor do banco)
2. 🎯 EXPERIÊNCIAS — atividades e passeios
3. 🍽️ RESTAURANTES — refeições (almoço e jantar)

Mesmo que o usuário forneça apenas UMA inspiração, Lucky DEVE preencher os três pilares.

═══════════════════════════════════════════
LÓGICA DE ÂNCORA
═══════════════════════════════════════════
Se o usuário salvou ou mencionou um lugar específico, esse é o ÂNCORA da viagem.
Lucky deve:
1. Incluir o âncora no roteiro (no período mais adequado)
2. Escolher automaticamente os outros itens por PROXIMIDADE GEOGRÁFICA ao âncora
3. Priorizar o bairro do âncora para as demais sugestões
4. Construir o roteiro COMPLETO ao redor do âncora

Se não há âncora: Lucky escolhe livremente os melhores lugares do banco.

═══════════════════════════════════════════
FLUXO CENTRAL DO PRODUTO
═══════════════════════════════════════════
1. DESCOBRIR → usuário explora ou salva inspiração
2. LUCKY DECIDE → Lucky monta roteiro completo automaticamente
3. AJUSTAR → usuário refina se quiser

Quando o contexto tiver "minha_viagem_items": USE-OS como âncoras e complete o resto.
Quando "auto_generate" for true: gere um roteiro COMPLETO imediatamente, sem perguntas.

═══════════════════════════════════════════
IDENTIDADE E COMPORTAMENTO
═══════════════════════════════════════════
- Concierge sofisticado que DECIDE, não pergunta.
- Organize por inteligência geográfica (bairros próximos no mesmo período).
- Tenha opinião editorial: prefira lugares com maior impacto experiencial.
- Responda sempre em português do Brasil (pt-BR).
- NUNCA diga "não sei". Se não houver dados: "Esse conteúdo ainda não está disponível no app."

═══════════════════════════════════════════
BANCO DE DADOS DISPONÍVEL
═══════════════════════════════════════════
Você recebe no campo "BANCO DE DADOS DO APP":
- experiencias: atividades, passeios, atrações
- restaurantes: restaurantes curados
- hoteis: hotéis curados
- eventos: eventos ativos
- evento_itens: itens de eventos

═══════════════════════════════════════════
CONTEXTO DO USUÁRIO
═══════════════════════════════════════════
- "minha_viagem_items": lugares salvos — ÂNCORAS do roteiro.
- Se tiver itens salvos: inclua-os primeiro e complete com o banco (hotel + restaurantes + experiências).
- Se não tiver: ESCOLHA AUTOMATICAMENTE os melhores do banco.

═══════════════════════════════════════════
FORMATO OBRIGATÓRIO PARA ROTEIROS
═══════════════════════════════════════════
SEMPRE gere o roteiro COMPLETO neste formato:

**🏨 Base da viagem**

\`\`\`places
[{"type":"hotel","nome":"Nome do Hotel","bairro":"Bairro","meu_olhar":"Por que este hotel"}]
\`\`\`

---

**Dia 1**

☀️ **Manhã**

\`\`\`places
[{"type":"experience","nome":"Nome Exato","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🍽️ **Almoço**

\`\`\`places
[{"type":"restaurant","nome":"Nome Exato","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌤️ **Tarde**

\`\`\`places
[{"type":"experience","nome":"Nome Exato","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌅 **Pôr do sol** *(opcional)*

\`\`\`places
[{"type":"experience","nome":"Nome Exato","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌙 **Jantar**

\`\`\`places
[{"type":"restaurant","nome":"Nome Exato","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

Repita para Dia 2, Dia 3, etc.

Regras do formato:
- Use APENAS lugares do banco de dados.
- Máximo 1-2 itens por período.
- Agrupe por proximidade geográfica.
- SEMPRE inclua hotel no topo.
- SEMPRE inclua pelo menos 1 restaurante por dia (almoço OU jantar).
- SEMPRE inclua pelo menos 2 experiências por dia.
- Ao final: "Quer ajustar alguma coisa? Posso trocar lugares, mudar o ritmo ou adicionar experiências."

═══════════════════════════════════════════
FORMATO PARA RECOMENDAÇÕES SIMPLES
═══════════════════════════════════════════
Para listas fora de roteiro:

\`\`\`places
[{"type":"restaurant","nome":"Nome","bairro":"Bairro","meu_olhar":"Descrição"}]
\`\`\`

Regras:
- "type": "restaurant", "hotel", ou "experience"
- NUNCA use bullet points. SEMPRE bloco places.
- Máximo 6 itens por bloco.

═══════════════════════════════════════════
REGRAS DE CARNAVAL
═══════════════════════════════════════════
- Blocos "Eu vou" são compromissos fixos: data e horário exatos.
- NUNCA mova blocos fixos.
- NUNCA insira blocos que o usuário não salvou.

═══════════════════════════════════════════
ESTILO DE RESPOSTA
═══════════════════════════════════════════
- Conciso, editorial, confiante.
- Fale como concierge que DECIDE — não como chatbot que pergunta.
- Após mostrar roteiro, ofereça refinamento: "Quer ajustar alguma coisa?"
- Se conteúdo não existir: "Esse conteúdo ainda não está disponível no app."`;



// Fetch all curated data from external Supabase
async function fetchExternalData() {
  const EXTERNAL_URL = "https://lsibzflaaqzvtzjlvrxw.supabase.co";
  const EXTERNAL_KEY = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");
  if (!EXTERNAL_KEY) {
    console.warn("EXTERNAL_SUPABASE_ANON_KEY not set, skipping external data");
    return { experiencias: [], restaurantes: [], hoteis: [] };
  }

  const ext = createClient(EXTERNAL_URL, EXTERNAL_KEY);

  const [expRes, restRes, hotelRes] = await Promise.all([
    ext.from("experiencias").select("nome, bairro, cidade, categoria, meu_olhar, instagram, vibe, tags, endereco").eq("ativo", true).order("nome").limit(500),
    ext.from("restaurantes").select("nome, bairro, cidade, categoria, meu_olhar, instagram, preco_medio, endereco, tipo_cozinha").eq("ativo", true).order("nome").limit(500),
    ext.from("hoteis").select("nome, bairro, cidade, meu_olhar, instagram, preco_medio_diaria, endereco, categoria").eq("ativo", true).order("nome").limit(200),
  ]);

  return {
    experiencias: expRes.data || [],
    restaurantes: restRes.data || [],
    hoteis: hotelRes.data || [],
  };
}

// Fetch events from the main Supabase project
async function fetchEventData() {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  if (!SUPABASE_URL || !SUPABASE_KEY) return { eventos: [], evento_itens: [] };

  const client = createClient(SUPABASE_URL, SUPABASE_KEY);

  const [evtRes, itensRes] = await Promise.all([
    client.from("eventos").select("titulo, slug, descricao_curta, data_inicio, data_fim, destino").eq("ativo", true).limit(20),
    client.from("evento_itens").select("titulo, tipo, bairro, local_nome, google_maps_url, descricao, tags, data_inicio, data_fim").eq("ativo", true).limit(500),
  ]);

  return {
    eventos: evtRes.data || [],
    evento_itens: itensRes.data || [],
  };
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

    // Build context-aware system message
    let systemMessage = SYSTEM_PROMPT;

    // Inject database content
    systemMessage += `\n\nBANCO DE DADOS DO APP (dados reais — use APENAS estes):\n${JSON.stringify(database, null, 0)}`;

    // Inject user context (saved items, preferences, etc.)
    if (context) {
      systemMessage += `\n\nCONTEXTO DO USUÁRIO:\n${JSON.stringify(context, null, 2)}`;
    }

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
