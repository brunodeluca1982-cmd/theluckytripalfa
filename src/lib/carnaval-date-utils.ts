const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const DIAS_SEMANA = [
  "domingo", "segunda-feira", "terça-feira", "quarta-feira",
  "quinta-feira", "sexta-feira", "sábado",
];

/** Parse an ISO date string (YYYY-MM-DD) into local date parts to avoid timezone shifts. */
function parseISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "14 de fevereiro de 2026 — sábado" */
export function formatCarnavalDateFull(iso: string): string {
  const dt = parseISO(iso);
  return `${dt.getDate()} de ${MESES[dt.getMonth()]} de ${dt.getFullYear()} — ${DIAS_SEMANA[dt.getDay()]}`;
}

/** "14 de fevereiro — sábado" (no year) */
export function formatCarnavalDateShort(iso: string): string {
  const dt = parseISO(iso);
  return `${dt.getDate()} de ${MESES[dt.getMonth()]} — ${DIAS_SEMANA[dt.getDay()]}`;
}

/** "14 de Fevereiro" (title-style) */
export function formatCarnavalDateTitle(iso: string): string {
  const dt = parseISO(iso);
  const mes = MESES[dt.getMonth()];
  return `${dt.getDate()} de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
}
