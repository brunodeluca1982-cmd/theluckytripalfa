import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CalendarPlus, MessageCircle, Bot, Search, MapPin, Star, Plus, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { getDestination } from "@/data/destinations-database";
import { searchPlaces, type PlaceResult } from "@/lib/search-places";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import rioHeroFallback from "@/assets/highlights/rio-de-janeiro-hero.jpg";
import { buildWhatsAppUrl } from "@/lib/whatsapp-concierge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * IA ASSISTANT — Hero/Glass redesign
 * Matches the iOS premium pattern used throughout the app.
 */

const IAAssistant = () => {
  const navigate = useNavigate();
  const { draft } = useTripDraft();

  // Resolve destination image
  const destination = draft.destinationId ? getDestination(draft.destinationId) : null;
  const heroImage = destination?.imageUrl || draft.destinationImageUrl || rioHeroFallback;
  const hasDestination = !!draft.destinationId;

  // Check if itinerary exists (roteiro pronto)
  const hasItinerary = (() => {
    try {
      const key = draft.destinationId ? `user-roteiro-${draft.destinationId}` : '';
      if (!key) return false;
      const stored = localStorage.getItem(key);
      if (stored) return true;
      // Also check generatedItinerary or itinerary_draft
      return !!localStorage.getItem('itinerary_draft') || !!localStorage.getItem('generatedItinerary');
    } catch { return false; }
  })();

  // WhatsApp URL with dynamic context
  const waUrl = buildWhatsAppUrl({
    destino: draft.destinationName || undefined,
    datas: draft.arrivalAt && draft.departureAt
      ? `${format(draft.arrivalAt, "dd/MM", { locale: ptBR })} a ${format(draft.departureAt, "dd/MM", { locale: ptBR })}`
      : undefined,
  });

  // Add-place modal state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (searchTimer) clearTimeout(searchTimer);
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchPlaces({
          query: value,
          city: draft.destinationName || "Rio de Janeiro",
          limit: 8,
        });
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    setSearchTimer(timer);
  };

  const handleAddPlace = async (place: PlaceResult) => {
    const roteiroId = draft.destinationId ? `${draft.destinationId}-auto` : "default";
    const { error } = await supabase.from("roteiro_itens").insert({
      roteiro_id: roteiroId,
      source: "google",
      ref_table: "places_cache",
      place_id: place.placeId,
      name: place.name,
      address: place.address,
      city: draft.destinationName || "Rio de Janeiro",
      lat: place.lat,
      lng: place.lng,
      day_index: 1,
      order_in_day: 99,
    });
    if (error) {
      toast.error("Erro ao adicionar. Tente novamente.");
    } else {
      toast.success(`${place.name} adicionado ao roteiro`);
      setShowSearch(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const actions = [
    {
      id: "auto",
      label: "Montar roteiro automaticamente",
      description: "Com base nas suas preferências e distâncias entre os pontos.",
      icon: CalendarPlus,
      primary: true,
      onClick: () => {
        if (hasDestination) {
          navigate("/meu-roteiro/automatico");
        } else {
          navigate("/meu-roteiro");
        }
      },
    },
    {
      id: "refinar",
      label: "Refinar meu roteiro",
      description: "Ajuste o que já foi criado: mais gastronomia, menos deslocamento, mais cultura…",
      icon: Sparkles,
      onClick: () => navigate("/ia/melhorar-roteiro"),
    },
    {
      id: "adicionar",
      label: "Adicionar lugar por nome",
      description: "Busque qualquer lugar no Google e adicione ao seu roteiro.",
      icon: Search,
      onClick: () => setShowSearch(true),
    },
    {
      id: "perguntar",
      label: "Perguntar sobre o destino",
      description: "Tire dúvidas sobre logística, bairros, segurança e mais.",
      icon: MessageCircle,
      onClick: () => navigate("/ia/perguntar"),
    },
    // WhatsApp concierge — only when itinerary is ready
    ...(hasItinerary
      ? [
          {
            id: "whatsapp",
            label: "Falar com o Concierge The Lucky Trip",
            description: "Refinamos seu roteiro em 5 minutos pelo WhatsApp.",
            icon: MessageCircle,
            isWhatsApp: true,
            onClick: () => window.open(waUrl, "_blank", "noopener,noreferrer"),
          },
        ]
      : []),
  ];

  return (
    <div className="relative min-h-screen pb-24">
      {/* Hero background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
      <div className="fixed inset-0 z-0 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 px-5 pt-14 pb-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-white/80" />
            <h1 className="text-2xl font-serif font-medium text-white tracking-tight">
              IA
            </h1>
          </div>
          <p className="text-sm text-white/60 font-light">
            Ajudo você a decidir e montar seu roteiro.
          </p>
        </header>

        {/* Destination context badge */}
        {hasDestination && destination && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6"
          >
            <MapPin className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs font-medium text-white/80">{destination.name}</span>
          </motion.div>
        )}

        {!hasDestination && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 mb-6"
          >
            <p className="text-xs text-white/50 leading-relaxed">
              Escolha um destino em <span className="text-white/70 font-medium">Meu Roteiro</span> para sugestões mais certeiras.
            </p>
          </motion.div>
        )}

        {/* Glass card with actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-4 space-y-3"
        >
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={action.onClick}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all duration-200 active:scale-[0.98]",
                  action.primary
                    ? "bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/20"
                    : "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex items-start gap-3.5">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    action.primary
                      ? "bg-white/20"
                      : "bg-white/10"
                  )}>
                    {(action as any).isWhatsApp ? (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    ) : (
                      <Icon className="w-4.5 h-4.5 text-white/90" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-sm font-medium text-white",
                      action.primary && "text-[15px]"
                    )}>
                      {action.label}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Lucky Trip AI link */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate("/ia/lucky-trip")}
          className="w-full mt-4 p-4 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30 hover:bg-primary/25 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">IA — Lucky Trip</p>
              <p className="text-xs text-white/50 mt-0.5">Seu curador inteligente</p>
            </div>
          </div>
        </motion.button>

        {/* Footer */}
        <p className="text-[10px] text-white/30 text-center mt-8 leading-relaxed max-w-xs mx-auto">
          Respostas baseadas exclusivamente em conteúdo curado pela nossa equipe editorial.
        </p>
      </div>

      {/* Add Place Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base">Adicionar lugar ao roteiro</DialogTitle>
          </DialogHeader>

          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Buscar restaurante, atração, hotel…"
              className="pl-9 pr-9"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {searchQuery && !isSearching && (
              <button
                onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-2 min-h-0">
            {/* Loading skeleton */}
            {isSearching && searchResults.length === 0 && (
              <div className="space-y-3 px-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            <AnimatePresence>
              {searchResults.map((place) => (
                <motion.div
                  key={place.placeId}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border hover:bg-accent transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{place.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                    {place.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {place.rating}
                        {place.userRatingsTotal && (
                          <span className="text-muted-foreground/60"> ({place.userRatingsTotal})</span>
                        )}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddPlace(place)}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty */}
            {searchQuery.length >= 3 && !isSearching && searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum resultado encontrado.
              </p>
            )}

            {!searchQuery && (
              <p className="text-xs text-muted-foreground text-center py-8 px-4 leading-relaxed">
                Digite o nome de um restaurante, atração ou hotel para buscar e adicionar ao seu roteiro.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IAAssistant;
