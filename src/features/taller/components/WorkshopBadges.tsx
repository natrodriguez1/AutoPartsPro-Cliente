import { Badge } from "@/shared/ui/badge";
import { Navigation, TrendingUp } from "lucide-react";
import type { WorkshopBadge } from "../types/workshop";

interface WorkshopBadgesProps {
  badges: WorkshopBadge[];
  className?: string;
}

export function WorkshopBadges({ badges, className }: WorkshopBadgesProps) {
  if (!badges?.length) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className ?? ""}`}>
      {badges.map((badge, index) => {
        switch (badge) {
          case "closest":
            return (
              <Badge
                key={`${badge}-${index}`}
                className="bg-blue-100 text-blue-800 text-xs font-medium"
              >
                <Navigation className="h-3 w-3 mr-1" />
                Más Cercano
              </Badge>
            );
          case "growth":
            return (
              <Badge
                key={`${badge}-${index}`}
                className="bg-green-100 text-green-800 text-xs font-medium"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Mayor Crecimiento
              </Badge>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
