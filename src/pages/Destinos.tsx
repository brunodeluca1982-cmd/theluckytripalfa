import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { curatedDestinations } from "@/data/destinations-database";
import FlowHeroBackground from "@/components/roteiro/FlowHeroBackground";

/**
 * DESTINOS PAGE
 * 
 * Editorial destination gallery using the same visual language as /meu-roteiro.
 */

const Destinos = () => {
  return (
    <FlowHeroBackground>
      <div className="min-h-screen pb-24">
        {/* Header — same glass style as /meu-roteiro */}
        <header className="sticky top-0 z-50 px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="p-2 -m-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold text-white">Destinos</h1>
            <div className="w-9" />
          </div>
        </header>

        <main className="px-4 py-4 space-y-6">
          {/* Section title — same editorial rhythm */}
          <div>
            <h2 className="text-2xl font-serif font-semibold text-white mb-1">
              Explore destinos
            </h2>
            <p className="text-white/60 text-sm">
              Descubra lugares incríveis para sua próxima viagem.
            </p>
          </div>

          {/* Destination grid — 2 columns, same card style */}
          <section>
            <div className="grid grid-cols-2 gap-3">
              {curatedDestinations.map((dest, index) => {
                const isDisabled = !dest.available;

                const card = (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative aspect-[4/5] rounded-xl overflow-hidden",
                      isDisabled && "opacity-40 grayscale-[40%]"
                    )}
                  >
                    {dest.imageUrl && (
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}

                    {/* Gradient overlay — same as /meu-roteiro */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Text bottom-left */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-semibold leading-tight">
                        {dest.name}
                      </p>
                      <p className="text-white/60 text-[11px] mt-0.5">
                        Cidade · {dest.country}
                      </p>
                    </div>

                    {/* "Em breve" pill — same as /meu-roteiro */}
                    {isDisabled && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 rounded-full">
                        <span className="text-[10px] text-white/80 font-medium">Em breve</span>
                      </div>
                    )}
                  </motion.div>
                );

                if (isDisabled) {
                  return <div key={dest.id}>{card}</div>;
                }

                return (
                  <Link key={dest.id} to={`/destino/${dest.id}/intro`}>
                    {card}
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </FlowHeroBackground>
  );
};

export default Destinos;
