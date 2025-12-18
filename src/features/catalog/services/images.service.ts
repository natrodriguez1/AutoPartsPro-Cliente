import api from "@/shared/lib/axios";
import type { ImageDTO, ProductImageLinkDTO } from "../types/image";

const PRODUCT_IMAGES_LIMIT = 10000; // ajusta si necesitas

export async function getImages(): Promise<ImageDTO[]> {
  const { data } = await api.get<ImageDTO[]>("/images/");
  return data;
}

export async function getProductImageLinks(): Promise<ProductImageLinkDTO[]> {
  const { data } = await api.get<ProductImageLinkDTO[]>(
    `/product-images/?skip=0&limit=${PRODUCT_IMAGES_LIMIT}`
  );
  return data;
}

/**
 * Map productId(string) -> array de urls
 */
export async function getProductImagesMap(): Promise<Map<string, string[]>> {
  const [links, images] = await Promise.all([getProductImageLinks(), getImages()]);

  const urlByImageId = new Map<number, string>(
    images.map((img) => [img.id, img.url])
  );

  const map = new Map<string, string[]>();

  for (const link of links) {
    const pid = String(link.product_id);
    const url = urlByImageId.get(link.image_id);
    if (!url) continue;

    const arr = map.get(pid) ?? [];
    arr.push(url);
    map.set(pid, arr);
  }

  return map;
}
