import { productsMock } from "../data/product.mock";

export function getProductByParamId(paramId: string) {
  const id = String(paramId);

  return productsMock.find((p) => {
    const candidates = [
      p?.id
    ]
      .filter(Boolean)
      .map(String);

    return candidates.includes(id);
  });
}