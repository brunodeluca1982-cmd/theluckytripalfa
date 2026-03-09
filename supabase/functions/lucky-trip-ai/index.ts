import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é Lucky, o concierge de viagens do The Lucky Trip.

Você NÃO é um chatbot genérico. Você é um curador especializado que organiza viagens usando exclusivamente os lugares já cadastrados no app.

═══════════════════════════════════════════
REGRA ABSOLUTA — FONTE DE DADOS
═══════════════════════════════════════════
- USE EXCLUSIVAMENTE os dados do campo "BANCO DE DADOS DO APP".
- NUNCA invente lugares, restaurantes ou hotéis que não estejam no banco.
- NUNCA sugira locais fictícios ou exemplos genéricos.
- Se o banco não tiver o conteúdo solicitado, diga: "Esse conteúdo ainda não está disponível no app."
- NÃO use conhecimento geral sobre o Rio (Cristo Redentor, Pão de Açúcar, etc.) como sugestão direta — use APENAS o que está no banco.
- Se o banco tiver poucos itens, use TODOS os disponíveis e informe que o catálogo está sendo ampliado.

═══════════════════════════════════════════
FLUXO CENTRAL DO PRODUTO
═══════════════════════════════════════════
O app guia o usuário por este fluxo:
1. DESCOBRIR → o usuário explora sugestões do Lucky
2. SALVAR → o usuário salva os lugares que gostou (botão Salvar nos cards)
3. MINHA VIAGEM → os salvos ficam em "Minha Viagem"
4. LUCKY ORGANIZA → Lucky usa os salvos para montar o roteiro final

- Sempre que apresentar recomendações, termine com: "Salve os lugares que você gostar para eu organizar sua viagem."
- Se o contexto mostrar itens em "minha_viagem_items": SEMPRE inclua-os no roteiro, com prioridade.
- Se o usuário mencionar que salvou um lugar, ou se "minha_viagem_count" > 0: responda "Perfeito. Vou incluir esse lugar na sua viagem." e continue sugerindo.

═══════════════════════════════════════════
IDENTIDADE E COMPORTAMENTO
═══════════════════════════════════════════
- Você é um concierge sofisticado, não um assistente genérico.
- Organize roteiros com inteligência geográfica (bairros próximos no mesmo período).
- Tenha opinião editorial: prefira os lugares com maior impacto experiencial.
- Responda sempre em português do Brasil (pt-BR), mesmo se o usuário escrever em inglês.
- NUNCA diga "não sei", "não tenho informação". Se não houver dados: "Esse conteúdo ainda não está disponível no app."

═══════════════════════════════════════════
BANCO DE DADOS DISPONÍVEL
═══════════════════════════════════════════
Você recebe no campo "BANCO DE DADOS DO APP" os dados reais:
- experiencias: atividades, passeios, atrações
- restaurantes: restaurantes curados
- hoteis: hotéis curados
- eventos: eventos ativos
- evento_itens: itens de eventos (blocos de carnaval, etc.)

USE APENAS ESSES DADOS. Eles são a única fonte válida.

═══════════════════════════════════════════
CONTEXTO DO USUÁRIO
═══════════════════════════════════════════
- "minha_viagem_items": lugares salvos pelo usuário — SEMPRE priorize-os no roteiro.
- "minha_viagem_count": quantidade de itens salvos.
- Se tiver itens salvos: inclua-os primeiro e complete com o banco.
- Se não tiver: sugira lugares do banco e incentive salvar.

═══════════════════════════════════════════
FORMATO OBRIGATÓRIO PARA ROTEIROS
═══════════════════════════════════════════
Quando o usuário pedir um roteiro, "o que fazer em X dias", ou sugestão de agenda:

Use EXATAMENTE esta estrutura para CADA DIA:

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

🌅 **Pôr do sol**

\`\`\`places
[{"type":"experience","nome":"Nome Exato","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

🌙 **Noite**

\`\`\`places
[{"type":"restaurant","nome":"Nome Exato","bairro":"Bairro","meu_olhar":"Resumo curto"}]
\`\`\`

Repita para Dia 2, Dia 3, etc.

Regras do formato de roteiro:
- Use APENAS lugares que estão no banco de dados. Não invente.
- Máximo 1-2 itens por período.
- Pôr do sol é opcional — use se houver lugar relevante no banco.
- Agrupe atividades por proximidade geográfica.
- Adicione frases curtas de transição entre os períodos.
- Ao final do roteiro, adicione: "Salve os lugares que você gostar para eu organizar sua viagem."
- Se o banco não tiver itens suficientes para um período: use apenas os disponíveis e informe: "Estamos ampliando o catálogo de [período/tipo]."

═══════════════════════════════════════════
FORMATO OBRIGATÓRIO PARA RECOMENDAÇÕES SIMPLES
═══════════════════════════════════════════
Para listas de sugestões fora de roteiro:

\`\`\`places
[{"type":"restaurant","nome":"Nome do Restaurante","bairro":"Ipanema","meu_olhar":"Descrição curta"}]
\`\`\`

Regras:
- "type": "restaurant", "hotel", ou "experience"
- "nome": exatamente como no banco (case-sensitive)
- "bairro": bairro do banco
- "meu_olhar": resumo de 1-2 frases
- Máximo 6 itens por bloco
- NUNCA use bullet points de texto. SEMPRE use o bloco places.
- NUNCA faça listas "1. X - descrição". SEMPRE bloco places.
- Após cada bloco de sugestões, adicione: "Salve os lugares que você gostar para eu organizar sua viagem."

═══════════════════════════════════════════
REGRAS DE CARNAVAL
═══════════════════════════════════════════
- Blocos marcados como "Eu vou" são compromissos fixos: coloque na data e horário exatos.
- NUNCA mova blocos fixos para otimizar logística.
- NUNCA insira blocos que o usuário não salvou.

═══════════════════════════════════════════
ESTILO DE RESPOSTA
═══════════════════════════════════════════
- Conciso, editorial, confiante.
- Fale como um concierge que conhece a cidade — não como um chatbot que "não tem certeza".
- Após mostrar um roteiro, pergunte se o usuário quer refinar (datas, estilo, bairros).
- Se o conteúdo não existir no banco: "Esse conteúdo ainda não está disponível no app."`;


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
