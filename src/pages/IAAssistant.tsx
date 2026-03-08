import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Sparkles, Send, MapPin, Loader2, BookmarkCheck, Trees, UtensilsCrossed, Landmark, Coffee, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import PlaceCardList from "@/components/chat/PlaceCardList";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import rioHeroFallback from "@/assets/highlights/rio-de-janeiro-hero.jpg";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { getDestination } from "@/data/destinations-database";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lucky-trip-ai`;
const STORAGE_KEY = "draft-roteiro";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTION_CHIPS = [
  "O que fazer no Rio em 3 dias?",
  "Onde ver o pôr do sol?",
  "Sugira restaurantes em Ipanema",
  "Monte minha viagem",
];

const QUICK_ACTIONS = [
  { label: "Mais natureza", icon: Trees, prompt: "Ajuste o roteiro para incluir mais natureza, praias e atividades ao ar livre" },
  { label: "Mais gastronomia", icon: UtensilsCrossed, prompt: "Ajuste o roteiro priorizando restaurantes e experiências gastronômicas" },
  { label: "Mais cultura", icon: Landmark, prompt: "Ajuste o roteiro priorizando museus, galerias e atrações culturais" },
  { label: "Viagem mais relaxada", icon: Coffee, prompt: "Ajuste o roteiro para um ritmo mais tranquilo com menos deslocamentos" },
  { label: "Viagem mais intensa", icon: Zap, prompt: "Ajuste o roteiro para um ritmo mais acelerado com mais atividades por dia" },
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
    // "draft-roteiro" is the primary save mechanism (use-item-save hook)
    const draftRoteiro = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // "saved-items" is the secondary normalized layer (use-saved-items hook)
    const savedItems = JSON.parse(localStorage.getItem("saved-items") || "[]");
    
    // Build a unified summary of what the user saved — prioritize draft-roteiro as it's the main flow
    const draftSummary = draftRoteiro.map((i: any) => ({
      title: i.title,
      type: i.type,
      destination: i.destinationName || "Rio de Janeiro",
    }));
    const savedSummary = savedItems.map((i: any) => ({
      title: i.title,
      type: i.type,
      neighborhood: i.neighborhood_full || i.neighborhood_short,
      date: i.date_iso,
      time: i.start_time_24h,
      priority: i.priority,
      rsvp: i.rsvp,
    }));

    return {
      minha_viagem_items: draftSummary,
      minha_viagem_count: draftRoteiro.length,
      saved_items_normalized: savedSummary,
      saved_items_normalized_count: savedItems.length,
      travel_dates: JSON.parse(localStorage.getItem("trip-dates") || "null"),
      user_preferences: JSON.parse(localStorage.getItem("trip-preferences") || "null"),
      selected_city: "Rio de Janeiro",
    };
  } catch {
    return { minha_viagem_items: [], minha_viagem_count: 0, saved_items_normalized: [], saved_items_normalized_count: 0, travel_dates: null, user_preferences: null, selected_city: "Rio de Janeiro" };
  }
}

/** Parse assistant content, splitting ```places JSON blocks from regular markdown */
function AssistantMessage({ content }: { content: string }) {
  const parts = useMemo(() => {
    const regex = /```places\s*\n([\s\S]*?)```/g;
    const result: { type: "text" | "places"; value: string }[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: "text", value: content.slice(lastIndex, match.index) });
      }
      result.push({ type: "places", value: match[1].trim() });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      result.push({ type: "text", value: content.slice(lastIndex) });
    }
    return result;
  }, [content]);

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.type === "places") {
          try {
            const items = JSON.parse(part.value);
            if (Array.isArray(items) && items.length > 0) {
              return <PlaceCardList key={i} items={items} />;
            }
          } catch {
            /* fallback to text */
          }
        }
        return (
          <div key={i} className="prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&_a]:text-white/80 [&_a]:underline">
            <ReactMarkdown>{part.value}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}
const IAAssistant = () => {

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { draft } = useTripDraft();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedCount, setSavedCount] = useState(getSavedCount);
  const autoTriggered = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Resolve hero image
  const destination = draft.destinationId ? getDestination(draft.destinationId) : null;
  const heroImage = destination?.imageUrl || draft.destinationImageUrl || rioHeroFallback;

  useEffect(() => {
    const sync = () => setSavedCount(getSavedCount());
    window.addEventListener("storage", sync);
    window.addEventListener("roteiro-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("roteiro-updated", sync);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Auto-trigger organize from "Minha Viagem"
  const sendMessageRef = useRef<((text: string) => void) | null>(null);
  useEffect(() => {
    if (autoTriggered.current) return;
    if (searchParams.get("action") === "organize" && messages.length === 0 && sendMessageRef.current) {
      autoTriggered.current = true;
      setSearchParams({}, { replace: true });
      const savedItems = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
      const count = savedItems.length;
      if (count > 0) {
        const titles = savedItems.map((i: any) => i.title).slice(0, 10).join(", ");
        const prompt = `Monte um roteiro organizado por dia usando os ${count} lugares que eu salvei em Minha Viagem (${titles}). Complete o roteiro com sugestões do app para os momentos do dia que faltarem.`;
        setTimeout(() => sendMessageRef.current?.(prompt), 300);
      }
    }
  });

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
        if (resp.status === 429) toast.error("Limite de requisições atingido. Tente novamente em instantes.");
        else if (resp.status === 402) toast.error("Créditos insuficientes.");
        else toast.error("Erro ao consultar o assistente.");
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamDone = false;

      const updateAssistant = (content: string) => {
        assistantSoFar += content;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

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
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) updateAssistant(c);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

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
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) updateAssistant(c);
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

  // Keep ref in sync for auto-trigger
  sendMessageRef.current = sendMessage;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="relative min-h-screen flex flex-col pb-20">
      {/* Atmospheric background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" />
      <div className="fixed inset-0 z-0 backdrop-blur-[2px]" />

      {/* Header — glass bar */}
      <header className="sticky top-0 z-40 bg-white/8 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="w-9" />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-white/80" />
              Lucky
            </h1>
            <p className="text-[11px] text-white/50">Seu assistente de viagem</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      {/* Scrollable content */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {/* Saved items card */}
        {savedCount > 0 && !hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <BookmarkCheck className="w-5 h-5 text-white/90" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Sua viagem está pronta para organizar</p>
                <p className="text-xs text-white/50 mt-0.5">
                  {savedCount} {savedCount === 1 ? "experiência salva" : "experiências salvas"} em Minha Viagem
                </p>
                <button
                  onClick={() => sendMessage("Monte minha viagem com base nos lugares que eu salvei")}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-sm font-medium text-white hover:bg-white/25 transition-all active:scale-[0.97]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Montar viagem com Lucky
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-5"
          >
            <div className="text-center pt-6 pb-2">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-white/80" />
              </div>
              <p className="text-sm text-white/50 max-w-[260px] mx-auto leading-relaxed font-light">
                Pergunte sobre destinos, peça recomendações ou deixe eu montar seu roteiro.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/80 hover:bg-white/20 transition-all active:scale-[0.97]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isLastAssistantMessage = msg.role === "assistant" && i === messages.length - 1;
            const showQuickActions = isLastAssistantMessage && !isLoading;

            return (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-br-md"
                        : "bg-white/10 backdrop-blur-xl border border-white/15 text-white/90 rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <AssistantMessage content={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>

                {/* Quick action buttons below last assistant message */}
                {showQuickActions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-3 px-1"
                  >
                    <div className="flex flex-wrap gap-2">
                      {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.label}
                            onClick={() => sendMessage(action.prompt)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/80 hover:bg-white/20 transition-all active:scale-[0.97] disabled:opacity-40"
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white/50" />
              <span className="text-xs text-white/50">Pensando…</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar — glass */}
      <div className="sticky bottom-20 z-30 px-4 pb-3 pt-2 bg-black/30 backdrop-blur-xl border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao Lucky sobre sua viagem"
            className="flex-1 h-11 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-full flex-shrink-0 flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 disabled:opacity-40 transition-all active:scale-[0.95]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-2">
        <p className="text-[10px] text-white/25 text-center leading-relaxed max-w-xs mx-auto">
          Respostas baseadas em conteúdo curado pela equipe editorial.
        </p>
      </div>
    </div>
  );
};

export default IAAssistant;
