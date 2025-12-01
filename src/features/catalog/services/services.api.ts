import api from "@/shared/lib/axios";
import { servicesMock } from "../data/services.mock";

export async function fetchServices() {
  // ✅ hoy:
  return servicesMock;

  // 🔜 mañana:
  // const { data } = await api.get("/services");
  // return data;
}

export async function fetchServiceById(id: string) {
  // ✅ hoy:
  return servicesMock.find((s) => s.id === id) ?? null;

  // 🔜 mañana:
  // const { data } = await api.get(`/services/${id}`);
  // return data;
}