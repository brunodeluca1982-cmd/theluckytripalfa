import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import brunoImg from "@/assets/partners/bruno-beach-portrait.png";

const slides = [
  {
    id: 1,
    tag: "DESCUBRA",
    title: "Viaje com outros olhos",
    description:
      'Navegue por um mapa imersivo e descubra "joias escondidas" com a curadoria exclusiva de Bruno De Luca. Fuja do óbvio e encontre o que o Google não te mostra.',
    bgUrl:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
  },
  {
    id: 2,
    tag: "EXCLUSIVIDADE",
    title: "A curadoria do Bruno",
    description:
      "Tenha acesso aos segredos e exclusividades que o Bruno De Luca colecionou em 20 anos de estrada. Dicas que o Google não te conta.",
    bgImage: brunoImg,
  },
  {
    id: 3,
    tag: "CONSULTE",
    title: "Salve seus favoritos",
    description:
      "Viu um restaurante ou um passeio incrível? Toque no coração para salvar na sua lista. Você escolhe os sonhos, nós cuidamos da logística.",
    bgUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  },
  {
    id: 4,
    tag: "ORGANIZE",
    title: "Seu roteiro exclusivo",
    description:
      "Nossa Inteligência Artificial organiza seus favoritos e cria um itinerário inteligente dia a dia, otimizando seu tempo e deslocamento.",
    bgUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  },
  {
    id: 5,
    tag: "COMEÇAR",
    title: "Personalize e viaje",
    description:
      "Arraste e solte para ajustar os horários como quiser. Seu concierge digital está pronto. Vamos tirar essa viagem do papel?",
    bgUrl:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    isFinal: true,
  },
];

interface OnboardingWalkthroughProps {
  onComplete: () => void;
}

const OnboardingWalkthrough = ({ onComplete }: OnboardingWalkthroughProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const next = useCallback(() => {
    if (isLast) {
      onComplete();
      return;
    }
    setDirection("left");
    setCurrent((p) => p + 1);
  }, [isLast, onComplete]);

  const skip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const bgStyle = slide.bgImage
    ? { backgroundImage: `url(${slide.bgImage})` }
    : { backgroundImage: `url(${slide.bgUrl})` };

  return (
    <div className="fixed inset-0 z-[90] bg-black">
      {/* Background image */}
      <div
        key={slide.id}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in"
        style={{
          ...bgStyle,
          backgroundPosition: slide.id === 2 ? "center 20%" : "center center",
        }}
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      {/* Skip button */}
      <button
        onClick={skip}
        className="absolute top-safe-top right-5 z-10 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium hover:bg-white/25 transition-colors"
        style={{ marginTop: "env(safe-area-inset-top, 12px)" }}
      >
        Pular <X className="w-3.5 h-3.5" />
      </button>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 flex flex-col gap-4">
        {/* Tag */}
        <span className="self-start text-[10px] font-semibold tracking-[0.2em] uppercase text-primary bg-primary/15 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/20">
          {slide.tag}
        </span>

        {/* Title */}
        <h2 className="text-2xl font-serif font-semibold text-white leading-tight">
          {slide.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed max-w-[320px]">
          {slide.description}
        </p>

        {/* Final CTA or navigation */}
        {isLast ? (
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => {
                onComplete();
                // navigate to auth
                window.location.href = "/auth";
              }}
              className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide"
            >
              Criar minha conta
            </button>
            <button
              onClick={() => {
                onComplete();
                window.location.href = "/auth";
              }}
              className="w-full py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium"
            >
              Já tenho conta
            </button>
          </div>
        ) : null}

        {/* Dots + Next arrow row */}
        <div className="flex items-center justify-between mt-2">
          {/* Dots */}
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-primary"
                    : i < current
                    ? "w-1.5 bg-white/50"
                    : "w-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>

          {/* Next arrow (hidden on last) */}
          {!isLast && (
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWalkthrough;
