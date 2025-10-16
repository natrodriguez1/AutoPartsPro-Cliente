import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Badge } from "@/shared/ui/badge";
import { Star, X, Filter } from "lucide-react";

interface FilterPanelProps {
  filters: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    brand: string[];
    compatibility: string[];
  };
  onFiltersChange: (filters: any) => void;
  isMobile?: boolean;
  isServiceMode?: boolean;
}

const productCategories = [
  { id: "frenos", label: "Frenos y Sistema de Frenado", count: 12 },
  { id: "motor", label: "Motor y Componentes", count: 18 },
  { id: "neumaticos", label: "Neumáticos y Llantas", count: 8 },
  { id: "suspension", label: "Suspensión y Dirección", count: 14 },
  { id: "electrico", label: "Sistema Eléctrico", count: 10 },
  { id: "transmision", label: "Transmisión y Embrague", count: 6 },
  { id: "accesorios", label: "Accesorios y Confort", count: 15 },
  { id: "herramientas", label: "Herramientas y Equipos", count: 9 }
];

const serviceCategories = [
  { id: "mantenimiento", label: "Mantenimiento Preventivo", count: 12 },
  { id: "diagnostico", label: "Diagnóstico y Revisión", count: 8 },
  { id: "frenos", label: "Servicios de Frenos", count: 6 },
  { id: "suspension", label: "Suspensión y Alineación", count: 7 },
  { id: "transmision", label: "Transmisión y Embrague", count: 4 },
  { id: "electrico", label: "Sistema Eléctrico", count: 5 },
  { id: "revision", label: "Inspección Técnica", count: 3 },
  { id: "climatizacion", label: "Aire Acondicionado", count: 4 },
  { id: "emergencia", label: "Servicios de Emergencia", count: 2 }
];

const brands = [
  { id: "bosch", label: "Bosch", count: 24 },
  { id: "brembo", label: "Brembo", count: 8 },
  { id: "castrol", label: "Castrol", count: 6 },
  { id: "k&n", label: "K&N", count: 4 },
  { id: "mobil1", label: "Mobil 1", count: 5 },
  { id: "ngk", label: "NGK", count: 7 },
  { id: "gates", label: "Gates", count: 3 },
  { id: "michelin", label: "Michelin", count: 5 },
  { id: "bridgestone", label: "Bridgestone", count: 4 },
  { id: "monroe", label: "Monroe", count: 6 },
  { id: "eibach", label: "Eibach", count: 2 },
  { id: "philips", label: "Philips", count: 3 },
  { id: "valeo", label: "Valeo", count: 4 },
  { id: "weathertech", label: "WeatherTech", count: 2 },
  { id: "anker", label: "Anker", count: 2 },
  { id: "truper", label: "Truper", count: 3 },
  { id: "stanley", label: "Stanley", count: 4 }
];

const compatibility = [
  { id: "universal", label: "Universal", count: 35 },
  { id: "honda", label: "Honda", count: 12 },
  { id: "toyota", label: "Toyota", count: 15 },
  { id: "nissan", label: "Nissan", count: 8 },
  { id: "ford", label: "Ford", count: 6 },
  { id: "chevrolet", label: "Chevrolet", count: 7 },
  { id: "bmw", label: "BMW", count: 5 },
  { id: "audi", label: "Audi", count: 4 },
  { id: "mercedes", label: "Mercedes-Benz", count: 3 },
  { id: "volkswagen", label: "Volkswagen", count: 6 },
  { id: "mazda", label: "Mazda", count: 4 },
  { id: "fiat", label: "Fiat", count: 3 },
  { id: "suv", label: "SUV", count: 8 },
  { id: "pickup", label: "Pickup", count: 6 },
  { id: "sedan", label: "Sedán", count: 10 },
  { id: "hatchback", label: "Hatchback", count: 8 }
];

export function FilterPanel({ filters, onFiltersChange, isMobile = false, isServiceMode = false }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    brand: false,
    compatibility: false
  });

  const categories = isServiceMode ? serviceCategories : productCategories;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(c => c !== categoryId);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brand, brandId]
      : filters.brand.filter(b => b !== brandId);
    
    onFiltersChange({
      ...filters,
      brand: newBrands
    });
  };

  const handleCompatibilityChange = (compatId: string, checked: boolean) => {
    const newCompat = checked
      ? [...filters.compatibility, compatId]
      : filters.compatibility.filter(c => c !== compatId);
    
    onFiltersChange({
      ...filters,
      compatibility: newCompat
    });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: rating === filters.minRating ? 0 : rating
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 500] as [number, number],
      minRating: 0,
      brand: [],
      compatibility: []
    });
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           (isServiceMode ? 0 : filters.brand.length + filters.compatibility.length) +
           (filters.minRating > 0 ? 1 : 0) +
           (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0);
  };

  return (
    <Card className={`w-80 ${isMobile ? "border-0 shadow-none" : ""}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} activos
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Categorías */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('categories')}
          >
            {isServiceMode ? "Tipos de Servicio" : "Categorías"}
            <span className={`transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </Button>
          
          {expandedSections.categories && (
            <div className="space-y-3 mt-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={category.id} className="text-sm cursor-pointer">
                      {category.label}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Rango de precio */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('price')}
          >
            Precio
            <span className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </Button>
          
          {expandedSections.price && (
            <div className="space-y-4 mt-3">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={500}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Calificación */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection('rating')}
          >
            Calificación
            <span className={`transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </Button>
          
          {expandedSections.rating && (
            <div className="space-y-2 mt-3">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  className={`flex items-center space-x-2 w-full p-2 rounded text-left hover:bg-muted transition-colors ${
                    filters.minRating === rating ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleRatingChange(rating)}
                >
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= rating 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">y más</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Solo mostrar marcas y compatibilidad para productos, no para servicios */}
        {!isServiceMode && (
          <>
            <Separator />

            {/* Marcas */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium"
                onClick={() => toggleSection('brand')}
              >
                Marcas
                <span className={`transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`}>
                  ↓
                </span>
              </Button>
              
              {expandedSections.brand && (
                <div className="space-y-3 mt-3 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={brand.id}
                          checked={filters.brand.includes(brand.id)}
                          onCheckedChange={(checked) => 
                            handleBrandChange(brand.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={brand.id} className="text-sm cursor-pointer">
                          {brand.label}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {brand.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Compatibilidad */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium"
                onClick={() => toggleSection('compatibility')}
              >
                Compatibilidad
                <span className={`transition-transform ${expandedSections.compatibility ? 'rotate-180' : ''}`}>
                  ↓
                </span>
              </Button>
              
              {expandedSections.compatibility && (
                <div className="space-y-3 mt-3 max-h-48 overflow-y-auto">
                  {compatibility.map((compat) => (
                    <div key={compat.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={compat.id}
                          checked={filters.compatibility.includes(compat.id)}
                          onCheckedChange={(checked) => 
                            handleCompatibilityChange(compat.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={compat.id} className="text-sm cursor-pointer">
                          {compat.label}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {compat.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}