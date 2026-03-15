import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Lock } from "lucide-react";
import luckyListHero from "@/assets/highlights/lucky-list-hero.jpg";

const LuckyListCTA = () => {
  return (
    <section className="py-6 px-5">
      <Link
        to="/lucky-list"
        className="block relative rounded-2xl overflow-hidden border border-primary/20"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={luckyListHero}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 py-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary">
              Lucky List
            </span>
          </div>

          <h3 className="text-xl font-serif font-medium text-white leading-tight mb-2">
            Os segredos que poucos conhecem
          </h3>

          <p className="text-sm text-white/60 leading-relaxed mb-4 max-w-[260px]">
            Curadoria pessoal de Bruno De Luca — 20 anos descobrindo os lugares que nem os guias mostram.
          </p>

          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Explorar Lucky List <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </section>
  );
};

export default LuckyListCTA;
