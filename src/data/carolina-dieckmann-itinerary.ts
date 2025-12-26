import { ReferenceItinerary } from "./reference-itineraries";

/**
 * ROTEIRO DA CAROLINA — RIO DE JANEIRO
 * Author: Carolina Dieckmann
 * Type: Reference itinerary (read-only)
 * 
 * Rio de Janeiro — Carolina Dieckmann's Itinerary
 * 7 days in my Rio
 * Profile: 2 adults, 1 young person
 * Hotel: Hotel Fasano Rio de Janeiro — Ipanema
 * 
 * Content preserved exactly as provided.
 * DO NOT modify any text.
 */
export const carolinaDieckmannRio: ReferenceItinerary = {
  id: 'carolina-dieckmann-rio',
  author: 'Carolina Dieckmann',
  title: 'Rio de Janeiro — Carolina Dieckmann\'s Itinerary',
  destinationId: 'rio-de-janeiro',
  description: '7 days in my Rio | Hotel Fasano Rio de Janeiro — Ipanema',
  days: {
    1: {
      dayNumber: 1,
      title: 'DAY 1 — ARRIVAL AND SETTLING IN',
      subtitle: 'Ipanema, first steps',
      items: [
        {
          id: 'carolina-d1-1',
          name: 'Arrival at Santos Dumont Airport',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '10:00',
          editorial: 'I always fly into Santos Dumont when I can. Twenty minutes to Ipanema, and you skip the chaos of Galeao.',
        },
        {
          id: 'carolina-d1-2',
          name: 'Hotel Fasano Rio de Janeiro',
          category: 'hotel',
          duration: '1h',
          source: 'partner',
          time: '11:00',
          editorial: 'Check-in or leave luggage. The lobby is calm, the staff knows what they are doing. No fuss.',
        },
        {
          id: 'carolina-d1-3',
          name: 'Nido',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '13:00',
          editorial: 'First meal in Rio has to be simple and good. Nido does Italian the way I like it — honest, no pretension, and three blocks from the hotel.',
        },
        {
          id: 'carolina-d1-4',
          name: 'Walk along Garcia d\'Avila street',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '15:30',
          editorial: 'This is the street where I do my errands when I am in Ipanema. Small shops, good coffee, nobody rushing.',
        },
        {
          id: 'carolina-d1-5',
          name: 'Livraria da Travessa',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '17:00',
          editorial: 'Lucky List. I can spend an hour here without noticing. Good selection, quiet, and they always have something I was not looking for but end up buying.',
        },
        {
          id: 'carolina-d1-6',
          name: 'Sunset at Arpoador',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '18:00',
          editorial: 'If the sky is clear, we walk to Arpoador. The applause when the sun goes down is silly, but I still like it.',
        },
        {
          id: 'carolina-d1-7',
          name: 'Zaza Bistro',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '20:30',
          editorial: 'First night should be relaxed. Zaza is comfortable, the food is light, and you can sit outside and watch Ipanema go by.',
        },
      ],
    },
    2: {
      dayNumber: 2,
      title: 'DAY 2 — SANTA TERESA',
      subtitle: 'The neighborhood where I grew up',
      items: [
        {
          id: 'carolina-d2-1',
          name: 'Breakfast at Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
          editorial: 'No rush. Good coffee, fresh fruit, the ocean right there. This is how mornings should start.',
        },
        {
          id: 'carolina-d2-2',
          name: 'Transfer to Santa Teresa',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '10:00',
          editorial: 'By car, 25-30 minutes depending on traffic. The road up is narrow but the driver will know it.',
        },
        {
          id: 'carolina-d2-3',
          name: 'Santa Teresa ateliers and street fair',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '10:30',
          editorial: 'Lucky List. I grew up here. The streets are the same, the houses, the views. Walking here is walking through my childhood. The ateliers sell local art, ceramics, things you cannot find anywhere else.',
        },
        {
          id: 'carolina-d2-4',
          name: 'Bar do Mineiro',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '12:30',
          editorial: 'Simple, loud, real. The feijoada is good, the pasteis are better. This is not a tourist spot pretending to be local — it is local.',
        },
        {
          id: 'carolina-d2-5',
          name: 'Aprazivel',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '14:30',
          editorial: 'Lunch with a view. The terrace looks over the entire city. Brazilian cuisine done with care. Long meal, no hurry.',
        },
        {
          id: 'carolina-d2-6',
          name: 'Return to Ipanema',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '17:30',
          editorial: 'Back by car. Rest at the hotel, maybe a nap.',
        },
        {
          id: 'carolina-d2-7',
          name: 'Cipriani',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '20:00',
          editorial: 'Italian at the Copacabana Palace. Classic, reliable, elegant without being stiff. Good for a proper dinner after a day of nostalgia.',
        },
      ],
    },
    3: {
      dayNumber: 3,
      title: 'DAY 3 — JARDIM BOTANICO AND GAVEA',
      subtitle: 'Green and quiet',
      items: [
        {
          id: 'carolina-d3-1',
          name: 'Breakfast at Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
        },
        {
          id: 'carolina-d3-2',
          name: 'Jardim Botanico',
          category: 'attraction',
          duration: '2h30',
          source: 'partner',
          time: '10:00',
          editorial: 'The palm avenue is beautiful. The garden is old, well kept, and quiet in the morning. Bring water.',
        },
        {
          id: 'carolina-d3-3',
          name: 'Emporio Jardim',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '12:30',
          editorial: 'Right next to the botanical garden. Light food, good salads, calm atmosphere. Perfect after walking.',
        },
        {
          id: 'carolina-d3-4',
          name: 'Transfer to Gavea',
          category: 'experience',
          duration: '15min',
          source: 'partner',
          time: '14:00',
          editorial: 'Short drive, same neighborhood.',
        },
        {
          id: 'carolina-d3-5',
          name: 'IMS Shop',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '14:15',
          editorial: 'Lucky List. The Instituto Moreira Salles has one of the best museum shops in the city. Books, photography, design objects. Worth the stop.',
        },
        {
          id: 'carolina-d3-6',
          name: 'Farm at Shopping da Gavea',
          category: 'experience',
          duration: '45min',
          source: 'partner',
          time: '15:30',
          editorial: 'Lucky List. Brazilian brand, colorful prints, comfortable clothes. Good for gifts or for yourself.',
        },
        {
          id: 'carolina-d3-7',
          name: 'Return to hotel',
          category: 'experience',
          duration: '20min',
          source: 'partner',
          time: '16:30',
        },
        {
          id: 'carolina-d3-8',
          name: 'Elena',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '20:00',
          editorial: 'Good music, good drinks, good food. Works for any mood. The crowd is interesting and the energy is right.',
        },
      ],
    },
    4: {
      dayNumber: 4,
      title: 'DAY 4 — LEBLON AND FINE DINING',
      subtitle: 'Taking it slow',
      items: [
        {
          id: 'carolina-d4-1',
          name: 'Late breakfast at Fasano',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '09:30',
          editorial: 'Sleep in. No alarms. Breakfast when you wake up.',
        },
        {
          id: 'carolina-d4-2',
          name: 'Walk to Leblon',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '11:00',
          editorial: 'Along the beach, through Ipanema, into Leblon. Twenty minutes if you walk fast, but why would you.',
        },
        {
          id: 'carolina-d4-3',
          name: 'Osklen',
          category: 'experience',
          duration: '45min',
          source: 'partner',
          time: '11:30',
          editorial: 'Lucky List. Brazilian brand that I have worn for years. Clean design, good quality, understated.',
        },
        {
          id: 'carolina-d4-4',
          name: 'Capricciosa',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '13:00',
          editorial: 'Pizzeria that has been here forever. Thin crust, simple toppings, no reinvention. Works every time.',
        },
        {
          id: 'carolina-d4-5',
          name: 'Beach at Leblon',
          category: 'experience',
          duration: '3h',
          source: 'partner',
          time: '15:00',
          editorial: 'Find a spot, order a coconut water, do nothing. This is the point.',
        },
        {
          id: 'carolina-d4-6',
          name: 'Return to hotel',
          category: 'experience',
          duration: '20min',
          source: 'partner',
          time: '18:30',
          editorial: 'By car. Shower, change, rest.',
        },
        {
          id: 'carolina-d4-7',
          name: 'Oteque',
          category: 'food',
          duration: '3h',
          source: 'partner',
          time: '20:00',
          editorial: 'Two Michelin stars. Seafood done with precision. This is a special dinner, so book ahead and dress accordingly.',
        },
      ],
    },
    5: {
      dayNumber: 5,
      title: 'DAY 5 — DOWNTOWN RIO',
      subtitle: 'History and street life',
      items: [
        {
          id: 'carolina-d5-1',
          name: 'Breakfast at Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:00',
          editorial: 'Early start today. The Centro is best in the morning before it gets too hot.',
        },
        {
          id: 'carolina-d5-2',
          name: 'Transfer to Downtown',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '09:30',
          editorial: 'By car, 25-30 minutes. Ask the driver to drop you near Praca XV.',
        },
        {
          id: 'carolina-d5-3',
          name: 'Feira do Lavradio',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '10:00',
          editorial: 'Lucky List. Antiques, vintage furniture, old records, things with history. Even if you do not buy, it is worth walking through.',
        },
        {
          id: 'carolina-d5-4',
          name: 'Walk through Centro Historico',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '12:00',
          editorial: 'Old buildings, churches, narrow streets. This is where Rio started. Most tourists never see it.',
        },
        {
          id: 'carolina-d5-5',
          name: 'Lunch downtown',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '13:30',
          editorial: 'There are many small restaurants around Rua do Ouvidor. Simple food, fast service, real carioca atmosphere.',
        },
        {
          id: 'carolina-d5-6',
          name: 'Return to Zona Sul',
          category: 'experience',
          duration: '40min',
          source: 'partner',
          time: '15:30',
          editorial: 'By car. Traffic can be heavy in the afternoon.',
        },
        {
          id: 'carolina-d5-7',
          name: 'Granado',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '16:30',
          editorial: 'Lucky List. Brazilian pharmacy brand since 1870. Soaps, creams, perfumes. Beautiful packaging, good products.',
        },
        {
          id: 'carolina-d5-8',
          name: 'Rest at hotel',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '17:00',
        },
        {
          id: 'carolina-d5-9',
          name: 'Lasai',
          category: 'food',
          duration: '3h',
          source: 'partner',
          time: '20:00',
          editorial: 'Chef Rafa Costa e Silva serves Brazilian ingredients with French technique. Small plates, tasting menu, serious cooking. One of the best restaurants in the city.',
        },
      ],
    },
    6: {
      dayNumber: 6,
      title: 'DAY 6 — BARRA DA TIJUCA',
      subtitle: 'Beaches and sunset',
      items: [
        {
          id: 'carolina-d6-1',
          name: 'Breakfast at Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
        },
        {
          id: 'carolina-d6-2',
          name: 'Transfer to Barra',
          category: 'experience',
          duration: '45min',
          source: 'partner',
          time: '10:00',
          editorial: 'By car, 40-50 minutes. The coast road is beautiful.',
        },
        {
          id: 'carolina-d6-3',
          name: 'Praia da Barra',
          category: 'experience',
          duration: '3h',
          source: 'partner',
          time: '11:00',
          editorial: 'Long beach, wide sand, less crowded than Ipanema. Good for swimming, good for walking.',
        },
        {
          id: 'carolina-d6-4',
          name: 'Golden Sucos',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '14:00',
          editorial: 'Lucky List. Fresh juices, acai, light snacks. This is what I drank growing up. Simple and perfect after the beach.',
        },
        {
          id: 'carolina-d6-5',
          name: 'Mocellin Mar',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '15:30',
          editorial: 'Seafood by the water. Good fish, good view, no pretension. This is lunch the way it should be at the beach.',
        },
        {
          id: 'carolina-d6-6',
          name: 'Sunset at Pier',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '18:00',
          editorial: 'The sunset from Barra is different. Wider sky, calmer water.',
        },
        {
          id: 'carolina-d6-7',
          name: 'Return to Ipanema',
          category: 'experience',
          duration: '50min',
          source: 'partner',
          time: '19:00',
          editorial: 'By car. Evening traffic can be slow.',
        },
        {
          id: 'carolina-d6-8',
          name: 'Gurume',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '21:00',
          editorial: 'Japanese with a Brazilian twist. Light dinner after a beach day. Fresh, reliable, consistent.',
        },
      ],
    },
    7: {
      dayNumber: 7,
      title: 'DAY 7 — LAST DAY',
      subtitle: 'Slow morning and farewell dinner',
      items: [
        {
          id: 'carolina-d7-1',
          name: 'Late breakfast at Fasano',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '09:30',
          editorial: 'No plans until noon. Enjoy the last morning.',
        },
        {
          id: 'carolina-d7-2',
          name: 'Walk on Ipanema beach',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '11:00',
          editorial: 'One last walk. From the hotel to Arpoador and back. Take your time.',
        },
        {
          id: 'carolina-d7-3',
          name: 'San Omakase',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '13:00',
          editorial: 'Omakase for lunch. The chef decides, you eat. Small restaurant, precise cooking, memorable meal.',
        },
        {
          id: 'carolina-d7-4',
          name: 'Rest and pack',
          category: 'experience',
          duration: '3h',
          source: 'partner',
          time: '15:00',
          editorial: 'Back to the hotel. Pack slowly. Maybe sit by the pool one last time.',
        },
        {
          id: 'carolina-d7-5',
          name: 'Satyricon',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '19:30',
          editorial: 'Last dinner in Rio. Seafood at Satyricon is a classic. Fresh fish, proper service, no surprises. The right way to close the trip.',
        },
        {
          id: 'carolina-d7-6',
          name: 'Return to hotel',
          category: 'experience',
          duration: '15min',
          source: 'partner',
          time: '22:00',
          editorial: 'Early flight tomorrow. Rest well.',
        },
      ],
    },
  },
};

/**
 * ESTIMATED COSTS — CAROLINA DIECKMANN ITINERARY
 * 
 * All prices in Brazilian Reais (BRL)
 * 
 * DAY 1
 * - Food: R$ 650 (Nido lunch + Zaza dinner)
 * - Activities: R$ 0
 * - Transportation: R$ 80 (airport transfer)
 * Total: R$ 730
 * 
 * DAY 2
 * - Food: R$ 900 (Fasano breakfast + Bar do Mineiro + Aprazivel + Cipriani)
 * - Activities: R$ 0
 * - Transportation: R$ 150 (transfers to/from Santa Teresa)
 * Total: R$ 1,050
 * 
 * DAY 3
 * - Food: R$ 550 (Fasano breakfast + Emporio Jardim + Elena)
 * - Activities: R$ 75 (Jardim Botanico entrance)
 * - Transportation: R$ 100
 * Total: R$ 725
 * 
 * DAY 4
 * - Food: R$ 1,200 (Fasano breakfast + Capricciosa + Oteque)
 * - Activities: R$ 0
 * - Transportation: R$ 80
 * Total: R$ 1,280
 * 
 * DAY 5
 * - Food: R$ 950 (Fasano breakfast + downtown lunch + Lasai)
 * - Activities: R$ 0
 * - Transportation: R$ 180
 * Total: R$ 1,130
 * 
 * DAY 6
 * - Food: R$ 600 (Fasano breakfast + Golden Sucos + Mocellin Mar + Gurume)
 * - Activities: R$ 0
 * - Transportation: R$ 200
 * Total: R$ 800
 * 
 * DAY 7
 * - Food: R$ 1,100 (Fasano breakfast + San Omakase + Satyricon)
 * - Activities: R$ 0
 * - Transportation: R$ 60
 * Total: R$ 1,160
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TOTAL ESTIMATED COST — 7 DAYS
 * 
 * Food: R$ 5,950
 * Activities: R$ 75
 * Transportation: R$ 850
 * 
 * GRAND TOTAL: R$ 6,875
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Prices are approximate. Accommodation and flights are not included.
 */
