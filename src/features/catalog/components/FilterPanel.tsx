import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Badge } from "@/shared/ui/badge";
import { Star, X, Filter } from "lucide-react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { productCategories } from "../data/product.mock";
import { brands, compatibility } from "../data/brand.mock";
import { serviceCategories } from "../data/services.mock";
import type { BaseFilters } from "../types/filters";

interface FilterPanelProps {
  filters: BaseFilters;
  onFiltersChange: (filters: any) => void;
  isMobile?: boolean;
  isServiceMode?: boolean;
}


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
                      onCheckedChange={(checked: CheckedState) =>
                        handleCategoryChange(category.id, checked === true)
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
                          onCheckedChange={(checked: CheckedState) => 
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
                          onCheckedChange={(checked: CheckedState) => 
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