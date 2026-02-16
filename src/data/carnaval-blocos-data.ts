import type { ImageStatus } from './carnival-blocks';

export interface BlocoEvent {
  id: string;
  name: string;
  startHour: number; // e.g. 7, 8, 9...
  location: string;
  vibe: string;
  publico: string;
  musica: string;
  image_url?: string | null;
  image_source_url?: string | null;
  image_credit?: string | null;
  image_status?: ImageStatus;
}

export interface CarnavalDay {
  date: string; // ISO format YYYY-MM-DD
  blocos: BlocoEvent[];
}

export const carnavalBlocos: CarnavalDay[] = [
  {
    date: "2026-02-16",
    blocos: [
      { id: "corre-atras", name: "Corre Atrás", startHour: 7, location: "Leblon", vibe: "Energético", publico: "Jovens", musica: "Pop e eletrônico" },
      { id: "brasilia-amarela", name: "Brasília Amarela", startHour: 8, location: "Urca", vibe: "Intimista, charmoso", publico: "Adultos", musica: "MPB e samba" },
      { id: "fica-comigo", name: "Fica Comigo", startHour: 9, location: "Lagoa", vibe: "Familiar, descontraído", publico: "Famílias", musica: "Pop brasileiro" },
      { id: "carvalho-em-pe", name: "Carvalho em pé", startHour: 10, location: "Tijuca", vibe: "Tradicional", publico: "Adultos", musica: "Samba" },
      { id: "cruzada", name: "Cruzada", startHour: 14, location: "Copacabana", vibe: "Animado, intenso", publico: "Jovens e adultos", musica: "Funk e samba" },
    ],
  },
  {
    date: "2026-02-17",
    blocos: [
      { id: "vagalume", name: "Vagalume", startHour: 8, location: "Laranjeiras", vibe: "Intimista, boêmio", publico: "Adultos", musica: "MPB e samba" },
      { id: "empurra", name: "Empurra", startHour: 12, location: "Flamengo", vibe: "Intenso, quente", publico: "Jovens", musica: "Funk e pop" },
      { id: "s-pimenta", name: "S. Pimenta", startHour: 20, location: "Lapa", vibe: "Noturno, apimentado", publico: "Adultos", musica: "Samba e funk" },
    ],
  },
  {
    date: "2026-02-18",
    blocos: [
      { id: "me-enterra-na-4a", name: "Me enterra na 4ª", startHour: 13, location: "Ipanema", vibe: "Despedida, saudoso", publico: "Todos", musica: "Marchinhas e MPB" },
      { id: "planta-na-mente", name: "Planta Na Mente", startHour: 14, location: "Jardim Botânico", vibe: "Tranquilo, verde", publico: "Adultos", musica: "Reggae e MPB" },
    ],
  },
  {
    date: "2026-02-19",
    blocos: [
      { id: "fundo-de-quintal", name: "Fundo de Quintal", startHour: 18, location: "Madureira", vibe: "Raiz, autêntico", publico: "Todos", musica: "Pagode e samba" },
    ],
  },
  {
    date: "2026-02-21",
    blocos: [
      { id: "bloconce", name: "Bloconcé", startHour: 9, location: "Ipanema", vibe: "Pop, empoderado", publico: "Jovens", musica: "Pop internacional" },
      { id: "batafa", name: "Batafá", startHour: 10, location: "Botafogo", vibe: "Percussivo, tribal", publico: "Adultos", musica: "Batucada e afrobeat" },
      { id: "chule-de-santa", name: "Chulé de Santa", startHour: 12, location: "Santa Teresa", vibe: "Irreverente, boêmio", publico: "Adultos", musica: "Samba e marchinhas" },
    ],
  },
  {
    date: "2026-02-22",
    blocos: [
      { id: "filhos-da-puc", name: "Filhos da PUC", startHour: 9, location: "Gávea", vibe: "Universitário, jovem", publico: "Jovens", musica: "Pop e funk" },
      { id: "boka-de-espuma", name: "Boka de Espuma", startHour: 14, location: "Copacabana", vibe: "Festa, espuma", publico: "Jovens e adultos", musica: "Eletrônico e pop" },
      { id: "saideira", name: "Saideira", startHour: 16, location: "Leblon", vibe: "Encerramento, festivo", publico: "Todos", musica: "Samba e pop" },
    ],
  },
];
