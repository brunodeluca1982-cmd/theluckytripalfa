import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const CriarRoteiroCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-5 mb-4">
      <button
        onClick={() => navigate("/ia")}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
      >
        <Sparkles className="w-5 h-5" />
        Criar meu roteiro
      </button>
    </section>
  );
};

export default CriarRoteiroCTA;
