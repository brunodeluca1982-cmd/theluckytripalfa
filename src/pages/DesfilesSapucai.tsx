import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronDown, ExternalLink, Music, Crown, Sparkles, Clock, Bookmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { sapucaiParades, getParadesByDate, type SapucaiParade } from "@/data/sapucai-parades-data";
import { useItemSave } from "@/hooks/use-item-save";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

const TAB_KEYS = [
  { key: "2026-02-16", label: "Seg 16/02" },
  { key: "2026-02-17", label: "Ter 17/02" },
];

/* ─── School Card ─── */
const SchoolCard = ({ parade }: { parade: SapucaiParade }) => (
  <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-4">
    {/* Header */}
    <div>
      <h3 className="text-xl font-serif font-semibold text-white leading-tight">{parade.school_name}</h3>
      <p className="text-white/50 text-xs mt-1">{parade.group_name} · {parade.date_display}</p>
    </div>

    {/* Time */}
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-white/50" />
      <span className="text-white/80 text-sm font-medium">
        Horário aproximado: {parade.start_hour_display}
      </span>
    </div>

    {/* Accordion sections */}
    <Accordion type="multiple" className="space-y-0">
      {/* Como eu chego */}
      <AccordionItem value="como-chego" className="border-white/10">
        <AccordionTrigger className="text-white/90 text-sm hover:no-underline py-3 [&>svg]:text-white/40">
          Como eu chego
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-white/70 text-sm whitespace-pre-line leading-relaxed">
            {parade.how_to_get_there}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* A vibe */}
      <AccordionItem value="vibe" className="border-white/10">
        <AccordionTrigger className="text-white/90 text-sm hover:no-underline py-3 [&>svg]:text-white/40">
          A vibe
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-white/70 text-sm whitespace-pre-line leading-relaxed">
            {parade.vibe_details}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Samba-enredo */}
      <AccordionItem value="samba" className="border-white/10">
        <AccordionTrigger className="text-white/90 text-sm hover:no-underline py-3 [&>svg]:text-white/40">
          <span className="flex items-center gap-2">
            <Music className="w-3.5 h-3.5" />
            Samba-enredo
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-white/50 text-xs uppercase tracking-wider">Título</span>
              <p className="text-white/90 font-medium mt-0.5">{parade.samba_title}</p>
            </div>
            <div>
              <span className="text-white/50 text-xs uppercase tracking-wider">Resumo</span>
              <p className="text-white/70 mt-0.5">{parade.samba_summary}</p>
            </div>
            <div>
              <span className="text-white/50 text-xs uppercase tracking-wider">Trecho</span>
              <p className="text-white/80 italic mt-0.5">"{parade.samba_excerpt}"</p>
            </div>
            <a
              href={parade.samba_full_lyrics_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              Letra completa
            </a>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Musas e Rainhas */}
      <AccordionItem value="musas" className="border-white/10 border-b-0">
        <AccordionTrigger className="text-white/90 text-sm hover:no-underline py-3 [&>svg]:text-white/40">
          <span className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5" />
            Musas e Rainhas de Bateria
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-white/70 text-sm whitespace-pre-line leading-relaxed">
            {parade.muses_and_queens}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

/* ─── Day Tab Content ─── */
const DayTabContent = ({ dateISO }: { dateISO: string }) => {
  const parades = sapucaiParades
    .filter((p) => p.date_iso === dateISO)
    .sort((a, b) => a.start_time_24h.localeCompare(b.start_time_24h));

  const groupName = parades[0]?.group_name || "";

  return (
    <div className="space-y-6">
      {/* Resumo da noite */}
      <div className="rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 p-4">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
          Resumo da noite — {groupName}
        </h3>
        <div className="space-y-1.5">
          {parades.map((p) => (
            <div key={p.id} className="flex items-baseline gap-3">
              <span className="text-white/50 text-sm font-mono w-28 shrink-0">{p.start_hour_display}</span>
              <span className="text-white/90 text-sm">{p.school_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* School cards */}
      {parades.map((p) => (
        <SchoolCard key={p.id} parade={p} />
      ))}
    </div>
  );
};

/* ─── Summary Table ─── */
const SummaryTable = () => {
  const grouped = getParadesByDate();
  return (
    <div className="rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
          Tabela resumida de escolas e horários
        </h3>
      </div>
      <div className="divide-y divide-white/8">
        {grouped.map((g) =>
          g.parades.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              {i === 0 ? (
                <span className="text-white/40 w-20 shrink-0 font-medium">
                  {p.date_iso === "2026-02-14" ? "Sáb 14/02" : p.date_iso === "2026-02-15" ? "Dom 15/02" : p.date_iso === "2026-02-16" ? "Seg 16/02" : "Ter 17/02"}
                </span>
              ) : (
                <span className="w-20 shrink-0" />
              )}
              <span className="text-white/90 flex-1 min-w-0 truncate">{p.school_name}</span>
              <span className="text-white/50 shrink-0 text-xs font-mono">{p.start_hour_display}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};




/* ─── Main Page ─── */
const DesfilesSapucai = () => {
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    saveItem("sapucai-desfiles", "activity", "Desfiles na Sapucaí", false);
    setIsSaved(true);
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(4px) contrast(0.9)", transform: "scale(1.05)" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* Scroll area */}
      <div className="relative z-10 h-full overflow-y-auto pb-24">
        {/* Header */}
        <header className="px-5 pt-14 pb-2 flex items-center justify-between">
          <Link
            to="/o-que-fazer"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <Button
            variant={isSaved ? "secondary" : "ghost"}
            size="sm"
            onClick={handleSave}
            className={`gap-1.5 text-white/80 hover:text-white ${isSaved ? "bg-white/20 text-white" : ""}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
            {isSaved ? "Salvo" : "Salvar"}
          </Button>
        </header>

        {/* Title */}
        <div className="px-5 pb-4 text-center">
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">
            Desfiles na Sapucaí
          </h1>
          <p className="text-xs text-white/50 mt-1 tracking-widest uppercase">
            Janelas de entrada (16–17/02/2026)
          </p>
        </div>

        {/* Content */}
        <div className="mx-4 space-y-6">
          {/* A: Summary table */}
          <SummaryTable />

          {/* B: Tabs by day */}
          <Tabs defaultValue="2026-02-16" className="w-full">
            <TabsList className="w-full bg-white/10 border border-white/15 backdrop-blur-xl p-1 rounded-xl">
              {TAB_KEYS.map((t) => (
                <TabsTrigger
                  key={t.key}
                  value={t.key}
                  className="flex-1 text-white/60 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg text-sm"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TAB_KEYS.map((t) => (
              <TabsContent key={t.key} value={t.key} className="mt-4">
                <DayTabContent dateISO={t.key} />
              </TabsContent>
            ))}
          </Tabs>

        </div>
      </div>
    </div>
  );
};

export default DesfilesSapucai;
