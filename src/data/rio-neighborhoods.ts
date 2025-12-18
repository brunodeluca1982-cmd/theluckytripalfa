/**
 * CANONICAL NEIGHBORHOOD LIST - RIO DE JANEIRO
 * 
 * This is the definitive, locked list of neighborhoods for Rio de Janeiro.
 * All sections (Where to Stay, Where to Eat, Lucky List, What to Do) must use this list.
 * 
 * Rules:
 * - Do NOT add, remove, or rename neighborhoods without updating ALL sections
 * - Empty states are allowed; missing content does not hide a neighborhood
 * - IDs use kebab-case for URL compatibility
 */

export interface Neighborhood {
  id: string;
  name: string;
  // Map positioning (percentage from top-left)
  mapPosition: {
    top: string;
    left: string;
  };
}

export const RIO_NEIGHBORHOODS: Neighborhood[] = [
  { id: "ipanema", name: "Ipanema", mapPosition: { top: "38%", left: "52%" } },
  { id: "leblon", name: "Leblon", mapPosition: { top: "45%", left: "38%" } },
  { id: "copacabana", name: "Copacabana", mapPosition: { top: "25%", left: "70%" } },
  { id: "leme", name: "Leme", mapPosition: { top: "15%", left: "82%" } },
  { id: "sao-conrado", name: "São Conrado", mapPosition: { top: "55%", left: "28%" } },
  { id: "barra-da-tijuca", name: "Barra da Tijuca", mapPosition: { top: "68%", left: "15%" } },
  { id: "recreio", name: "Recreio", mapPosition: { top: "78%", left: "8%" } },
  { id: "santa-teresa", name: "Santa Teresa", mapPosition: { top: "22%", left: "45%" } },
  { id: "centro", name: "Centro", mapPosition: { top: "18%", left: "55%" } },
  { id: "gavea", name: "Gávea", mapPosition: { top: "48%", left: "42%" } },
  { id: "lagoa", name: "Lagoa", mapPosition: { top: "35%", left: "48%" } },
];

// Helper to get neighborhood by ID
export const getNeighborhoodById = (id: string): Neighborhood | undefined => {
  return RIO_NEIGHBORHOODS.find(n => n.id === id);
};

// Helper to get neighborhood name by ID
export const getNeighborhoodName = (id: string): string => {
  return getNeighborhoodById(id)?.name || id;
};
