import type { ReactNode } from "react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  required?: boolean;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required,
}: Props) {
  const hasIcon = Boolean(icon);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {hasIcon ? (
        <div className="relative">
          <span className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
            {icon}
          </span>
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
            required={required}
          />
        </div>
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
    </div>
  );
}
