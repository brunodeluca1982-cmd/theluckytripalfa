import { useEffect } from "react";

const WA_URL =
  "https://api.whatsapp.com/send?phone=5521998102132&text=Ol%C3%A1%2C%20vim%20pelo%20The%20Lucky%20Trip%20e%20quero%20refinar%20meu%20roteiro";

const WhatsAppRedirect = () => {
  useEffect(() => {
    window.location.replace(WA_URL);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-foreground">
      <p className="text-lg font-medium">Abrindo WhatsApp...</p>
      <a
        href={WA_URL}
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
