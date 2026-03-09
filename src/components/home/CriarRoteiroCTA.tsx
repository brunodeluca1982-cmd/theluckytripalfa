import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CriarRoteiroCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-5 mb-4">
      <div className="rounded-2xl bg-card border border-border p-6 text-center">
        <h3 className="font-serif text-xl font-medium text-foreground mb-2">
          Organize sua próxima viagem
        </h3>
        <p className="text-muted-foreground text-sm mb-5">
          Monte um roteiro personalizado com os melhores lugares, restaurantes e experiências.
        </p>
        <button
          onClick={() => navigate("/ia")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Criar roteiro
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default CriarRoteiroCTA;
