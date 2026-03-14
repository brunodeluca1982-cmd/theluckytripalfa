import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Send, ArrowRight, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp-concierge";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lucky-trip-ai`;

const WHATSAPP_FALLBACK = "Boa pergunta. Vou perguntar diretamente ao Bruno e te respondo.";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  showWhatsApp?: boolean;
}

const quickChips = [
  "Como chegar?",
  "Qual melhor bairro pra ficar?",
  "O que fazer em 3 dias?",
  "Onde comer bem sem estresse?",
  "É seguro?",
];

const IAPerguntar = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: text.trim() },
          ],
          context: {
            selected_city: "Rio de Janeiro",
            minha_viagem_count: 0,
            mode: "perguntar",
          },
        }),
      });

      if (!res.ok) throw new Error("fetch failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("no reader");

      let fullContent = "";
      const decoder = new TextDecoder();

      const assistantId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
              );
            }
          } catch { /* skip */ }
        }
      }

      // If AI response is very short or empty, show WhatsApp fallback
      if (!fullContent.trim() || fullContent.trim().length < 10) {
        setMessages(prev =>
          prev.map(m => m.id === assistantId
            ? { ...m, content: WHATSAPP_FALLBACK, showWhatsApp: true }
            : m
          )
        );
      }
    } catch {
      const fallbackId = `assistant-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        { id: fallbackId, role: 'assistant', content: WHATSAPP_FALLBACK, showWhatsApp: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border flex-shrink-0">
        <Link 
          to="/ia" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-xl font-serif font-medium text-foreground">
          Pergunte sobre o Rio
        </h1>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Respostas com base no conteúdo curado do The Lucky Trip.
        </p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            
            <p className="text-center text-foreground/80 leading-relaxed max-w-sm mb-8">
              Pergunte qualquer coisa sobre o Rio de Janeiro. Vou responder com base nos nossos guias e recomendações.
            </p>

            <div className="w-full max-w-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 text-center">
                Experimente perguntar
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => handleChipClick(chip)}
                    className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm text-foreground/70 hover:bg-muted hover:border-border transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border border-border'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {message.showWhatsApp && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <a
                        href={buildWhatsAppUrl({ destino: "Rio de Janeiro" })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(141,73%,42%)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Falar com Bruno no WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted border border-border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-border bg-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Digite sua pergunta..."
            className="flex-1 h-12 rounded-xl bg-muted/50 border-border"
          />
          <button 
            onClick={() => sendMessage(input)}
            className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
          Respostas baseadas apenas em conteúdo curado
        </p>
      </div>
    </div>
  );
};

export default IAPerguntar;
