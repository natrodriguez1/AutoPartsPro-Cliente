import api from "@/shared/lib/axios";
import { productsMock } from "../data/product.mock";

export async function fetchProducts() {
  // ✅ Por ahora mock:
  return productsMock;

  // 🔜 Cuando tengan backend:
  // const { data } = await api.get("/products");
  // return data;
}