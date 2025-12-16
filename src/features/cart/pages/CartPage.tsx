import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useCart } from "../store/cart.store";
import { availableProducts } from "../data/availableProducts";
import { DISCOUNT_CODES } from "../data/discountCodes";

import { Card, CardContent} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import {
  ArrowLeft,
  Heart,
  Search,
} from "lucide-react";

import { toast } from "sonner";
import { motion } from "motion/react";

import { CartEmptyState } from "../components/CartEmptyState";
import { RemovedItemsNoticeList } from "../components/RemovedItemsNoticeList";
import { CartItemCard } from "../components/CartItemCard";
import { WishlistItemCard } from "../components/WishlistItemCard";
import { SearchProductCard } from "../components/SearchProductCard";
import { useCartTotals } from "../hooks/useCartTotals";

import { DiscountCodeCard } from "../components/DiscountCodeCard";
import { OrderSummaryCard } from "../components/sidebar/OrderSummaryCard";
import { CheckoutBenefitsCard } from "../components/sidebar/CheckoutBenefitsCard";

export function CartPage() {
  const navigate = useNavigate();

  const {
    items,
    wishlistItems,
    itemsEliminados,
    add,
    remove,
    restore,
    updateQty,
    toggleWishlist,
  } = useCart(
    useShallow((s) => ({
      items: s.items,
      wishlistItems: s.wishlistItems,
      itemsEliminados: s.itemsEliminados,
      add: s.add,
      remove: s.remove,
      restore: s.restore,
      updateQty: s.updateQty,
      toggleWishlist: s.toggleWishlist,
    }))
  );

  const onRegresar = () => navigate(-1);
  const onIrCheckout = () => navigate("/checkout");

  const discountPercentage = useCart((s) => s.discountPercentage);
  const discountCode = useCart((s) => s.discountCode);
  const applyDiscount = useCart((s) => s.applyDiscount);
  const clearDiscount = useCart((s) => s.clearDiscount);

  const [codigoDescuento, setCodigoDescuento] = useState(discountCode);
  
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [tabActiva, setTabActiva] = useState("carrito");

  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      remove(id);
      return;
    }
    updateQty(id, nuevaCantidad);
  };

  useEffect(() => {
    setCodigoDescuento(discountCode);
  }, [discountCode]);

  const aplicarDescuento = () => {
    const res = applyDiscount(codigoDescuento);
    if (!res.ok) {
      toast.error("Código de descuento inválido");
      return;
    }
    toast.success(`¡Descuento del ${res.percentage}% aplicado!`);
  };


  const onClearDiscount = () => {
    clearDiscount();
    setCodigoDescuento(""); // si tu input es local
    toast.message("Descuento removido");
  };

  const productosFiltrados = useMemo(() => {
    const q = busquedaProducto.trim().toLowerCase();
    if (!q) return availableProducts;
    return availableProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [busquedaProducto]);

  const { subtotal, descuento, envio, total } = useCartTotals(items, discountPercentage);

  const wishlistIds = useMemo(() => new Set(wishlistItems.map((x) => x.id)), [wishlistItems]);

  if (items.length === 0 && wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onRegresar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1>Mi Carrito</h1>
        </div>

        <CartEmptyState onContinue={onRegresar} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continuar Comprando
        </Button>
        <h1>Mi Carrito</h1>
      </div>

      {/* Notificaciones de items eliminados */}
      <RemovedItemsNoticeList items={itemsEliminados} onUndo={restore} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <Tabs value={tabActiva} onValueChange={setTabActiva}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="carrito">Carrito ({items.length})</TabsTrigger>
              <TabsTrigger value="wishlist">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos ({wishlistItems.length})
              </TabsTrigger>
              <TabsTrigger value="buscar">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carrito" className="mt-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <CartItemCard
                      item={item}
                      isWishlisted={wishlistIds.has(item.id)}
                      onChangeQty={actualizarCantidad}
                      onRemove={remove}
                      onToggleWishlist={toggleWishlist}
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <div className="space-y-4">
                {wishlistItems.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-medium mb-2">Tu lista de deseos está vacía</h3>
                      <p className="text-muted-foreground text-sm">
                        Agrega productos a favoritos para verlos aquí
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  wishlistItems.map((item) => (
                    <WishlistItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={(p) => add(p)}
                      onRemoveFromWishlist={(p) => toggleWishlist(p)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="buscar" className="mt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar más productos..."
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  {productosFiltrados.map((producto) => (
                    <SearchProductCard
                      key={producto.id}
                      product={producto}
                      isWishlisted={wishlistIds.has(producto.id)}
                      onAdd={(p) => {
                        add(p);
                        toast.success(`${p.name} agregado al carrito`);
                      }}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}

                  {busquedaProducto && productosFiltrados.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-medium mb-2">No se encontraron productos</h3>
                        <p className="text-muted-foreground text-sm">
                          Intenta con otros términos de búsqueda
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel lateral - Solo visible si hay items */}
        {items.length > 0 && (
          <div className="space-y-4">
            <DiscountCodeCard
              code={codigoDescuento}
              onCodeChange={setCodigoDescuento}
              onApply={aplicarDescuento}
              onClear={onClearDiscount}
              appliedPercent={discountPercentage}
              codes={DISCOUNT_CODES}
            />

            <OrderSummaryCard
              itemsCount={items.length}
              subtotal={subtotal}
              discountPercent={discountPercentage}
              discountAmount={descuento}
              shippingCost={envio}
              total={total}
              onCheckout={onIrCheckout}
            />

            <CheckoutBenefitsCard />
          </div>
        )}
      </div>
    </div>
  );
}
