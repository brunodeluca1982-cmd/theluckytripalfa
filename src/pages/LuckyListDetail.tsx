import { useParams } from "react-router-dom";
import { MapPin, Instagram, Phone, Clock } from "lucide-react";
import { useLuckyListItem } from "@/hooks/use-lucky-list";
import { getReturnPath } from "@/data/subscriber-behavior";
import { useItemSave } from "@/hooks/use-item-save";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useState, useEffect } from "react";
import DetailHeroLayout from "@/components/detail/DetailHeroLayout";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function isSavedLocally(id: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some((item: { id: string; type: string }) => item.id === id && item.type === "lucky-list");
}

const LuckyListDetail = () => {
  const { id } = useParams<{ id: string }>();
  const returnPath = getReturnPath();
  const { data: item, isLoading } = useLuckyListItem(id);
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);

  const itemSlug = item ? slugify(item.nome) : "";
  const placeQuery = item ? buildPlaceQuery(item.nome, item.bairro || undefined) : "";
  const { photoUrl } = usePlacePhoto(itemSlug, "attraction", placeQuery, !!item);

  useEffect(() => {
    if (id) setIsSaved(isSavedLocally(id));
  }, [id]);

  const handleSave = () => {
    if (!item) return;
    saveItem(item.id, "lucky-list", item.nome, false);
    setIsSaved(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Item não encontrado.</p>
      </div>
    );
  }

  const pills = [item.categoria_experiencia, item.bairro].filter(Boolean) as string[];

  return (
    <DetailHeroLayout
      backPath={returnPath}
      title={item.nome}
      pills={pills}
      heroImageUrl={photoUrl || undefined}
      isSaved={isSaved}
      onSave={handleSave}
      footer="The Lucky Trip — Rio de Janeiro"
    >
      {/* Meu Olhar */}
      {item.meu_olhar && (
        <p className="text-base text-white/80 italic leading-relaxed mb-5">{item.meu_olhar}</p>
      )}

      {/* Como Fazer */}
      {item.como_fazer && (
        <div className="space-y-2 mb-6">
          {item.como_fazer.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base text-white/70 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-3">
        {item.google_maps && (
          <a href={item.google_maps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            <MapPin className="w-4 h-4" />
            Ver no Google Maps
          </a>
        )}
        {item.contato_instagram && (
          <p className="flex items-center gap-2 text-sm text-white/50">
            <Instagram className="w-4 h-4" />
            {item.contato_instagram}
          </p>
        )}
        {item.contato_telefone && (
          <p className="flex items-center gap-2 text-sm text-white/50">
            <Phone className="w-4 h-4" />
            {item.contato_telefone}
          </p>
        )}
        {item.horarios && (
          <p className="flex items-center gap-2 text-sm text-white/50">
            <Clock className="w-4 h-4" />
            {item.horarios}
          </p>
        )}
      </div>

      {/* Effort tag */}
      {item.nivel_esforco && (
        <div className="mt-4">
          <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded-full">
            Esforço: {item.nivel_esforco}
          </span>
        </div>
      )}
    </DetailHeroLayout>
  );
};

export default LuckyListDetail;
