import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cart.store";
import { CheckoutView } from "../components/CheckoutView";

export function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);

  // Guard: si no hay items, no se puede entrar
  useEffect(() => {
    if (items.length === 0) {
      navigate("/carrito", { replace: true });
    }
  }, [items.length, navigate]);

  const onRegresar = useCallback(() => {
    navigate(-1); // o navigate("/carrito")
  }, [navigate]);

  /**
   * Backend-ready:
   * aquí luego reemplazas por "crear orden" / "confirmar pago" con API,
   * y cuando el backend responda OK recién limpias carrito + navegas.
   */
  const onCompletado = useCallback(() => {
    clearCart();
    navigate("/perfil", { replace: true });
  }, [clearCart, navigate]);

  if (items.length === 0) return null;

  return (
    <CheckoutView
      items={items}
      onRegresar={onRegresar}
      onCompletado={onCompletado}
    />
  );
}
