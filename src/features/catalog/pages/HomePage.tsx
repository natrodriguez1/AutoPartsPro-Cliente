import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { toast } from "sonner";

import { useCart } from "@/features/cart/store/cart.store";
import { useAuth } from "@/app/providers/AuthContext";

import { getProducts } from "@/features/catalog/services/products.service";
import { getServices } from "../services/services.service";

import type { Product} from "../types/product";
import type { Service} from "../types/service";
import type { SortOption } from "../components/SortDropdown";

import { ProductsSection } from "../components/ProductsSection";
import { ServicesSection } from "../components/ServicesSection";
import { FeaturedWorkshopsSection } from "../components/HomeFeaturedWorkshops";

import { useProductFilters } from "../hooks/useProductFilters";
import { useServiceFilters } from "../hooks/useServiceFilters";

export function HomePage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [tabActiva, setTabActiva] = useState<"productos" | "servicios">(
    "productos"
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Carros del usuario (para relevancia de productos)
  const carrosUsuario = usuario?.carros || [];

  // --- Fetch de productos ---
  useEffect(() => {
    let alive = true;

    getProducts()
      .then((data) => {
        if (alive) setProducts(data);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        // aquí podrías setear un estado de error si quieres
      });

    return () => {
      alive = false;
    };
  }, []);

  // --- Fetch de servicios ---
  useEffect(() => {
    let alive = true;

    getServices()
      .then((data) => {
        if (alive) setServices(data);
      })
      .catch((error) => {
        console.error("Error cargando servicios:", error);
      });

    return () => {
      alive = false;
    };
  }, []);

  // --- Filtros de productos ---
  const {
    filters: productFilters,
    setFilters: setProductFilters,
    items: filteredAndSortedProducts,
    clearFilters: clearProductFilters,
  } = useProductFilters(products, carrosUsuario, sortBy);

  // --- Filtros de servicios ---
  const {
    filters: serviceFilters,
    setFilters: setServiceFilters,
    items: filteredAndSortedServices,
    clearFilters: clearServiceFilters,
  } = useServiceFilters(services, sortBy);

  // --- Carrito y wishlist ---
  const wishlistItems = useCart((s) => s.wishlistItems);
  const toggleWishlist = useCart((s) => s.toggleWishlist);
  const cartItems = useCart((s) => s.items);
  const addToCart = useCart((s) => s.add);

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.id === productId);

  const handleWishlistToggle = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const alreadyInWishlist = isInWishlist(productId);
    toggleWishlist(product);

    toast.success(
      alreadyInWishlist
        ? `${product.name} eliminado de favoritos`
        : `${product.name} agregado a favoritos`
    );
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const isInCart = cartItems.some((item) => item.id === productId);
    addToCart(product, 1);

    toast.success(
      isInCart
        ? `Se aumentó la cantidad de ${product.name}`
        : `${product.name} agregado al carrito`
    );
  };

  // --- Navegación ---
  const handleVerPerfil = (tallerId: string) =>
    navigate(`/perfilTaller/${tallerId}`);

  const handleVerProducto = (productoId: string) =>
    navigate(`/productos/${productoId}`);

  const handleVerServicio = (servicioId: string) =>
    navigate(`/servicios/${servicioId}`);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Sección de talleres destacados */}
      <FeaturedWorkshopsSection onVerPerfil={handleVerPerfil} />

      {/* Tabs Productos / Servicios */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="mb-6">
          <TabsTrigger value="productos">
            Repuestos ({filteredAndSortedProducts.length})
          </TabsTrigger>
          <TabsTrigger value="servicios">
            Servicios ({filteredAndSortedServices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productos">
          <ProductsSection
            products={filteredAndSortedProducts}
            filters={productFilters}
            onFiltersChange={setProductFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isInWishlist={isInWishlist}
            onToggleWishlist={handleWishlistToggle}
            onAddToCart={handleAddToCart}
            onVerProducto={handleVerProducto}
            userCars={carrosUsuario}
          />
        </TabsContent>

        <TabsContent value="servicios">
          <ServicesSection
            services={filteredAndSortedServices}
            filters={serviceFilters}
            onFiltersChange={setServiceFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onVerServicio={handleVerServicio}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
