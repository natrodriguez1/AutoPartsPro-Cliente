import type { Product, ProductCompatibility } from "../types/product";
import type { Carro } from "@/app/types/auth";

export function getProductCompatibility(
  product: Product,
  userCars: Carro[] = []
): ProductCompatibility {
  const compatibilityList = product.compatibility ?? [];

  // 1) ¿Es universal?
  const isUniversal = compatibilityList.some(
    (compat) => compat.toLowerCase() === "universal"
  );

  // Si no hay carros del usuario, solo devolvemos si es universal
  if (!userCars.length) {
    return {
      isUniversal,
      isSpecificCompatible: false,
      matchedCars: [],
    };
  }

  const matchedCars: Carro[] = [];

  for (const car of userCars) {
    const carBrand = car.marca?.toLowerCase() ?? "";
    const carModel = car.modelo?.toLowerCase() ?? "";

    if (!carBrand && !carModel) continue;

    const isSpecificCompatible = compatibilityList.some((compat) => {
      const compatLower = compat.toLowerCase();
      if (compatLower === "universal") return false;

      return (
        (carBrand &&
          (compatLower === carBrand || compatLower.includes(carBrand))) ||
        (carModel &&
          (compatLower === carModel || compatLower.includes(carModel)))
      );
    });

    if (isSpecificCompatible) {
      matchedCars.push(car);
    }
  }

  return {
    isUniversal,
    isSpecificCompatible: matchedCars.length > 0,
    matchedCars,
  };
}