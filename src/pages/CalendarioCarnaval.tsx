import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Clock, MapPin, Music, Users, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import SaveToRoteiroButton from "@/components/SaveToRoteiroButton";
import calendarBg from "@/assets/highlights/calendario-carnaval-bg.png";
import { carnavalBlocos, type BlocoEvent } from "@/data/carnaval-blocos-data";

/**
 * CALENDÁRIO CARNAVAL
 * 
 * Glass-style calendar grid showing Carnaval blocos by date.
 * Tapping a bloco opens an Apple-style bottom sheet with details.
 */

// February 2026 starts on Sunday (index 0)
const DAYS_IN_FEB = 28;
const FIRST_DAY_OFFSET = 0; // Feb 1 2026 = Sunday
const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

const getBlocosForDay = (day: number) => {
  const found = carnavalBlocos.find((d) => d.date === day);
  return found?.blocos || [];
};

const CalendarioCarnaval = () => {
  const [selectedBloco, setSelectedBloco] = useState<BlocoEvent | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleBlocoClick = (bloco: BlocoEvent) => {
    setSelectedBloco(bloco);
    setSheetOpen(true);
  };

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < FIRST_DAY_OFFSET; i++) cells.push(null);
  for (let d = 1; d <= DAYS_IN_FEB; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background image — locked framing */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${calendarBg})` }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Scrollable content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24">
        {/* Header */}
        <header className="px-5 pt-14 pb-4 flex items-center justify-between">
          <Link
            to="/o-que-fazer"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>

        {/* Title */}
        <div className="px-5 pb-6 text-center">
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">
            Fevereiro 2026
          </h1>
          <p className="text-xs text-white/60 mt-1 tracking-widest uppercase">
            Calendário de Blocos
          </p>
        </div>

        {/* Calendar grid — glass card */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-3 shadow-2xl">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={i} className="text-center text-xs font-medium text-white/70 py-1">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
              {week.map((day, di) => {
                if (!day) {
                  return <div key={di} className="aspect-square" />;
                }

                const blocos = getBlocosForDay(day);
                const hasBlocos = blocos.length > 0;
                const isCarnavalHighlight = [14, 15, 16, 17, 18].includes(day);

                return (
                  <div
                    key={di}
                    className={`
                      aspect-square rounded-xl flex flex-col items-start justify-start p-1 overflow-hidden
                      border transition-all
                      ${isCarnavalHighlight
                        ? "border-white/40 bg-white/15 shadow-lg shadow-white/5"
                        : "border-white/10 bg-white/5"
                      }
                    `}
                  >
                    {/* Day number */}
                    <span className={`text-[10px] font-semibold leading-none mb-0.5 ${
                      isCarnavalHighlight ? "text-white" : "text-white/50"
                    }`}>
                      {day}
                    </span>

                    {/* Bloco chips */}
                    {hasBlocos && (
                      <div className="flex flex-col gap-[1px] w-full overflow-hidden flex-1">
                        {blocos.slice(0, 3).map((bloco) => (
                          <button
                            key={bloco.id}
                            onClick={() => handleBlocoClick(bloco)}
                            className="w-full text-left text-[5px] leading-[7px] text-white/90 bg-white/15 rounded px-0.5 py-[1px] truncate hover:bg-white/25 transition-colors active:scale-95"
                          >
                            {bloco.startHour}h {bloco.name}
                          </button>
                        ))}
                        {blocos.length > 3 && (
                          <span className="text-[5px] text-white/50 pl-0.5">
                            +{blocos.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-white/40" />
          <span className="text-[10px] text-white/40">Toque em um bloco para ver detalhes</span>
        </div>
      </div>

      {/* Bottom Sheet — Bloco Detail */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-t border-border/30 backdrop-blur-2xl bg-background/95 px-6 pt-2 pb-8 max-h-[70vh]">
          {selectedBloco && (
            <>
              <SheetHeader className="pt-4 pb-3">
                <SheetTitle className="text-2xl font-serif font-semibold text-foreground text-left">
                  {selectedBloco.name}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Detalhes do bloco {selectedBloco.name}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4">
                {/* Info rows */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedBloco.startHour}h</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedBloco.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedBloco.vibe}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedBloco.publico}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Music className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedBloco.musica}</span>
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-3">
                  <SaveToRoteiroButton
                    itemId={selectedBloco.id}
                    itemType="activity"
                    itemTitle={selectedBloco.name}
                    className="w-full justify-center"
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarioCarnaval;
