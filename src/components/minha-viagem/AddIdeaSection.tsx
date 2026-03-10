import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Link2, Lightbulb, Loader2, Sparkles, Bookmark, MapPin, ExternalLink, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  type: "experience" | "restaurant" | "hotel";
  id: string;
  nome: string;
  bairro: string;
  meu_olhar?: string;
}

interface DetectedContext {
  location: string;
  city: string;
  activity: string;
  neighborhood?: string;
}

interface AnalysisResult {
  interpretation: string;
  detected?: DetectedContext;
  suggestions: Suggestion[];
  meta?: { title: string; description: string; siteName: string };
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

const isInstagramLink = (link: string) => link.includes("instagram.com");
const isTikTokLink = (link: string) => link.includes("tiktok.com");

function detectSource(link: string): "instagram" | "tiktok" | "link" {
  if (isInstagramLink(link)) return "instagram";
  if (isTikTokLink(link)) return "tiktok";
  return "link";
}

export default function AddIdeaSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [currentSource, setCurrentSource] = useState<"instagram" | "tiktok" | "link">("link");
  const [analyzedUrl, setAnalyzedUrl] = useState("");

  const analyze = async (link: string) => {
    if (!link.trim()) return;

    const source = detectSource(link);
    setCurrentSource(source);
    setAnalyzedUrl(link.trim());
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

        // Fallback: save directly as idea if analysis fails
        saveDirectIdea(link.trim(), source);
        setIsLoading(false);
        return;
      }

      const data: AnalysisResult = await resp.json();

      if (!data.suggestions?.length && !data.interpretation) {
        // No AI results — save as direct idea
        saveDirectIdea(link.trim(), source, data.interpretation || undefined);
        setIsLoading(false);
        return;
      }

      setResult(data);
    } catch {
      // Network error — save directly as fallback
      saveDirectIdea(link.trim(), source);
    }

    setIsLoading(false);
  };

  const saveDirectIdea = (link: string, source: "instagram" | "tiktok" | "link", interpretation?: string) => {
    const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const ideaId = `idea-${Date.now()}`;

    const sourceLabels: Record<string, string> = { instagram: "Instagram", tiktok: "TikTok", link: "Link" };
    const titleLabels: Record<string, string> = { instagram: "Ideia do Instagram", tiktok: "Ideia do TikTok", link: "Ideia salva" };

    draft.push({
      id: ideaId,
      type: "activity",
      title: interpretation || titleLabels[source],
      savedAt: new Date().toISOString(),
      isPremium: false,
      destinationId: "rio-de-janeiro",
      destinationName: "Rio de Janeiro",
      source,
      sourceLabel: sourceLabels[source],
      sourceUrl: link,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    window.dispatchEvent(new CustomEvent("roteiro-updated"));
    toast({ title: "Ideia salva ✓", description: interpretation || `${titleLabels[source]} adicionada à sua viagem.` });
    setUrl("");
    setIsOpen(false);
    setResult(null);
  };

  const handlePaste = (source: "instagram" | "tiktok" | "link" = "link") => {
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

    const sourceLabels: Record<string, string> = { instagram: "Instagram", tiktok: "TikTok", link: "Link" };

    draft.push({
      id: suggestion.id,
      type: typeToSavedType[suggestion.type],
      title: suggestion.nome,
      savedAt: new Date().toISOString(),
      isPremium: false,
      destinationId: "rio-de-janeiro",
      destinationName: "Rio de Janeiro",
      source: currentSource,
      sourceLabel: sourceLabels[currentSource],
      sourceUrl: analyzedUrl,
      neighborhood: suggestion.bairro,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    window.dispatchEvent(new CustomEvent("roteiro-updated"));
    setSavedIds((prev) => new Set(prev).add(suggestion.id));
    toast({ title: "Adicionado à viagem ✓", description: suggestion.nome });
  };

  const saveInterpretationAsIdea = () => {
    if (!result) return;
    saveDirectIdea(analyzedUrl, currentSource, result.interpretation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) analyze(url.trim());
  };

  const sourceIcon = currentSource === "instagram" ? (
    <Instagram className="w-3.5 h-3.5" />
  ) : currentSource === "tiktok" ? (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
    </svg>
  ) : (
    <Link2 className="w-3.5 h-3.5" />
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Adicionar ideia</p>
      </div>

      {/* Quick paste buttons */}
      {!isOpen && !result && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePaste("instagram")} className="h-9 rounded-xl gap-1.5 text-xs">
            <Instagram className="w-3.5 h-3.5" />
            Colar link do Instagram
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePaste("tiktok")} className="h-9 rounded-xl gap-1.5 text-xs">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
            </svg>
            Colar link do TikTok
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePaste()} className="h-9 rounded-xl gap-1.5 text-xs">
            <Link2 className="w-3.5 h-3.5" />
            Colar link
          </Button>
        </div>
      )}

      {/* URL input */}
      {isOpen && !result && !isLoading && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole o link aqui..."
            className="flex-1 h-10 rounded-xl bg-muted/50 border-border text-sm"
            autoFocus
          />
          <Button type="submit" size="sm" className="h-10 px-4 rounded-xl gap-1.5" disabled={!url.trim()}>
            <Sparkles className="w-4 h-4" />
            Analisar
          </Button>
        </form>
      )}

      {/* Loading state */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 py-4 px-3 bg-muted/30 rounded-xl"
        >
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Lucky está interpretando...</p>
            <p className="text-xs text-muted-foreground mt-0.5">Analisando sua inspiração de viagem</p>
          </div>
        </motion.div>
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
            {/* Interpretation card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Source header */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                {sourceIcon}
                <span className="text-xs font-medium text-muted-foreground capitalize">{currentSource}</span>
                <a
                  href={analyzedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver post
                </a>
              </div>

              {/* Interpretation */}
              <div className="p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{result.interpretation}</p>
                </div>

                {result.detected && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-6">
                    {result.detected.location && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {result.detected.location}
                      </Badge>
                    )}
                    {result.detected.neighborhood && result.detected.neighborhood !== result.detected.location && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        {result.detected.neighborhood}
                      </Badge>
                    )}
                    {result.detected.activity && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                        {result.detected.activity}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Save interpretation as idea */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveInterpretationAsIdea}
                  className="mt-2 ml-4 h-7 text-xs text-primary gap-1"
                >
                  <Bookmark className="w-3 h-3" />
                  Salvar como ideia
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground px-1">
                  Experiências relacionadas no app
                </p>
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
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null);
                  setUrl("");
                  setIsOpen(false);
                  setSavedIds(new Set());
                  setAnalyzedUrl("");
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
