import { Link } from "react-router-dom";
import { ChevronLeft, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import PlaceCardList from "@/components/chat/PlaceCardList";

type Msg = { role: "user" | "assistant"; content: string };

function getUserContext() {
  try {
    const savedItems = JSON.parse(localStorage.getItem("saved-items") || "[]");
    const draftRoteiro = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
    const tripDates = JSON.parse(localStorage.getItem("trip-dates") || "{}");
    const preferences = JSON.parse(localStorage.getItem("user-preferences") || "{}");
    return {
      saved_items: savedItems,
      itinerary_draft: draftRoteiro,
      minha_viagem_items: draftRoteiro,
      minha_viagem_count: draftRoteiro.length,
      travel_dates: tripDates,
      user_preferences: preferences,
      selected_city: "Rio de Janeiro",
    };
  } catch {
    return { selected_city: "Rio de Janeiro", minha_viagem_count: 0 };
  }
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lucky-trip-ai`;

const exampleQueries = [
  "O que fazer no Rio em 3 dias?",
  "Qual o melhor bairro pra ficar no Rio?",
  "Sugira um roteiro gastronômico na Zona Sul",
  "O que fazer num dia de chuva?",
];

/** Parse assistant content and render places blocks as PlaceCardList */
function AssistantMessage({ content, onSave }: { content: string; onSave?: (name: string) => void }) {
  const parts: Array<{ type: "text" | "places"; raw: string }> = [];
  const regex = /```places\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", raw: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "places", raw: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", raw: content.slice(lastIndex) });
  }

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.type === "places") {
          try {
            const items = JSON.parse(part.raw.trim());
            if (Array.isArray(items) && items.length > 0) {
              return (
                <PlaceCardListWithCallback
                  key={i}
                  items={items}
                  onSave={onSave}
                />
              );
            }
          } catch {
            // fallback to text
          }
          return null;
        }
        if (!part.raw.trim()) return null;
        return (
          <div key={i} className="prose prose-sm max-w-none text-foreground [&_p]:text-foreground [&_strong]:text-foreground [&_em]:text-foreground/80 [&_li]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground">
            <ReactMarkdown>{part.raw}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}

function PlaceCardListWithCallback({
  items,
  onSave,
}: {
  items: Array<{ type: string; nome: string; bairro: string; meu_olhar?: string }>;
  onSave?: (name: string) => void;
}) {
  // Wrap PlaceCardList with save detection via storage events
  useEffect(() => {
    if (!onSave) return;
    const handler = () => {
      try {
        const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
        const lastItem = draft[draft.length - 1];
        if (lastItem?.title) onSave(lastItem.title);
      } catch {}
    };
    window.addEventListener("roteiro-updated", handler);
    return () => window.removeEventListener("roteiro-updated", handler);
  }, [onSave]);

  return (
    <PlaceCardList
      items={items.map((it) => ({
        type: it.type as "restaurant" | "hotel" | "experience",
        nome: it.nome,
        bairro: it.bairro,
        meu_olhar: it.meu_olhar,
      }))}
    />
  );
}

const IALuckyTrip = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Track last saved item name to trigger acknowledgment
  const pendingSaveRef = useRef<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSaveAck = useCallback((itemName: string) => {
    if (pendingSaveRef.current === itemName) return; // already acked
    pendingSaveRef.current = itemName;
    const ackMsg: Msg = {
      role: "assistant",
      content: `Perfeito. Vou incluir **${itemName}** na sua viagem. Continue explorando e salve mais lugares — assim posso organizar um roteiro completo para você.`,
    };
    setMessages((prev) => [...prev, ackMsg]);
    // Reset after short delay so next save can be acked
    setTimeout(() => { pendingSaveRef.current = null; }, 2000);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          context: getUserContext(),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro de conexão" }));
        toast.error(err.error || "Erro ao conectar com a IA");
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        const content = assistantSoFar;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      let done = false;
      while (!done) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("AI stream error:", e);
      toast.error("Erro ao conectar com a IA");
    }

    setIsLoading(false);
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-5 pt-12 pb-4 border-b border-border shrink-0">
        <Link
          to="/ia"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-serif font-medium text-foreground">
          IA – Lucky Trip
        </h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-1">
          Seu curador inteligente de viagem
        </p>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-center text-foreground/80 leading-relaxed max-w-sm mb-8">
              Descubra, salve e deixe o Lucky organizar sua viagem.
            </p>
            <div className="w-full max-w-sm space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 text-center">
                Experimente perguntar
              </p>
              {exampleQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground/70 hover:bg-muted hover:border-border transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "user" ? (
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-primary text-primary-foreground">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-muted">
                <AssistantMessage content={msg.content} onSave={handleSaveAck} />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground">
              <span className="animate-pulse">Pensando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-border bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte algo..."
            className="flex-1 h-12 rounded-xl bg-muted/50 border-border"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
          Salve os lugares que você gostar para eu organizar sua viagem.
        </p>
      </form>
    </div>
  );
};

export default IALuckyTrip;
