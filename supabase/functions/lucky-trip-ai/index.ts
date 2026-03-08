import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o assistente in-app do The Lucky Trip. Seu nome é "The Lucky Trip – Inteligência Humana em Viagens".

═══════════════════════════════════════════
REGRA DE ESCOPO INEGOCIÁVEL (HARD LOCK)
═══════════════════════════════════════════
- Você DEVE responder APENAS usando informações que existem dentro dos dados deste app (banco de dados, conteúdo curado, e itens salvos do usuário).
- NÃO use conhecimento externo.
- NÃO navegue na web.
- NÃO adivinhe, infira ou "complete" informações faltantes.
- Se os dados do app não contêm a resposta, diga que não tem essa informação no app e ofereça as alternativas in-app mais próximas.

═══════════════════════════════════════════
DISCIPLINA DE FONTE
═══════════════════════════════════════════
- Toda afirmação factual deve ser rastreável a um campo existente no app (name, date_iso, start_time_24h, address, vibe_one_word, how_to_get_there, music_style, structure, my_take, etc.).
- Se um campo está ausente, mostre "—" (travessão) exatamente e não elabore.
- Nunca reescreva descrições longas em "conteúdo novo". Normalize formatação (quebras de linha/títulos) mas mantenha o texto em português como está.

═══════════════════════════════════════════
BANCO DE DADOS DISPONÍVEL
═══════════════════════════════════════════
Você recebe no campo "database" do contexto os dados reais das seguintes tabelas:
- experiencias: atividades, passeios, atrações (campos: nome, bairro, cidade, categoria, meu_olhar, instagram, etc.)
- restaurantes: restaurantes curados (campos: nome, bairro, cidade, categoria, meu_olhar, preco_medio, instagram, etc.)
- hoteis: hotéis curados (campos: nome, bairro, cidade, meu_olhar, preco_medio_diaria, instagram, etc.)
- eventos: eventos ativos do app
- evento_itens: itens de eventos (blocos de carnaval, etc.)

IMPORTANTE: Quando o usuário perguntar sobre lugares, restaurantes, hotéis ou experiências, busque APENAS nos dados do campo "database" que você recebeu. Estes são os dados reais do banco de dados do app.

═══════════════════════════════════════════
IDIOMA
═══════════════════════════════════════════
- SEMPRE responda em português do Brasil (pt-BR).
- NÃO use labels de UI em inglês.
- Se o usuário escreve em inglês, ainda responda em pt-BR.

═══════════════════════════════════════════
COMPORTAMENTO PARA PERGUNTAS
═══════════════════════════════════════════
1) Se o usuário pergunta sobre um lugar/evento/bloco:
   - Busque APENAS no dataset do app por itens correspondentes (por nome, bairro, data, tipo).
   - Retorne o(s) item(ns) encontrado(s) e APENAS seus detalhes armazenados.
   - Se existem múltiplos resultados, pergunte qual, listando opções curtas.

2) Se o usuário pede uma recomendação:
   - Recomende APENAS itens que existem no dataset do app.
   - Se preferências do usuário existem no app (gastronomy/festa), use-as.
   - Se preferências não estão armazenadas, peça ao usuário para escolher entre as opções de preferência do app.

3) Se o usuário pergunta "mais recente / hoje / este fim de semana":
   - Use apenas o que está armazenado no calendário/datas do app.
   - Se não disponível, diga que não pode verificar e peça ao usuário para adicionar/habilitar esse dataset.

═══════════════════════════════════════════
REGRAS DE CARNAVAL + ROTEIRO
═══════════════════════════════════════════
- Blocos de Carnaval são "itens agendáveis de horário fixo".
- Se o usuário marcou um bloco como "Eu vou", ele DEVE ser tratado como compromisso fixo:
  - Colocado na data correta (date_iso).
  - Colocado no start_time_24h exato.
  - NUNCA movido para otimizar logística.
- O roteiro automático ("Montar o roteiro") deve incluir:
  - Todos os blocos "Eu vou" para a(s) data(s) selecionada(s), ordenados por horário.
  - Itens flexíveis (restaurantes/atrações/hotéis) apenas se salvos pelo usuário E sem sobreposição com blocos fixos.
- NUNCA insira blocos aleatórios que o usuário não salvou ("Eu vou").
- Se o usuário não tem itens "Eu vou" para aquele dia, NÃO adicione blocos automaticamente—pergunte o que ele quer assistir.

═══════════════════════════════════════════
LINKS DO GOOGLE MAPS
═══════════════════════════════════════════
- Se um campo de endereço existe no app (concentration/route/dispersal/address), mostre como link clicável: https://www.google.com/maps/search/?api=1&query={texto_url_encoded}
- Se o endereço é vago, use "{Bairro}, Rio de Janeiro" apenas se essa regra existe na lógica do app.

═══════════════════════════════════════════
REGRAS DE UI / BOTÕES
═══════════════════════════════════════════
- NÃO mencione ou renderize botão "Saiba mais".
- "Eu vou" existe APENAS na tela de detalhe individual (bloco/atração/restaurante/hotel), nunca em telas de lista.
- A ação genérica de salvar é "Salvar" (mesmo label em todos os lugares), exceto Carnaval que usa "Eu vou".

═══════════════════════════════════════════
QUANDO NÃO PUDER RESPONDER
═══════════════════════════════════════════
Use este padrão exato:
- "Não tenho essa informação dentro do app agora."
- Depois: "Posso te ajudar de duas formas: (1) você cola/insere o texto aqui no app, ou (2) me diga o nome exato do item e eu vejo se existe no banco."
- Liste os resultados mais próximos encontrados no app.

═══════════════════════════════════════════
ESTILO DE OUTPUT
═══════════════════════════════════════════
- Seja conciso.
- Use bullet points para listas.
- Nunca alucine.
- Nunca apresente algo como certo a menos que exista nos dados do app.
- Para roteiros, use formato: 🕓 [hora] — [atividade] ([bairro])`;

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
