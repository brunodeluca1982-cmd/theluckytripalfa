import { ItineraryItem } from "@/components/roteiro/ItineraryCard";

/**
 * CURATED ITINERARY DATA
 * 
 * STRUCTURAL LOCK — Source content for drag & drop
 * 
 * This is the READ-ONLY left column content.
 * Items here serve as templates that users drag to their roteiro.
 * 
 * Each item retains:
 * - Name (display title)
 * - Category (food, attraction, hotel, experience)
 * - Source (lucky-trip, partner)
 * - Duration (optional time estimate)
 * 
 * ARCHITECTURE NOTES:
 * - This data is never modified by user actions
 * - Items are copied when dragged, originals stay
 * - Can be extended with partner content
 */

export const curatedItineraryRio: Record<number, ItineraryItem[]> = {
  1: [
    {
      id: 'rio-d1-1',
      name: 'Cristo Redentor',
      category: 'attraction',
      duration: '3h',
      source: 'lucky-trip',
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300',
      description: 'Ícone do Rio, vista panorâmica'
    },
    {
      id: 'rio-d1-2',
      name: 'Confeitaria Colombo',
      category: 'food',
      duration: '1h30',
      source: 'lucky-trip',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300',
      description: 'Café histórico no Centro'
    },
    {
      id: 'rio-d1-3',
      name: 'Pão de Açúcar',
      category: 'attraction',
      duration: '2h30',
      source: 'lucky-trip',
      imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=300',
      description: 'Bondinho com vista espetacular'
    },
    {
      id: 'rio-d1-4',
      name: 'Jantar em Botafogo',
      category: 'food',
      duration: '2h',
      source: 'partner',
      description: 'Gastronomia contemporânea'
    },
  ],
  2: [
    {
      id: 'rio-d2-1',
      name: 'Praia de Ipanema',
      category: 'experience',
      duration: '4h',
      source: 'lucky-trip',
      imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=300',
      description: 'A praia mais famosa'
    },
    {
      id: 'rio-d2-2',
      name: 'Feira de Ipanema',
      category: 'experience',
      duration: '2h',
      source: 'partner',
      description: 'Feira de artesanato aos domingos'
    },
    {
      id: 'rio-d2-3',
      name: 'Arpoador ao pôr do sol',
      category: 'experience',
      duration: '1h30',
      source: 'lucky-trip',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300',
      description: 'Melhor pôr do sol do Rio'
    },
    {
      id: 'rio-d2-4',
      name: 'Zuka Restaurante',
      category: 'food',
      duration: '2h',
      source: 'lucky-trip',
      description: 'Alta gastronomia em Leblon'
    },
  ],
  3: [
    {
      id: 'rio-d3-1',
      name: 'Jardim Botânico',
      category: 'attraction',
      duration: '3h',
      source: 'lucky-trip',
      imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=300',
      description: 'Natureza exuberante'
    },
    {
      id: 'rio-d3-2',
      name: 'Lagoa Rodrigo de Freitas',
      category: 'experience',
      duration: '2h',
      source: 'lucky-trip',
      description: 'Pedalinho e quiosques'
    },
    {
      id: 'rio-d3-3',
      name: 'Santa Teresa',
      category: 'experience',
      duration: '3h',
      source: 'partner',
      description: 'Bairro boêmio histórico'
    },
    {
      id: 'rio-d3-4',
      name: 'Copacabana Palace',
      category: 'hotel',
      duration: 'Noite',
      source: 'partner',
      description: 'Hotel icônico'
    },
  ],
};

// Get curated itinerary by destination ID
export const getCuratedItinerary = (destinationId: string): Record<number, ItineraryItem[]> => {
  switch (destinationId) {
    case 'rio-de-janeiro':
      return curatedItineraryRio;
    default:
      return curatedItineraryRio; // Fallback
  }
};

// Get total days for a destination
export const getDestinationDays = (destinationId: string): number => {
  const itinerary = getCuratedItinerary(destinationId);
  return Object.keys(itinerary).length;
};
