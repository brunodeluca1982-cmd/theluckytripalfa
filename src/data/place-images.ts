/**
 * PLACE IMAGES - Generic neighborhood-based fallback images
 * 
 * Provides appropriate placeholder images for hotels, restaurants, and attractions
 * based on the neighborhood context in Rio de Janeiro.
 */

// Hotel images by neighborhood
import ipanemaHotel from "@/assets/places/ipanema-hotel.jpg";
import leblonHotel from "@/assets/places/leblon-hotel.jpg";
import copacabanaHotel from "@/assets/places/copacabana-hotel.jpg";
import lemeHotel from "@/assets/places/leme-hotel.jpg";
import santaTeresaHotel from "@/assets/places/santa-teresa-hotel.jpg";
import barraHotel from "@/assets/places/barra-hotel.jpg";
import saoConradoHotel from "@/assets/places/sao-conrado-hotel.jpg";
import centroHotel from "@/assets/places/centro-hotel.jpg";
import recreioHotel from "@/assets/places/recreio-hotel.jpg";

// Restaurant images by neighborhood
import ipanemaRestaurant from "@/assets/places/ipanema-restaurant.jpg";
import leblonRestaurant from "@/assets/places/leblon-restaurant.jpg";
import copacabanaRestaurant from "@/assets/places/copacabana-restaurant.jpg";
import botafogoRestaurant from "@/assets/places/botafogo-restaurant.jpg";
import jardimBotanicoRestaurant from "@/assets/places/jardim-botanico-restaurant.jpg";
import gaveaRestaurant from "@/assets/places/gavea-restaurant.jpg";
import barraRestaurant from "@/assets/places/barra-restaurant.jpg";
import centroRestaurant from "@/assets/places/centro-restaurant.jpg";
import recreioRestaurant from "@/assets/places/recreio-restaurant.jpg";

// Attraction images
import ipanemaAttraction from "@/assets/places/ipanema-attraction.jpg";

const hotelImages: Record<string, string> = {
  ipanema: ipanemaHotel,
  leblon: leblonHotel,
  copacabana: copacabanaHotel,
  leme: lemeHotel,
  "santa-teresa": santaTeresaHotel,
  "barra-da-tijuca": barraHotel,
  "sao-conrado": saoConradoHotel,
  centro: centroHotel,
  recreio: recreioHotel,
};

const restaurantImages: Record<string, string> = {
  ipanema: ipanemaRestaurant,
  leblon: leblonRestaurant,
  copacabana: copacabanaRestaurant,
  botafogo: botafogoRestaurant,
  "jardim-botanico": jardimBotanicoRestaurant,
  gavea: gaveaRestaurant,
  "barra-da-tijuca": barraRestaurant,
  centro: centroRestaurant,
  recreio: recreioRestaurant,
};

const attractionImages: Record<string, string> = {
  ipanema: ipanemaAttraction,
  // Fallback to ipanema for other neighborhoods
};

// Default fallbacks
const defaultHotelImage = ipanemaHotel;
const defaultRestaurantImage = ipanemaRestaurant;
const defaultAttractionImage = ipanemaAttraction;

export type PlaceType = "hotel" | "restaurant" | "attraction";

/**
 * Get appropriate image for a place based on neighborhood and type
 */
export const getPlaceImage = (neighborhoodId: string, type: PlaceType): string => {
  switch (type) {
    case "hotel":
      return hotelImages[neighborhoodId] || defaultHotelImage;
    case "restaurant":
      return restaurantImages[neighborhoodId] || defaultRestaurantImage;
    case "attraction":
      return attractionImages[neighborhoodId] || defaultAttractionImage;
    default:
      return defaultRestaurantImage;
  }
};

/**
 * Get hotel image for a specific neighborhood
 */
export const getHotelImage = (neighborhoodId: string): string => {
  return hotelImages[neighborhoodId] || defaultHotelImage;
};

/**
 * Get restaurant image for a specific neighborhood
 */
export const getRestaurantImage = (neighborhoodId: string): string => {
  return restaurantImages[neighborhoodId] || defaultRestaurantImage;
};

/**
 * Get attraction image for a specific neighborhood
 */
export const getAttractionImage = (neighborhoodId: string): string => {
  return attractionImages[neighborhoodId] || defaultAttractionImage;
};
