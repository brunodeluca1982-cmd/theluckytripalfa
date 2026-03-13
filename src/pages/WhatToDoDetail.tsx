import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, Clock, MapPin, Zap, ExternalLink } from "lucide-react";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { GooglePlaceSearchSection } from "@/components/GooglePlaceSearchSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { PlaceResult } from "@/lib/search-places";
import { useOQueFazer, type OQueFazerItem, slugifyOQueFazer } from "@/hooks/use-o-que-fazer";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";

function normalizeSlug(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function ItemCard({ item }: { item: OQueFazerItem }) {
  const placeQuery = buildPlaceQuery(item.nome, item.bairro || undefined);
  const itemSlug = slugifyOQueFazer(item.nome);
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(itemSlug, "attraction", placeQuery);

  return (
    <Link
      to={`/atividade/${item.id}?from=${normalizeSlug(item.bairro || "")}`}
      className="block border-b border-border pb-8 last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
    >
      <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4 relative">
        {photoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {photoUrl && (
          <img src={photoUrl} alt={item.nome} className="w-full h-full object-cover" loading="lazy" />
        )}
      </div>

      <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">{item.categoria}</p>
      <h2 className="text-2xl font-serif font-medium text-foreground mb-2">{item.nome}</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.duracao_media && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            <Clock className="w-3 h-3" /> {item.duracao_media}
          </span>
        )}
        {item.vibe && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.vibe}</span>
        )}
        {item.energia && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            <Zap className="w-3 h-3" /> {item.energia}
          </span>
        )}
      </div>

      {item.meu_olhar && (
        <div className="space-y-2 mb-4">
          {item.meu_olhar.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base text-muted-foreground leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}

      <span className="text-xs text-muted-foreground/60">Ver detalhes</span>
    </Link>
  );
}

const WhatToDoDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const slug = neighborhood || "";

  const { data: allItems, isLoading } = useOQueFazer();

  const items = (allItems || []).filter(
    (e) => normalizeSlug(e.bairro || "") === slug
  );

  const neighborhoodName = items[0]?.bairro || slug;

  const handleAddToRoteiro = async (place: PlaceResult) => {
    const { error } = await supabase.from("roteiro_itens").insert({
      roteiro_id: "rio-de-janeiro-draft",
      source: "google",
      ref_table: "places_cache",
      place_id: place.placeId,
      name: place.name,
      address: place.address,
      neighborhood: neighborhood || null,
      city: "Rio de Janeiro",
      lat: place.lat,
      lng: place.lng,
      day_index: 1,
      order_in_day: 0,
    });
    if (error) {
      toast({ title: "Erro ao adicionar", description: "Tente novamente.", variant: "destructive" });
    } else {
      toast({ title: "Adicionado ao roteiro!", description: place.name });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to="/o-que-fazer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <RoteiroAccessLink />
      </header>

      <main className="pb-12">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            O que fazer em {neighborhoodName}
          </h1>
        </div>

        <div className="px-6 pt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-8">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-base text-muted-foreground">Atividades em breve.</p>
          )}
        </div>

        <div className="px-6 pt-8">
          <GooglePlaceSearchSection
            city="Rio de Janeiro"
            bairro={neighborhoodName}
            title="Outras opções (Google)"
            placeholder="Buscar atrações no Google..."
            onAddToRoteiro={handleAddToRoteiro}
          />
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">The Lucky Trip — {neighborhoodName}</p>
      </footer>
    </div>
  );
};

export default WhatToDoDetail;
