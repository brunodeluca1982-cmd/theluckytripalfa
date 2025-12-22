import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plane, Car, Bus, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Como Chegar
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Rio de Janeiro
          </p>
        </div>

        {/* Introduction */}
        <div className="px-6 pb-8">
          <p className="text-base text-foreground leading-relaxed">
            Chegar ao Rio é fácil. Difícil é ir embora.
          </p>
        </div>

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
                    <li>• <strong>Galeão (GIG)</strong> — voos internacionais e nacionais</li>
                    <li>• <strong>Santos Dumont (SDU)</strong> — no Centro, ideal para Zona Sul</li>
                    <li>• SDU tem uma das aproximações mais bonitas do mundo</li>
                  </ul>
                </div>

                {/* Rotas principais */}
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-foreground mb-2">Rotas principais</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• São Paulo → Rio: ~1h, voos a cada poucos minutos</li>
                    <li>• Belo Horizonte → Rio: ~1h10</li>
                    <li>• Porto Alegre → Rio: ~2h</li>
                    <li>• Florianópolis → Rio: ~1h45</li>
                    <li>• Fortaleza → Rio: ~3h</li>
                  </ul>
                </div>

                {/* Dica */}
                <div className="mb-5 border-l-2 border-border pl-3 py-1">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Dica:</strong> Zona Sul? Prefira SDU. Barra/Recreio? Galeão é mais prático.
                  </p>
                </div>

                {/* Do aeroporto */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-2">Do aeroporto à cidade</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Uber e 99 funcionam bem</li>
                    <li>• Táxi oficial é seguro</li>
                    <li>• SDU: dá pra sair caminhando até o Centro</li>
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => openWebview("https://www.google.com/travel/flights?q=voos%20para%20rio%20de%20janeiro")}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver preços de voos
                </button>
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
