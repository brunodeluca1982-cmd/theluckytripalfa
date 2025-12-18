import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { luckyListItems } from "@/data/lucky-list-data";

/**
 * LUCKY LIST — DETAIL TEMPLATE
 * 
 * PREMIUM LAYER - Consistent template for all Lucky List items
 * 
 * Reserved fields (always present, even if empty):
 * - External booking / partner link
 * - Media area
 * 
 * Internal label: "Lucky List only — premium layer"
 */

const LuckyListDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const item = luckyListItems.find(i => i.id === id);
  
  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 py-4 border-b border-border">
          <Link
            to="/lucky-list"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>
        <main className="px-6 py-8">
          <p className="text-muted-foreground">Item não encontrado.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Back to Lucky List context */}
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
        {/* Category & Neighborhood */}
        <div className="px-6 pt-8">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            {item.category}
          </p>
          {item.neighborhoodName && (
            <p className="text-xs text-muted-foreground/60 mt-1">
              {item.neighborhoodName} — Lucky List only
            </p>
          )}
        </div>

        {/* Title */}
        <div className="px-6 pt-4 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            {item.title}
          </h1>
        </div>

        {/* Media Placeholder - Full Width (reserved field) */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          {item.mediaUrl ? (
            <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
          )}
        </div>

        {/* Description */}
        <div className="px-6 pt-8">
          <div className="space-y-2">
            {item.description.split('\n').map((paragraph, index) => (
              <p key={index} className="text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="px-6 pt-6 space-y-1 text-sm text-muted-foreground">
          {item.googleMaps && (
            <p>
              <a 
                href={item.googleMaps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline"
              >
                Ver no Google Maps
              </a>
            </p>
          )}
          {item.instagram && (
            <p>Instagram: {item.instagram}</p>
          )}
          {item.price && (
            <p>Preço: {item.price}</p>
          )}
        </div>

        {/* External booking / partner link (reserved field) */}
        <div className="px-6 pt-8">
          {item.externalLink ? (
            <a 
              href={item.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 px-4 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Reservar / Saber mais
            </a>
          ) : (
            <div className="py-3 px-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Saiba mais
              </p>
            </div>
          )}
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
