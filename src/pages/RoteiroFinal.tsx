import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Utensils, Sun, Camera, Mountain, Music, Clock, Moon, MapPin, Car, Footprints, CalendarDays, Users, Hotel, Gauge, MapPinned, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { getValidatedLocation } from "@/data/validated-locations";
import { useWeatherIcons, getTripDayDate } from "@/hooks/use-weather-icons";

/* ─── Animation helpers ─── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

/* ─── 1. Clean Header ─── */

const CleanHeader = ({ destination, onBack }: { destination: string; onBack: () => void }) => (
  <header className="px-4 pt-5 pb-6 bg-background border-b border-border">
    <button
      onClick={onBack}
      className="mb-4 flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground transition-colors"
      aria-label="Voltar"
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Voltar</span>
    </button>
    <h1 className="text-2xl font-serif font-semibold text-foreground leading-tight">{destination}</h1>
    <p className="text-sm text-muted-foreground mt-1">Roteiro organizado para sua viagem</p>
  </header>
);

/* ─── 2. Executive Summary ─── */

const ExecutiveSummary = ({ dates, totalDays, pace, mainRegion, travelers, hotel }: {
  dates: string; totalDays: number; pace: string; mainRegion: string; travelers: string; hotel: string;
}) => (
  <div className="mx-4 mt-5 rounded-xl bg-muted/40 border border-border/60 p-5">
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-3">Resumo do roteiro</p>
    <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
      <SummaryItem icon={<CalendarDays className="w-3.5 h-3.5" />} label="Datas" value={dates} />
      <SummaryItem icon={<Clock className="w-3.5 h-3.5" />} label="Duração" value={`${totalDays} dias`} />
      <SummaryItem icon={<Gauge className="w-3.5 h-3.5" />} label="Ritmo" value={pace} />
      <SummaryItem icon={<MapPinned className="w-3.5 h-3.5" />} label="Região principal" value={mainRegion} />
      <SummaryItem icon={<Users className="w-3.5 h-3.5" />} label="Viajantes" value={travelers} />
      <SummaryItem icon={<Hotel className="w-3.5 h-3.5" />} label="Hospedagem" value={hotel} />
    </div>
  </div>
);

const SummaryItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-xs font-medium text-foreground leading-snug">{value}</p>
    </div>
  </div>
);

/* ─── Icon helpers ─── */

const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  meal:      { icon: <Utensils className="w-3.5 h-3.5 text-orange-600/80" />, bg: "bg-orange-50 dark:bg-orange-900/20" },
  sunset:    { icon: <Sun className="w-3.5 h-3.5 text-amber-600/80" />,      bg: "bg-amber-50 dark:bg-amber-900/20" },
  landmark:  { icon: <Camera className="w-3.5 h-3.5 text-primary" />,        bg: "bg-primary/8" },
  nature:    { icon: <Mountain className="w-3.5 h-3.5 text-green-600/80" />,  bg: "bg-green-50 dark:bg-green-900/20" },
  nightlife: { icon: <Music className="w-3.5 h-3.5 text-purple-600/80" />,    bg: "bg-purple-50 dark:bg-purple-900/20" },
  departure: { icon: <Clock className="w-3.5 h-3.5 text-muted-foreground" />, bg: "bg-muted/60" },
  activity:  { icon: <MapPin className="w-3.5 h-3.5 text-primary" />,        bg: "bg-primary/8" },
};

const getIconData = (t: string) => iconMap[t] ?? iconMap.activity;

const blockLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  morning:   { label: "Manhã",  icon: <Sun className="w-3 h-3 text-amber-500" /> },
  afternoon: { label: "Tarde",  icon: <Sun className="w-3 h-3 text-orange-500" /> },
  evening:   { label: "Noite",  icon: <Moon className="w-3 h-3 text-indigo-400" /> },
};

/* ─── 3. Day Block ─── */

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

const formatDayDate = (startDate: Date, dayNum: number) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayNum - 1);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const DayBlock = ({ day, tripStartDate, weatherMap }: {
  day: DayData; tripStartDate: Date; weatherMap: Record<string, { icon: string; label?: string }>;
}) => {
  let currentBlock = "";
  const isoDate = getTripDayDate(tripStartDate, day.day);
  const w = weatherMap[isoDate];
  const dateStr = formatDayDate(tripStartDate, day.day);

  return (
    <section className="rounded-xl bg-card border border-border/70 overflow-hidden">
      {/* Day header */}
      <div className="px-5 pt-5 pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Dia {day.day}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{dateStr} · {day.title.replace(/^Dia \d+ — /, "")}</p>
          </div>
          {w && <span className="text-base">{w.icon}</span>}
        </div>
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
                <div className="flex items-center gap-2 pt-5 pb-1.5 border-t border-border/30 mt-2 first:mt-0 first:border-0">
                  {bl.icon}
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">{bl.label}</span>
                </div>
              )}

              {isTransport ? (
                <div className="flex items-center gap-3 py-1.5 opacity-45">
                  <span className="w-11 text-[11px] tabular-nums text-muted-foreground">{a.time}</span>
                  <div className="w-5 h-5 rounded flex items-center justify-center">
                    {a.mode === "walking"
                      ? <Footprints className="w-3 h-3 text-muted-foreground" />
                      : <Car className="w-3 h-3 text-muted-foreground" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground flex-1">{a.from} → {a.to} · {a.duration}</p>
                </div>
              ) : (
                <div className="flex items-start gap-3 py-2.5">
                  <span className="w-11 text-[11px] tabular-nums text-muted-foreground pt-0.5">{a.time}</span>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${getIconData(a.icon || "activity").bg}`}>
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
      <div className="px-5 py-3.5 bg-muted/25 border-t border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="text-muted-foreground">Alimentação R${day.costs.food}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Atividades R${day.costs.activities}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Transporte R${day.costs.transport}</span>
          </div>
          <p className="text-xs font-semibold text-foreground whitespace-nowrap">R$ {day.costs.total}</p>
        </div>
      </div>
    </section>
  );
};

/* ─── 4. Logistics Block ─── */

const LogisticsBlock = ({ neighborhoods }: { neighborhoods: string[] }) => (
  <div className="rounded-xl bg-muted/30 border border-border/60 px-5 py-5">
    <div className="flex items-center gap-2 mb-3">
      <ListChecks className="w-4 h-4 text-muted-foreground" />
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Organização prática</p>
    </div>
    <ul className="space-y-2 text-sm text-foreground/80">
      <li className="flex items-start gap-2">
        <span className="text-muted-foreground mt-1">•</span>
        <span>Priorize deslocamentos pela manhã cedo, quando o trânsito é menor.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-muted-foreground mt-1">•</span>
        <span>Bairros envolvidos: {neighborhoods.join(", ")}.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-muted-foreground mt-1">•</span>
        <span>Reservas recomendadas para restaurantes com ícone de refeição, especialmente no jantar.</span>
      </li>
    </ul>
  </div>
);

/* ─── 5. Curator Note (objective) ─── */

const CuratorNote = () => (
  <div className="rounded-xl bg-muted/25 border border-border/50 px-5 py-4">
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-2">Observação do Curador</p>
    <p className="text-sm text-foreground/75 leading-relaxed">
      Esse roteiro prioriza deslocamentos curtos e experiências com melhor custo-benefício. Os horários sugeridos consideram tempo de deslocamento real. Ajuste conforme necessário.
    </p>
  </div>
);

/* ─── 6. Refinement CTA ─── */

const RefinementCTA = ({ onContact }: { onContact: () => void }) => (
  <div className="rounded-xl bg-card border border-border/60 px-5 py-4">
    <p className="text-sm font-medium text-foreground">Precisa ajustar algo específico?</p>
    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
      Posso revisar hotéis, horários e encaixes do roteiro.
    </p>
    <button
      onClick={onContact}
      className="mt-3 w-full h-10 rounded-lg border border-border bg-muted/40 text-foreground text-sm font-medium transition-all active:scale-[0.98] hover:bg-muted/70"
    >
      Solicitar ajuste
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
    dates: "15/01/2025 — 18/01/2025",
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

  // Extract unique neighborhoods from all activities
  const allNeighborhoods = Array.from(new Set(
    tripData.days.flatMap(d => d.activities.filter(a => a.neighborhood).map(a => a.neighborhood!))
  ));

  const dayCount = tripData.days.length;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* 1 — Clean Header */}
      <CleanHeader destination={tripData.destination} onBack={() => navigate("/")} />

      {/* 2 — Executive Summary */}
      <motion.div {...fadeUp(0.05)}>
        <ExecutiveSummary
          dates={tripData.dates}
          totalDays={dayCount}
          pace="Moderado"
          mainRegion="Zona Sul"
          travelers={tripData.travelers}
          hotel={`${tripData.hotel.name} · ${tripData.hotel.neighborhood}`}
        />
      </motion.div>

      {/* 3 — Day blocks */}
      <div className="px-4 mt-6 space-y-4">
        {tripData.days.map((day, i) => (
          <motion.div key={day.day} {...fadeUp(0.1 + 0.12 * i)}>
            <DayBlock day={day} tripStartDate={tripStartDate} weatherMap={weatherMap} />
          </motion.div>
        ))}
      </div>

      {/* Trip total */}
      <motion.div
        className="mx-4 mt-4 rounded-xl bg-muted/30 border border-border/50 px-5 py-3.5 flex items-center justify-between"
        {...fadeUp(0.1 + 0.12 * dayCount + 0.05)}
      >
        <div>
          <p className="text-sm font-semibold text-foreground">Total estimado: R$ {tripTotal}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Não inclui hospedagem e passagens aéreas</p>
        </div>
      </motion.div>

      {/* 4 — Logistics */}
      <motion.div className="px-4 mt-5" {...fadeUp(0.1 + 0.12 * dayCount + 0.15)}>
        <LogisticsBlock neighborhoods={allNeighborhoods} />
      </motion.div>

      {/* 5 — Curator Note */}
      <motion.div className="px-4 mt-4" {...fadeUp(0.1 + 0.12 * dayCount + 0.25)}>
        <CuratorNote />
      </motion.div>

      {/* 6 — Refinement CTA */}
      <motion.div className="px-4 mt-4" {...fadeUp(0.1 + 0.12 * dayCount + 0.35)}>
        <RefinementCTA onContact={() => {
          console.log("whatsapp_concierge_clicked");
          navigate("/wa");
        }} />
      </motion.div>

      {/* Bottom action */}
      <div className="fixed bottom-safe-cta left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <Button onClick={() => navigate("/")} variant="outline" className="w-full h-12 text-base font-medium rounded-xl">
          Voltar ao app
        </Button>
      </div>
    </div>
  );
};

export default RoteiroFinal;
