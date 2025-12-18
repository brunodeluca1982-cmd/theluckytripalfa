import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * Lucky List Detail - Consistent template for all Lucky List items
 * 
 * Rules:
 * - Media area (video or photo gallery) always exists, even if empty
 * - Uses ONE consistent template for all items
 */

// Placeholder data - will be replaced with real content
const luckyListData: Record<string, { title: string; neighborhood: string | null; content: string }> = {
  "sunset-pedra-bonita": {
    title: "Pôr do Sol na Pedra Bonita",
    neighborhood: null,
    content: "A Pedra Bonita oferece o que pode ser o mirante de pôr do sol mais espetacular do Rio. A trilha é moderada e recompensa com vistas de 360 graus da cidade, montanhas e oceano.",
  },
  "morning-swim-arpoador": {
    title: "Mergulho Matinal no Arpoador",
    neighborhood: "Ipanema",
    content: "Antes do sol ficar forte demais e as multidões chegarem, a praia do Arpoador oferece um ritual matinal perfeito. A água é calma, a luz é dourada, e você vai dividir as ondas com os locais dedicados.",
  },
  "confeitaria-colombo": {
    title: "Café na Confeitaria Colombo",
    neighborhood: "Centro",
    content: "Atravesse as portas da Confeitaria Colombo e viaje de volta a 1894. Os espelhos ornamentados, a madeira entalhada e a atmosfera Belle Époque fazem deste lugar mais do que apenas um café — é um museu vivo.",
  },
};

const LuckyListDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const item = luckyListData[id || ""] || {
    title: "Item da Lucky List",
    neighborhood: null,
    content: "Conteúdo em breve.",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/lucky-list"
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
            {item.title}
          </h1>
          {item.neighborhood && (
            <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">
              {item.neighborhood}
            </p>
          )}
        </div>

        {/* Media Placeholder - Full Width (always present) */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
        </div>

        {/* Content */}
        <div className="px-6 pt-8">
          <p className="text-base text-muted-foreground leading-relaxed">
            {item.content}
          </p>
        </div>

        {/* Inactive CTA Placeholder */}
        <div className="px-6 pt-8">
          <div className="py-3 px-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Saiba mais
            </p>
          </div>
        </div>
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

export default LuckyListDetail;
