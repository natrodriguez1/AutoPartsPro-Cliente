import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Star, MessageCircle } from "lucide-react";

import type { Workshop } from "@/features/taller/types/workshop";
import { WorkshopBadges } from "@/features/taller/components/WorkshopBadges";

interface WorkshopCardProps {
  workshop: Workshop;
  onViewProfile?: (id: string) => void;
  onContact?: (workshop: Workshop) => void;
  className?: string;
}

export function WorkshopCard({
  workshop,
  onViewProfile,
  onContact,
  className = "",
}: WorkshopCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header: nombre + badges + rating */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-lg">{workshop.nombre}</h4>
          <WorkshopBadges badges={workshop.badges} className="mt-1" />
        </div>
        <Badge variant="outline" className="flex items-center gap-1 ml-2">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {workshop.rating}
        </Badge>
      </div>

      {/* Especialidad */}
      <p className="text-sm text-muted-foreground mb-2 font-medium">
        {workshop.especialidad}
      </p>

      {/* Ciudad + distancia */}
      <p className="text-sm text-muted-foreground mb-3">
        📍 {workshop.ciudad} • {workshop.distancia}
      </p>

      {/* Reseña destacada */}
      {workshop.reseñas?.length > 0 && (
        <div className="text-sm text-muted-foreground mb-4">
          "{workshop.reseñas[0]}"
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2">
        {onViewProfile && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProfile(workshop.id)}
          >
            Ver Perfil
          </Button>
        )}

        {onContact && (
          <Button size="sm" onClick={() => onContact(workshop)}>
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat
          </Button>
        )}
      </div>
    </div>
  );
}