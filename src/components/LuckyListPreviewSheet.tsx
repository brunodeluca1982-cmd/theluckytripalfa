import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface LuckyListPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LuckyListPreviewSheet = ({ open, onOpenChange }: LuckyListPreviewSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-2xl font-serif font-semibold text-foreground">
            Lucky List — Rio de Janeiro
          </SheetTitle>
        </SheetHeader>
        
        <div className="pb-8">
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Uma dica especial, fora do óbvio, curada pelo The Lucky Trip.
          </p>
          
          {/* Inactive CTA Placeholder */}
          <div className="py-3 px-4 bg-amber-50 border border-amber-200/60 rounded-lg text-center">
            <p className="text-sm font-medium text-amber-800/80">
              Assine para desbloquear
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LuckyListPreviewSheet;
