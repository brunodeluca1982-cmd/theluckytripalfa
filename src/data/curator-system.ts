/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CURATOR SYSTEM — DATA & TYPES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * STRUCTURAL LOCK
 * 
 * Curators are human sources of itinerary content.
 * The AI acts as an orchestrator, not a creator.
 * 
 * RULES:
 * - Bruno De Luca has editorial priority by default
 * - Partners complement, never override Bruno
 * - No anonymous or AI-only items allowed
 * - Every item retains author attribution
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface Curator {
  id: string;
  name: string;
  initials: string;
  role: 'primary' | 'partner';
  bio?: string;
  imageUrl?: string;
  destinationIds: string[];
}

export interface CuratorItem {
  id: string;
  name: string;
  category: 'attraction' | 'food' | 'hotel' | 'experience';
  duration: string;
  curatorId: string;
  curatorName: string;
  neighborhood?: string;
  imageUrl?: string;
  description?: string;
  editorial?: string;
  time?: string;
}

/**
 * CURATOR REGISTRY
 * 
 * Bruno De Luca = Primary curator (editorial priority)
 * Partners = Complementary curators
 */
export const curators: Curator[] = [
  {
    id: 'bruno-de-luca',
    name: 'Bruno De Luca',
    initials: 'BD',
    role: 'primary',
    bio: 'Apresentador e viajante profissional',
    destinationIds: ['rio-de-janeiro'],
  },
  {
    id: 'carolina-dieckmann',
    name: 'Carolina Dieckmann',
    initials: 'CD',
    role: 'partner',
    bio: 'Atriz e exploradora',
    destinationIds: ['rio-de-janeiro'],
  },
  {
    id: 'isabeli-fontana',
    name: 'Isabeli Fontana',
    initials: 'IF',
    role: 'partner',
    bio: 'Top model internacional',
    destinationIds: ['rio-de-janeiro'],
  },
  {
    id: 'di-ferrero',
    name: 'Di Ferrero',
    initials: 'DF',
    role: 'partner',
    bio: 'Músico e aventureiro',
    destinationIds: ['rio-de-janeiro'],
  },
];

// Get curator by ID
export const getCurator = (id: string): Curator | null => {
  return curators.find(c => c.id === id) || null;
};

// Get primary curator (Bruno)
export const getPrimaryCurator = (): Curator => {
  return curators.find(c => c.role === 'primary')!;
};

// Get partner curators for a destination
export const getPartnerCuratorsForDestination = (destinationId: string): Curator[] => {
  return curators.filter(c => 
    c.role === 'partner' && 
    c.destinationIds.includes(destinationId)
  );
};

// Get all curators for a destination
export const getCuratorsForDestination = (destinationId: string): Curator[] => {
  return curators.filter(c => c.destinationIds.includes(destinationId));
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CURATOR CONTENT — SAMPLE ITEMS BY CURATOR
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Each curator has their own curated places.
 * Items are tagged with curatorId and curatorName for attribution.
 */

export const curatorContentRio: Record<string, CuratorItem[]> = {
  'bruno-de-luca': [
    {
      id: 'bruno-1',
      name: 'Nido – Ipanema',
      category: 'food',
      duration: '2h',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Ipanema',
      editorial: 'Italiano afetivo, confortável, sem peso pra primeiro dia.',
    },
    {
      id: 'bruno-2',
      name: 'Aprazível – Santa Teresa',
      category: 'food',
      duration: '2h30',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Santa Teresa',
      editorial: 'Vista linda, cozinha brasileira refinada.',
    },
    {
      id: 'bruno-3',
      name: 'Satyricon – Leblon',
      category: 'food',
      duration: '2h30',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Leblon',
      editorial: 'Peixe impecável, serviço redondo, constância absoluta.',
    },
    {
      id: 'bruno-4',
      name: 'Bira de Guaratiba',
      category: 'food',
      duration: '3h',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Guaratiba',
      editorial: 'Vista absurda, peixe fresco, almoço que vira memória.',
    },
    {
      id: 'bruno-5',
      name: 'Cristo Redentor',
      category: 'attraction',
      duration: '2h30',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Corcovado',
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300',
    },
    {
      id: 'bruno-6',
      name: 'Pão de Açúcar',
      category: 'attraction',
      duration: '3h',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Urca',
      imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=300',
    },
    {
      id: 'bruno-7',
      name: 'Pôr do sol no Arpoador',
      category: 'experience',
      duration: '1h30',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Arpoador',
    },
    {
      id: 'bruno-8',
      name: 'Lasai – Ipanema',
      category: 'food',
      duration: '3h',
      curatorId: 'bruno-de-luca',
      curatorName: 'Bruno De Luca',
      neighborhood: 'Ipanema',
      editorial: 'Fecha a viagem no nível máximo.',
    },
  ],
  'carolina-dieckmann': [
    {
      id: 'carolina-1',
      name: 'Oro – Leblon',
      category: 'food',
      duration: '2h30',
      curatorId: 'carolina-dieckmann',
      curatorName: 'Carolina Dieckmann',
      neighborhood: 'Leblon',
      editorial: 'Fine dining brasileiro excepcional.',
    },
    {
      id: 'carolina-2',
      name: 'Praia do Leblon',
      category: 'experience',
      duration: '3h',
      curatorId: 'carolina-dieckmann',
      curatorName: 'Carolina Dieckmann',
      neighborhood: 'Leblon',
      imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=300',
    },
    {
      id: 'carolina-3',
      name: 'Jobi – Leblon',
      category: 'food',
      duration: '1h30',
      curatorId: 'carolina-dieckmann',
      curatorName: 'Carolina Dieckmann',
      neighborhood: 'Leblon',
      editorial: 'Boteco clássico, chopp gelado.',
    },
  ],
  'isabeli-fontana': [
    {
      id: 'isabeli-1',
      name: 'CT Boucherie – Leblon',
      category: 'food',
      duration: '2h',
      curatorId: 'isabeli-fontana',
      curatorName: 'Isabeli Fontana',
      neighborhood: 'Leblon',
      editorial: 'Carnes premium, ambiente sofisticado.',
    },
    {
      id: 'isabeli-2',
      name: 'Spa do Hotel Fasano',
      category: 'experience',
      duration: '3h',
      curatorId: 'isabeli-fontana',
      curatorName: 'Isabeli Fontana',
      neighborhood: 'Ipanema',
    },
  ],
  'di-ferrero': [
    {
      id: 'di-1',
      name: 'Pedra Bonita',
      category: 'experience',
      duration: '4h',
      curatorId: 'di-ferrero',
      curatorName: 'Di Ferrero',
      neighborhood: 'São Conrado',
      editorial: 'Trilha com vista panorâmica.',
    },
    {
      id: 'di-2',
      name: 'Baixo Gávea',
      category: 'experience',
      duration: '3h',
      curatorId: 'di-ferrero',
      curatorName: 'Di Ferrero',
      neighborhood: 'Gávea',
      editorial: 'Vida noturna autêntica carioca.',
    },
  ],
};

// Get curator content for a destination
export const getCuratorContent = (
  curatorId: string, 
  destinationId: string
): CuratorItem[] => {
  if (destinationId !== 'rio-de-janeiro') return [];
  return curatorContentRio[curatorId] || [];
};

// Get all curator content for a destination
export const getAllCuratorContent = (destinationId: string): CuratorItem[] => {
  if (destinationId !== 'rio-de-janeiro') return [];
  return Object.values(curatorContentRio).flat();
};
