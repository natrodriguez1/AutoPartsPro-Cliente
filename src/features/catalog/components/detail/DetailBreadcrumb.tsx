import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  onBack: () => void;
  category?: string;
  brand?: string;
  backLabel?: string;
};

export function DetailBreadcrumb({
  onBack,
  category,
  brand,
  backLabel = "Volver al catálogo",
}: Props) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {backLabel}
      </Button>

      {category && (
        <>
          <span>/</span>
          <span className="capitalize">{category}</span>
        </>
      )}

      {brand && (
        <>
          <span>/</span>
          <span className="capitalize">{brand}</span>
        </>
      )}
    </div>
  );
}
