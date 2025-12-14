import type { Workshop } from "../types/workshop";
import { toast } from "sonner";

export function openWorkshopWhatsapp(taller: Workshop) {
  if (!taller.whatsapp) {
    toast.error("No se pudo iniciar el chat ni contactar por WhatsApp");
    return;
  }

  const mensaje = encodeURIComponent(
    `Hola ${taller.nombre}, estoy interesado en sus servicios de ${taller.especialidad}. ¿Podrían ayudarme?`
  );

  window.open(
    `https://wa.me/${taller.whatsapp.replace(/[^0-9]/g, "")}?text=${mensaje}`,
    "_blank"
  );

  toast.success(`Abriendo WhatsApp para contactar ${taller.nombre}`);
}