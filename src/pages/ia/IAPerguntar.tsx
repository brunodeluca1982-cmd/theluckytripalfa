import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Send, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findKnowledgeMatch, topicToModuleMap, KnowledgeEntry } from "@/data/rio-knowledge-base";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IA PERGUNTAR — CLOSED-SCOPE CHAT (NO HALLUCINATIONS)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RULES:
 * - AI responds ONLY from RIO_KB (local knowledge base)
 * - If no match found, offer navigation to relevant modules
 * - All UI in Portuguese (pt-BR)
 * - No external APIs, no hallucinations
 * - Ready for future RAG integration
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: { path: string; label: string }[];
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

  const generateResponse = (query: string): { content: string; suggestions?: { path: string; label: string }[] } => {
    const matches = findKnowledgeMatch(query);
    
    if (matches.length === 0) {
      // No match found - offer navigation
      return {
        content: "Ainda não tenho isso no meu banco do Rio. Quer que eu te leve para uma dessas seções?",
        suggestions: [
          { path: '/como-chegar', label: 'Chegar' },
          { path: '/onde-ficar-rio', label: 'Ficar' },
          { path: '/eat-map-view', label: 'Comer' },
          { path: '/o-que-fazer', label: 'Fazer' },
        ],
      };
    }

    // Build response from matches
    const responseTexts = matches.slice(0, 2).map(entry => entry.text);
    const topics = [...new Set(matches.map(m => m.topic))];
    const suggestions = topics.slice(0, 2).map(topic => topicToModuleMap[topic]);

    return {
      content: responseTexts.join('\n\n'),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        suggestions: response.suggestions,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleChipClick = (chip: string) => {
    handleSend(chip);
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
          Respostas só com base no conteúdo curado do The Lucky Trip.
        </p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            
            <p className="text-center text-foreground/80 leading-relaxed max-w-sm mb-8">
              Pergunte qualquer coisa sobre o Rio de Janeiro. Vou responder com base nos nossos guias e recomendações.
            </p>

            {/* Quick Chips */}
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
          /* Messages */
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
                  
                  {/* Suggestion Buttons */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(suggestion.path)}
                          className="text-xs h-8"
                        >
                          {suggestion.label}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
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
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Digite sua pergunta..."
            className="flex-1 h-12 rounded-xl bg-muted/50 border-border"
          />
          <button 
            onClick={() => handleSend(input)}
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
