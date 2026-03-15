import { useMemo } from "react";
import { useOQueFazer, type OQueFazerItem } from "@/hooks/use-o-que-fazer";
import { useExternalRestaurants, normalizeNeighborhood, type ExternalRestaurant } from "@/hooks/use-external-restaurants";
import { useExternalHotels, type ExternalHotel } from "@/hooks/use-external-hotels";
import { useLuckyList, type LuckyListItem } from "@/hooks/use-lucky-list";
import { buildPlaceQuery } from "@/hooks/use-place-photo";

/* ── Unified pool item ── */
export interface PoolItem {
  id: string;
  sourceId: string;
  nome: string;
  bairro: string;
  tipo: "experiência" | "restaurante" | "hotel" | "lucky";
  descricao?: string;
  link: string;
  photoKey: string;
  photoQuery: string;
  photoType: "hotel" | "restaurant" | "attraction";
  tags: string[];
  vibe?: string;
  momentoIdeal?: string;
  energia?: string;
  categoria?: string;
}

/* ── Mood definitions ── */
export interface MoodSet {
  id: string;
  label: string;
  subtitle: string;
  emoji: string;
  keywords: string[];
  items: PoolItem[];
}

const MOOD_DEFS: Omit<MoodSet, "items">[] = [
  {
    id: "classico",
    label: "Clássico Carioca",
    subtitle: "Os ícones que definem o Rio",
    emoji: "🏛️",
    keywords: ["clássico", "classico", "icônico", "iconico", "turístico", "turistico", "cartão postal", "cartao postal", "pão de açúcar", "cristo", "copacabana"],
  },
  {
    id: "por-do-sol",
    label: "Pôr do Sol no Rio",
    subtitle: "Golden hour com a vista certa",
    emoji: "🌅",
    keywords: ["pôr do sol", "por do sol", "sunset", "golden hour", "entardecer", "arpoador", "mirante"],
  },
  {
    id: "elegante",
    label: "Rio Elegante",
    subtitle: "Sofisticação e bom gosto",
    emoji: "✨",
    keywords: ["elegante", "sofisticado", "fine dining", "luxo", "premium", "chique", "requintado", "fasano"],
  },
  {
    id: "cultural",
    label: "Cultura & Arte",
    subtitle: "O lado criativo da cidade",
    emoji: "🎭",
    keywords: ["cultura", "arte", "museu", "galeria", "teatro", "história", "historia", "patrimônio", "patrimonio", "santa teresa"],
  },
  {
    id: "romantico",
    label: "Rio Romântico",
    subtitle: "Cenários feitos para dois",
    emoji: "💛",
    keywords: ["romântico", "romantico", "casal", "date", "jantar", "intimista", "especial"],
  },
  {
    id: "local",
    label: "Carioca de Verdade",
    subtitle: "O Rio que os locais vivem",
    emoji: "🤙",
    keywords: ["local", "escondido", "secreto", "autêntico", "autentico", "boteco", "raiz", "carioca"],
  },
];

/* ── Helpers ── */
function getCurrentMomento(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "manhã";
  if (h >= 12 && h < 18) return "tarde";
  return "noite";
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function matchesMood(item: PoolItem, keywords: string[]): boolean {
  const haystack = normalize(
    [item.nome, item.descricao || "", item.vibe || "", item.categoria || "", ...(item.tags || [])].join(" ")
  );
  return keywords.some((kw) => haystack.includes(normalize(kw)));
}

/** Extract just the place name before any em-dash or long separator */
function extractPlaceName(nome: string): string {
  const parts = nome.split(/\s*[—–]\s*|\s+-\s+/);
  return parts[0].trim();
}

/* ── Mappers ── */
function mapExperience(e: OQueFazerItem): PoolItem {
  const cleanName = extractPlaceName(e.nome);
  return {
    id: `exp-${e.id}`,
    sourceId: e.id,
    nome: e.nome,
    bairro: e.bairro || "Rio de Janeiro",
    tipo: "experiência",
    descricao: e.meu_olhar || undefined,
    link: `/atividade/${e.id}`,
    photoKey: `pool-exp-${e.id}`,
    photoQuery: buildPlaceQuery(cleanName, e.bairro || undefined),
    photoType: "attraction",
    tags: e.tags_ia || [],
    vibe: e.vibe || undefined,
    momentoIdeal: e.momento_ideal || undefined,
    energia: e.energia || undefined,
    categoria: e.categoria || undefined,
  };
}

function mapRestaurant(r: ExternalRestaurant): PoolItem {
  const from = normalizeNeighborhood(r.bairro);
  return {
    id: `rest-${r.id}`,
    sourceId: String(r.id),
    nome: r.nome,
    bairro: r.bairro,
    tipo: "restaurante",
    descricao: r.meu_olhar || undefined,
    link: `/restaurante/${r.id}?from=${from}`,
    photoKey: `pool-rest-${r.id}`,
    photoQuery: buildPlaceQuery(r.nome, r.bairro),
    photoType: "restaurant",
    tags: [],
    categoria: r.categoria || undefined,
  };
}

function mapHotel(h: ExternalHotel): PoolItem {
  const from = normalizeNeighborhood(h.bairro);
  return {
    id: `hotel-${h.id}`,
    sourceId: h.id,
    nome: h.nome,
    bairro: h.bairro,
    tipo: "hotel",
    descricao: h.meu_olhar || undefined,
    link: `/hotel/${h.id}?from=${from}`,
    photoKey: `pool-hotel-${h.id}`,
    photoQuery: buildPlaceQuery(h.nome, h.bairro),
    photoType: "hotel",
    tags: h.ai_tags || [],
    vibe: h.atmosfera || undefined,
    categoria: h.categoria || undefined,
  };
}

function mapLucky(l: LuckyListItem): PoolItem {
  return {
    id: `lucky-${l.id}`,
    sourceId: l.id,
    nome: l.nome,
    bairro: l.bairro || "Rio de Janeiro",
    tipo: "lucky",
    descricao: l.meu_olhar || undefined,
    link: `/lucky-list/${l.id}`,
    photoKey: `pool-lucky-${l.id}`,
    photoQuery: buildPlaceQuery(l.nome, l.bairro || undefined),
    photoType: "attraction",
    tags: l.tags_ia || [],
    categoria: l.categoria_experiencia || undefined,
  };
}

/* ── Main hook ── */
export interface HomeContentPool {
  contextual: PoolItem[];       // O Que Fazer Agora
  editorial: PoolItem[];        // Curados Para Você
  moods: MoodSet[];             // Seu Rio Mais Lucky
  isLoading: boolean;
}

export function useHomeContentPool(): HomeContentPool {
  const { data: experiences = [], isLoading: l1 } = useOQueFazer();
  const { data: restaurants = [], isLoading: l2 } = useExternalRestaurants();
  const { data: hotels = [], isLoading: l3 } = useExternalHotels();
  const { data: luckyItems = [], isLoading: l4 } = useLuckyList();

  const isLoading = l1 || l2 || l3 || l4;

  return useMemo(() => {
    if (isLoading) return { contextual: [], editorial: [], moods: [], isLoading: true };

    const now = getCurrentMomento();
    const usedIds = new Set<string>();

    // Build full pool
    const allExperiences = experiences.map(mapExperience);
    const rioRestaurants = restaurants
      .filter((r) => r.ativo && r.cidade?.toLowerCase().includes("rio"))
      .map(mapRestaurant);
    const rioHotels = hotels
      .filter((h) => h.ativo && h.cidade?.toLowerCase().includes("rio"))
      .map(mapHotel);
    const allLucky = luckyItems.map(mapLucky);

    // ── SECTION 1: O Que Fazer Agora ──
    // Score by momento_ideal match, take top 8
    const scored = allExperiences
      .map((item) => ({
        item,
        score: item.momentoIdeal?.toLowerCase().includes(now) ? 100 : 0,
      }))
      .sort((a, b) => b.score - a.score);

    const contextual: PoolItem[] = [];
    for (const { item } of scored) {
      if (contextual.length >= 8) break;
      contextual.push(item);
      usedIds.add(item.id);
    }

    // ── SECTION 2: Curados Para Você ──
    // Interleave experiences, restaurants, hotels, lucky — skip used
    const remainingExp = allExperiences.filter((i) => !usedIds.has(i.id));
    const editorial: PoolItem[] = [];
    const sources = [remainingExp, rioRestaurants, rioHotels, allLucky];
    const maxLen = Math.max(...sources.map((s) => s.length));

    for (let i = 0; i < maxLen && editorial.length < 12; i++) {
      for (const source of sources) {
        const item = source[i];
        if (item && !usedIds.has(item.id) && editorial.length < 12) {
          editorial.push(item);
          usedIds.add(item.id);
        }
      }
    }

    // ── SECTION 3: Seu Rio Mais Lucky ──
    // Build themed mood sets of 3 items each
    const remainingPool = [
      ...allExperiences.filter((i) => !usedIds.has(i.id)),
      ...rioRestaurants.filter((i) => !usedIds.has(i.id)),
      ...rioHotels.filter((i) => !usedIds.has(i.id)),
      ...allLucky.filter((i) => !usedIds.has(i.id)),
    ];

    const moods: MoodSet[] = [];
    for (const def of MOOD_DEFS) {
      const matching = remainingPool.filter(
        (item) => !usedIds.has(item.id) && matchesMood(item, def.keywords)
      );
      if (matching.length >= 3) {
        const selected = matching.slice(0, 3);
        selected.forEach((i) => usedIds.add(i.id));
        moods.push({ ...def, items: selected });
      }
      if (moods.length >= 3) break; // max 3 moods
    }

    // If we didn't get 3 moods, try filling with any remaining themed items
    if (moods.length < 2) {
      const ungrouped = remainingPool.filter((i) => !usedIds.has(i.id));
      if (ungrouped.length >= 3) {
        const fallbackItems = ungrouped.slice(0, 3);
        fallbackItems.forEach((i) => usedIds.add(i.id));
        moods.push({
          id: "surpresa",
          label: "Surpresas do Rio",
          subtitle: "Achados que merecem sua atenção",
          emoji: "🎲",
          keywords: [],
          items: fallbackItems,
        });
      }
    }

    return { contextual, editorial, moods, isLoading: false };
  }, [isLoading, experiences, restaurants, hotels, luckyItems]);
}
