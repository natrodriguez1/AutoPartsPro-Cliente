import type { Service } from "../types/service";
import { servicesMock } from "../data/services.mock";
import api from "@/shared/lib/axios";

// 👇 Cambia esto a false cuando ya tengas el backend listo
const USE_MOCKS = true;


/**
 * Devuelve todos los productos del catálogo.
 * - MODO mock: usa productsMock
 * - MODO api: consulta al backend
 */
export async function getServices(): Promise<Service[]> {
  if (USE_MOCKS) {
    return servicesMock as Service[];
  }

  const { data } = await api.get<Service[]>("/services");
  return data;
}

/**
 * Devuelve el detalle de un servicio por id.
 * - MODO mock: busca en productsMock
 * - MODO api: consulta al backend
 */
export async function getServiceById(
  id: string
): Promise<Service | null> {
  if (USE_MOCKS) {
    const normalizedId = String(id);
    const found = (servicesMock as Service[]).find(
      (p) => String(p.id) === normalizedId
    );
    return found ?? null;
  }

  try{
    const { data } = await api.get<Service>(`/services/${id}`);
    return data ?? null;
  }catch(error){
    console.error("Error obteniendo producto por id:", error);
    return null;
  }
}