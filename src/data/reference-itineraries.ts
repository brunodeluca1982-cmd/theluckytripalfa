import { ItineraryItem } from "@/components/roteiro/ItineraryCard";
import { carolinaDieckmannRio } from "./carolina-dieckmann-itinerary";

/**
 * REFERENCE ITINERARIES
 * 
 * STRUCTURAL LOCK — Author-curated itineraries
 * 
 * These are read-only reference sources that users can drag FROM.
 * Each item or full day block can be dragged into "Meu Roteiro".
 * 
 * RULES:
 * - Content is NEVER modified
 * - Original text preserved exactly (times, emojis, descriptions)
 * - Dragging creates a copy, never removes from reference
 * - Order inside reference is fixed
 * - These inspire, never impose
 */

export interface ReferenceItinerary {
  id: string;
  author: string;
  title: string;
  destinationId: string;
  description?: string;
  days: Record<number, ReferenceDay>;
}

export interface ReferenceDay {
  dayNumber: number;
  title: string;
  subtitle: string;
  items: ReferenceItem[];
}

export interface ReferenceItem extends ItineraryItem {
  time?: string;
  editorial?: string;
}

/**
 * ROTEIRO DO BRUNO — RIO DE JANEIRO
 * Author: Bruno De Luca
 * Type: Reference itinerary (read-only)
 * 
 * Content preserved exactly as provided.
 * DO NOT modify any Portuguese text.
 */
export const brunoDeLucaRio: ReferenceItinerary = {
  id: 'bruno-de-luca-rio',
  author: 'Bruno De Luca',
  title: 'ROTEIRO DO BRUNO — RIO DE JANEIRO',
  destinationId: 'rio-de-janeiro',
  description: 'Base: Hotel Fasano – Ipanema',
  days: {
    1: {
      dayNumber: 1,
      title: '🌅 DIA 1 — SEGUNDA',
      subtitle: 'CHEGADA, IPANEMA E PRIMEIRO CONTATO',
      items: [
        {
          id: 'bruno-d1-1',
          name: 'Chegada SDU',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '09:30',
          editorial: 'Traslado direto para Ipanema',
        },
        {
          id: 'bruno-d1-2',
          name: 'Hotel Fasano',
          category: 'hotel',
          duration: '1h',
          source: 'partner',
          time: '10:30',
          editorial: 'Check-in ou mala guardada',
        },
        {
          id: 'bruno-d1-3',
          name: 'Nido – Ipanema',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '13:00',
          editorial: 'Italiano afetivo, confortável, sem peso pra primeiro dia.\nFica a poucos minutos do Fasano. Ótimo pra chegar, sentar e começar a viagem sem stress.',
        },
        {
          id: 'bruno-d1-4',
          name: 'Praia de Ipanema',
          category: 'experience',
          duration: '3h',
          source: 'partner',
          time: '15:00',
          editorial: 'Posto clássico, caminhada leve',
        },
        {
          id: 'bruno-d1-5',
          name: 'Pôr do sol no Arpoador',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '18:00',
        },
        {
          id: 'bruno-d1-6',
          name: 'Zazá Bistrô Café – Ipanema',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '20:30',
          editorial: 'Funciona perfeitamente pra primeira noite.\nComida leve, ambiente agradável, zero obrigação de produção.',
        },
      ],
    },
    2: {
      dayNumber: 2,
      title: '🌿 DIA 2 — TERÇA',
      subtitle: 'CRISTO, VERDE E ZONA SUL',
      items: [
        {
          id: 'bruno-d2-1',
          name: 'Café da manhã no Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
        },
        {
          id: 'bruno-d2-2',
          name: 'Saída para o Cristo',
          category: 'experience',
          duration: '45min',
          source: 'partner',
          time: '09:45',
        },
        {
          id: 'bruno-d2-3',
          name: 'Cristo Redentor',
          category: 'attraction',
          duration: '2h',
          source: 'partner',
          time: '10:30',
          imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300',
        },
        {
          id: 'bruno-d2-4',
          name: 'Aprazível – Santa Teresa',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '12:45',
          editorial: 'Já que você subiu, fica.\nVista linda, cozinha brasileira refinada, almoço longo e prazeroso.',
        },
        {
          id: 'bruno-d2-5',
          name: 'Jardim Botânico',
          category: 'attraction',
          duration: '2h',
          source: 'partner',
          time: '14:30',
          imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=300',
        },
        {
          id: 'bruno-d2-6',
          name: 'Parque Lage',
          category: 'attraction',
          duration: '1h30',
          source: 'partner',
          time: '16:30',
        },
        {
          id: 'bruno-d2-7',
          name: 'Boteco Rainha – Leblon',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '21:00',
          editorial: 'Depois de um dia intenso, você não quer fine dining.\nQuer comida boa, clima animado e zero tensão.',
        },
      ],
    },
    3: {
      dayNumber: 3,
      title: '🗻 DIA 3 — QUARTA',
      subtitle: 'URCA E PÃO DE AÇÚCAR',
      items: [
        {
          id: 'bruno-d3-1',
          name: 'Café da manhã',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
        },
        {
          id: 'bruno-d3-2',
          name: 'Pista Cláudio Coutinho',
          category: 'experience',
          duration: '1h45',
          source: 'partner',
          time: '10:15',
        },
        {
          id: 'bruno-d3-3',
          name: 'Mureta da Urca',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '12:00',
        },
        {
          id: 'bruno-d3-4',
          name: 'Bar Urca',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '13:30',
          editorial: 'Clássico simples, direto, sem frescura.\nCombina com o passeio, sem deslocamento desnecessário.',
        },
        {
          id: 'bruno-d3-5',
          name: 'Bondinho do Pão de Açúcar',
          category: 'attraction',
          duration: '3h',
          source: 'partner',
          time: '15:30',
          imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=300',
        },
        {
          id: 'bruno-d3-6',
          name: 'Satyricon – Leblon',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '21:00',
          editorial: 'Dia bonito pede jantar à altura.\nPeixe impecável, serviço redondo, constância absoluta.',
        },
      ],
    },
    4: {
      dayNumber: 4,
      title: '🌊 DIA 4 — QUINTA',
      subtitle: 'BARRA DA TIJUCA',
      items: [
        {
          id: 'bruno-d4-1',
          name: 'Café da manhã',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '09:00',
        },
        {
          id: 'bruno-d4-2',
          name: 'Saída para a Barra',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '10:30',
        },
        {
          id: 'bruno-d4-3',
          name: 'Pobre Juan – VillageMall',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '13:30',
          editorial: 'Boa comida, ambiente confortável, fácil estacionamento.\nIdeal no meio do dia.',
        },
        {
          id: 'bruno-d4-4',
          name: 'Praia da Barra',
          category: 'experience',
          duration: '2h30',
          source: 'partner',
          time: '16:00',
        },
        {
          id: 'bruno-d4-5',
          name: 'Pôr do sol no Píer',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '18:30',
        },
        {
          id: 'bruno-d4-6',
          name: 'Mocellin – Barra',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '20:30',
          editorial: 'Clássico da sua vida.\nFunciona sempre, sem erro.',
        },
      ],
    },
    5: {
      dayNumber: 5,
      title: '🌴 DIA 5 — SEXTA',
      subtitle: 'PRAINHA, GRUMARI E GUARATIBA',
      items: [
        {
          id: 'bruno-d5-1',
          name: 'Saída cedo',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '08:45',
        },
        {
          id: 'bruno-d5-2',
          name: 'Prainha',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '10:15',
        },
        {
          id: 'bruno-d5-3',
          name: 'Grumari',
          category: 'experience',
          duration: '2h30',
          source: 'partner',
          time: '12:00',
        },
        {
          id: 'bruno-d5-4',
          name: 'Bira de Guaratiba',
          category: 'food',
          duration: '3h',
          source: 'partner',
          time: '14:30',
          editorial: 'Aqui não se discute.\nVista absurda, peixe fresco, almoço que vira memória.',
        },
        {
          id: 'bruno-d5-5',
          name: 'Retorno Zona Sul',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '17:30',
        },
        {
          id: 'bruno-d5-6',
          name: 'Gurumê – Fashion Mall ou Ipanema',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '21:30',
          editorial: 'Depois de estrada e sol, você quer conforto e previsibilidade.',
        },
      ],
    },
    6: {
      dayNumber: 6,
      title: '🌙 DIA 6 — SÁBADO',
      subtitle: 'PRAIA E BARES',
      items: [
        {
          id: 'bruno-d6-1',
          name: 'Praia de Ipanema',
          category: 'experience',
          duration: '3h30',
          source: 'partner',
          time: '11:00',
          imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=300',
        },
        {
          id: 'bruno-d6-2',
          name: 'Gula Gula – Leblon',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '14:30',
          editorial: 'Leve, rápido, eficiente.\nIdeal antes de um descanso.',
        },
        {
          id: 'bruno-d6-3',
          name: 'Descanso no hotel',
          category: 'experience',
          duration: '3h',
          source: 'partner',
        },
        {
          id: 'bruno-d6-4',
          name: 'Elena – Jardim Botânico',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '20:30',
          editorial: 'Funciona pra casal, pra solteiro, pra paquera.\nBoa música, público interessante, energia certa pro sábado.',
        },
        {
          id: 'bruno-d6-5',
          name: 'Barzin – Ipanema',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          editorial: 'Baixo Gávea se quiser esticar',
        },
      ],
    },
    7: {
      dayNumber: 7,
      title: '🎶 DIA 7 — DOMINGO',
      subtitle: 'CENTRO E DESPEDIDA',
      items: [
        {
          id: 'bruno-d7-1',
          name: 'Centro do Rio',
          category: 'experience',
          duration: '3h30',
          source: 'partner',
          time: '11:00',
        },
        {
          id: 'bruno-d7-2',
          name: 'Gajos d\'Ouro – Centro',
          category: 'food',
          duration: '3h',
          source: 'partner',
          time: '14:30',
          editorial: 'Casa do Porco não.\nAqui é Rio.\nPortuguês clássico, almoço longo, clima de domingo.',
        },
        {
          id: 'bruno-d7-3',
          name: 'Aterro do Flamengo',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '17:30',
        },
        {
          id: 'bruno-d7-4',
          name: 'Lasai – Ipanema',
          category: 'food',
          duration: '3h',
          source: 'partner',
          time: '20:30',
          editorial: 'Última noite pede algo marcante.\nFecha a viagem no nível máximo.',
        },
      ],
    },
    8: {
      dayNumber: 8,
      title: '☕ DIA 8 — SEGUNDA',
      subtitle: 'DESPEDIDA',
      items: [
        {
          id: 'bruno-d8-1',
          name: 'Café da manhã no Fasano',
          category: 'food',
          duration: '1h30',
          source: 'partner',
        },
        {
          id: 'bruno-d8-2',
          name: 'Check-out',
          category: 'hotel',
          duration: '30min',
          source: 'partner',
        },
        {
          id: 'bruno-d8-3',
          name: 'Aeroporto',
          category: 'experience',
          duration: '1h',
          source: 'partner',
        },
      ],
    },
  },
};

// Registry of all reference itineraries
export const referenceItineraries: Record<string, ReferenceItinerary> = {
  'bruno-de-luca-rio': brunoDeLucaRio,
  'carolina-dieckmann-rio': carolinaDieckmannRio,
};

// Get reference itineraries for a destination
export const getReferenceItinerariesForDestination = (destinationId: string): ReferenceItinerary[] => {
  return Object.values(referenceItineraries).filter(r => r.destinationId === destinationId);
};

// Get a specific reference itinerary
export const getReferenceItinerary = (id: string): ReferenceItinerary | null => {
  return referenceItineraries[id] || null;
};
