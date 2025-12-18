import api from "@/shared/lib/axios";
import type { Product } from "../types/product";
import { productsMock } from "../data/product.mock";

// 👇 Cambia esto a false cuando ya tengas el backend listo
const USE_MOCKS = true;

/**
 * Devuelve todos los productos del catálogo.
 * - MODO mock: usa productsMock
 * - MODO api: consulta al backend
 */
export async function getProducts(): Promise<Product[]> {
  if (USE_MOCKS) {
    // productsMock ya tiene la forma de Product
    return productsMock as Product[];
  }

  const { data } = await api.get<Product[]>("/products");
  return data;
}

/**
 * Devuelve el detalle de un producto por id.
 * - MODO mock: busca en productsMock
 * - MODO api: consulta al backend
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (USE_MOCKS) {
    const normalizedId = String(id);
    const found = (productsMock as Product[]).find(
      (p) => String(p.id) === normalizedId
    );
    return found ?? null;
  }

  try {
    const { data } = await api.get<Product>(`/products/${id}`);
    // por si acaso el backend responde 200 pero sin data usable
    return data ?? null;
  } catch (error) {
    console.error("Error obteniendo producto por id:", error);
    return null;
  }
}
