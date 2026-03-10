import { Lock, Sparkles } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SecretLockedSheetProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  itemTitle?: string;
}

const SecretLockedSheet = ({ open, onClose, onUnlock, itemTitle }: SecretLockedSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-[hsl(30,10%,10%)] border-t border-white/10 p-0">
        <div className="flex flex-col items-center px-6 pt-8 pb-10">
          {/* Handle */}
          <div className="w-10 h-1 rounded-full bg-white/20 mb-8" />

          {/* Lock icon */}
          <div className="w-14 h-14 rounded-full bg-[hsl(40,60%,50%)]/15 flex items-center justify-center mb-5">
            <Lock className="w-6 h-6 text-[hsl(40,60%,50%)]" />
          </div>

          {/* Badge */}
          <span className="text-[10px] tracking-[0.2em] uppercase text-[hsl(40,60%,50%)] border border-[hsl(40,60%,50%)]/30 rounded-full px-3 py-1 mb-5">
            Lucky Pro
          </span>

          {/* Title */}
          <h2 className="text-2xl font-serif font-semibold text-white text-center leading-tight mb-3">
            Você encontrou um segredo exclusivo
          </h2>

          <p className="text-sm text-white/50 text-center leading-relaxed max-w-xs mb-8">
            Este é um dos 127 endereços exclusivos que só os membros Lucky Pro acessam. Curadoria pessoal do Bruno de Luca.
          </p>

          {/* Locked preview card */}
          {itemTitle && (
            <div className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-sm text-white/50 line-clamp-1">
                🔒 Conteúdo exclusivo Lucky Pro
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="w-full space-y-3 mb-8">
            {[
              "127 segredos exclusivos por cidade",
              "Salvar locais e gerar roteiros com IA",
              "Acesso offline + colaboração em tempo real",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[hsl(40,60%,50%)] flex-shrink-0" />
                <p className="text-sm text-white/70">{text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onUnlock}
            className="w-full py-4 rounded-xl bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] font-semibold text-base hover:bg-[hsl(40,60%,55%)] transition-colors"
          >
            Desbloquear tudo
          </button>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-white/30 hover:text-white/50 transition-colors"
          >
            Ver todos os planos e benefícios →
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SecretLockedSheet;
