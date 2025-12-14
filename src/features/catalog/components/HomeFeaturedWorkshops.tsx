import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MapPin, MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";

import { talleresDestacadosMock } from "@/features/taller/data/workshops.mock";
import type { Workshop } from "@/features/taller/types/workshop";
import { WorkshopCard } from "@/features/taller/components/WorkshopCard";
import { openWorkshopWhatsapp } from "@/features/taller/utils/workshopContact";

interface FeaturedWorkshopsSectionProps {
  onVerPerfil: (tallerId: string) => void;
}

export function FeaturedWorkshopsSection({
  onVerPerfil,
}: FeaturedWorkshopsSectionProps) {
  const talleresDestacados: Workshop[] = talleresDestacadosMock;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Red de Talleres Especializados en Ecuador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talleresDestacados.map((taller) => (
            <WorkshopCard
              key={taller.id}
              workshop={taller}
              onViewProfile={onVerPerfil}
              onContact={openWorkshopWhatsapp}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
