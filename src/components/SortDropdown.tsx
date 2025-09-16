import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowUpDown } from "lucide-react";

export type SortOption = 
  | "relevance" 
  | "name" 
  | "price-low-high" 
  | "price-high-low" 
  | "rating" 
  | "newest";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  { value: "relevance" as const, label: "Más Relevantes" },
  { value: "name" as const, label: "Nombre A-Z" },
  { value: "price-low-high" as const, label: "Precio: Menor a Mayor" },
  { value: "price-high-low" as const, label: "Precio: Mayor a Menor" },
  { value: "rating" as const, label: "Mejor Calificados" },
  { value: "newest" as const, label: "Más Nuevos" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <SelectValue placeholder="Ordenar por" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}