import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Move } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import { useExternalHotels } from "@/hooks/use-external-hotels";

// Fixed editorial neighborhood order
const NEIGHBORHOOD_ORDER = [
  "ipanema",
  "leblon",
  "arpoador",
  "copacabana",
  "leme",
  "santa-teresa",
  "centro",
  "recreio",
  "barra-da-tijuca",
  "sao-conrado",
  "botafogo",
  "jardim-botanico",
  "gavea",
];

function normalizeNeighborhood(bairro: string): string {
  return bairro
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

const OndeficarRio = () => {
  const [mapInteractive, setMapInteractive] = useState(false);
  const { data: externalHotels } = useExternalHotels();

  const hotelListData = useMemo(() => {
    if (!externalHotels || externalHotels.length === 0) return [];
    return externalHotels.map((h) => ({
      id: h.id,
      name: h.nome,
      neighborhood: normalizeNeighborhood(h.bairro),
      tag: h.categoria?.trim() || "Hotel",
      meuOlhar: h.meu_olhar,
      instagram: h.instagram,
    }));
  }, [externalHotels]);

  const makeSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const renderHotelRow = (hotel: typeof hotelListData[0]) => {
    const slug = makeSlug(hotel.name);
    return (
      <Link
        key={hotel.id}
        to={`/hotel/${slug}?from=${hotel.neighborhood}`}
        className="flex items-center justify-between py-4 border-b border-border hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
      >
        <div className="flex-1 min-w-0">
          <p className="text-base text-foreground truncate">{hotel.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded">
            {hotel.tag}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      {/* Header block */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-serif font-medium text-foreground">
          Onde faz mais sentido você ficar
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Escolha um bairro. A gente te ajuda a decidir onde ficar.
        </p>
      </div>

      {/* Map Area — fits viewport width, no horizontal scroll, doesn't capture vertical scroll */}
      <div className="relative w-full" style={{ height: "40vh" }}>
        {/* Overlay that blocks touch pan/scroll on map unless interactive mode is on */}
        {!mapInteractive && (
          <div className="absolute inset-0 z-10" />
        )}

        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            touchAction: mapInteractive ? "pan-x pan-y pinch-zoom" : "auto",
          }}
        >
          <img
            src="/assets/maps/rio-3d-map.png"
            alt="Rio de Janeiro 3D Map"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />

          {/* Pins — positioned with percentages so they scale with the image */}
          {RIO_NEIGHBORHOODS.map((neighborhood) => (
            <Link
              key={neighborhood.id}
              to={`/onde-ficar/${neighborhood.id}?from=map`}
              className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center z-20"
              style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
              aria-label={`Explorar hotéis em ${neighborhood.name}`}
            >
              <div className="w-2 h-2 rounded-full bg-foreground/60" />
            </Link>
          ))}
        </div>

        {/* Toggle interactive mode button */}
        <button
          onClick={() => setMapInteractive((v) => !v)}
          className={`absolute bottom-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            mapInteractive
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 text-foreground border border-border backdrop-blur-sm"
          }`}
        >
          <Move className="w-3 h-3" />
          {mapInteractive ? "Sair" : "Interagir"}
        </button>
      </div>

      {/* Instruction */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-sm text-muted-foreground">
          Toque em um bairro para explorar onde ficar
        </p>
      </div>

      {/* Hotel List — flows naturally in page scroll */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-serif font-medium text-foreground mb-4">
          Hotéis
        </h2>

        <div className="space-y-6">
          {NEIGHBORHOOD_ORDER.map((neighborhoodId) => {
            const neighborhoodHotels = hotelListData.filter(
              (h) => h.neighborhood === neighborhoodId
            );
            if (neighborhoodHotels.length === 0) return null;
            const neighborhoodData = getNeighborhoodById(neighborhoodId);

            return (
              <div key={neighborhoodId}>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  {neighborhoodData?.name || neighborhoodId}
                </h3>
                <div className="space-y-1">
                  {neighborhoodHotels.map(renderHotelRow)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default OndeficarRio;
