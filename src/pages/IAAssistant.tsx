import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Send, MapPin, Loader2, BookmarkCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import rioHeroFallback from "@/assets/highlights/rio-de-janeiro-hero.jpg";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lucky-trip-ai`;
const STORAGE_KEY = "draft-roteiro";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTION_CHIPS = [
  "O que fazer no Rio em 3 dias?",
  "Onde ver o pôr do sol?",
  "Sugira restaurantes em Ipanema",
  "Monte minha viagem",
];

function getSavedCount(): number {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").length;
  } catch {
    return 0;
  }
}

function getUserContext() {
  try {
    return {
      saved_items: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
      itinerary_draft: JSON.parse(localStorage.getItem("itinerary_draft") || "[]"),
      travel_dates: JSON.parse(localStorage.getItem("trip-dates") || "null"),
      user_preferences: JSON.parse(localStorage.getItem("trip-preferences") || "null"),
      selected_city: "Rio de Janeiro",
    };
  } catch {
    return { saved_items: [], itinerary_draft: [], travel_dates: null, user_preferences: null, selected_city: "Rio de Janeiro" };
  }
}

const IAAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedCount, setSavedCount] = useState(getSavedCount);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep saved count in sync
  useEffect(() => {
    const sync = () => setSavedCount(getSavedCount());
    window.addEventListener("storage", sync);
    window.addEventListener("roteiro-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("roteiro-updated", sync);
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          context: getUserContext(),
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Limite de requisições atingido. Tente novamente em instantes.");
        } else if (resp.status === 402) {
          toast.error("Créditos insuficientes.");
        } else {
          toast.error("Erro ao consultar o assistente.");
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Flush remaining
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("Lucky AI error:", e);
      toast.error("Erro de conexão com o assistente.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-9" />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Lucky
            </h1>
            <p className="text-[11px] text-muted-foreground">Seu assistente de viagem</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Saved items card */}
        {savedCount > 0 && !hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookmarkCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Sua viagem está pronta para organizar</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {savedCount} {savedCount === 1 ? "experiência salva" : "experiências salvas"} em Minha Viagem
                </p>
                <Button
                  size="sm"
                  className="mt-3 gap-1.5"
                  onClick={() => sendMessage("Monte minha viagem com base nos lugares que eu salvei")}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Montar viagem com Lucky
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state with suggestions */}
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-4"
          >
            <div className="text-center pt-4 pb-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
                Pergunte sobre destinos, peça recomendações ou deixe eu montar seu roteiro.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-2 rounded-full bg-card border border-border text-xs text-foreground hover:bg-accent transition-colors active:scale-[0.97]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Pensando…</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="sticky bottom-20 z-30 px-4 pb-3 pt-2 bg-background/80 backdrop-blur-md border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao Lucky sobre sua viagem"
            className="flex-1 h-11 px-4 rounded-full bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 rounded-full flex-shrink-0"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default IAAssistant;
