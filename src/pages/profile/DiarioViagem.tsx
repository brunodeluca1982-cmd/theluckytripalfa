import { Link } from "react-router-dom";
import { ChevronLeft, BookOpen } from "lucide-react";

/**
 * DIÁRIO DE VIAGEM — PLACEHOLDER
 * 
 * STRUCTURAL RESERVATION:
 * Future memory/diary feature.
 * No media creation implemented.
 */

const DiarioViagem = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/perfil"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      {/* Content */}
      <main className="px-6 pt-8">
        <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
          Diário de Viagem
        </h1>
        
        {/* Placeholder */}
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-base text-muted-foreground mb-2">
            Em breve
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Registre suas memórias, fotos e anotações de cada viagem.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border mt-8">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip
        </p>
      </footer>
    </div>
  );
};

export default DiarioViagem;
