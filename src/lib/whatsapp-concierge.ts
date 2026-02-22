/**
 * WhatsApp Concierge — single source of truth for wa.me links.
 */

const WA_PHONE = "5511999999999";
const WA_BASE = `https://wa.me/${WA_PHONE}`;

export interface WhatsAppContext {
  destino?: string;
  datas?: string;
}

export function buildWhatsAppUrl(ctx?: WhatsAppContext): string {
  let msg = "Olá Quero ajuda para refinar meu roteiro no The Lucky Trip.";

  if (ctx?.destino) {
    msg += ` Meu destino é ${ctx.destino}`;
    if (ctx?.datas) {
      msg += ` e as datas são ${ctx.datas}`;
    }
    msg += ".";
  }

  msg += " Pode me ajudar?";

  return `${WA_BASE}?text=${encodeURIComponent(msg)}`;
}
