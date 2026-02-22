import { useEffect } from "react";

const MSG = "Olá, vim pelo The Lucky Trip e quero refinar meu roteiro";
const PHONE = "5521998102132";
const URL_APP = `whatsapp://send?phone=${PHONE}&text=${encodeURIComponent(MSG)}`;
const URL_WEB = `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(MSG)}`;

const WhatsAppRedirect = () => {
  useEffect(() => {
    window.location.href = URL_APP;
    const t = setTimeout(() => {
      window.location.href = URL_WEB;
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-foreground">
      <p className="text-lg font-medium">Abrindo WhatsApp...</p>
      <a
        href={URL_WEB}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary underline"
      >
        Se não abrir, toque aqui
      </a>
    </div>
  );
};

export default WhatsAppRedirect;
