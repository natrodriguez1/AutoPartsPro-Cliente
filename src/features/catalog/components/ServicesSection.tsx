import { Filter, Wrench, Clock, Calendar } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

import { FilterPanel } from "./FilterPanel";
import { SortDropdown, SortOption } from "./SortDropdown";
import { ImageWithFallback } from "@/shared/components/ImageWithFallback";
import { RatingStars } from "@/shared/components/RatingStars";

import type { Service, ServiceFilter } from "../types/service";

interface ServicesSectionProps {
  services: Service[];
  filters: ServiceFilter;
  onFiltersChange: (filters: ServiceFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onVerServicio: (serviceId: string) => void;
}

export function ServicesSection({
  services,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  onVerServicio,
}: ServicesSectionProps) {
  return (
    <div className="flex gap-6">
      {/* Filtros (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          isServiceMode={true}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Barra de controles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1>Servicios de Taller ({services.length})</h1>

            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md gap-1.5 px-3 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="p-4">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    isMobile={true}
                    isServiceMode={true}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4">
            <SortDropdown value={sortBy} onChange={onSortChange} />
          </div>
        </div>

        {/* Grid de servicios */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron servicios que coincidan con tus filtros.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                onFiltersChange({
                  categories: [],
                  brand: [],
                  compatibility: [],
                  priceRange: [0, 500],
                  minRating: 0,
                })
              }
              className="mt-4"
            >
              Limpiar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm"
                onClick={() => onVerServicio(service.id)}
              >
                <CardContent className="p-4">
                  <div className="relative">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {service.isPromoted && (
                        <Badge className="bg-blue-500 text-white text-xs font-medium">
                          Promocionado
                        </Badge>
                      )}
                      {service.isUrgent && (
                        <Badge
                          variant="destructive"
                          className="text-xs font-medium"
                        >
                          Express
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium leading-tight line-clamp-2 h-10">
                      {service.name}
                    </h3>

                    <div className="flex items-center gap-1">
                      <RatingStars rating={service.rating} size="sm" />
                      <span className="text-sm text-muted-foreground ml-1">
                        {service.rating} ({service.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          ${service.price}
                        </span>
                        {service.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${service.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      <span>Por {service.workshopName}</span>
                    </div>

                    <Button className="w-full mt-2" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
