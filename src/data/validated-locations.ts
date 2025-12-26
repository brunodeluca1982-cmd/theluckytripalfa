/**
 * VALIDATED LOCATION DATABASE
 * 
 * Single source of truth for all place locations in Rio de Janeiro.
 * Each entry must have:
 * - fullAddress: Complete street address
 * - neighborhood: From validated neighborhood list
 * - city: "Rio de Janeiro"
 * - lat/lng: Real coordinates (verified)
 * 
 * DO NOT add entries without verified geographic data.
 * DO NOT guess, approximate, or infer locations.
 */

import { ValidatedLocation } from '@/lib/location-validation';

export const VALIDATED_LOCATIONS: Record<string, ValidatedLocation> = {
  // ============= HOTELS =============
  'fasano': {
    fullAddress: 'Av. Vieira Souto, 80 - Ipanema',
    neighborhood: 'Ipanema',
    city: 'Rio de Janeiro',
    lat: -22.9867,
    lng: -43.2022,
  },
  'janeiro': {
    fullAddress: 'Av. Delfim Moreira, 696 - Leblon',
    neighborhood: 'Leblon',
    city: 'Rio de Janeiro',
    lat: -22.9872,
    lng: -43.2297,
  },
  'ritz-leblon': {
    fullAddress: 'Av. Ataulfo de Paiva, 1280 - Leblon',
    neighborhood: 'Leblon',
    city: 'Rio de Janeiro',
    lat: -22.9838,
    lng: -43.2234,
  },
  'ipanema-inn': {
    fullAddress: 'R. Maria Quitéria, 27 - Ipanema',
    neighborhood: 'Ipanema',
    city: 'Rio de Janeiro',
    lat: -22.9823,
    lng: -43.2028,
  },
  'mar-ipanema': {
    fullAddress: 'R. Visconde de Pirajá, 539 - Ipanema',
    neighborhood: 'Ipanema',
    city: 'Rio de Janeiro',
    lat: -22.9833,
    lng: -43.2033,
  },
  'copa-palace': {
    fullAddress: 'Av. Atlântica, 1702 - Copacabana',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    lat: -22.9669,
    lng: -43.1782,
  },
  'emiliano': {
    fullAddress: 'Av. Atlântica, 3804 - Copacabana',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    lat: -22.9781,
    lng: -43.1903,
  },
  'fairmont': {
    fullAddress: 'Av. Atlântica, 4240 - Copacabana',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    lat: -22.9812,
    lng: -43.1923,
  },
  'santa-teresa-mgallery': {
    fullAddress: 'R. Almirante Alexandrino, 660 - Santa Teresa',
    neighborhood: 'Santa Teresa',
    city: 'Rio de Janeiro',
    lat: -22.9227,
    lng: -43.1873,
  },
  'nacional': {
    fullAddress: 'Av. Niemeyer, 769 - São Conrado',
    neighborhood: 'São Conrado',
    city: 'Rio de Janeiro',
    lat: -22.9989,
    lng: -43.2644,
  },
  
  // ============= RESTAURANTS =============
  'lasai': {
    fullAddress: 'R. Conde de Irajá, 191 - Botafogo',
    neighborhood: 'Botafogo',
    city: 'Rio de Janeiro',
    lat: -22.9539,
    lng: -43.1827,
  },
  'oteque': {
    fullAddress: 'R. Conde de Irajá, 581 - Botafogo',
    neighborhood: 'Botafogo',
    city: 'Rio de Janeiro',
    lat: -22.9555,
    lng: -43.1832,
  },
  'nido': {
    fullAddress: 'R. Garcia D\'Ávila, 134 - Ipanema',
    neighborhood: 'Ipanema',
    city: 'Rio de Janeiro',
    lat: -22.9844,
    lng: -43.2044,
  },
  'zaza': {
    fullAddress: 'R. Joana Angélica, 40 - Ipanema',
    neighborhood: 'Ipanema',
    city: 'Rio de Janeiro',
    lat: -22.9802,
    lng: -43.2016,
  },
  'jobi': {
    fullAddress: 'Av. Ataulfo de Paiva, 1166 - Leblon',
    neighborhood: 'Leblon',
    city: 'Rio de Janeiro',
    lat: -22.9832,
    lng: -43.2226,
  },
  'satyricon': {
    fullAddress: 'R. Barão da Torre, 192 - Ipanema',
    neighborhood: 'Ipanema',
    city: 'Rio de Janeiro',
    lat: -22.9825,
    lng: -43.2003,
  },
  'elena': {
    fullAddress: 'R. Pacheco Leão, 780 - Jardim Botânico',
    neighborhood: 'Jardim Botânico',
    city: 'Rio de Janeiro',
    lat: -22.9679,
    lng: -43.2247,
  },
  'aprazivel': {
    fullAddress: 'R. Aprazível, 62 - Santa Teresa',
    neighborhood: 'Santa Teresa',
    city: 'Rio de Janeiro',
    lat: -22.9232,
    lng: -43.1932,
  },
  'bar-mineiro': {
    fullAddress: 'R. Paschoal Carlos Magno, 99 - Santa Teresa',
    neighborhood: 'Santa Teresa',
    city: 'Rio de Janeiro',
    lat: -22.9193,
    lng: -43.1852,
  },
  'confeitaria-colombo': {
    fullAddress: 'R. Gonçalves Dias, 32 - Centro',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    lat: -22.9039,
    lng: -43.1763,
  },
  'mee': {
    fullAddress: 'Av. Atlântica, 1702 - Copacabana',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    lat: -22.9669,
    lng: -43.1782,
  },
  'cipriani': {
    fullAddress: 'Av. Atlântica, 1702 - Copacabana',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    lat: -22.9669,
    lng: -43.1782,
  },
  'ct-boucherie': {
    fullAddress: 'R. Dias Ferreira, 636 - Leblon',
    neighborhood: 'Leblon',
    city: 'Rio de Janeiro',
    lat: -22.9866,
    lng: -43.2276,
  },
  'belmonte': {
    fullAddress: 'Av. Atlântica, 3432 - Copacabana',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    lat: -22.9764,
    lng: -43.1889,
  },
  
  // ============= ACTIVITIES =============
  'praia-ipanema': {
    fullAddress: 'Praia de Ipanema - Ipanema',
    neighborhood: 'Ipanema',
    city: 'Rio de Janeiro',
    lat: -22.9868,
    lng: -43.2035,
  },
  'por-sol-arpoador': {
    fullAddress: 'Pedra do Arpoador - Arpoador',
    neighborhood: 'Arpoador',
    city: 'Rio de Janeiro',
    lat: -22.9885,
    lng: -43.1913,
  },
  'pao-acucar': {
    fullAddress: 'Av. Pasteur, 520 - Urca',
    neighborhood: 'Urca',
    city: 'Rio de Janeiro',
    lat: -22.9509,
    lng: -43.1655,
  },
  'cristo-redentor': {
    fullAddress: 'Parque Nacional da Tijuca - Alto da Boa Vista',
    neighborhood: 'Floresta da Tijuca',
    city: 'Rio de Janeiro',
    lat: -22.9519,
    lng: -43.2106,
  },
  'jardim-botanico': {
    fullAddress: 'R. Jardim Botânico, 1008 - Jardim Botânico',
    neighborhood: 'Jardim Botânico',
    city: 'Rio de Janeiro',
    lat: -22.9662,
    lng: -43.2274,
  },
  'parque-lage': {
    fullAddress: 'R. Jardim Botânico, 414 - Jardim Botânico',
    neighborhood: 'Jardim Botânico',
    city: 'Rio de Janeiro',
    lat: -22.9592,
    lng: -43.2109,
  },
  'museu-amanha': {
    fullAddress: 'Praça Mauá, 1 - Centro',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    lat: -22.8943,
    lng: -43.1802,
  },
  'escadaria-selaron': {
    fullAddress: 'R. Manuel Carneiro - Lapa',
    neighborhood: 'Lapa',
    city: 'Rio de Janeiro',
    lat: -22.9152,
    lng: -43.1791,
  },
  'lagoa-rodrigo-freitas': {
    fullAddress: 'Lagoa Rodrigo de Freitas - Lagoa',
    neighborhood: 'Lagoa',
    city: 'Rio de Janeiro',
    lat: -22.9716,
    lng: -43.2141,
  },
  'mureta-urca': {
    fullAddress: 'Av. João Luiz Alves - Urca',
    neighborhood: 'Urca',
    city: 'Rio de Janeiro',
    lat: -22.9472,
    lng: -43.1620,
  },
  'voo-livre': {
    fullAddress: 'Pedra Bonita, Estrada das Canoas - São Conrado',
    neighborhood: 'São Conrado',
    city: 'Rio de Janeiro',
    lat: -22.9876,
    lng: -43.2782,
  },
  'pedra-bonita': {
    fullAddress: 'Estrada das Canoas - Floresta da Tijuca',
    neighborhood: 'Floresta da Tijuca',
    city: 'Rio de Janeiro',
    lat: -22.9876,
    lng: -43.2782,
  },
  'ccbb': {
    fullAddress: 'R. Primeiro de Março, 66 - Centro',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    lat: -22.9016,
    lng: -43.1764,
  },
  'aquario': {
    fullAddress: 'Via Binário do Porto, s/n - Centro',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    lat: -22.8937,
    lng: -43.1863,
  },
  'boulevard-olimpico': {
    fullAddress: 'Orla Conde - Centro',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    lat: -22.8938,
    lng: -43.1817,
  },
};

/**
 * Gets validated location for a place by ID
 * Returns undefined if not found (place should be skipped)
 */
export function getValidatedLocation(placeId: string): ValidatedLocation | undefined {
  return VALIDATED_LOCATIONS[placeId];
}

/**
 * Checks if a place has validated location data
 */
export function hasValidatedLocation(placeId: string): boolean {
  return placeId in VALIDATED_LOCATIONS;
}
