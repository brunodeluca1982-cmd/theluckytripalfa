import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Crown, Sparkles, Users, Camera, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  strategicCategories,
  honestRanking,
  decisionShortcuts,
  publicAnalysis,
  closingStatement,
} from "@/data/camarotes-data";

/* ── typography shortcuts ── */
const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };
const sans = { fontFamily: "'Inter', system-ui, sans-serif" };

/* ── palette (off-white editorial) ── */
const bg = "#F6F3EE";
const cardBg = "#FFFFFF";
const borderClr = "#E8E4DD";
const textPrimary = "#1A1A1A";
const textSecondary = "#5C5549";
const textMuted = "#8A8279";
const accentGold = "#9E8A6E";
const accentGoldLight = "#B8A88E";

const iconMap: Record<string, React.ReactNode> = {
  crown: <Crown className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
};

/* ── Expandable Card component ── */
function ExpandableCategory({ cat, index }: { cat: typeof strategicCategories[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${borderClr}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      {/* Header — always visible, tappable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 touch-target"
        style={{ minHeight: 56 }}
      >
        <div className="flex items-center gap-2.5">
          <span style={{ color: accentGold }}>{iconMap[cat.icon]}</span>
          <span
            className="text-[12px] font-semibold uppercase tracking-[0.15em]"
            style={{ ...sans, color: textSecondary }}
          >
            {cat.label}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="w-4 h-4" style={{ color: textMuted }} />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {cat.camarotes.map((cam, idx) => (
                <div
                  key={idx}
                  className={`py-4 ${idx > 0 ? "border-t" : ""}`}
                  style={{ borderColor: borderClr }}
                >
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: accentGold }}
                    >
                      #{idx + 1}
                    </span>
                    <h3
                      className="text-[17px] font-semibold"
                      style={{ ...playfair, color: textPrimary }}
                    >
                      {cam.name}
                    </h3>
                  </div>
                  <p className="text-[13px] leading-[1.6] mb-2.5" style={{ ...sans, color: textSecondary }}>
                    {cam.reason}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px]" style={{ ...sans, color: textMuted }}>
                      <span style={{ color: accentGold, fontWeight: 500 }}>Perfil: </span>
                      {cam.audienceProfile}
                    </p>
                    <p className="text-[11px]" style={{ ...sans, color: textMuted }}>
                      <span style={{ color: accentGold, fontWeight: 500 }}>Energia: </span>
                      {cam.energy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Fallback wrapper ── */
function SafeSection({ children, label }: { children: React.ReactNode; label: string }) {
  try {
    return <>{children}</>;
  } catch {
    return (
      <div className="px-5 py-8 text-center">
        <p className="text-[13px] italic" style={{ ...sans, color: textMuted }}>
          {label}: Conteúdo em atualização
        </p>
      </div>
    );
  }
}

/* ── Section Title ── */
function SectionTitle({ children }: { children: string }) {
  return (
    <h2
      className="text-[20px] font-semibold tracking-tight mb-5"
      style={{ ...playfair, color: textPrimary }}
    >
      {children}
    </h2>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function CamarotesRanking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: bg }}>
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl px-5 pt-12 pb-6" style={{ backgroundColor: `${bg}E6` }}>
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-12 p-2.5 rounded-full touch-target"
          style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: textPrimary }} />
        </button>

        <div className="text-center pt-1">
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ ...sans, color: textMuted, fontWeight: 500 }}
          >
            Atualizado em 17 de fevereiro, 2026
          </p>
          <h1
            className="text-[26px] font-bold leading-tight tracking-tight"
            style={{ ...playfair, color: textPrimary }}
          >
            Carnaval Rio 2026
          </h1>
          <p
            className="text-[13px] mt-1"
            style={{ ...sans, color: textSecondary }}
          >
            Camarotes Marquês de Sapucaí
          </p>
          <div
            className="inline-block mt-3 px-3 py-1 rounded-full"
            style={{ backgroundColor: `${accentGold}15`, border: `1px solid ${accentGold}30` }}
          >
            <p
              className="text-[11px] italic"
              style={{ ...playfair, color: accentGold }}
            >
              Ranking Estratégico + Leitura Honesta
            </p>
          </div>
        </div>
      </header>

      {/* ── 1. RANKING POR INTENÇÃO ── */}
      <SafeSection label="Ranking por Intenção">
        <section className="px-5 mt-2">
          <SectionTitle>Ranking por Intenção</SectionTitle>
          <div className="space-y-3">
            {strategicCategories.length === 0 ? (
              <p className="text-[13px] italic text-center py-4" style={{ ...sans, color: textMuted }}>
                Conteúdo em atualização
              </p>
            ) : (
              strategicCategories.map((cat, i) => (
                <ExpandableCategory key={cat.id} cat={cat} index={i} />
              ))
            )}
          </div>
        </section>
      </SafeSection>

      {/* ── 2. LEITURA HONESTA ── */}
      <SafeSection label="Leitura Honesta">
        <section className="px-5 mt-10">
          <SectionTitle>Leitura Honesta</SectionTitle>
          <div className="space-y-4">
            {honestRanking.length === 0 ? (
              <p className="text-[13px] italic text-center py-4" style={{ ...sans, color: textMuted }}>
                Conteúdo em atualização
              </p>
            ) : (
              honestRanking.map((cam, i) => (
                <Link key={cam.id} to={`/camarote/${cam.id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  className="rounded-2xl p-5 active:scale-[0.98] transition-transform cursor-pointer"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderClr}`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-[17px] font-semibold"
                      style={{ ...playfair, color: textPrimary }}
                    >
                      {cam.name}
                    </h3>
                    <span
                      className="text-[9px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 rounded-full shrink-0 ml-3"
                      style={{
                        ...sans,
                        color: accentGold,
                        backgroundColor: `${accentGold}12`,
                        border: `1px solid ${accentGold}25`,
                      }}
                    >
                      {cam.energy}
                    </span>
                  </div>
                  <p
                    className="text-[14px] italic leading-[1.6] mb-3"
                    style={{ ...playfair, color: textSecondary }}
                  >
                    "{cam.reality}"
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-[12px] leading-[1.5]" style={{ ...sans, color: textMuted }}>
                      <span style={{ color: accentGold, fontWeight: 500 }}>Quem frequenta: </span>
                      {cam.whoAttends}
                    </p>
                    <p className="text-[12px] leading-[1.5]" style={{ ...sans, color: textMuted }}>
                      <span style={{ color: accentGold, fontWeight: 500 }}>O que esperar: </span>
                      {cam.whatToExpect}
                    </p>
                  </div>
                </motion.div>
                </Link>
              ))
            )}
          </div>
        </section>
      </SafeSection>

      {/* ── 3. ANÁLISE ESTRATÉGICA DE PÚBLICO ── */}
      <SafeSection label="Análise de Público">
        <section className="px-5 mt-10">
          <SectionTitle>Análise Estratégica de Público</SectionTitle>
          {publicAnalysis.length === 0 ? (
            <p className="text-[13px] italic text-center py-4" style={{ ...sans, color: textMuted }}>
              Conteúdo em atualização
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {publicAnalysis.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
                  className={`rounded-2xl p-4 ${i === publicAnalysis.length - 1 && publicAnalysis.length % 2 !== 0 ? "col-span-2" : ""}`}
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderClr}`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <h3
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2"
                    style={{ ...sans, color: accentGold }}
                  >
                    {profile.label}
                  </h3>
                  <p
                    className="text-[12px] leading-[1.55]"
                    style={{ ...sans, color: textSecondary }}
                  >
                    {profile.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </SafeSection>

      {/* ── 4. ATALHO DE DECISÃO ── */}
      <SafeSection label="Atalho de Decisão">
        <section className="px-5 mt-10">
          <SectionTitle>Atalho de Decisão</SectionTitle>
          <div className="space-y-2.5">
            {decisionShortcuts.map((ds, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 touch-target"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderClr}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = accentGoldLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = borderClr;
                }}
              >
                <div className="text-left">
                  <p className="text-[12px]" style={{ ...sans, color: textMuted }}>
                    {ds.intent}
                  </p>
                  <p
                    className="text-[15px] font-semibold mt-0.5"
                    style={{ ...playfair, color: textPrimary }}
                  >
                    {ds.camaroteName}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: accentGoldLight }} />
              </motion.button>
            ))}
          </div>
        </section>
      </SafeSection>

      {/* ── FOOTER EDITORIAL ── */}
      <footer className="px-8 mt-14 mb-8 text-center">
        <div
          className="w-10 h-px mx-auto mb-6"
          style={{ backgroundColor: accentGoldLight }}
        />
        <p
          className="text-[16px] italic leading-[1.7]"
          style={{ ...playfair, color: textSecondary }}
        >
          "{closingStatement}"
        </p>
        <div
          className="w-10 h-px mx-auto mt-6"
          style={{ backgroundColor: accentGoldLight }}
        />
      </footer>
    </div>
  );
}
