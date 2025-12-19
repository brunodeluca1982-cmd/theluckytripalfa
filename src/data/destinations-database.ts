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
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400',
    available: true,
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    country: 'Brasil',
    region: 'Sudeste',
    imageUrl: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=400',
    available: false, // Coming soon
  },
  {
    id: 'salvador',
    name: 'Salvador',
    country: 'Brasil',
    region: 'Nordeste',
    imageUrl: 'https://images.unsplash.com/photo-1551817958-20204d6ab212?w=400',
    available: false,
  },
  {
    id: 'florianopolis',
    name: 'Florianópolis',
    country: 'Brasil',
    region: 'Sul',
    imageUrl: 'https://images.unsplash.com/photo-1597038891284-0e8eb3d2bfdc?w=400',
    available: false,
  },
  {
    id: 'fernando-de-noronha',
    name: 'Fernando de Noronha',
    country: 'Brasil',
    region: 'Nordeste',
    imageUrl: 'https://images.unsplash.com/photo-1599054802207-91d346adc120?w=400',
    available: false,
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    imageUrl: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400',
    available: false,
  },
  {
    id: 'lisboa',
    name: 'Lisboa',
    country: 'Portugal',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
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
