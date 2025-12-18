import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * Lucky List - Editorial curation
 * 
 * Rules:
 * - Can be neighborhood-linked OR city-level
 * - Must not duplicate items from "Where to Eat" or "What to Do"
 * - Uses ONE consistent Lucky List Detail template
 * - Media area always exists, even if empty
 */

// Placeholder Lucky List items
const luckyListItems = [
  {
    id: "sunset-pedra-bonita",
    title: "Pôr do Sol na Pedra Bonita",
    neighborhood: null, // City-level
    teaser: "A hora dourada mais mágica do Rio.",
  },
  {
    id: "morning-swim-arpoador",
    title: "Mergulho Matinal no Arpoador",
    neighborhood: "ipanema",
    teaser: "Junte-se aos locais antes das multidões chegarem.",
  },
  {
    id: "confeitaria-colombo",
    title: "Café na Confeitaria Colombo",
    neighborhood: "centro",
    teaser: "Entre no Rio da Belle Époque.",
  },
];

const LuckyList = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/"
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
            The Lucky List
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Rio de Janeiro
          </p>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            Uma coleção curada de experiências, lugares e momentos que definem a alma do Rio. São as descobertas que tornam uma viagem verdadeiramente sortuda.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Lucky List Items */}
        <section className="px-6 pt-8">
          <div className="space-y-4">
            {luckyListItems.map((item) => (
              <Link
                key={item.id}
                to={`/lucky-list/${item.id}`}
                className="block p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-lg font-serif font-medium text-foreground mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.teaser}
                </p>
                {item.neighborhood && (
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                    {item.neighborhood}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
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

export default LuckyList;
