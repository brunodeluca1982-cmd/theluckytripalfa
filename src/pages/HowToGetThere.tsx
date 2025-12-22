import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plane, Car, Bus, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import santosDumontImage from "@/assets/places/santos-dumont-airport.jpg";

type TransportType = "aviao" | "carro" | "onibus" | null;

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
    <div className="min-h-screen bg-background">
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

      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden">
        {/* Back Button - Positioned over hero */}
        <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4">
          <Link
            to="/destino/rio-de-janeiro"
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>

        {/* Hero Image - Softened treatment matching Rio destination screen */}
        <img
          src={santosDumontImage}
          alt="Aeroporto Santos Dumont com Pão de Açúcar ao fundo"
          className="w-full h-full object-cover contrast-[0.85] saturate-[0.7] brightness-[0.95]"
        />

        {/* Dark Overlay - Matching Rio destination hub treatment */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h1 className="text-3xl font-serif font-semibold text-white leading-tight mb-2">
            Como chegar ao Rio de Janeiro
          </h1>
          <p className="text-sm text-white/80">
            Escolha como você prefere chegar
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="pb-12">

        {/* Transport Selection Buttons */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Avião Button */}
            <button
              onClick={() => handleTransportClick("aviao")}
              className={`flex flex-col items-center justify-center py-6 px-3 rounded-xl border-2 transition-all ${
                activeTransport === "aviao"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground/50"
              }`}
            >
              <Plane className="w-8 h-8 mb-2" />
              <span className="text-sm font-semibold tracking-wide">AVIÃO</span>
            </button>

            {/* Carro Button */}
            <button
              onClick={() => handleTransportClick("carro")}
              className={`flex flex-col items-center justify-center py-6 px-3 rounded-xl border-2 transition-all ${
                activeTransport === "carro"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground/50"
              }`}
            >
              <Car className="w-8 h-8 mb-2" />
              <span className="text-sm font-semibold tracking-wide">CARRO</span>
            </button>

            {/* Ônibus Button */}
            <button
              onClick={() => handleTransportClick("onibus")}
              className={`flex flex-col items-center justify-center py-6 px-3 rounded-xl border-2 transition-all ${
                activeTransport === "onibus"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:border-foreground/50"
              }`}
            >
              <Bus className="w-8 h-8 mb-2" />
              <span className="text-sm font-semibold tracking-wide">ÔNIBUS</span>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {/* AVIÃO Content */}
          {activeTransport === "aviao" && (
            <motion.section
              key="aviao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="px-6"
            >
              <div className="border border-border rounded-xl p-5">
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

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => openWebview("https://www.google.com/travel/flights?q=voos%20para%20santos%20dumont%20sdu")}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    <Plane className="w-4 h-4" />
                    Ver voos para SDU
                  </button>
                  <button
                    onClick={() => openWebview("https://www.google.com/travel/flights?q=voos%20para%20galeao%20gig")}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-foreground text-foreground rounded-lg font-medium text-sm hover:bg-foreground/10 transition-colors"
                  >
                    <Plane className="w-4 h-4" />
                    Ver voos para GIG
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* CARRO Content */}
          {activeTransport === "carro" && (
            <motion.section
              key="carro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="px-6"
            >
              <div className="border border-border rounded-xl p-5">
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
            </motion.section>
          )}

          {/* ÔNIBUS Content */}
          {activeTransport === "onibus" && (
            <motion.section
              key="onibus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="px-6"
            >
              <div className="border border-border rounded-xl p-5">
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
            </motion.section>
          )}
        </AnimatePresence>

        {/* Empty state hint */}
        {activeTransport === null && (
          <div className="px-6 text-center py-8">
            <p className="text-sm text-muted-foreground">
              Escolha como você vai chegar ao Rio
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default HowToGetThere;
