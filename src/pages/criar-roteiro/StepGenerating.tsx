import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const StepGenerating = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6"
    >
      <Sparkles className="h-7 w-7 text-white" />
    </motion.div>

    <h1 className="text-2xl font-bold text-white font-[var(--font-serif)]">
      Estamos organizando sua viagem
    </h1>
    <p className="text-white/60 text-sm mt-3 max-w-[260px]">
      Selecionando as melhores experiências para você.
    </p>

    {/* Pulsing dots */}
    <div className="flex gap-1.5 mt-8">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          className="w-2 h-2 rounded-full bg-white/60"
        />
      ))}
    </div>
  </motion.div>
);

export default StepGenerating;
