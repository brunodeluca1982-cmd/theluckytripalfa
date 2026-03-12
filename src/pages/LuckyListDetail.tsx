import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLuckyListItem } from "@/hooks/use-lucky-list";
import { getReturnPath } from "@/data/subscriber-behavior";
import SaveToRoteiroButton from "@/components/SaveToRoteiroButton";

const LuckyListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const returnPath = getReturnPath();
  const { data: item, isLoading } = useLuckyListItem(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 py-4 border-b border-border">
          <Link to={returnPath} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link to={returnPath} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <SaveToRoteiroButton itemId={item.id} itemType="lucky-list" itemTitle={item.nome} />
      </header>

      <main className="pb-12">
        <div className="px-6 pt-8">
          {item.categoria_experiencia && (
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{item.categoria_experiencia}</p>
          )}
          {item.bairro && (
            <p className="text-xs text-muted-foreground/60 mt-1">{item.bairro}</p>
          )}
        </div>

        <div className="px-6 pt-4 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">{item.nome}</h1>
        </div>

        {/* Meu Olhar */}
        {item.meu_olhar && (
          <div className="px-6 pt-4">
            <p className="text-base text-foreground/80 italic leading-relaxed">{item.meu_olhar}</p>
          </div>
        )}

        {/* Como Fazer */}
        {item.como_fazer && (
          <div className="px-6 pt-6">
            <div className="space-y-2">
              {item.como_fazer.split('\n').map((paragraph, index) => (
                <p key={index} className="text-base text-muted-foreground leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {(item.google_maps || item.contato_instagram || item.contato_telefone || item.horarios) && (
          <div className="px-6 pt-6 space-y-1 text-sm text-muted-foreground">
            {item.google_maps && (
              <p>
                <a href={item.google_maps} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">
                  Ver no Google Maps
                </a>
              </p>
            )}
            {item.contato_instagram && <p>Instagram: {item.contato_instagram}</p>}
            {item.contato_telefone && <p>Telefone: {item.contato_telefone}</p>}
            {item.horarios && <p>Horários: {item.horarios}</p>}
          </div>
        )}

        {/* Tags */}
        {item.nivel_esforco && (
          <div className="px-6 pt-4">
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              Esforço: {item.nivel_esforco}
            </span>
          </div>
        )}
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">The Lucky Trip — Rio de Janeiro</p>
      </footer>
    </div>
  );
};

export default LuckyListDetail;
