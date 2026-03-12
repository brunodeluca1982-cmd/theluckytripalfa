import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plane, Car, Bus, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCityHero } from "@/contexts/CityHeroContext";

type TransportType = "aviao" | "carro" | "onibus" | null;

interface RadialButtonProps {
  icon: LucideIcon;
  label: string;
  position: "top-left" | "top-right" | "bottom-center";
  isActive?: boolean;
  onClick: () => void;
}

const RadialButton = ({ icon: Icon, label, position, isActive, onClick }: RadialButtonProps) => {
  const positionClasses = {
    "top-left": "absolute top-0 left-0",
    "top-right": "absolute top-0 right-0",
    "bottom-center": "absolute bottom-0 left-1/2 -translate-x-1/2",
  };

  return (
    <button
      onClick={onClick}
      className={`${positionClasses[position]} flex flex-col items-center gap-2 group`}
    >
      <div 
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${
          isActive 
            ? "bg-white/40 border-white/60" 
            : "bg-white/15 border-white/25 group-hover:bg-white/25 group-hover:border-white/40"
        }`}
      >
        <Icon className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={1.5} />
      </div>
      <span className="text-[11px] font-medium text-white/90 tracking-wide uppercase">
        {label}
      </span>
    </button>
  );
};

const HowToGetThere = () => {
  const [activeTransport, setActiveTransport] = useState<TransportType>(null);
  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);

  const handleTransportClick = (transport: TransportType) => {
    setActiveTransport(activeTransport === transport ? null : transport);
  };

  const openWebview = (url: string) => {
    setWebviewUrl(url);
  };

  const closeWebview = () => {
    setWebviewUrl(null);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Webview Overlay */}
      <AnimatePresence>
        {webviewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <button
                onClick={closeWebview}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
                Fechar
              </button>
            </div>
            <iframe
              src={webviewUrl}
              className="w-full h-[calc(100vh-56px)]"
              title="External content"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          FULL-SCREEN HERO BACKGROUND (MATCHING RIO DESTINATION SCREEN)
          ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${santosDumontImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60" />

      {/* ═══════════════════════════════════════════════════════════════
          BACK BUTTON (SAME AS RIO DESTINATION)
          ═══════════════════════════════════════════════════════════════ */}
      <Link 
        to="/destino/rio-de-janeiro" 
        className="absolute top-8 left-4 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          EDITORIAL TITLE (SAME STYLE AS RIO DESTINATION)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-[14vh] left-0 right-0 z-10 flex flex-col items-center">
        <h1 className="text-[3.25rem] font-serif font-medium text-white leading-none text-center drop-shadow-lg tracking-tight">
          Como chegar?
        </h1>
        <p className="text-[10px] tracking-[0.35em] text-white/70 uppercase mt-2.5">
          Escolha como você quer
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RADIAL BUTTONS (SAME STYLE AS RIO DESTINATION)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ paddingTop: '8vh' }}>
        <div className="relative w-[280px] h-[220px]">
          {/* TOP LEFT — Avião */}
          <RadialButton 
            icon={Plane}
            label="Avião"
            position="top-left"
            isActive={activeTransport === "aviao"}
            onClick={() => handleTransportClick("aviao")}
          />
          {/* TOP RIGHT — Carro */}
          <RadialButton 
            icon={Car}
            label="Carro"
            position="top-right"
            isActive={activeTransport === "carro"}
            onClick={() => handleTransportClick("carro")}
          />
          {/* BOTTOM CENTER — Ônibus */}
          <RadialButton 
            icon={Bus}
            label="Ônibus"
            position="bottom-center"
            isActive={activeTransport === "onibus"}
            onClick={() => handleTransportClick("onibus")}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTENT DRAWER (SLIDES UP FROM BOTTOM)
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeTransport && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-40 bg-background rounded-t-3xl max-h-[75vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Drag Handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* AVIÃO Content */}
              {activeTransport === "aviao" && (
                <div>
                  <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
                    Voar para o Rio
                  </h2>

                  {/* Aeroportos */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-foreground mb-2">Aeroportos</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong className="text-foreground">Santos Dumont (SDU)</strong> — Zona Sul, Centro, pouso cênico</li>
                      <li>• <strong className="text-foreground">Galeão (GIG)</strong> — voos internacionais, Barra, Zona Norte</li>
                    </ul>
                  </div>

                  {/* Tempos de voo */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-foreground mb-2">Tempos de voo</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• São Paulo → ~1h</li>
                      <li>• Belo Horizonte → ~1h10</li>
                      <li>• Nordeste → 2h30 a 3h30</li>
                    </ul>
                  </div>

                  {/* Action Buttons - Skyscanner Links */}
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://www.skyscanner.com.br/transporte/voos-para/sdua/voos-baratos-para-aeroporto-santos-dumont.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                      <Plane className="w-4 h-4" />
                      Buscar voos para SDU
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                    </a>
                    <a
                      href="https://www.skyscanner.com.br/transporte/voos-para/rioa/voos-baratos-para-aeroporto-internacional-do-rio-de-janeiro-galeao.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-foreground text-foreground rounded-lg font-medium text-sm hover:bg-foreground/10 transition-colors"
                    >
                      <Plane className="w-4 h-4" />
                      Buscar voos para GIG
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                    </a>
                  </div>
                </div>
              )}

              {/* CARRO Content */}
              {activeTransport === "carro" && (
                <div>
                  <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
                    Vir de carro
                  </h2>

                  {/* Acesso */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-foreground mb-2">Principais acessos</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>BR-101</strong> — São Paulo / Costa Verde</li>
                      <li>• <strong>BR-040</strong> — Belo Horizonte (~6h de viagem)</li>
                      <li>• Região Serrana — estradas bem sinalizadas</li>
                    </ul>
                  </div>

                  {/* Na cidade */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-2">Dentro da cidade</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Carro útil na Barra, Recreio e Guaratiba</li>
                      <li>• Na Zona Sul, andar a pé ou app é mais prático</li>
                      <li>• Estacionamento pode ser difícil em Ipanema/Leblon</li>
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openWebview("https://www.google.com/maps/dir//Rio+de+Janeiro")}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Traçar rota
                  </button>
                </div>
              )}

              {/* ÔNIBUS Content */}
              {activeTransport === "onibus" && (
                <div>
                  <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
                    Vir de ônibus
                  </h2>

                  {/* Rodoviária */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium text-foreground mb-2">Rodoviária Novo Rio</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Recebe ônibus de todas as capitais do país</li>
                      <li>• Fica próxima ao Centro e Zona Portuária</li>
                      <li>• Fácil acesso a metrô e apps de transporte</li>
                    </ul>
                  </div>

                  {/* Viagem */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-foreground mb-2">Sobre a viagem</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Do Sudeste: viagens noturnas bem organizadas</li>
                      <li>• Ônibus leito são confortáveis para longas distâncias</li>
                      <li>• Opção econômica comparada ao avião</li>
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openWebview("https://www.clickbus.com.br/onibus/para/rio-de-janeiro-rj")}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buscar ônibus
                  </button>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setActiveTransport(null)}
                className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HowToGetThere;
