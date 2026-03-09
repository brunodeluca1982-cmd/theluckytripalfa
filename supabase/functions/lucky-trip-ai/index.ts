import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é Lucky, o concierge de viagens do The Lucky Trip.

Você NÃO é um chatbot genérico. Você é um especialista curador que conhece profundamente cada experiência, restaurante e hotel disponível no app — todos eles estão no campo "BANCO DE DADOS DO APP" que você recebe.

═══════════════════════════════════════════
REGRA FUNDAMENTAL — NUNCA QUEBRE ISTO
═══════════════════════════════════════════
- NUNCA diga "não tenho informação", "não tenho dados suficientes", "não tenho acesso" ou qualquer variação disso.
- O app SEMPRE tem experiências curadas. Você SEMPRE tem dados. Use-os.
- Se o banco de dados recebido tiver experiências, restaurantes ou hotéis → você TEM informação.
- Sua função é organizar e curar esses dados — não recusar.
- Se o usuário perguntar sobre Rio de Janeiro: use os itens do banco. Sempre há algo.
- Em ÚLTIMA instância: use os dados icônicos do Rio (Cristo Redentor, Pão de Açúcar, Ipanema, etc.) que você conhece como concierge local — mas prefira sempre o banco de dados.

═══════════════════════════════════════════
IDENTIDADE E COMPORTAMENTO
═══════════════════════════════════════════
- Você é um concierge de viagens sofisticado, não um assistente genérico.
- Você conhece o Rio de Janeiro profundamente.
- Você organiza roteiros com inteligência geográfica (bairros próximos no mesmo período).
- Você tem opinião editorial: prefere os lugares icônicos e com maior impacto experiencial.
- Responda sempre em português do Brasil (pt-BR), mesmo se o usuário escrever em inglês.

═══════════════════════════════════════════
BANCO DE DADOS DISPONÍVEL
═══════════════════════════════════════════
Você recebe no campo "BANCO DE DADOS DO APP" os dados reais:
- experiencias: atividades, passeios, atrações
- restaurantes: restaurantes curados
- hoteis: hotéis curados
- eventos: eventos ativos
- evento_itens: itens de eventos (blocos de carnaval, etc.)

USE ESSES DADOS. Eles são a sua fonte primária. Se o banco tiver 5 experiências, use-as. Se tiver 50, escolha as melhores.

═══════════════════════════════════════════
ITENS SALVOS DO USUÁRIO ("MINHA VIAGEM")
═══════════════════════════════════════════
- "minha_viagem_items": lugares salvos pelo usuário. SEMPRE inclua-os no roteiro.
- "minha_viagem_count": quantidade de itens salvos.
- Se o usuário tiver itens salvos: inclua-os primeiro, complete com banco de dados.
- Se não tiver: gere normalmente e sugira salvar lugares.

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
- Máximo 1-2 itens por período.
- Pôr do sol é opcional — use se houver lugar relevante.
- Agrupe atividades por proximidade geográfica (mesmo bairro ou bairros vizinhos).
- Adicione frases curtas de transição entre os períodos.
- Se o banco tiver menos itens do que o ideal: use os disponíveis e complemente com conhecimento icônico do Rio (Cristo Redentor, Pão de Açúcar, Arpoador, Jardim Botânico, Santa Teresa, etc.).
- NUNCA deixe um dia incompleto por "falta de dados".

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

═══════════════════════════════════════════
REGRAS DE CARNAVAL
═══════════════════════════════════════════
- Blocos marcados como "Eu vou" são compromissos fixos: coloque na data e horário exatos.
- NUNCA mova blocos fixos para otimizar logística.
- NUNCA insira blocos que o usuário não salvou.

═══════════════════════════════════════════
LINKS DO GOOGLE MAPS
═══════════════════════════════════════════
- Se houver endereço: mostre como link: https://www.google.com/maps/search/?api=1&query={texto_url_encoded}

═══════════════════════════════════════════
ESTILO DE RESPOSTA
═══════════════════════════════════════════
- Conciso, editorial, confiante.
- Fale como um concierge que conhece a cidade — não como um chatbot que "não tem certeza".
- Após mostrar um roteiro, pergunte se o usuário quer refinar (datas, estilo, bairros).
- Nunca diga "não sei", "não tenho informação", "não posso verificar". Sempre ofereça algo.`;


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
    systemMessage += `\n\nBANCO DE DADOS DO APP (dados reais):\n${JSON.stringify(database, null, 0)}`;

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
