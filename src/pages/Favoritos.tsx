import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";

/**
 * FAVORITOS PLACEHOLDER
 * 
 * Minimal placeholder page for user favorites.
 * To be expanded with actual favorites functionality later.
 */

const Favoritos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
      </header>

      {/* Content */}
      <main className="px-6 py-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-semibold text-foreground mb-3">
            Favoritos
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Seus lugares e experiências favoritos aparecerão aqui.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Favoritos;
