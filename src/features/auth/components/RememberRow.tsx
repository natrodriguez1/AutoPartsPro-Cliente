import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import type { CheckedState } from "@radix-ui/react-checkbox";

type Props = {
  id: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
};

export function RememberRow({ id, checked, onCheckedChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v: CheckedState) => onCheckedChange(v === true)}
        />
        <Label htmlFor={id} className="text-sm">
          Recordarme
        </Label>
      </div>
      <Button variant="link" className="p-0 h-auto text-sm">
        ¿Olvidaste tu contraseña?
      </Button>
    </div>
  );
}
