import api from "@/shared/lib/axios";
import type { Product } from "../types/product";
import { productsMock } from "../data/product.mock";
import { getProductImagesMap } from "./images.service";

const USE_MOCKS = false;

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCKS) return productsMock as Product[];

  const [{ data: products }, imagesMap] = await Promise.all([
    api.get<Product[]>("/products/"),
    getProductImagesMap(),
  ]);

  return products.map((p) => {
    const imgs = imagesMap.get(String(p.id)) ?? [];
    return {
      ...p,
      images: imgs,
      image: imgs[0] ?? p.image, // card usa la primera si existe
    };
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  if (USE_MOCKS) {
    const found = (productsMock as Product[]).find((p) => String(p.id) === String(id));
    return found ?? null;
  }

  try {
    const [{ data: product }, imagesMap] = await Promise.all([
      api.get<Product>(`/products/${id}/`), // <-- slash final
      getProductImagesMap(),
    ]);

    const imgs = imagesMap.get(String(product.id)) ?? [];

    return {
      ...product,
      images: imgs,
      image: imgs[0] ?? product.image,
    };
  } catch (error) {
    console.error("Error obteniendo producto por id:", error);
    return null;
  }
}
