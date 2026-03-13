import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Link2, Lightbulb, Loader2, Sparkles, Bookmark, MapPin, ExternalLink, Route } from "lucide-react";
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

function GlassButton({
  children,
  className = "",
  onClick,
  disabled,
  type,
}: { children: React.ReactNode; className?: string; onClick?: () => void; disabled?: boolean; type?: "submit" | "button" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`flex items-center gap-2 py-3 px-5 text-xs font-medium text-foreground rounded-full backdrop-blur-xl bg-white/15 border border-white/25 shadow-sm hover:bg-white/22 transition-colors duration-200 ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}

function GlassPill({
  children,
  className = "",
  onClick,
  disabled,
}: { children: React.ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`flex items-center gap-1.5 py-2 px-3.5 text-[11px] font-medium text-foreground/80 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/18 transition-colors duration-200 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

export default function AddIdeaSection() {
  const navigate = useNavigate();
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
        saveDirectIdea(link.trim(), source);
        setIsLoading(false);
        return;
      }

      const data: AnalysisResult = await resp.json();
      if (!data.suggestions?.length && !data.interpretation) {
        saveDirectIdea(link.trim(), source, data.interpretation || undefined);
        setIsLoading(false);
        return;
      }
      setResult(data);
    } catch {
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

  const TikTokIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
    </svg>
  );

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full backdrop-blur-xl bg-white/12 border border-white/20 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-foreground/70" />
        </div>
        <p className="text-sm font-semibold text-foreground">Adicionar ideia</p>
      </div>

      {/* Quick paste buttons — glass capsules */}
      {!isOpen && !result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="flex flex-wrap gap-2"
        >
          <GlassButton onClick={() => handlePaste("instagram")}>
            <Instagram className="w-3.5 h-3.5" />
            Colar link do Instagram
          </GlassButton>
          <GlassButton onClick={() => handlePaste("tiktok")}>
            <TikTokIcon />
            Colar link do TikTok
          </GlassButton>
          <GlassButton onClick={() => handlePaste()}>
            <Link2 className="w-3.5 h-3.5" />
            Colar link
          </GlassButton>
        </motion.div>
      )}

      {/* URL input — glass style */}
      {isOpen && !result && !isLoading && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole o link aqui..."
            className="flex-1 h-11 rounded-full bg-white/10 backdrop-blur-xl border-white/20 text-sm text-foreground placeholder:text-foreground/40 px-5"
            autoFocus
          />
          <GlassButton type="submit" disabled={!url.trim()} className="bg-white/20 border-white/35">
            <Sparkles className="w-4 h-4" />
            Analisar
          </GlassButton>
        </form>
      )}

      {/* Loading state — glass */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 py-4 px-4 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/15 shadow-lg"
        >
          <Loader2 className="w-5 h-5 animate-spin text-foreground/60" />
          <div>
            <p className="text-sm font-medium text-foreground">Lucky está interpretando...</p>
            <p className="text-xs text-foreground/50 mt-0.5">Analisando sua inspiração de viagem</p>
          </div>
        </motion.div>
      )}

      {/* Results — glass cards */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="space-y-3"
          >
            {/* Interpretation card */}
            <div className="rounded-2xl overflow-hidden backdrop-blur-2xl bg-white/10 border border-white/15 shadow-lg">
              {/* Source header */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10">
                {sourceIcon}
                <span className="text-xs font-medium text-foreground/60 capitalize">{currentSource}</span>
                <a
                  href={analyzedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-foreground/50 hover:text-foreground flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver post
                </a>
              </div>

              {/* Interpretation */}
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-foreground/60 mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">{result.interpretation}</p>
                </div>

                {result.detected && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 ml-6">
                    {result.detected.location && (
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-white/10 border-white/15 text-foreground/70 backdrop-blur-sm gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {result.detected.location}
                      </Badge>
                    )}
                    {result.detected.neighborhood && result.detected.neighborhood !== result.detected.location && (
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto bg-white/10 border-white/15 text-foreground/70 backdrop-blur-sm">
                        {result.detected.neighborhood}
                      </Badge>
                    )}
                    {result.detected.activity && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-auto border-white/20 text-foreground/60">
                        {result.detected.activity}
                      </Badge>
                    )}
                  </div>
                )}

                <GlassPill onClick={saveInterpretationAsIdea} className="mt-3 ml-5">
                  <Bookmark className="w-3 h-3" />
                  Salvar como ideia
                </GlassPill>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-foreground/50 px-1">
                  Experiências relacionadas no app
                </p>
                {result.suggestions.map((s) => {
                  const isSaved = savedIds.has(s.id);
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/15 p-4 shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.nome}</p>
                        <p className="text-xs text-foreground/50">{s.bairro}</p>
                        <Badge variant="secondary" className="mt-1.5 text-[10px] px-2 py-0.5 h-auto bg-white/10 border-white/15 text-foreground/60 backdrop-blur-sm">
                          {typeLabels[s.type] || s.type}
                        </Badge>
                        {s.meu_olhar && (
                          <p className="text-xs text-foreground/40 mt-1.5 line-clamp-2 italic leading-relaxed">
                            "{s.meu_olhar}"
                          </p>
                        )}
                      </div>
                      <GlassPill
                        onClick={() => saveSuggestion(s)}
                        disabled={isSaved}
                        className={isSaved ? "bg-white/20 border-white/30" : ""}
                      >
                        <Bookmark className={`w-3 h-3 ${isSaved ? "fill-current" : ""}`} />
                        {isSaved ? "Salvo" : "Salvar"}
                      </GlassPill>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <GlassButton
                onClick={() => {
                  navigate("/inspiracao-trip", {
                    state: {
                      anchor: {
                        ...result,
                        sourceUrl: analyzedUrl,
                        source: currentSource,
                      },
                    },
                  });
                }}
                className="bg-white/20 border-white/35"
              >
                <Route className="w-3.5 h-3.5" />
                Gerar roteiro
              </GlassButton>
              <GlassButton
                onClick={() => {
                  setResult(null);
                  setUrl("");
                  setIsOpen(false);
                  setSavedIds(new Set());
                  setAnalyzedUrl("");
                }}
              >
                Nova ideia
              </GlassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
