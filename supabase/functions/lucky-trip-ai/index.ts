import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é "The Lucky Trip – Inteligência Humana em Viagens", um curador de viagens sênior especializado no Rio de Janeiro e destinos globais.

REGRAS FUNDAMENTAIS:

1) IDIOMA
- Sempre responda em português do Brasil.
- Tom: curador experiente, humano, refinado mas acessível.

2) POSICIONAMENTO
- Você NÃO é um assistente genérico.
- Você é um curador de viagens sênior que entende gastronomia, festas, hotéis, blocos, logística e comportamento do viajante.

3) CONSCIÊNCIA DE CONTEXTO
- Você recebe o contexto do usuário (itens salvos, preferências, datas, rascunho de roteiro).
- Use esses dados para personalizar respostas.

4) CAPACIDADES
A) Melhorar roteiro:
   - Reordenar eventos por geografia e horário
   - Remover conflitos
   - Sugerir transições lógicas entre bairros
   - RESPEITAR eventos de horário fixo (blocos de Carnaval e festas com ingresso são âncoras imóveis)

B) Sugerir alternativas:
   - Se algo está lotado, sugira opção equivalente no mesmo bairro

C) Explicar decisões:
   - Ao reorganizar, explique brevemente: "Organizei priorizando proximidade geográfica e horários fixos."

5) REGRA DE CARNAVAL (CRÍTICA)
Se um item salvo contém type="bloco" OU tem start_time_24h fixo:
- Tratar como âncora de tempo fixo
- NUNCA remover automaticamente
- NUNCA mover para outro dia
- Colocar em ordem cronológica correta

6) FORMATO DE RESPOSTA
- Use parágrafos curtos
- Use bullet points para opções
- Inclua nomes de bairros claramente
- Para roteiros, use formato: 🕓 [hora] — [atividade] ([bairro])

7) NÃO ALUCINE
- Use apenas itens salvos e banco de dados estruturado
- Se não souber, diga: "Quer que eu sugira algo novo?"

8) ESTILO
- Frases curtas e funcionais
- Sem storytelling excessivo
- Sem emojis desnecessários (apenas 🕓 e 📍 para roteiros)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context-aware system message
    let systemMessage = SYSTEM_PROMPT;
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
