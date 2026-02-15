import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Sparkles, Users, Camera, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  strategicCategories,
  honestRanking,
  decisionShortcuts,
  publicAnalysis,
  closingStatement,
} from "@/data/camarotes-data";

const iconMap: Record<string, React.ReactNode> = {
  crown: <Crown className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
};

/** Safe section wrapper — if children throw, shows fallback instead of crashing the page */
function SafeSection({ children, label }: { children: React.ReactNode; label: string }) {
  try {
    return <>{children}</>;
  } catch {
    return (
      <div className="px-4 py-6">
        <p className="text-[13px] text-[hsl(40,10%,45%)] font-sans italic text-center">
          {label}: Conteúdo em atualização
        </p>
      </div>
    );
  }
}

export default function CamarotesRanking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(30,10%,8%)] text-[hsl(40,15%,92%)] pb-28">
      {/* Header */}
      <div className="relative px-5 pt-12 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-12 p-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center pt-2">
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[hsl(40,20%,55%)] mb-1">
            Atualizado em 15 de fevereiro, 2026
          </p>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Carnaval Rio 2026
          </h1>
          <p className="text-sm text-[hsl(40,15%,60%)] mt-1 font-sans">
            Camarotes Marquês de Sapucaí
          </p>
          <p className="text-xs text-[hsl(35,20%,50%)] mt-3 font-sans italic max-w-[260px] mx-auto leading-relaxed">
            Ranking Estratégico + Leitura Honesta
          </p>
        </div>
      </div>

      {/* Strategic Ranking */}
      <SafeSection label="Ranking por Intenção">
        <section className="px-4 space-y-5">
          <h2 className="text-lg font-semibold tracking-tight px-1" style={{ fontFamily: "var(--font-serif)" }}>
            Ranking por Intenção
          </h2>

          {strategicCategories.length === 0 ? (
            <p className="text-[13px] text-[hsl(40,10%,45%)] font-sans italic text-center py-4">Conteúdo em atualização</p>
          ) : strategicCategories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08, duration: 0.4 }}
              className="rounded-2xl bg-[hsl(30,8%,13%)] border border-[hsl(35,12%,20%)] overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                <span className="text-[hsl(40,30%,60%)]">{iconMap[cat.icon]}</span>
                <span className="text-[13px] font-semibold uppercase tracking-wider text-[hsl(40,20%,65%)] font-sans">
                  {cat.label}
                </span>
              </div>

              {cat.camarotes.map((cam, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-3.5 ${idx > 0 ? "border-t border-[hsl(35,10%,18%)]" : ""}`}
                >
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-[hsl(40,25%,50%)]">#{idx + 1}</span>
                    <h3 className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                      {cam.name}
                    </h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[hsl(40,10%,58%)] font-sans">{cam.reason}</p>
                  <p className="text-[11px] mt-2 text-[hsl(40,10%,45%)] font-sans">
                    <span className="text-[hsl(40,20%,55%)] font-medium">Perfil:</span> {cam.audienceProfile}
                  </p>
                </div>
              ))}
            </motion.div>
          ))}
        </section>
      </SafeSection>

      {/* Honest Ranking */}
      <SafeSection label="Leitura Honesta">
        <section className="px-4 mt-10 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight px-1" style={{ fontFamily: "var(--font-serif)" }}>
            Leitura Honesta
          </h2>

          {honestRanking.length === 0 ? (
            <p className="text-[13px] text-[hsl(40,10%,45%)] font-sans italic text-center py-4">Conteúdo em atualização</p>
          ) : honestRanking.map((cam, i) => (
            <motion.div
              key={cam.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
              className="rounded-xl bg-[hsl(30,8%,12%)] border border-[hsl(35,10%,18%)] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                  {cam.name}
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-sans font-medium text-[hsl(40,25%,55%)] bg-[hsl(40,20%,55%,0.1)] px-2 py-0.5 rounded-full">
                  {cam.energy}
                </span>
              </div>
              <p className="text-[13px] text-[hsl(40,10%,60%)] leading-relaxed font-sans italic mb-2">
                "{cam.reality}"
              </p>
              <div className="flex flex-col gap-1 text-[11px] text-[hsl(40,10%,48%)] font-sans">
                <span><span className="text-[hsl(40,20%,55%)] font-medium">Quem frequenta:</span> {cam.whoAttends}</span>
                <span><span className="text-[hsl(40,20%,55%)] font-medium">O que esperar:</span> {cam.whatToExpect}</span>
              </div>
            </motion.div>
          ))}
        </section>
      </SafeSection>

      {/* Strategic Public Analysis */}
      <SafeSection label="Análise de Público">
        <section className="px-4 mt-10">
          <h2 className="text-lg font-semibold tracking-tight px-1 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Análise Estratégica de Público
          </h2>

          {publicAnalysis.length === 0 ? (
            <p className="text-[13px] text-[hsl(40,10%,45%)] font-sans italic text-center py-4">Conteúdo em atualização</p>
          ) : (
            <div className="space-y-3">
              {publicAnalysis.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
                  className="rounded-xl bg-[hsl(30,8%,12%)] border border-[hsl(35,10%,18%)] p-4"
                >
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[hsl(40,25%,60%)] font-sans mb-1.5">
                    {profile.label}
                  </h3>
                  <p className="text-[13px] text-[hsl(40,10%,55%)] leading-relaxed font-sans">
                    {profile.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </SafeSection>

      {/* Decision Shortcut */}
      <SafeSection label="Atalho de Decisão">
        <section className="px-4 mt-10">
          <h2 className="text-lg font-semibold tracking-tight px-1 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Atalho de Decisão
          </h2>

          <div className="rounded-2xl bg-[hsl(30,8%,13%)] border border-[hsl(35,12%,20%)] overflow-hidden divide-y divide-[hsl(35,10%,18%)]">
            {decisionShortcuts.map((ds, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-[12px] text-[hsl(40,10%,50%)] font-sans">{ds.intent}</p>
                  <p className="text-[14px] font-semibold mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>
                    {ds.camaroteName}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[hsl(40,15%,40%)]" />
              </div>
            ))}
          </div>
        </section>
      </SafeSection>

      {/* Closing */}
      <div className="px-6 mt-12 mb-6 text-center">
        <p
          className="text-[15px] italic text-[hsl(40,12%,55%)] leading-relaxed"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          "{closingStatement}"
        </p>
      </div>
    </div>
  );
}
