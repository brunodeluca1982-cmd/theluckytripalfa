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
    date: "2026-02-17",
    blocos: [
      { id: "fervo-da-lud", name: "Fervo da Lud", startHour: 7, location: "Centro", vibe: "Alta energia, clima de show", publico: "Jovens, LGBTQIA+, turistas", musica: "Pop, funk, hits atuais" },
      { id: "as-carmelitas", name: "As Carmelitas", startHour: 8, location: "Santa Teresa", vibe: "Boêmio, histórico", publico: "Locais, artistas, famílias", musica: "Samba e marchinhas" },
      { id: "vagalume-o-verde", name: "Vagalume O Verde", startHour: 8, location: "Jardim Botânico", vibe: "Organizado, menos caótico", publico: "Zona Sul, famílias", musica: "Samba e marchinhas" },
      { id: "empurra-que-pega-do-leblon", name: "Empurra que Pega", startHour: 12, location: "Leblon", vibe: "Comunitário, tradicional", publico: "Moradores, famílias", musica: "Samba e marchinhas" },
      { id: "sargento-pimenta", name: "Sargento Pimenta", startHour: 20, location: "Jardim Botânico", vibe: "Alternativo, animado", publico: "Criativos, jovens adultos", musica: "Beatles em samba" },
    ],
  },
  {
    date: "2026-02-18",
    blocos: [
      { id: "me-enterra-na-4a", name: "Me Enterra na Quarta", startHour: 13, location: "Centro", vibe: "Tradicional, nostálgico", publico: "Carnavalescos raiz", musica: "Samba-enredo e marchinhas" },
      { id: "planta-na-mente", name: "Planta Na Mente", startHour: 14, location: "Lapa", vibe: "—", publico: "—", musica: "—" },
    ],
  },
  {
    date: "2026-02-19",
    blocos: [
      { id: "fundo-de-quintal", name: "Fundo de Quintal", startHour: 18, location: "Lapa", vibe: "Raiz, autêntico", publico: "30+, sambistas, casais", musica: "Samba raiz" },
    ],
  },
  {
    date: "2026-02-21",
    blocos: [
      { id: "bloco-da-anitta", name: "Bloco da Anitta", startHour: 7, location: "Centro", vibe: "Megaevento, show internacional", publico: "Jovens, turistas", musica: "Pop, funk, hits" },
      { id: "bloconce", name: "Bloconcé", startHour: 9, location: "Flamengo", vibe: "Pop, coreografado", publico: "Jovens adultos", musica: "Pop nacional e internacional" },
      { id: "batafa", name: "Batafá", startHour: 10, location: "Laranjeiras", vibe: "Tranquilo, bairro", publico: "Moradores, famílias", musica: "Samba e marchinhas" },
      { id: "chule-de-santa", name: "Chulé de Santa", startHour: 12, location: "Santa Teresa", vibe: "Alternativo, artístico", publico: "Criativos, moradores", musica: "Samba e alternativo" },
      { id: "mulheres-de-chico", name: "Mulheres de Chico", startHour: 15, location: "Leme", vibe: "Romântico, sofisticado", publico: "Adultos, casais, MPB", musica: "Chico Buarque" },
      { id: "bloco-beatles-para-criancas", name: "Beatles P/ Crianças", startHour: 15, location: "Gávea", vibe: "Infantil, familiar", publico: "Pais e crianças", musica: "Beatles adaptado" },
    ],
  },
  {
    date: "2026-02-22",
    blocos: [
      { id: "bloco-little-be", name: "Little Be", startHour: 8, location: "Ipanema", vibe: "Familiar, tranquilo", publico: "Pais e crianças", musica: "Infantil e marchinhas" },
      { id: "filhos-da-puc", name: "Filhos da PUC", startHour: 9, location: "Gávea", vibe: "Universitário, jovem", publico: "Estudantes, jovens", musica: "Pop e samba" },
      { id: "boka-de-espuma", name: "Boka de Espuma", startHour: 14, location: "Botafogo", vibe: "Irreverente, animado", publico: "Jovens e adultos", musica: "Samba e pop" },
      { id: "saideira", name: "Saideira", startHour: 16, location: "Leme", vibe: "Encerramento, festivo", publico: "Todos", musica: "Samba e marchinhas" },
    ],
  },
];
