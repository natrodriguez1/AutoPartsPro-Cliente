import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cart.store";
import type { CartItem } from "../types/cart";
import { CheckoutView } from "../components/CheckoutView";

export function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCart((s) => s.items) as CartItem[];
  const clearCart = useCart((s) => s.clear);

  // ✅ Guard: si no hay items, no se puede entrar
  useEffect(() => {
    if (items.length === 0) {
      navigate("/carrito", { replace: true });
    }
  }, [items.length, navigate]);

  const onRegresar = () => navigate(-1); // o navigate("/carrito")
  const onCompletado = () => {
    clearCart();
    navigate("/perfil", { replace: true });
  };

  if (items.length === 0) return null;

  return <CheckoutView items={items} onRegresar={onRegresar} onCompletado={onCompletado} />;
}
