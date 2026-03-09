import { useState } from "react";
import { Instagram, Link2, Lightbulb, Loader2, Sparkles, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  type: "experience" | "restaurant" | "hotel";
  id: string;
  nome: string;
  bairro: string;
  meu_olhar?: string;
}

interface AnalysisResult {
  interpretation: string;
  suggestions: Suggestion[];
}

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-social-link`;
const STORAGE_KEY = "draft-roteiro";

const typeLabels: Record<string, string> = {
  experience: "Experiência",
  restaurant: "Restaurante",
  hotel: "Hotel",
};

const typeToSavedType: Record<string, string> = {
  experience: "activity",
  restaurant: "restaurant",
  hotel: "hotel",
};

export default function AddIdeaSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [currentSource, setCurrentSource] = useState<'instagram' | 'tiktok' | 'link'>('link');

  const analyze = async (link: string) => {
    if (!link.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ url: link.trim() }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro ao analisar" }));
        toast({ title: "Erro", description: err.error || "Não foi possível analisar o link", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const data: AnalysisResult = await resp.json();
      if (!data.suggestions?.length) {
        toast({ title: "Nenhuma sugestão", description: "Não encontramos experiências relacionadas a este link." });
      }
      setResult(data);
    } catch {
      toast({ title: "Erro", description: "Falha ao conectar. Tente novamente.", variant: "destructive" });
    }

    setIsLoading(false);
  };

  const handlePaste = (source: 'instagram' | 'tiktok' | 'link' = 'link') => {
    setCurrentSource(source);
    navigator.clipboard.readText().then((text) => {
      if (text.trim()) {
        setUrl(text.trim());
        setIsOpen(true);
        analyze(text.trim());
      } else {
        setIsOpen(true);
      }
    }).catch(() => {
      setIsOpen(true);
    });
  };

  const saveSuggestion = (suggestion: Suggestion) => {
    const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const alreadySaved = draft.some(
      (item: any) => item.id === suggestion.id && item.type === typeToSavedType[suggestion.type]
    );

    if (alreadySaved) {
      toast({ title: "Já salvo", description: `${suggestion.nome} já está na sua viagem.` });
      return;
    }

    draft.push({
      id: suggestion.id,
      type: typeToSavedType[suggestion.type],
      title: suggestion.nome,
      savedAt: new Date().toISOString(),
      isPremium: false,
      destinationId: "rio-de-janeiro",
      destinationName: "Rio de Janeiro",
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    window.dispatchEvent(new CustomEvent("roteiro-updated"));
    setSavedIds((prev) => new Set(prev).add(suggestion.id));

    toast({
      title: "Adicionado à viagem ✓",
      description: suggestion.nome,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) analyze(url.trim());
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Adicionar ideia</p>
      </div>

      {/* Quick paste buttons */}
      {!isOpen && !result && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaste("instagram")}
            className="h-9 rounded-xl gap-1.5 text-xs"
          >
            <Instagram className="w-3.5 h-3.5" />
            Colar link do Instagram
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaste("tiktok")}
            className="h-9 rounded-xl gap-1.5 text-xs"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
            </svg>
            Colar link do TikTok
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaste()}
            className="h-9 rounded-xl gap-1.5 text-xs"
          >
            <Link2 className="w-3.5 h-3.5" />
            Colar link
          </Button>
        </div>
      )}

      {/* URL input */}
      {isOpen && !result && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole o link aqui..."
            className="flex-1 h-10 rounded-xl bg-muted/50 border-border text-sm"
            autoFocus
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            className="h-10 px-4 rounded-xl gap-1.5"
            disabled={!url.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isLoading ? "Analisando..." : "Analisar"}
          </Button>
        </form>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Lucky está analisando seu link...
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {result.interpretation && (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
                {result.interpretation}
              </p>
            )}

            {result.suggestions.map((s) => {
              const isSaved = savedIds.has(s.id);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-card rounded-xl border border-border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{s.nome}</p>
                    <p className="text-xs text-muted-foreground">{s.bairro}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        {typeLabels[s.type] || s.type}
                      </Badge>
                    </div>
                    {s.meu_olhar && (
                      <p className="text-xs text-muted-foreground/80 mt-1.5 line-clamp-2 italic">
                        "{s.meu_olhar}"
                      </p>
                    )}
                  </div>
                  <Button
                    variant={isSaved ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => saveSuggestion(s)}
                    disabled={isSaved}
                    className="h-8 px-3 rounded-lg gap-1 text-xs shrink-0"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Salvo" : "Salvar"}
                  </Button>
                </motion.div>
              );
            })}

            {/* Actions after results */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null);
                  setUrl("");
                  setIsOpen(false);
                }}
                className="h-8 rounded-lg text-xs"
              >
                Nova ideia
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
