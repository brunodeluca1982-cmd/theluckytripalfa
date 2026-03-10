import { Lock, Star } from "lucide-react";
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
          <div className="w-16 h-16 rounded-full bg-[hsl(40,60%,50%)]/10 border border-[hsl(40,60%,50%)]/20 flex items-center justify-center mb-5">
            <Lock className="w-7 h-7 text-[hsl(40,60%,50%)]" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-serif font-semibold text-white text-center leading-tight mb-3">
            Você está prestes a descobrir o Rio que o Google não mostra
          </h2>

          <p className="text-sm text-white/50 text-center leading-relaxed max-w-xs mb-6">
            Este é um dos 127 segredos exclusivos escolhidos a dedo por Bruno De Luca.
          </p>

          {/* Curator block */}
          <div className="w-full rounded-xl bg-white/5 border border-white/10 p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(40,60%,50%)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-4 h-4 text-[hsl(40,60%,50%)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">
                  Curadoria pessoal de Bruno De Luca
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  20 anos descobrindo os lugares que nem os guias mostram.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onUnlock}
            className="w-full py-4 rounded-xl bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] font-semibold text-base hover:bg-[hsl(40,60%,55%)] active:scale-[0.98] transition-all"
          >
            Desbloquear Lucky Pro
          </button>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-white/30 hover:text-white/50 transition-colors"
          >
            Agora não
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SecretLockedSheet;
