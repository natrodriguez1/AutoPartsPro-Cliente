import { Button } from "@/shared/ui/button";
import { Minus, Plus } from "lucide-react";

type Props = {
  value: number;
  min?: number;
  onChange: (next: number) => void;
};

export function QuantitySelector({ value, min = 1, onChange }: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(value + 1);

  return (
    <div className="flex items-center border rounded-md">
      <Button variant="ghost" size="sm" onClick={dec} disabled={value <= min}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-4 py-2 font-medium">{value}</span>
      <Button variant="ghost" size="sm" onClick={inc}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
