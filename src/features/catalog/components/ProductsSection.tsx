import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";

import { FilterPanel } from "./FilterPanel";
import { SortDropdown, SortOption } from "./SortDropdown";
import { ProductCard } from "./ProductCard";

import type { Product, ProductFilter } from "../types/product";
import { Carro } from "@/app/types/auth";

interface ProductsSectionProps {
  products: Product[];
  filters: ProductFilter;
  onFiltersChange: (filters: ProductFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  isInWishlist: (productId: string) => boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onVerProducto: (productId: string) => void;
  userCars: Carro[]; // si luego defines un tipo Car, lo cambiamos aquí
}

export function ProductsSection({
  products,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onVerProducto,
  userCars,
}: ProductsSectionProps) {
  return (
    <div className="flex gap-6">
      {/* Panel de filtros (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <FilterPanel filters={filters} onFiltersChange={onFiltersChange} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        {/* Barra de controles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1>
              Repuestos Automotrices ({products.length})
            </h1>

            {/* Filtros (mobile) */}
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
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4">
            {/* Vista grid/list */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Ordenamiento */}
            <SortDropdown value={sortBy} onChange={onSortChange} />
          </div>
        </div>

        {/* Grid de productos */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron repuestos que coincidan con tus filtros.
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
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => onAddToCart(product.id)}
                onWishlistToggle={() => onToggleWishlist(product.id)}
                onVerProducto={() => onVerProducto(product.id)}
                isInWishlist={isInWishlist(product.id)}
                viewMode={viewMode}
                userCars={userCars}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
