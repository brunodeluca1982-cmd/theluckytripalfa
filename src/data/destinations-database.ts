/**
 * CURATED DESTINATIONS DATABASE
 * 
 * STRUCTURAL LOCK — Internal destinations for autocomplete
 * 
 * These are the ONLY destinations users can select when creating itineraries.
 * NO Google Places, NO free typing at this stage.
 */

export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  imageUrl?: string;
  available: boolean;
}

export const curatedDestinations: Destination[] = [
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    country: 'Brasil',
    region: 'Sudeste',
    imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=600&q=80',
    available: true,
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    country: 'Brasil',
    region: 'Sudeste',
    imageUrl: 'https://images.unsplash.com/photo-1578002580281-516e14a9070c?w=600&q=80',
    available: false,
  },
  {
    id: 'salvador',
    name: 'Salvador',
    country: 'Brasil',
    region: 'Nordeste',
    imageUrl: 'https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?w=600&q=80',
    available: false,
  },
  {
    id: 'florianopolis',
    name: 'Florianópolis',
    country: 'Brasil',
    region: 'Sul',
    imageUrl: 'https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=600&q=80',
    available: false,
  },
  {
    id: 'fernando-de-noronha',
    name: 'Fernando de Noronha',
    country: 'Brasil',
    region: 'Nordeste',
    imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600&q=80',
    available: false,
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80',
    available: false,
  },
  {
    id: 'lisboa',
    name: 'Lisboa',
    country: 'Portugal',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80',
    available: false,
  },
];

// Search destinations by name (case insensitive)
export const searchDestinations = (query: string): Destination[] => {
  if (!query.trim()) return curatedDestinations.filter(d => d.available);
  
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  return curatedDestinations.filter(d => {
    const normalizedName = d.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedCountry = d.country.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    return normalizedName.includes(normalizedQuery) || normalizedCountry.includes(normalizedQuery);
  });
};

// Get a destination by ID
export const getDestination = (id: string): Destination | null => {
  return curatedDestinations.find(d => d.id === id) || null;
};
