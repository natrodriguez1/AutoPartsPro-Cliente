import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Tag, X } from "lucide-react";

type DiscountCode = { code: string; label: string };

type Props = {
  code: string;
  onCodeChange: (next: string) => void;
  onApply: () => void;

  appliedPercent: number;
  codes: DiscountCode[];

  onClear: () => void;
};

export function DiscountCodeCard({
  code,
  onCodeChange,
  onApply,
  appliedPercent,
  codes,
  onClear,
}: Props) {
  const hasDiscount = appliedPercent > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Código de Descuento
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Ingresa código"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
          />
          <Button onClick={onApply} variant="outline">
            Aplicar
          </Button>

          {/* ✅ botón quitar */}
          {hasDiscount && (
            <Button onClick={onClear} variant="ghost" className="text-red-600">
              <X className="h-4 w-4 mr-1" />
              Quitar
            </Button>
          )}
        </div>

        {appliedPercent > 0 && (
          <div className="text-sm text-green-600">
            ✓ Descuento del {appliedPercent}% aplicado
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Códigos disponibles:</p>
          {codes.map((c) => (
            <p key={c.code}>
              • "{c.code}" - {c.label}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
