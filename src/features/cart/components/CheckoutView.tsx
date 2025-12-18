import { useMemo, useState, useEffect } from "react";
import type { CartItem } from "../types/cart";
import type { PaymentMethod, SavedAddress, SavedCard, ShippingMethod } from "../types/checkout";

import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";
import { motion } from "motion/react";

import { savedAddresses } from "../data/checkoutAddresses";
import { savedCards } from "../data/checkoutCards";

import { CheckoutStepsIndicator } from "./checkout/CheckoutStepsIndicator";
import { CheckoutOrderSummary } from "./checkout/CheckoutOrderSummary";
import { CheckoutTrustInfo } from "./checkout/CheckoutTrustInfo";
import { StepShippingAddress } from "./checkout/StepShippingAddress";
import { StepShippingMethod } from "./checkout/StepShippingMethod";
import { StepPaymentMethod } from "./checkout/StepPaymentMethod";
import { StepConfirmOrder } from "./checkout/StepConfirmOrder";
import { AddressDialog } from "./checkout/AddressDialog";
import { useCheckout } from "../hooks/useCheckout";
import { useCart } from "../store/cart.store";
import { DiscountCodeCard } from "./DiscountCodeCard";
import { DISCOUNT_CODES } from "../data/discountCodes";

export interface CheckoutViewProps {
  items: CartItem[];
  onRegresar: () => void;
  onCompletado: () => void;

  /** Backend-ready: si luego quieres inyectar data real desde API */
  addresses?: SavedAddress[];
  cards?: SavedCard[];

  /** Backend-ready: si luego quieres procesar con API real desde afuera */
  onProcessPayment?: () => Promise<void>;
}

export function CheckoutView({
  items,
  onRegresar,
  onCompletado,
  addresses: addressesProp,
  cards: cardsProp,
  onProcessPayment,
}: CheckoutViewProps) {

  const [addresses, setAddresses] = useState<SavedAddress[]>(addressesProp ?? savedAddresses);
  const cards = cardsProp ?? savedCards;

  const [addrOpen, setAddrOpen] = useState(false);
  const [addrMode, setAddrMode] = useState<"create" | "edit">("create");
  const [addrEditing, setAddrEditing] = useState<SavedAddress | undefined>(undefined);

  const discountPercentage = useCart((s) => s.discountPercentage);
  const discountCode = useCart((s) => s.discountCode);
  const applyDiscount = useCart((s) => s.applyDiscount);
  const clearDiscount = useCart((s) => s.clearDiscount);

  const [codigoDescuento, setCodigoDescuento] = useState(discountCode);
  useEffect(() => setCodigoDescuento(discountCode), [discountCode]);

  const aplicarDescuento = () => {
    const res = applyDiscount(codigoDescuento);
    if (!res.ok) return toast.error("Código de descuento inválido");
    toast.success(`¡Descuento del ${res.percentage}% aplicado!`);
  };

  const onClearDiscount = () => {
    clearDiscount();
    setCodigoDescuento("");
    toast.message("Descuento removido");
  };

  const openCreateAddress = () => {
    setAddrMode("create");
    setAddrEditing(undefined);
    setAddrOpen(true);
  };

  const openEditAddress = (a: SavedAddress) => {
    setAddrMode("edit");
    setAddrEditing(a);
    setAddrOpen(true);
  };

  const saveAddress = (a: SavedAddress) => {
    setAddresses((prev) => {
      let next =
        addrMode === "create"
          ? [a, ...prev]
          : prev.map((x) => (x.id === a.id ? a : x));

      // si esta es principal => las demás dejan de ser principal
      if (a.principal) {
        next = next.map((x) => (x.id === a.id ? x : { ...x, principal: false }));
      }

      return next;
    });

    setDireccionSeleccionada(a.id);
  };

  const [pasoActual, setPasoActual] = useState(1);

  const [direccionSeleccionada, setDireccionSeleccionada] = useState(addresses[0]?.id ?? "1");
  const [metodoEnvio, setMetodoEnvio] = useState<ShippingMethod>("standard");
  const [metodoPago, setMetodoPago] = useState<PaymentMethod>("tarjeta");
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(cards[0]?.id ?? "1");

  const { subtotal, discount, shippingCost, total, processing, submit } = useCheckout({
    items,
    shippingMethod: metodoEnvio,
    discountPercentage,
    discountCode,
  });


  // Datos nueva tarjeta (backend-ready: luego se mandan al servidor/tokenización)
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);

  const selectedAddress = useMemo(
    () => addresses.find((d) => d.id === direccionSeleccionada),
    [addresses, direccionSeleccionada]
  );

  const selectedCard = useMemo(
    () => cards.find((c) => c.id === tarjetaSeleccionada),
    [cards, tarjetaSeleccionada]
  );

  const procesarPago = async () => {
    try {
      await submit({
        addressId: direccionSeleccionada,
        paymentMethod: metodoPago,
        selectedCardId: metodoPago === "tarjeta" ? tarjetaSeleccionada : undefined,
        newCard: metodoPago === "tarjeta" && numeroTarjeta
          ? {
              number: numeroTarjeta,
              exp: fechaExpiracion,
              cvv,
              holderName: nombreTitular,
              save: guardarTarjeta,
            }
          : undefined,
      });

      toast.success("¡Pago procesado exitosamente!");
      toast.success("Recibirás confirmación por email");
      setTimeout(() => onCompletado(), 800);
    } catch {
      toast.error("Error al procesar el pago");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onRegresar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Carrito
        </Button>
        <h1>Finalizar Compra</h1>
      </div>

      <CheckoutStepsIndicator currentStep={pasoActual} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CONTENIDO PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          {pasoActual === 1 && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <StepShippingAddress
                addresses={addresses}
                selectedId={direccionSeleccionada}
                onSelect={setDireccionSeleccionada}
                onAddNew={openCreateAddress}
                onEdit={openEditAddress}
                onNext={() => setPasoActual(2)}
              />
            </motion.div>
          )}

          {pasoActual === 2 && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <StepShippingMethod
                subtotal={subtotal}
                method={metodoEnvio}
                onChange={setMetodoEnvio}
                onBack={() => setPasoActual(1)}
                onNext={() => setPasoActual(3)}
              />
            </motion.div>
          )}

          {pasoActual === 3 && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <StepPaymentMethod
                cards={cards}
                paymentMethod={metodoPago}
                onPaymentMethodChange={setMetodoPago}
                selectedCardId={tarjetaSeleccionada}
                onSelectedCardChange={setTarjetaSeleccionada}
                numeroTarjeta={numeroTarjeta}
                setNumeroTarjeta={setNumeroTarjeta}
                fechaExpiracion={fechaExpiracion}
                setFechaExpiracion={setFechaExpiracion}
                cvv={cvv}
                setCvv={setCvv}
                nombreTitular={nombreTitular}
                setNombreTitular={setNombreTitular}
                guardarTarjeta={guardarTarjeta}
                setGuardarTarjeta={setGuardarTarjeta}
                onBack={() => setPasoActual(2)}
                onNext={() => setPasoActual(4)}
              />
            </motion.div>
          )}

          {pasoActual === 4 && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <StepConfirmOrder
                address={selectedAddress}
                shippingMethod={metodoEnvio}
                paymentMethod={metodoPago}
                selectedCard={selectedCard}
                total={total}
                processing={processing}
                onBack={() => setPasoActual(3)}
                onPay={procesarPago}
              />
            </motion.div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <DiscountCodeCard
            code={codigoDescuento}
            onCodeChange={setCodigoDescuento}
            onApply={aplicarDescuento}
            onClear={onClearDiscount}
            appliedPercent={discountPercentage}
            codes={DISCOUNT_CODES}
          />
          <CheckoutOrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} total={total} />
          <CheckoutTrustInfo />
        </div>
      </div>
      <AddressDialog
        open={addrOpen}
        onOpenChange={setAddrOpen}
        mode={addrMode}
        initial={addrEditing}
        onSave={saveAddress}
      />
    </div>
    
  );
}
