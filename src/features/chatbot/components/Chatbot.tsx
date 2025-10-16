import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Bot,
  MapPin,
  Star,
  Phone,
  Wrench,
  Car,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Mensaje {
  id: string;
  tipo: "usuario" | "bot";
  contenido: string;
  timestamp: Date;
  opciones?: Array<{
    label: string;
    accion: () => void;
  }>;
  talleres?: Array<{
    id: string;
    nombre: string;
    especialidad: string;
    rating: number;
    distancia: string;
    telefono: string;
  }>;
  productos?: Array<{
    id: string;
    nombre: string;
    precio: number;
    categoria: string;
  }>;
}

// Base de conocimiento automotriz expandida
const conocimientoAutomotriz = {
  sintomas: {
    "ruido frenos": {
      diagnostico: "Posible desgaste de pastillas de freno",
      solucion: "Inspección y cambio de pastillas/discos",
      urgencia: "alta",
      talleres: ["TallerPro Guayaquil"],
      productos: ["Pastillas de Freno Cerámicas Premium Bosch", "Discos de Freno Ventilados Brembo"]
    },
    "motor no enciende": {
      diagnostico: "Problema en sistema de arranque o combustible",
      solucion: "Revisar batería, bujías y bomba de combustible",
      urgencia: "alta",
      talleres: ["AutoMaster Quito"],
      productos: ["Batería Bosch S4 12V 60Ah", "Bujías de Encendido NGK Iridium"]
    },
    "vibracion volante": {
      diagnostico: "Problema en sistema de dirección o balanceado",
      solucion: "Balanceado de llantas y revisión de suspensión",
      urgencia: "media",
      talleres: ["MecánicaTotal Cuenca"],
      productos: ["Neumáticos Urbanos Bridgestone", "Amortiguadores Monroe Gas-Matic"]
    },
    "aceite negro": {
      diagnostico: "Aceite de motor vencido o contaminado",
      solucion: "Cambio de aceite y filtro inmediato",
      urgencia: "media",
      talleres: ["AutoMaster Quito"],
      productos: ["Aceite de Motor Sintético Mobil 1", "Filtro de Aire K&N Performance"]
    },
    "luces debiles": {
      diagnostico: "Problema en sistema eléctrico o focos",
      solucion: "Revisar batería y cambiar a LED",
      urgencia: "baja",
      talleres: ["TallerPro Guayaquil"],
      productos: ["Kit de Conversión LED para Faros", "Batería Bosch S4 12V 60Ah"]
    }
  },
  
  mantenimiento: {
    "cada_5000km": [
      "Cambio de aceite de motor",
      "Revisión de filtro de aire",
      "Inspección de frenos",
      "Verificación de niveles de fluidos"
    ],
    "cada_10000km": [
      "Cambio de filtro de aceite",
      "Rotación de neumáticos",
      "Inspección de suspensión",
      "Revisión de batería"
    ],
    "cada_20000km": [
      "Cambio de filtro de aire",
      "Cambio de bujías",
      "Alineación y balanceado",
      "Inspección de correa de distribución"
    ]
  },

  talleresPorEspecialidad: {
    "frenos": "TallerPro Guayaquil - Especialistas en sistemas de frenado con tecnología europea",
    "motor": "AutoMaster Quito - Expertos en diagnóstico computarizado y reparación de motores",
    "suspension": "MecánicaTotal Cuenca - Líderes en suspensión, alineación 3D y dirección",
    "electrico": "TallerPro Guayaquil - Sistemas eléctricos y conversión a LED",
    "transmision": "AutoMaster Quito - Reparación de cajas automáticas y manuales"
  }
};

const talleresBD = [
  {
    id: "1",
    nombre: "AutoMaster Quito",
    especialidad: "Motor y Transmisión",
    rating: 4.8,
    distancia: "2.3 km",
    telefono: "+593 2 245-6789",
    reseñas: [
      "Excelente diagnóstico computarizado, encontraron la falla que otros no pudieron",
      "Muy profesionales y explican todo detalladamente",
      "Buenos precios y trabajo garantizado por 6 meses"
    ],
    servicios: ["Diagnóstico computarizado", "Reparación de motores", "Cambio de aceite", "Transmisión automática"],
    horarios: "Lun-Vie 8:00-18:00, Sáb 8:00-16:00",
    experiencia: "15 años"
  },
  {
    id: "2",
    nombre: "TallerPro Guayaquil",
    especialidad: "Sistema de Frenos y Eléctrico",
    rating: 4.6,
    distancia: "3.1 km",
    telefono: "+593 4 289-3456",
    reseñas: [
      "Los mejores en frenos, especialistas en carros europeos",
      "Trabajo garantizado y usan repuestos originales",
      "Atención rápida, terminaron en el tiempo prometido"
    ],
    servicios: ["Cambio de pastillas", "Rectificado de discos", "Sistema ABS", "Instalación LED"],
    horarios: "Lun-Vie 7:30-19:00, Sáb 8:00-17:00",
    experiencia: "12 años"
  },
  {
    id: "3",
    nombre: "MecánicaTotal Cuenca",
    especialidad: "Suspensión y Dirección",
    rating: 4.7,
    distancia: "4.5 km",
    telefono: "+593 7 405-7890",
    reseñas: [
      "Alineación 3D perfecta, el carro maneja como nuevo",
      "Personal muy capacitado en suspensión deportiva",
      "Precios justos y siempre cumplen con los tiempos"
    ],
    servicios: ["Amortiguadores", "Alineación 3D", "Balanceado", "Dirección hidráulica"],
    horarios: "Lun-Vie 8:00-17:30, Sáb 8:00-15:00",
    experiencia: "18 años"
  }
];

// Base de datos de productos
const productosBD = [
  {
    id: "1",
    nombre: "Pastillas de Freno Cerámicas Premium Bosch",
    precio: 120,
    categoria: "frenos",
    marca: "Bosch",
    descripcion: "Pastillas de alta performance para frenado superior",
    disponible: true
  },
  {
    id: "2", 
    nombre: "Aceite de Motor Sintético Mobil 1",
    precio: 45,
    categoria: "lubricantes",
    marca: "Mobil",
    descripcion: "Aceite sintético premium 5W-30",
    disponible: true
  },
  {
    id: "3",
    nombre: "Batería Bosch S4 12V 60Ah",
    precio: 95,
    categoria: "electrico",
    marca: "Bosch", 
    descripcion: "Batería de arranque libre de mantenimiento",
    disponible: true
  },
  {
    id: "4",
    nombre: "Amortiguadores Monroe Gas-Matic",
    precio: 140,
    categoria: "suspension",
    marca: "Monroe",
    descripcion: "Amortiguadores de gas para mejor estabilidad",
    disponible: true
  },
  {
    id: "5",
    nombre: "Neumáticos Urbanos Bridgestone",
    precio: 180,
    categoria: "neumaticos",
    marca: "Bridgestone",
    descripcion: "Neumáticos 205/55R16 para ciudad",
    disponible: true
  },
  {
    id: "6",
    nombre: "Kit de Conversión LED para Faros",
    precio: 85,
    categoria: "electrico",
    marca: "Philips",
    descripcion: "Kit completo LED H4 6000K",
    disponible: true
  }
];

// Base de datos de servicios
const serviciosBD = [
  {
    id: "1",
    nombre: "Cambio de Aceite Premium",
    precio: 65,
    categoria: "mantenimiento",
    duracion: "45 min",
    descripcion: "Cambio de aceite sintético + filtro",
    incluye: ["Aceite sintético 5L", "Filtro de aceite", "Revisión de niveles"]
  },
  {
    id: "2",
    nombre: "Diagnóstico Computarizado Completo", 
    precio: 35,
    categoria: "diagnostico",
    duracion: "60 min",
    descripcion: "Escaneo completo de todos los sistemas",
    incluye: ["Scanner OBD2", "Reporte detallado", "Recomendaciones"]
  },
  {
    id: "3",
    nombre: "Servicio de Frenos Completo",
    precio: 120,
    categoria: "frenos", 
    duracion: "2 horas",
    descripcion: "Cambio de pastillas y revisión integral",
    incluye: ["Pastillas nuevas", "Revisión de discos", "Sangrado de frenos"]
  },
  {
    id: "4",
    nombre: "Alineación 3D y Balanceado",
    precio: 55,
    categoria: "suspension",
    duracion: "90 min", 
    descripcion: "Alineación computarizada + balanceado",
    incluye: ["Alineación 3D", "Balanceado 4 ruedas", "Reporte impreso"]
  },
  {
    id: "5",
    nombre: "Revisión Pre-Viaje Completa",
    precio: 80,
    categoria: "mantenimiento",
    duracion: "2 horas",
    descripcion: "Inspección integral antes de viajar",
    incluye: ["45 puntos de revisión", "Reporte detallado", "Recomendaciones"]
  }
];

export function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "1",
      tipo: "bot",
      contenido: "¡Hola! Soy el Asistente Automotriz de AutoParts Pro 🚗\n\nPuedo ayudarte con:\n• Diagnóstico de problemas del auto\n• Recomendaciones de talleres\n• Consejos de mantenimiento\n• Selección de repuestos\n\n¿Qué necesitas?",
      timestamp: new Date(),
      opciones: [
        { label: "🔧 Mi auto tiene un problema", accion: () => manejarOpcion("diagnostico") },
        { label: "🏪 Buscar taller especializado", accion: () => manejarOpcion("talleres") },
        { label: "📅 Programa de mantenimiento", accion: () => manejarOpcion("mantenimiento") },
        { label: "🛒 Buscar repuestos", accion: () => manejarOpcion("repuestos") },
        { label: "🔍 Búsqueda general", accion: () => manejarOpcion("busqueda") }
      ]
    }
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);

  const agregarMensaje = (mensaje: Omit<Mensaje, "id" | "timestamp">) => {
    const nuevoMsg: Mensaje = {
      ...mensaje,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMensajes(prev => [...prev, nuevoMsg]);
  };

  const simularRespuestaBot = (contenido: string, opciones?: any[], talleres?: any[], productos?: any[]) => {
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      agregarMensaje({
        tipo: "bot",
        contenido,
        opciones,
        talleres,
        productos
      });
    }, 1500);
  };

  const diagnosticarProblema = (problema: string) => {
    const problemaLower = problema.toLowerCase();
    let diagnostico = null;

    // Buscar coincidencias en la base de conocimiento
    for (const [key, value] of Object.entries(conocimientoAutomotriz.sintomas)) {
      if (problemaLower.includes(key)) {
        diagnostico = value;
        break;
      }
    }

    if (diagnostico) {
      const urgenciaColor = diagnostico.urgencia === "alta" ? "🔴" : 
                           diagnostico.urgencia === "media" ? "🟡" : "🟢";
      
      const talleresRecomendados = talleresBD.filter(t => 
        diagnostico.talleres.some(dt => t.nombre.includes(dt))
      );

      simularRespuestaBot(
        `${urgenciaColor} **Diagnóstico:**\n${diagnostico.diagnostico}\n\n**Solución recomendada:**\n${diagnostico.solucion}\n\n**Nivel de urgencia:** ${diagnostico.urgencia.toUpperCase()}`,
        [
          { label: "Ver talleres especializados", accion: () => mostrarTalleresEspecializados(diagnostico.talleres) },
          { label: "Ver repuestos necesarios", accion: () => mostrarRepuestosRecomendados(diagnostico.productos) },
          { label: "Más información", accion: () => darMasInformacion(diagnostico) }
        ],
        talleresRecomendados
      );
    } else {
      simularRespuestaBot(
        "No pude identificar el problema específico. ¿Podrías darme más detalles?\n\nPor ejemplo:\n• ¿Qué ruidos escuchas?\n• ¿Cuándo ocurre el problema?\n• ¿Hay luces de advertencia encendidas?",
        [
          { label: "Hablar con especialista", accion: () => manejarOpcion("talleres") },
          { label: "Problemas comunes", accion: () => mostrarProblemasComunes() }
        ]
      );
    }
  };

  const mostrarProblemasComunes = () => {
    simularRespuestaBot(
      "**Problemas más comunes:**\n\n🔧 **Frenos:** Ruidos, vibración al frenar\n🚗 **Motor:** No enciende, pérdida de potencia\n🛞 **Neumáticos:** Desgaste irregular, vibración\n⚡ **Eléctrico:** Luces débiles, batería se descarga\n🔧 **Suspensión:** Ruidos en curvas, auto rebota",
      [
        { label: "Mi problema es de frenos", accion: () => diagnosticarProblema("ruido frenos") },
        { label: "Mi problema es del motor", accion: () => diagnosticarProblema("motor no enciende") },
        { label: "Mi problema es eléctrico", accion: () => diagnosticarProblema("luces debiles") },
        { label: "Otro problema", accion: () => manejarOpcion("diagnostico") }
      ]
    );
  };

  const mostrarMantenimientoPorKm = (kilometraje: string) => {
    const mantenimiento = conocimientoAutomotriz.mantenimiento[kilometraje as keyof typeof conocimientoAutomotriz.mantenimiento];
    if (mantenimiento) {
      const lista = mantenimiento.map(item => `• ${item}`).join('\n');
      simularRespuestaBot(
        `**Mantenimiento ${kilometraje.replace('_', ' ')}:**\n\n${lista}\n\n💡 **Consejo:** Es mejor prevenir que reparar. El mantenimiento regular alarga la vida de tu vehículo.`,
        [
          { label: "Buscar talleres", accion: () => manejarOpcion("talleres") },
          { label: "Ver repuestos necesarios", accion: () => manejarOpcion("repuestos") },
          { label: "Agendar cita", accion: () => agendarCita() }
        ]
      );
    }
  };

  const recomendarTallerPorEspecialidad = (especialidad: string) => {
    const recomendacion = conocimientoAutomotriz.talleresPorEspecialidad[especialidad as keyof typeof conocimientoAutomotriz.talleresPorEspecialidad];
    const talleres = talleresBD.filter(t => 
      t.especialidad.toLowerCase().includes(especialidad)
    );

    if (recomendacion && talleres.length > 0) {
      simularRespuestaBot(
        `**Recomendación para ${especialidad}:**\n\n${recomendacion}\n\n⭐ **Datos del taller:**\n• ${talleres[0].experiencia} de experiencia\n• Calificación: ${talleres[0].rating}/5.0\n• Horarios: ${talleres[0].horarios}`,
        [
          { label: "Contactar taller", accion: () => contactarTaller(talleres[0]) },
          { label: "Ver otros talleres", accion: () => manejarOpcion("talleres") },
          { label: "Leer reseñas", accion: () => mostrarReseñasDetalladas(talleres[0]) }
        ],
        talleres
      );
    }
  };

  const mostrarReseñasDetalladas = (taller: any) => {
    const reseñas = taller.reseñas.map((reseña: string, index: number) => 
      `${index + 1}. "${reseña}"`
    ).join('\n\n');

    simularRespuestaBot(
      `**Reseñas de ${taller.nombre}:**\n\n${reseñas}\n\n📞 ¿Quieres contactarlos?`,
      [
        { label: "Llamar ahora", accion: () => contactarTaller(taller) },
        { label: "Ver ubicación", accion: () => verUbicacion(taller) },
        { label: "Buscar otro taller", accion: () => manejarOpcion("talleres") }
      ]
    );
  };

  const manejarOpcion = (tipo: string) => {
    switch (tipo) {
      case "diagnostico":
        agregarMensaje({ tipo: "usuario", contenido: "Mi auto tiene un problema" });
        simularRespuestaBot(
          "🔍 **Diagnóstico Automotriz**\n\nCuéntame qué problema está presentando tu vehículo. Puedes describir:\n\n• Ruidos extraños\n• Comportamiento anormal\n• Luces de advertencia\n• Pérdida de rendimiento\n\nEscribe los síntomas y te ayudo a identificar el problema.",
          [
            { label: "Problemas comunes", accion: () => mostrarProblemasComunes() },
            { label: "Emergencia", accion: () => manejarEmergencia() }
          ]
        );
        break;
      
      case "talleres":
        agregarMensaje({ tipo: "usuario", contenido: "Buscar taller especializado" });
        simularRespuestaBot(
          "🏪 **Talleres Especializados en Ecuador**\n\n¿Qué tipo de servicio necesitas?",
          [
            { label: "🔧 Frenos", accion: () => recomendarTallerPorEspecialidad("frenos") },
            { label: "🚗 Motor", accion: () => recomendarTallerPorEspecialidad("motor") },
            { label: "🛞 Suspensión", accion: () => recomendarTallerPorEspecialidad("suspension") },
            { label: "⚡ Eléctrico", accion: () => recomendarTallerPorEspecialidad("electrico") },
            { label: "📍 Ver todos cercanos", accion: () => mostrarTodosLosTalleres() }
          ]
        );
        break;
      
      case "mantenimiento":
        agregarMensaje({ tipo: "usuario", contenido: "Programa de mantenimiento" });
        simularRespuestaBot(
          "📅 **Mantenimiento Preventivo**\n\n¿Cuántos kilómetros tiene tu vehículo o cada cuánto quieres hacer mantenimiento?",
          [
            { label: "Cada 5,000 km", accion: () => mostrarMantenimientoPorKm("cada_5000km") },
            { label: "Cada 10,000 km", accion: () => mostrarMantenimientoPorKm("cada_10000km") },
            { label: "Cada 20,000 km", accion: () => mostrarMantenimientoPorKm("cada_20000km") },
            { label: "Plan personalizado", accion: () => crearPlanPersonalizado() }
          ]
        );
        break;
      
      case "repuestos":
        agregarMensaje({ tipo: "usuario", contenido: "Buscar repuestos" });
        simularRespuestaBot(
          "🛒 **Catálogo de Repuestos**\n\n¿Qué tipo de repuesto buscas?",
          [
            { label: "🔧 Frenos", accion: () => mostrarRepuestosPorCategoria("frenos") },
            { label: "🚗 Motor", accion: () => mostrarRepuestosPorCategoria("motor") },
            { label: "🛞 Neumáticos", accion: () => mostrarRepuestosPorCategoria("neumaticos") },
            { label: "⚡ Eléctrico", accion: () => mostrarRepuestosPorCategoria("electrico") },
            { label: "🔍 Buscar específico", accion: () => buscarRepuestoEspecifico() }
          ]
        );
        break;
      
      case "busqueda":
        agregarMensaje({ tipo: "usuario", contenido: "Búsqueda general" });
        simularRespuestaBot(
          "🔍 **Búsqueda en AutoParts Pro**\n\n¿Qué estás buscando?\n\nPuedes buscar por:\n• Nombre del producto\n• Marca específica\n• Tipo de servicio\n• Nombre del taller\n• Categoría\n\nEscribe lo que necesitas y te ayudo a encontrarlo.",
          [
            { label: "🛒 Ver productos populares", accion: () => mostrarProductosPopulares() },
            { label: "⚙️ Ver servicios más solicitados", accion: () => mostrarServiciosPopulares() },
            { label: "🏪 Ver talleres mejor calificados", accion: () => mostrarTalleresMejores() },
            { label: "🔍 Búsqueda por categoría", accion: () => busquedaPorCategoria() }
          ]
        );
        break;
    }
  };

  const manejarEmergencia = () => {
    simularRespuestaBot(
      "🚨 **EMERGENCIA AUTOMOTRIZ**\n\n**Pasos inmediatos:**\n1. Encuentra un lugar seguro para detenerte\n2. Enciende las luces de emergencia\n3. Evalúa la situación\n\n**Contactos de emergencia:**\n• Bomberos: 911\n• Grúa AutoParts: +593 99-GRUAEC\n\n¿Necesitas asistencia inmediata?",
      [
        { label: "🚗 Llamar grúa", accion: () => llamarGrua() },
        { label: "📞 Taller más cercano", accion: () => tallerMasCercano() },
        { label: "🔧 Autodiagnóstico", accion: () => autodiagnosticoEmergencia() }
      ]
    );
  };

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    
    agregarMensaje({ tipo: "usuario", contenido: nuevoMensaje });
    
    // Análisis inteligente del mensaje
    const mensaje = nuevoMensaje.toLowerCase();
    
    // Diagnóstico de problemas
    if (mensaje.includes("ruido") || mensaje.includes("sonido")) {
      if (mensaje.includes("freno")) {
        diagnosticarProblema("ruido frenos");
      } else {
        simularRespuestaBot("¿Puedes especificar dónde escuchas el ruido? (frenos, motor, suspensión)");
      }
    } else if (mensaje.includes("no enciende") || mensaje.includes("no arranca")) {
      diagnosticarProblema("motor no enciende");
    } else if (mensaje.includes("vibra") || mensaje.includes("tiembla")) {
      diagnosticarProblema("vibracion volante");
    } else if (mensaje.includes("aceite")) {
      diagnosticarProblema("aceite negro");
    } else if (mensaje.includes("luz") || mensaje.includes("faro")) {
      diagnosticarProblema("luces debiles");
    } 
    // Búsqueda de talleres
    else if (mensaje.includes("taller") || mensaje.includes("mecanic")) {
      manejarOpcion("talleres");
    }
    // Mantenimiento
    else if (mensaje.includes("mantenimiento") || mensaje.includes("servicio")) {
      manejarOpcion("mantenimiento");
    }
    // Repuestos
    else if (mensaje.includes("repuesto") || mensaje.includes("pieza") || mensaje.includes("comprar")) {
      manejarOpcion("repuestos");
    }
    // Búsqueda específica
    else if (mensaje.includes("buscar") || mensaje.includes("encontrar") || mensaje.includes("necesito")) {
      realizarBusqueda(mensaje);
    }
    // Emergencia
    else if (mensaje.includes("emergencia") || mensaje.includes("urgente") || mensaje.includes("ayuda")) {
      manejarEmergencia();
    }
    // Respuesta genérica inteligente
    else {
      simularRespuestaBot(
        "Entiendo que necesitas ayuda automotriz. Para darte la mejor recomendación, ¿podrías ser más específico?\n\n💡 **Puedo ayudarte con:**\n• Diagnóstico de problemas\n• Recomendación de talleres\n• Mantenimiento preventivo\n• Selección de repuestos",
        [
          { label: "🔧 Tengo un problema", accion: () => manejarOpcion("diagnostico") },
          { label: "🏪 Buscar taller", accion: () => manejarOpcion("talleres") },
          { label: "📅 Mantenimiento", accion: () => manejarOpcion("mantenimiento") },
          { label: "🛒 Comprar repuestos", accion: () => manejarOpcion("repuestos") },
          { label: "🔍 Búsqueda general", accion: () => manejarOpcion("busqueda") }
        ]
      );
    }
    
    setNuevoMensaje("");
  };

  // Funciones auxiliares
  const mostrarTodosLosTalleres = () => {
    simularRespuestaBot(
      "📍 **Talleres Cercanos:**",
      [
        { label: "Ver en mapa", accion: () => verEnMapa() }
      ],
      talleresBD
    );
  };

  const contactarTaller = (taller: any) => {
    agregarMensaje({ tipo: "usuario", contenido: `Quiero contactar ${taller.nombre}` });
    simularRespuestaBot(
      `📞 **Contactar ${taller.nombre}**\n\n**Teléfono:** ${taller.telefono}\n**Especialidad:** ${taller.especialidad}\n**Calificación:** ⭐ ${taller.rating}/5.0\n**Distancia:** ${taller.distancia}\n\n¿Te ayudo con algo más?`,
      [
        { label: "Agendar cita", accion: () => agendarCita() },
        { label: "Ver servicios", accion: () => verServicios(taller) },
        { label: "Leer reseñas", accion: () => mostrarReseñasDetalladas(taller) }
      ]
    );
  };

  const verServicios = (taller: any) => {
    const servicios = taller.servicios?.join(", ") || "Servicios generales de mecánica";
    simularRespuestaBot(
      `🔧 **Servicios de ${taller.nombre}:**\n\n${servicios}\n\n⏰ **Horarios:** ${taller.horarios}`
    );
  };

  const agendarCita = () => {
    simularRespuestaBot(
      "📅 **Agendar Cita**\n\nPara agendar una cita, puedes:\n\n1. Llamar directamente al taller\n2. Usar nuestra app móvil\n3. Visitar el taller personalmente\n\n💡 **Tip:** Menciona que vienes de AutoParts Pro para descuentos especiales."
    );
  };

  const verEnMapa = () => {
    simularRespuestaBot("🗺️ Te redirigiré a Google Maps con las ubicaciones de todos nuestros talleres afiliados.");
  };

  // Funciones de búsqueda
  const realizarBusqueda = (mensaje: string) => {
    const termino = mensaje.toLowerCase();
    let resultados = {
      productos: [] as any[],
      servicios: [] as any[],
      talleres: [] as any[]
    };

    // Buscar productos
    resultados.productos = productosBD.filter(p => 
      p.nombre.toLowerCase().includes(termino) ||
      p.marca.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino)
    ).slice(0, 3);

    // Buscar servicios
    resultados.servicios = serviciosBD.filter(s =>
      s.nombre.toLowerCase().includes(termino) ||
      s.categoria.toLowerCase().includes(termino) ||
      s.descripcion.toLowerCase().includes(termino)
    ).slice(0, 3);

    // Buscar talleres
    resultados.talleres = talleresBD.filter(t =>
      t.nombre.toLowerCase().includes(termino) ||
      t.especialidad.toLowerCase().includes(termino) ||
      t.servicios.some(servicio => servicio.toLowerCase().includes(termino))
    ).slice(0, 3);

    if (resultados.productos.length === 0 && resultados.servicios.length === 0 && resultados.talleres.length === 0) {
      simularRespuestaBot(
        `No encontré resultados para "${mensaje}". ¿Podrías intentar con otros términos?\n\n💡 **Sugerencias:**\n• Usa el nombre específico del producto\n• Menciona la marca\n• Describe el tipo de servicio`,
        [
          { label: "🛒 Ver productos populares", accion: () => mostrarProductosPopulares() },
          { label: "⚙️ Ver servicios", accion: () => mostrarServiciosPopulares() },
          { label: "🏪 Ver talleres", accion: () => mostrarTalleresMejores() }
        ]
      );
    } else {
      mostrarResultadosBusqueda(resultados, mensaje);
    }
  };

  const mostrarResultadosBusqueda = (resultados: any, termino: string) => {
    let contenido = `🔍 **Resultados para "${termino}":**\n\n`;

    if (resultados.productos.length > 0) {
      contenido += "🛒 **Productos encontrados:**\n";
      resultados.productos.forEach((p: any) => {
        contenido += `• ${p.nombre} - ${p.precio}\n`;
      });
      contenido += "\n";
    }

    if (resultados.servicios.length > 0) {
      contenido += "⚙️ **Servicios encontrados:**\n";
      resultados.servicios.forEach((s: any) => {
        contenido += `• ${s.nombre} - ${s.precio} (${s.duracion})\n`;
      });
      contenido += "\n";
    }

    if (resultados.talleres.length > 0) {
      contenido += "🏪 **Talleres encontrados:**\n";
      resultados.talleres.forEach((t: any) => {
        contenido += `• ${t.nombre} - ${t.especialidad} ⭐${t.rating}\n`;
      });
    }

    simularRespuestaBot(
      contenido,
      [
        { label: "🛒 Ver más productos", accion: () => mostrarProductosPopulares() },
        { label: "⚙️ Ver más servicios", accion: () => mostrarServiciosPopulares() },
        { label: "🏪 Ver más talleres", accion: () => mostrarTalleresMejores() },
        { label: "🔍 Nueva búsqueda", accion: () => manejarOpcion("busqueda") }
      ],
      resultados.talleres,
      resultados.productos
    );
  };

  const mostrarProductosPopulares = () => {
    const productosPopulares = productosBD.slice(0, 4);
    simularRespuestaBot(
      "🛒 **Productos Más Populares:**\n\n" + 
      productosPopulares.map(p => `• ${p.nombre}\n  💰 ${p.precio} - ${p.marca}\n`).join('\n'),
      [
        { label: "🔧 Ver frenos", accion: () => mostrarRepuestosPorCategoria("frenos") },
        { label: "🚗 Ver motor", accion: () => mostrarRepuestosPorCategoria("motor") },
        { label: "⚡ Ver eléctricos", accion: () => mostrarRepuestosPorCategoria("electrico") }
      ],
      [],
      productosPopulares
    );
  };

  const mostrarServiciosPopulares = () => {
    const serviciosPopulares = serviciosBD.slice(0, 4);
    simularRespuestaBot(
      "⚙️ **Servicios Más Solicitados:**\n\n" +
      serviciosPopulares.map(s => `• ${s.nombre}\n  💰 ${s.precio} - ⏱️ ${s.duracion}\n`).join('\n'),
      [
        { label: "🔧 Agendar servicio", accion: () => agendarCita() },
        { label: "🏪 Ver talleres", accion: () => mostrarTalleresMejores() },
        { label: "💡 Más información", accion: () => manejarOpcion("mantenimiento") }
      ]
    );
  };

  const mostrarTalleresMejores = () => {
    const talleresMejores = talleresBD.sort((a, b) => b.rating - a.rating);
    simularRespuestaBot(
      "🏪 **Talleres Mejor Calificados:**",
      [
        { label: "📍 Ver ubicaciones", accion: () => verEnMapa() },
        { label: "📞 Contactar", accion: () => contactarTaller(talleresMejores[0]) }
      ],
      talleresMejores
    );
  };

  const busquedaPorCategoria = () => {
    simularRespuestaBot(
      "🔍 **Búsqueda por Categoría:**\n\n¿En qué categoría quieres buscar?",
      [
        { label: "🔧 Frenos y Suspensión", accion: () => buscarEnCategoria("frenos") },
        { label: "🚗 Motor y Transmisión", accion: () => buscarEnCategoria("motor") },
        { label: "⚡ Sistema Eléctrico", accion: () => buscarEnCategoria("electrico") },
        { label: "🛞 Neumáticos y Llantas", accion: () => buscarEnCategoria("neumaticos") },
        { label: "🛢️ Lubricantes y Filtros", accion: () => buscarEnCategoria("lubricantes") }
      ]
    );
  };

  const buscarEnCategoria = (categoria: string) => {
    const productos = productosBD.filter(p => p.categoria === categoria);
    const servicios = serviciosBD.filter(s => s.categoria === categoria);
    
    let contenido = `📋 **${categoria.charAt(0).toUpperCase() + categoria.slice(1)}:**\n\n`;
    
    if (productos.length > 0) {
      contenido += "🛒 **Productos disponibles:**\n";
      productos.forEach(p => {
        contenido += `• ${p.nombre} - ${p.precio}\n`;
      });
      contenido += "\n";
    }
    
    if (servicios.length > 0) {
      contenido += "⚙️ **Servicios relacionados:**\n";
      servicios.forEach(s => {
        contenido += `• ${s.nombre} - ${s.precio}\n`;
      });
    }

    simularRespuestaBot(
      contenido,
      [
        { label: "🛒 Ver detalles productos", accion: () => mostrarProductosPopulares() },
        { label: "🏪 Buscar talleres especializados", accion: () => recomendarTallerPorEspecialidad(categoria) },
        { label: "🔍 Otra categoría", accion: () => busquedaPorCategoria() }
      ],
      [],
      productos
    );
  };

  return (
    <>
      {/* Botón flotante */}
      <AnimatePresence>
        {!abierto && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setAbierto(true)}
              className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <Bot className="h-6 w-6" />
            </Button>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ventana del chat */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className={`shadow-2xl ${minimizado ? "h-auto" : "h-[500px]"} flex flex-col`}>
              <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary-foreground text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm text-primary-foreground">Asistente Automotriz</CardTitle>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-primary-foreground/80">Especialista en línea</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMinimizado(!minimizado)}
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAbierto(false)}
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!minimizado && (
                <>
                  <CardContent className="flex-1 overflow-y-auto space-y-4 p-4 max-h-80">
                    {mensajes.map((mensaje) => (
                      <div
                        key={mensaje.id}
                        className={`flex ${mensaje.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-xs p-3 rounded-lg ${
                          mensaje.tipo === "usuario"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}>
                          <p className="text-sm whitespace-pre-line">{mensaje.contenido}</p>
                          
                          {/* Opciones de respuesta rápida */}
                          {mensaje.opciones && (
                            <div className="mt-3 space-y-1">
                              {mensaje.opciones.map((opcion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={opcion.accion}
                                  className="text-xs w-full justify-start"
                                >
                                  {opcion.label}
                                </Button>
                              ))}
                            </div>
                          )}

                          {/* Talleres recomendados */}
                          {mensaje.talleres && (
                            <div className="mt-3 space-y-2">
                              {mensaje.talleres.map((taller) => (
                                <div key={taller.id} className="border rounded p-2 bg-background text-foreground">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-sm">{taller.nombre}</p>
                                      <p className="text-xs text-muted-foreground">{taller.especialidad}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1">
                                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                          <span className="text-xs">{taller.rating}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">• {taller.distancia}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full mt-2 text-xs"
                                    onClick={() => contactarTaller(taller)}
                                  >
                                    <Phone className="h-3 w-3 mr-1" />
                                    Contactar
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {escribiendo && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Pregunta sobre tu auto..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                        className="text-sm"
                      />
                      <Button onClick={enviarMensaje} disabled={!nuevoMensaje.trim()} size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      💡 Pregúntame sobre problemas, talleres o mantenimiento
                    </p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}