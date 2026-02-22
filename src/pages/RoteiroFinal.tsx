import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Utensils, Sun, Camera, Mountain, Music, Clock, Moon, MapPin, Car, Footprints } from "lucide-react";
import { getValidatedLocation } from "@/data/validated-locations";
import { useWeatherIcons, getTripDayDate } from "@/hooks/use-weather-icons";
import rioHero from "@/assets/highlights/rio-de-janeiro-hero.jpg";

/* ─── Sub-components ─── */

const HeroHeader = ({ destination, onBack }: { destination: string; onBack: () => void }) => (
  <div className="relative w-full h-72 overflow-hidden">
    <img src={rioHero} alt={destination} className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px]" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
    <button
      onClick={onBack}
      className="absolute top-5 left-4 z-10 p-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20"
      aria-label="Voltar"
    >
      <ChevronLeft className="w-5 h-5 text-white" />
    </button>
    <div className="absolute bottom-6 left-5 right-5 z-10">
      <p className="text-white/70 text-xs tracking-[0.2em] uppercase font-sans mb-1">The Lucky Trip</p>
      <h1 className="text-3xl font-serif font-semibold text-white leading-tight">{destination}</h1>
      <p className="text-white/60 text-sm font-sans mt-1 italic">Roteiro personalizado para você</p>
    </div>
  </div>
);

const TripSummaryBar = ({ dates, travelers, hotelName, hotelNeighborhood }: {
  dates: string; travelers: string; hotelName: string; hotelNeighborhood: string;
}) => (
  <div className="mx-4 -mt-5 relative z-20 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm px-5 py-4">
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground/70">
      <div><span className="font-medium text-foreground">Datas</span><br />{dates}</div>
      <div><span className="font-medium text-foreground">Viajantes</span><br />{travelers}</div>
      <div><span className="font-medium text-foreground">Hotel</span><br />{hotelName} · {hotelNeighborhood}</div>
    </div>
  </div>
);

/* ─── Icon helpers ─── */

const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  meal:      { icon: <Utensils className="w-4 h-4 text-orange-600/80" />, bg: "bg-orange-100 dark:bg-orange-900/30" },
  sunset:    { icon: <Sun className="w-4 h-4 text-amber-600/80" />,      bg: "bg-amber-100 dark:bg-amber-900/30" },
  landmark:  { icon: <Camera className="w-4 h-4 text-primary" />,        bg: "bg-primary/10" },
  nature:    { icon: <Mountain className="w-4 h-4 text-green-600/80" />,  bg: "bg-green-100 dark:bg-green-900/30" },
  nightlife: { icon: <Music className="w-4 h-4 text-purple-600/80" />,    bg: "bg-purple-100 dark:bg-purple-900/30" },
  departure: { icon: <Clock className="w-4 h-4 text-primary" />,         bg: "bg-primary/10" },
  activity:  { icon: <MapPin className="w-4 h-4 text-primary" />,        bg: "bg-primary/10" },
};

const getIconData = (t: string) => iconMap[t] ?? iconMap.activity;

const blockLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  morning:   { label: "Manhã",  icon: <Sun className="w-3 h-3 text-amber-500" /> },
  afternoon: { label: "Tarde",  icon: <Sun className="w-3 h-3 text-orange-500" /> },
  evening:   { label: "Noite",  icon: <Moon className="w-3 h-3 text-indigo-400" /> },
};

/* ─── Day Block ─── */

interface DayActivity {
  time: string;
  type?: string;
  id?: string;
  name?: string;
  neighborhood?: string;
  icon?: string;
  timeBlock?: string;
  address?: string;
  from?: string;
  to?: string;
  mode?: string;
  duration?: string;
  distanceKm?: number;
}

interface DayData {
  day: number;
  title: string;
  activities: DayActivity[];
  costs: { food: number; activities: number; transport: number; total: number };
}

const DayBlock = ({ day, tripStartDate, weatherMap }: {
  day: DayData; tripStartDate: Date; weatherMap: Record<string, { icon: string; label?: string }>;
}) => {
  let currentBlock = "";
  const isoDate = getTripDayDate(tripStartDate, day.day);
  const w = weatherMap[isoDate];

  return (
    <section className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 overflow-hidden">
      {/* Day header */}
      <div className="px-5 pt-5 pb-3 border-b border-border/40">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-serif font-semibold text-foreground">Dia {day.day}</h2>
          {w && <span className="text-sm opacity-70">{w.icon}</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{day.title.replace(/^Dia \d+ — /, "")}</p>
      </div>

      {/* Activities */}
      <div className="px-5 py-3 space-y-0.5">
        {day.activities.map((a, idx) => {
          const isTransport = a.type === "transport";
          const showBlock = a.timeBlock && a.timeBlock !== currentBlock && !isTransport;
          if (a.timeBlock && !isTransport) currentBlock = a.timeBlock;
          const bl = a.timeBlock ? blockLabels[a.timeBlock] : null;

          return (
            <div key={idx}>
              {showBlock && bl && (
                <div className="flex items-center gap-2 pt-4 pb-1.5">
                  {bl.icon}
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">{bl.label}</span>
                </div>
              )}

              {isTransport ? (
                <div className="flex items-center gap-3 py-1.5 opacity-50">
                  <span className="w-11 text-[11px] tabular-nums text-muted-foreground">{a.time}</span>
                  <div className="w-6 h-6 rounded-md bg-muted/40 flex items-center justify-center">
                    {a.mode === "walking"
                      ? <Footprints className="w-3.5 h-3.5 text-muted-foreground" />
                      : <Car className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground flex-1">{a.from} → {a.to} · {a.duration}</p>
                </div>
              ) : (
                <div className="flex items-start gap-3 py-2.5">
                  <span className="w-11 text-[11px] tabular-nums text-muted-foreground pt-0.5">{a.time}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconData(a.icon || "activity").bg}`}>
                    {getIconData(a.icon || "activity").icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-[13px] leading-snug">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.neighborhood}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cost footer */}
      <div className="px-5 py-4 bg-muted/30 border-t border-border/40">
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full">Alimentação R$ {day.costs.food}</span>
          <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full">Atividades R$ {day.costs.activities}</span>
          <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full">Transporte R$ {day.costs.transport}</span>
        </div>
        <p className="text-sm font-semibold text-foreground mt-2">Total do dia: R$ {day.costs.total}</p>
      </div>
    </section>
  );
};

/* ─── Curator Note ─── */

const CuratorNote = () => (
  <div className="rounded-2xl bg-accent/40 dark:bg-accent/20 border border-border/40 px-5 py-5">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-2">Nota do Curador</p>
    <p className="text-sm text-foreground/80 italic leading-relaxed font-serif">
      "Esse roteiro equilibra experiência local com ritmo confortável — manhãs ativas, tardes livres para improvisar e noites em endereços que valem cada minuto. Ajuste à vontade; o melhor roteiro é o que você faz seu."
    </p>
  </div>
);

/* ─── Concierge CTA ─── */

const ConciergeCTA = ({ onContact }: { onContact: () => void }) => (
  <div className="rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm px-5 py-5">
    <p className="text-sm font-semibold text-foreground">Quer ajustar algo?</p>
    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
      Posso refinar hotéis, horários e reservas — atendimento direto e personalizado.
    </p>
    <button
      onClick={onContact}
      className="mt-3 w-full h-11 rounded-full bg-foreground text-background text-sm font-medium transition-all active:scale-[0.97] hover:opacity-90"
    >
      Falar com Concierge →
    </button>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

const RoteiroFinal = () => {
  const navigate = useNavigate();
  const weatherMap = useWeatherIcons({ lat: -22.9068, lon: -43.1729 });
  const tripStartDate = new Date("2025-01-15");

  // --- Static demo data (unchanged logic) ---
  const tripData = {
    destination: "Rio de Janeiro",
    dates: "15 Jan → 18 Jan 2025",
    travelers: "2 adultos, 1 criança",
    hotel: {
      id: "fasano",
      name: "Hotel Fasano",
      neighborhood: "Ipanema",
      address: getValidatedLocation("fasano")?.fullAddress || "Av. Vieira Souto, 80 - Ipanema",
    },
    days: [
      {
        day: 1,
        title: "Dia 1 — Zona Sul clássica",
        activities: [
          { time: "08:30", id: "fasano", name: "Saída do hotel", neighborhood: "Ipanema", icon: "departure", timeBlock: "morning", address: getValidatedLocation("fasano")?.fullAddress },
          { time: "08:45", type: "transport", from: "Ipanema", to: "Floresta da Tijuca", mode: "uber", duration: "25-30 min", distanceKm: 12.5 },
          { time: "09:30", id: "cristo-redentor", name: "Cristo Redentor", neighborhood: "Floresta da Tijuca", icon: "landmark", timeBlock: "morning", address: getValidatedLocation("cristo-redentor")?.fullAddress },
          { time: "12:00", type: "transport", from: "Floresta da Tijuca", to: "Botafogo", mode: "uber", duration: "20-25 min", distanceKm: 8.2 },
          { time: "12:30", id: "lasai", name: "Lasai", neighborhood: "Botafogo", icon: "meal", timeBlock: "afternoon", address: getValidatedLocation("lasai")?.fullAddress },
          { time: "14:30", type: "transport", from: "Botafogo", to: "Ipanema", mode: "uber", duration: "10-15 min", distanceKm: 4.5 },
          { time: "15:00", id: "praia-ipanema", name: "Praia de Ipanema", neighborhood: "Ipanema", icon: "activity", timeBlock: "afternoon", address: getValidatedLocation("praia-ipanema")?.fullAddress },
          { time: "17:00", type: "transport", from: "Ipanema", to: "Arpoador", mode: "walking", duration: "10-15 min", distanceKm: 0.8 },
          { time: "17:30", id: "por-sol-arpoador", name: "Pôr do sol no Arpoador", neighborhood: "Arpoador", icon: "sunset", timeBlock: "evening", address: getValidatedLocation("por-sol-arpoador")?.fullAddress },
          { time: "19:15", type: "transport", from: "Arpoador", to: "Botafogo", mode: "uber", duration: "10-15 min", distanceKm: 3.8 },
          { time: "20:00", id: "oteque", name: "Oteque", neighborhood: "Botafogo", icon: "meal", timeBlock: "evening", address: getValidatedLocation("oteque")?.fullAddress },
          { time: "22:30", type: "transport", from: "Botafogo", to: "Ipanema", mode: "uber", duration: "10-15 min", distanceKm: 4.5 },
        ],
        costs: { food: 600, activities: 100, transport: 95, total: 795 },
      },
      {
        day: 2,
        title: "Dia 2 — Natureza e sabores",
        activities: [
          { time: "08:00", id: "fasano", name: "Saída do hotel", neighborhood: "Ipanema", icon: "departure", timeBlock: "morning", address: getValidatedLocation("fasano")?.fullAddress },
          { time: "08:15", type: "transport", from: "Ipanema", to: "Jardim Botânico", mode: "uber", duration: "10-15 min", distanceKm: 3.2 },
          { time: "08:30", id: "jardim-botanico", name: "Jardim Botânico", neighborhood: "Jardim Botânico", icon: "nature", timeBlock: "morning", address: getValidatedLocation("jardim-botanico")?.fullAddress },
          { time: "11:30", type: "transport", from: "Jardim Botânico", to: "Jardim Botânico", mode: "walking", duration: "5 min", distanceKm: 0.3 },
          { time: "12:00", id: "elena", name: "Elena", neighborhood: "Jardim Botânico", icon: "meal", timeBlock: "afternoon", address: getValidatedLocation("elena")?.fullAddress },
          { time: "14:00", type: "transport", from: "Jardim Botânico", to: "Lagoa", mode: "uber", duration: "8-12 min", distanceKm: 2.1 },
          { time: "15:00", id: "lagoa-rodrigo-freitas", name: "Lagoa Rodrigo de Freitas", neighborhood: "Lagoa", icon: "activity", timeBlock: "afternoon", address: getValidatedLocation("lagoa-rodrigo-freitas")?.fullAddress },
          { time: "16:30", type: "transport", from: "Lagoa", to: "Jardim Botânico", mode: "walking", duration: "15-20 min", distanceKm: 1.2 },
          { time: "17:00", id: "parque-lage", name: "Parque Lage", neighborhood: "Jardim Botânico", icon: "landmark", timeBlock: "evening", address: getValidatedLocation("parque-lage")?.fullAddress },
          { time: "19:30", type: "transport", from: "Jardim Botânico", to: "Ipanema", mode: "uber", duration: "10-15 min", distanceKm: 3.5 },
          { time: "20:30", id: "satyricon", name: "Satyricon", neighborhood: "Ipanema", icon: "meal", timeBlock: "evening", address: getValidatedLocation("satyricon")?.fullAddress },
          { time: "22:30", type: "transport", from: "Ipanema", to: "Ipanema", mode: "walking", duration: "5 min", distanceKm: 0.4 },
        ],
        costs: { food: 550, activities: 80, transport: 75, total: 705 },
      },
      {
        day: 3,
        title: "Dia 3 — Centro histórico e despedida",
        activities: [
          { time: "08:30", id: "fasano", name: "Saída do hotel", neighborhood: "Ipanema", icon: "departure", timeBlock: "morning", address: getValidatedLocation("fasano")?.fullAddress },
          { time: "08:45", type: "transport", from: "Ipanema", to: "Lapa", mode: "uber", duration: "20-25 min", distanceKm: 8.5 },
          { time: "09:30", id: "escadaria-selaron", name: "Escadaria Selarón", neighborhood: "Lapa", icon: "landmark", timeBlock: "morning", address: getValidatedLocation("escadaria-selaron")?.fullAddress },
          { time: "10:15", type: "transport", from: "Lapa", to: "Centro", mode: "walking", duration: "10-15 min", distanceKm: 0.9 },
          { time: "10:30", id: "confeitaria-colombo", name: "Confeitaria Colombo", neighborhood: "Centro", icon: "meal", timeBlock: "morning", address: getValidatedLocation("confeitaria-colombo")?.fullAddress },
          { time: "11:30", type: "transport", from: "Centro", to: "Centro", mode: "walking", duration: "10 min", distanceKm: 0.8 },
          { time: "12:00", id: "museu-amanha", name: "Museu do Amanhã", neighborhood: "Centro", icon: "activity", timeBlock: "afternoon", address: getValidatedLocation("museu-amanha")?.fullAddress },
          { time: "13:30", type: "transport", from: "Centro", to: "Centro", mode: "walking", duration: "5 min", distanceKm: 0.3 },
          { time: "14:00", id: "boulevard-olimpico", name: "Boulevard Olímpico", neighborhood: "Centro", icon: "activity", timeBlock: "afternoon", address: getValidatedLocation("boulevard-olimpico")?.fullAddress },
          { time: "15:30", type: "transport", from: "Centro", to: "Santa Teresa", mode: "uber", duration: "10-15 min", distanceKm: 2.8 },
          { time: "16:00", id: "bar-mineiro", name: "Bar do Mineiro", neighborhood: "Santa Teresa", icon: "meal", timeBlock: "afternoon", address: getValidatedLocation("bar-mineiro")?.fullAddress },
          { time: "18:00", type: "transport", from: "Santa Teresa", to: "Ipanema", mode: "uber", duration: "25-30 min", distanceKm: 9.2 },
        ],
        costs: { food: 280, activities: 60, transport: 85, total: 425 },
      },
    ],
  };

  const tripTotal = tripData.days.reduce((s, d) => s + d.costs.total, 0);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* 1 — Hero */}
      <HeroHeader destination={tripData.destination} onBack={() => navigate("/")} />

      {/* 2 — Summary bar */}
      <TripSummaryBar
        dates={tripData.dates}
        travelers={tripData.travelers}
        hotelName={tripData.hotel.name}
        hotelNeighborhood={tripData.hotel.neighborhood}
      />

      {/* 3 — Day blocks */}
      <div className="px-4 mt-6 space-y-5">
        {tripData.days.map((day) => (
          <DayBlock key={day.day} day={day} tripStartDate={tripStartDate} weatherMap={weatherMap} />
        ))}
      </div>

      {/* Trip total */}
      <div className="mx-4 mt-5 rounded-2xl bg-primary/5 border border-primary/15 px-5 py-4">
        <p className="text-sm font-semibold text-foreground">Total estimado: R$ {tripTotal}</p>
        <p className="text-[11px] text-muted-foreground mt-1">(não inclui hospedagem e passagens aéreas)</p>
      </div>

      {/* 4 — Curator Note */}
      <div className="px-4 mt-5">
        <CuratorNote />
      </div>

      {/* 5 — Concierge CTA */}
      <div className="px-4 mt-4">
        <ConciergeCTA onContact={() => {
          console.log("whatsapp_concierge_clicked");
          navigate("/wa");
        }} />
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-safe-cta left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <Button onClick={() => navigate("/")} variant="outline" className="w-full h-14 text-lg font-semibold rounded-2xl">
          Voltar ao app
        </Button>
      </div>
    </div>
  );
};

export default RoteiroFinal;
