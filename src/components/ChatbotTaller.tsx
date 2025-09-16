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
  Tool,
  AlertTriangle,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Settings
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

// Base de conocimiento para talleres
const conocimientoTaller = {
  gestion: {
    "inventario": {
      descripcion: "Gestión eficiente de repuestos e insumos",
      consejos: [
        "Mantén stock mínimo de piezas rotativas",
        "Utiliza sistema FIFO para aceites y lubricantes",
        "Revisa inventario semanalmente",
        "Negocia descuentos por volumen con proveedores"
      ],
      herramientas: ["Sistema POS", "Códigos de barras", "Alertas automáticas"]
    },
    "clientes": {
      descripcion: "Fidelización y seguimiento de clientes",
      estrategias: [
        "Programa de mantenimiento preventivo",
        "Recordatorios automáticos de servicios",
        "Descuentos para clientes frecuentes",
        "Sistema de referencias y recomendaciones"
      ],
      kpis: ["Retención de clientes", "Valor promedio por orden", "Frecuencia de visitas"]
    },
    "finanzas": {
      descripcion: "Control financiero y rentabilidad",
      aspectos: [
        "Análisis de costos por servicio",
        "Margen de utilidad en repuestos",
        "Flujo de caja mensual",
        "Presupuesto para herramientas y equipos"
      ],
      indicadores: ["ROI", "Margen bruto", "Costo de adquisición de clientes"]
    }
  },
  
  servicios: {
    "diagnostico": {
      procedimiento: "Scanner + inspección visual + pruebas funcionales",
      tiempo_promedio: "30-60 minutos",
      precio_sugerido: "$25-45",
      herramientas: ["Scanner OBD2", "Multímetro", "Manómetros"]
    },
    "cambio_aceite": {
      procedimiento: "Drenaje + cambio filtro + carga aceite nuevo",
      tiempo_promedio: "20-30 minutos", 
      precio_sugerido: "$35-60",
      herramientas: ["Llave para filtro", "Embudo", "Recipiente para drenaje"]
    },
    "frenos": {
      procedimiento: "Inspección + cambio pastillas/discos + sangrado",
      tiempo_promedio: "1-2 horas",
      precio_sugerido: "$80-150",
      herramientas: ["Gato hidráulico", "Llaves especiales", "Compresor para sangrado"]
    }
  },

  proveedores: {
    "nacionales": [
      "Distribuidora Central - Repuestos generales",
      "AutoImport Ecuador - Piezas importadas", 
      "TecniParts - Herramientas especializadas"
    ],
    "internacionales": [
      "Bosch - Sistemas eléctricos y frenos",
      "Monroe - Suspensión y amortiguadores",
      "Mobil 1 - Aceites y lubricantes premium"
    ]
  }
};

const estadisticasNegocio = {
  mes_actual: {
    ordenes: 127,
    ingresos: 18450,
    clientes_nuevos: 23,
    servicios_populares: ["Cambio aceite", "Frenos", "Diagnóstico"]
  },
  comparacion: {
    mes_anterior: { ordenes: 98, ingresos: 14200 },
    crecimiento_ordenes: "+29.6%",
    crecimiento_ingresos: "+29.9%"
  }
};

// Base de datos de productos para talleres
const productosBD = [
  {
    id: "1",
    nombre: "Pastillas de Freno Cerámicas Premium Bosch",
    precio: 120,
    categoria: "frenos",
    marca: "Bosch",
    descripcion: "Pastillas de alta performance para frenado superior",
    disponible: true,
    stock: 25
  },
  {
    id: "2", 
    nombre: "Aceite de Motor Sintético Mobil 1",
    precio: 45,
    categoria: "lubricantes",
    marca: "Mobil",
    descripcion: "Aceite sintético premium 5W-30",
    disponible: true,
    stock: 50
  },
  {
    id: "3",
    nombre: "Batería Bosch S4 12V 60Ah",
    precio: 95,
    categoria: "electrico",
    marca: "Bosch", 
    descripcion: "Batería de arranque libre de mantenimiento",
    disponible: true,
    stock: 15
  },
  {
    id: "4",
    nombre: "Amortiguadores Monroe Gas-Matic",
    precio: 140,
    categoria: "suspension",
    marca: "Monroe",
    descripcion: "Amortiguadores de gas para mejor estabilidad",
    disponible: true,
    stock: 8
  },
  {
    id: "5",
    nombre: "Neumáticos Urbanos Bridgestone",
    precio: 180,
    categoria: "neumaticos",
    marca: "Bridgestone",
    descripcion: "Neumáticos 205/55R16 para ciudad",
    disponible: true,
    stock: 12
  },
  {
    id: "6",
    nombre: "Kit de Conversión LED para Faros",
    precio: 85,
    categoria: "electrico",
    marca: "Philips",
    descripcion: "Kit completo LED H4 6000K",
    disponible: true,
    stock: 20
  }
];

// Base de datos de servicios para talleres
const serviciosBD = [
  {
    id: "1",
    nombre: "Cambio de Aceite Premium",
    precio: 65,
    categoria: "mantenimiento",
    duracion: "45 min",
    descripcion: "Cambio de aceite sintético + filtro",
    margen: "45%",
    popularidad: "alta"
  },
  {
    id: "2",
    nombre: "Diagnóstico Computarizado Completo", 
    precio: 35,
    categoria: "diagnostico",
    duracion: "60 min",
    descripcion: "Escaneo completo de todos los sistemas",
    margen: "85%",
    popularidad: "muy alta"
  },
  {
    id: "3",
    nombre: "Servicio de Frenos Completo",
    precio: 120,
    categoria: "frenos", 
    duracion: "2 horas",
    descripcion: "Cambio de pastillas y revisión integral",
    margen: "60%",
    popularidad: "alta"
  },
  {
    id: "4",
    nombre: "Alineación 3D y Balanceado",
    precio: 55,
    categoria: "suspension",
    duracion: "90 min", 
    descripcion: "Alineación computarizada + balanceado",
    margen: "55%",
    popularidad: "media"
  },
  {
    id: "5",
    nombre: "Revisión Pre-Viaje Completa",
    precio: 80,
    categoria: "mantenimiento",
    duracion: "2 horas",
    descripcion: "Inspección integral antes de viajar",
    margen: "70%",
    popularidad: "estacional"
  }
];

// Base de datos de talleres competencia
const talleresBD = [
  {
    id: "1",
    nombre: "AutoMaster Quito",
    especialidad: "Motor y Transmisión",
    rating: 4.8,
    distancia: "2.3 km",
    telefono: "+593 2 245-6789",
    fortalezas: ["Diagnóstico avanzado", "Precios competitivos", "Garantía extendida"]
  },
  {
    id: "2",
    nombre: "TallerPro Guayaquil",
    especialidad: "Sistema de Frenos y Eléctrico",
    rating: 4.6,
    distancia: "3.1 km",
    telefono: "+593 4 289-3456",
    fortalezas: ["Especialización europea", "Repuestos originales", "Rapidez"]
  },
  {
    id: "3",
    nombre: "MecánicaTotal Cuenca",
    especialidad: "Suspensión y Dirección",
    rating: 4.7,
    distancia: "4.5 km",
    telefono: "+593 7 405-7890",
    fortalezas: ["Alineación 3D", "Experiencia", "Cumplimiento de tiempos"]
  }
];

export function ChatbotTaller() {
  const [abierto, setAbierto] = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "1",
      tipo: "bot",
      contenido: "¡Hola! Soy el Asistente de Gestión para Talleres AutoParts Pro 🔧\n\nPuedo ayudarte con:\n• Gestión de inventario y proveedores\n• Estrategias para fidelizar clientes\n• Análisis de rentabilidad del negocio\n• Optimización de procesos de trabajo\n• Consejos de marketing para talleres\n\n¿En qué área te gustaría mejorar tu taller?",
      timestamp: new Date(),
      opciones: [
        { label: "📦 Gestión de Inventario", accion: () => manejarOpcion("inventario") },
        { label: "👥 Fidelización de Clientes", accion: () => manejarOpcion("clientes") },
        { label: "💰 Análisis Financiero", accion: () => manejarOpcion("finanzas") },
        { label: "⚙️ Optimización de Procesos", accion: () => manejarOpcion("procesos") },
        { label: "🔍 Buscar en Catálogo", accion: () => manejarOpcion("busqueda") }
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

  const manejarOpcion = (tipo: string) => {
    switch (tipo) {
      case "inventario":
        agregarMensaje({ tipo: "usuario", contenido: "Gestión de Inventario" });
        simularRespuestaBot(
          "📦 **Gestión de Inventario Inteligente**\n\n**Consejos clave:**\n• Mantén stock mínimo de piezas rotativas (filtros, aceites, pastillas)\n• Usa sistema FIFO para productos con fecha de vencimiento\n• Revisa inventario semanalmente\n• Negocia descuentos por volumen\n\n**Herramientas recomendadas:**\n• Sistema POS con control de stock\n• Códigos de barras para rapidez\n• Alertas automáticas de stock mínimo",
          [
            { label: "🔍 Análisis de rotación", accion: () => analizarRotacion() },
            { label: "📊 Proveedores confiables", accion: () => mostrarProveedores() },
            { label: "⚠️ Control de stock crítico", accion: () => stockCritico() },
            { label: "💡 Optimizar almacén", accion: () => optimizarAlmacen() }
          ]
        );
        break;

      case "clientes":
        agregarMensaje({ tipo: "usuario", contenido: "Fidelización de Clientes" });
        simularRespuestaBot(
          "👥 **Estrategias de Fidelización**\n\n**Programas efectivos:**\n• Mantenimiento preventivo programado\n• Recordatorios automáticos de servicios\n• Tarjeta de descuentos para clientes frecuentes\n• Sistema de referencias con incentivos\n\n**KPIs importantes:**\n• Retención de clientes: 75%\n• Valor promedio por orden: $145\n• Frecuencia de visitas: cada 4 meses",
          [
            { label: "📱 WhatsApp Business", accion: () => whatsappBusiness() },
            { label: "🎁 Programa de puntos", accion: () => programaPuntos() },
            { label: "📅 Recordatorios automáticos", accion: () => recordatorios() },
            { label: "⭐ Gestión de reseñas", accion: () => gestionReseñas() }
          ]
        );
        break;

      case "finanzas":
        agregarMensaje({ tipo: "usuario", contenido: "Análisis Financiero" });
        const { mes_actual, comparacion } = estadisticasNegocio;
        simularRespuestaBot(
          `💰 **Análisis Financiero del Mes**\n\n📈 **Métricas actuales:**\n• Órdenes completadas: ${mes_actual.ordenes}\n• Ingresos totales: $${mes_actual.ingresos.toLocaleString()}\n• Clientes nuevos: ${mes_actual.clientes_nuevos}\n\n📊 **Crecimiento vs mes anterior:**\n• Órdenes: ${comparacion.crecimiento_ordenes}\n• Ingresos: ${comparacion.crecimiento_ingresos}\n\n🔝 **Servicios más rentables:**\n${mes_actual.servicios_populares.map(s => `• ${s}`).join('\n')}`,
          [
            { label: "📊 Análisis detallado", accion: () => analisisDetallado() },
            { label: "💡 Mejores márgenes", accion: () => mejoresMargen() },
            { label: "📈 Proyección trimestral", accion: () => proyeccionTrimestral() },
            { label: "💰 Control de gastos", accion: () => controlGastos() }
          ]
        );
        break;

      case "procesos":
        agregarMensaje({ tipo: "usuario", contenido: "Optimización de Procesos" });
        simularRespuestaBot(
          "⚙️ **Optimización de Procesos**\n\n**Áreas de mejora:**\n• Recepción de vehículos estandarizada\n• Check-list de diagnóstico obligatorio\n• Comunicación clara de tiempos y costos\n• Sistema de seguimiento por SMS/WhatsApp\n\n**Tiempos estándar recomendados:**\n• Diagnóstico básico: 30-45 min\n• Cambio de aceite: 20-30 min\n• Frenos completos: 1-2 horas",
          [
            { label: "📋 Crear check-lists", accion: () => crearChecklist() },
            { label: "⏱️ Optimizar tiempos", accion: () => optimizarTiempos() },
            { label: "📱 Comunicación cliente", accion: () => comunicacionCliente() },
            { label: "🔧 Organización taller", accion: () => organizacionTaller() }
          ]
        );
        break;
      
      case "busqueda":
        agregarMensaje({ tipo: "usuario", contenido: "Buscar en Catálogo" });
        simularRespuestaBot(
          "🔍 **Búsqueda en Catálogo AutoParts Pro**\n\n¿Qué estás buscando para tu taller?\n\nPuedes buscar:\n• Repuestos por nombre o marca\n• Servicios para ofrecer\n• Información de competencia\n• Productos por categoría\n\nEscribe lo que necesitas encontrar.",
          [
            { label: "🛒 Ver productos más vendidos", accion: () => mostrarProductosMasVendidos() },
            { label: "⚙️ Ver servicios rentables", accion: () => mostrarServiciosRentables() },
            { label: "🏪 Analizar competencia", accion: () => analizarCompetencia() },
            { label: "📊 Buscar por categoría", accion: () => busquedaPorCategoria() }
          ]
        );
        break;
    }
  };

  const analizarRotacion = () => {
    simularRespuestaBot(
      "🔍 **Análisis de Rotación de Inventario**\n\n**Productos de alta rotación (reponer cada 2 semanas):**\n• Aceites de motor (5W-30, 15W-40)\n• Filtros de aceite universales\n• Pastillas de freno comunes\n• Bujías de encendido\n\n**Productos de rotación media (reponer mensual):**\n• Amortiguadores\n• Baterías de 12V\n• Correas de distribución\n\n**Productos de baja rotación (reponer bimestral):**\n• Piezas específicas por marca\n• Herramientas especializadas"
    );
  };

  const mostrarProveedores = () => {
    simularRespuestaBot(
      "📊 **Proveedores Confiables en Ecuador**\n\n🇪🇨 **Nacionales:**\n• Distribuidora Central - Repuestos generales, crédito 30 días\n• AutoImport Ecuador - Piezas importadas, entrega 48h\n• TecniParts - Herramientas, garantía extendida\n\n🌍 **Internacionales:**\n• Bosch - Sistemas eléctricos, calidad premium\n• Monroe - Suspensión, garantía 2 años\n• Mobil 1 - Lubricantes, programa de fidelidad\n\n💡 **Tip:** Diversifica proveedores para mejores precios y disponibilidad"
    );
  };

  const whatsappBusiness = () => {
    simularRespuestaBot(
      "📱 **WhatsApp Business para Talleres**\n\n**Configuración esencial:**\n• Catálogo con servicios y precios\n• Respuestas automáticas para horarios\n• Etiquetas para organizar clientes\n• Estados para mostrar trabajos realizados\n\n**Mensajes automáticos útiles:**\n• 'Hola, ¿en qué podemos ayudarte?'\n• 'Tu vehículo está listo para recoger'\n• 'Recordatorio: tu carro necesita mantenimiento'\n\n**Resultado esperado:** +40% en retención de clientes",
      [
        { label: "📱 Configurar catálogo", accion: () => configurarCatalogo() },
        { label: "🤖 Mensajes automáticos", accion: () => mensajesAutomaticos() }
      ]
    );
  };

  const analisisDetallado = () => {
    simularRespuestaBot(
      "📊 **Análisis Financiero Detallado**\n\n**Rentabilidad por servicio:**\n• Diagnóstico: Margen 85% ($38 promedio)\n• Cambio aceite: Margen 45% ($52 promedio)\n• Frenos: Margen 60% ($125 promedio)\n• Suspensión: Margen 55% ($180 promedio)\n\n**Costos operativos mensuales:**\n• Alquiler: $800\n• Servicios: $150\n• Herramientas: $200\n• Personal: $2,400\n\n**Punto de equilibrio:** 65 órdenes/mes\n**Meta recomendada:** 90+ órdenes/mes"
    );
  };

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;
    
    agregarMensaje({ tipo: "usuario", contenido: nuevoMensaje });
    
    // Análisis inteligente del mensaje para talleres
    const mensaje = nuevoMensaje.toLowerCase();
    
    // Gestión de inventario
    if (mensaje.includes("inventario") || mensaje.includes("stock") || mensaje.includes("repuesto")) {
      manejarOpcion("inventario");
    } 
    // Clientes y marketing
    else if (mensaje.includes("cliente") || mensaje.includes("marketing") || mensaje.includes("fideliz")) {
      manejarOpcion("clientes");
    }
    // Finanzas y rentabilidad
    else if (mensaje.includes("dinero") || mensaje.includes("ganancia") || mensaje.includes("financ") || mensaje.includes("precio")) {
      manejarOpcion("finanzas");
    }
    // Procesos y organización
    else if (mensaje.includes("proceso") || mensaje.includes("organiz") || mensaje.includes("tiempo") || mensaje.includes("eficien")) {
      manejarOpcion("procesos");
    }
    // Competencia
    else if (mensaje.includes("competencia") || mensaje.includes("otro taller")) {
      simularRespuestaBot(
        "🏆 **Diferenciarse de la Competencia**\n\n**Estrategias efectivas:**\n• Especialización en marcas específicas\n• Diagnóstico computarizado avanzado\n• Garantía extendida en trabajos\n• Transparencia en precios y procesos\n• Atención personalizada y seguimiento\n\n**Valor agregado:**\n• Servicio de grúa incluido\n• Vehículo de reemplazo\n• Mantenimiento domiciliario\n• Asesoría técnica gratuita"
      );
    }
    // Búsqueda específica
    else if (mensaje.includes("buscar") || mensaje.includes("encontrar") || mensaje.includes("necesito")) {
      realizarBusqueda(mensaje);
    }
    // Capacitación
    else if (mensaje.includes("capacit") || mensaje.includes("aprender") || mensaje.includes("curso")) {
      simularRespuestaBot(
        "🎓 **Capacitación Continua**\n\n**Áreas prioritarias:**\n• Diagnóstico electrónico avanzado\n• Sistemas híbridos y eléctricos\n• Tecnología ADAS\n• Atención al cliente\n• Gestión empresarial\n\n**Recursos recomendados:**\n• Cursos técnicos SECAP\n• Certificaciones de fabricantes\n• Webinars AutoParts Pro\n• Intercambio con otros talleres"
      );
    }
    // Respuesta genérica
    else {
      simularRespuestaBot(
        "Entiendo que buscas mejorar tu taller. Para darte la mejor recomendación, ¿podrías ser más específico?\n\n🔧 **Puedo ayudarte con:**\n• Gestión de inventario y proveedores\n• Estrategias de fidelización\n• Análisis financiero y rentabilidad\n• Optimización de procesos",
        [
          { label: "📦 Inventario", accion: () => manejarOpcion("inventario") },
          { label: "👥 Clientes", accion: () => manejarOpcion("clientes") },
          { label: "💰 Finanzas", accion: () => manejarOpcion("finanzas") },
          { label: "⚙️ Procesos", accion: () => manejarOpcion("procesos") },
          { label: "🔍 Buscar en catálogo", accion: () => manejarOpcion("busqueda") }
        ]
      );
    }
    
    setNuevoMensaje("");
  };

  // Funciones auxiliares específicas para talleres
  const crearChecklist = () => {
    simularRespuestaBot(
      "📋 **Check-list de Recepción de Vehículos**\n\n✅ **Información básica:**\n• Datos del cliente y contacto\n• Placa, marca, modelo, año, km\n• Motivo de la visita\n• Síntomas reportados\n\n✅ **Inspección inicial:**\n• Estado general exterior\n• Niveles de fluidos\n• Funcionamiento de luces\n• Estado de neumáticos\n\n✅ **Diagnóstico:**\n• Prueba con scanner\n• Prueba de manejo corta\n• Estimado de tiempo y costo\n• Autorización del cliente"
    );
  };

  const configurarCatalogo = () => {
    simularRespuestaBot(
      "📱 **Configurar Catálogo WhatsApp**\n\n**Servicios básicos:**\n• Cambio de aceite - desde $35\n• Revisión general - $25\n• Diagnóstico computarizado - $30\n• Frenos - desde $80\n\n**Incluye en cada servicio:**\n• Descripción detallada\n• Tiempo estimado\n• Garantía ofrecida\n• Foto referencial\n\n**Tip:** Actualiza precios mensualmente y agrega servicios estacionales"
    );
  };

  // Funciones de búsqueda para talleres
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

    // Buscar talleres competencia
    resultados.talleres = talleresBD.filter(t =>
      t.nombre.toLowerCase().includes(termino) ||
      t.especialidad.toLowerCase().includes(termino)
    ).slice(0, 3);

    if (resultados.productos.length === 0 && resultados.servicios.length === 0 && resultados.talleres.length === 0) {
      simularRespuestaBot(
        `No encontré resultados para "${mensaje}". ¿Podrías intentar con otros términos?\n\n💡 **Sugerencias:**\n• Nombre específico del repuesto\n• Marca del producto\n• Tipo de servicio\n• Categoría de producto`,
        [
          { label: "🛒 Ver productos populares", accion: () => mostrarProductosMasVendidos() },
          { label: "⚙️ Ver servicios rentables", accion: () => mostrarServiciosRentables() },
          { label: "🏪 Analizar competencia", accion: () => analizarCompetencia() }
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
        contenido += `• ${p.nombre}\n  💰 ${p.precio} - Stock: ${p.stock} unidades\n`;
      });
      contenido += "\n";
    }

    if (resultados.servicios.length > 0) {
      contenido += "⚙️ **Servicios encontrados:**\n";
      resultados.servicios.forEach((s: any) => {
        contenido += `• ${s.nombre}\n  💰 ${s.precio} - Margen: ${s.margen} (${s.duracion})\n`;
      });
      contenido += "\n";
    }

    if (resultados.talleres.length > 0) {
      contenido += "🏪 **Competencia encontrada:**\n";
      resultados.talleres.forEach((t: any) => {
        contenido += `• ${t.nombre} - ${t.especialidad}\n  ⭐${t.rating} - ${t.distancia}\n`;
      });
    }

    simularRespuestaBot(
      contenido,
      [
        { label: "🛒 Ver más productos", accion: () => mostrarProductosMasVendidos() },
        { label: "⚙️ Ver más servicios", accion: () => mostrarServiciosRentables() },
        { label: "🏪 Analizar competencia", accion: () => analizarCompetencia() },
        { label: "🔍 Nueva búsqueda", accion: () => manejarOpcion("busqueda") }
      ],
      resultados.talleres,
      resultados.productos
    );
  };

  const mostrarProductosMasVendidos = () => {
    const productosTop = productosBD.slice(0, 4);
    simularRespuestaBot(
      "🛒 **Productos Más Vendidos:**\n\n" + 
      productosTop.map(p => `• ${p.nombre}\n  💰 ${p.precio} - Stock: ${p.stock} - ${p.marca}\n`).join('\n'),
      [
        { label: "🔧 Ver categoría frenos", accion: () => buscarEnCategoria("frenos") },
        { label: "🚗 Ver categoría motor", accion: () => buscarEnCategoria("lubricantes") },
        { label: "⚡ Ver categoría eléctrico", accion: () => buscarEnCategoria("electrico") },
        { label: "📦 Gestionar inventario", accion: () => manejarOpcion("inventario") }
      ],
      [],
      productosTop
    );
  };

  const mostrarServiciosRentables = () => {
    const serviciosTop = serviciosBD.filter(s => s.margen !== "55%").slice(0, 4);
    simularRespuestaBot(
      "⚙️ **Servicios Más Rentables:**\n\n" +
      serviciosTop.map(s => `• ${s.nombre}\n  💰 ${s.precio} - Margen: ${s.margen} (${s.duracion})\n`).join('\n'),
      [
        { label: "📊 Análisis de precios", accion: () => analisisDetallado() },
        { label: "🎯 Estrategias de venta", accion: () => manejarOpcion("clientes") },
        { label: "⏱️ Optimizar tiempos", accion: () => optimizarTiempos() }
      ]
    );
  };

  const analizarCompetencia = () => {
    simularRespuestaBot(
      "🏪 **Análisis de Competencia Local:**\n\n" +
      talleresBD.map(t => `• **${t.nombre}** ⭐${t.rating}\n  📍 ${t.distancia} - ${t.especialidad}\n  🎯 Fortalezas: ${t.fortalezas.join(', ')}\n`).join('\n'),
      [
        { label: "🎯 Estrategias diferenciación", accion: () => estrategiasDiferenciacion() },
        { label: "💰 Comparar precios", accion: () => compararPrecios() },
        { label: "📈 Mejorar calificación", accion: () => mejorarCalificacion() }
      ]
    );
  };

  const busquedaPorCategoria = () => {
    simularRespuestaBot(
      "📊 **Búsqueda por Categoría:**\n\n¿Qué categoría te interesa?",
      [
        { label: "🔧 Frenos y Suspensión", accion: () => buscarEnCategoria("frenos") },
        { label: "🛢️ Lubricantes y Filtros", accion: () => buscarEnCategoria("lubricantes") },
        { label: "⚡ Sistema Eléctrico", accion: () => buscarEnCategoria("electrico") },
        { label: "🛞 Neumáticos y Llantas", accion: () => buscarEnCategoria("neumaticos") },
        { label: "⚙️ Servicios de Mantenimiento", accion: () => buscarEnCategoria("mantenimiento") }
      ]
    );
  };

  const buscarEnCategoria = (categoria: string) => {
    const productos = productosBD.filter(p => p.categoria === categoria);
    const servicios = serviciosBD.filter(s => s.categoria === categoria);
    
    let contenido = `📋 **Categoría: ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}:**\n\n`;
    
    if (productos.length > 0) {
      contenido += "🛒 **Productos disponibles:**\n";
      productos.forEach(p => {
        contenido += `• ${p.nombre}\n  💰 ${p.precio} - Stock: ${p.stock}\n`;
      });
      contenido += "\n";
    }
    
    if (servicios.length > 0) {
      contenido += "⚙️ **Servicios relacionados:**\n";
      servicios.forEach(s => {
        contenido += `• ${s.nombre}\n  💰 ${s.precio} - Margen: ${s.margen}\n`;
      });
    }

    simularRespuestaBot(
      contenido,
      [
        { label: "📦 Gestionar stock", accion: () => manejarOpcion("inventario") },
        { label: "💰 Análisis rentabilidad", accion: () => manejarOpcion("finanzas") },
        { label: "🔍 Otra categoría", accion: () => busquedaPorCategoria() }
      ],
      [],
      productos
    );
  };

  const estrategiasDiferenciacion = () => {
    simularRespuestaBot(
      "🎯 **Estrategias de Diferenciación:**\n\n**Ventajas competitivas:**\n• Especialización en marcas específicas\n• Diagnóstico computarizado avanzado\n• Garantía extendida en servicios\n• Atención personalizada 24/7\n• Servicio de grúa incluido\n\n**Propuesta de valor:**\n• Transparencia total en precios\n• Comunicación constante vía WhatsApp\n• Repuestos originales certificados"
    );
  };

  const compararPrecios = () => {
    simularRespuestaBot(
      "💰 **Comparación de Precios:**\n\n**Servicios básicos (promedio mercado):**\n• Cambio aceite: $35-65\n• Diagnóstico: $25-45\n• Frenos: $80-150\n• Alineación: $45-70\n\n**Recomendaciones:**\n• Mantén precios competitivos\n• Ofrece paquetes de servicios\n• Descuentos por volumen\n• Programa de fidelidad"
    );
  };

  const mejorarCalificacion = () => {
    simularRespuestaBot(
      "📈 **Mejorar Calificación del Taller:**\n\n**Estrategias probadas:**\n• Seguimiento post-servicio por WhatsApp\n• Solicitar reseñas a clientes satisfechos\n• Resolver reclamos inmediatamente\n• Exceder expectativas en tiempos\n• Ofrecer garantía extendida\n\n**Meta:** Alcanzar 4.8+ estrellas en 6 meses"
    );
  };

  const verDetalleProducto = (producto: any) => {
    simularRespuestaBot(
      `🛒 **${producto.nombre}**\n\n**Detalles:**\n• Marca: ${producto.marca}\n• Precio: ${producto.precio}\n• Categoría: ${producto.categoria}\n• Stock disponible: ${producto.stock || 'Consultar'}\n• Descripción: ${producto.descripcion}\n\n**Para tu taller:**\nEste producto es popular entre talleres similares y tiene buena rotación de inventario.`,
      [
        { label: "📦 Gestionar inventario", accion: () => manejarOpcion("inventario") },
        { label: "💰 Ver margen de ganancia", accion: () => manejarOpcion("finanzas") },
        { label: "🔍 Buscar productos similares", accion: () => buscarEnCategoria(producto.categoria) }
      ]
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
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
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
                        <Wrench className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm text-primary-foreground">Asistente de Gestión</CardTitle>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs text-primary-foreground/80">Experto en talleres</span>
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

                          {/* Productos recomendados */}
                          {mensaje.productos && (
                            <div className="mt-3 space-y-2">
                              {mensaje.productos.map((producto: any) => (
                                <div key={producto.id} className="border rounded p-2 bg-background text-foreground">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-sm">{producto.nombre}</p>
                                      <p className="text-xs text-muted-foreground">{producto.marca} • {producto.categoria}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium">${producto.precio}</span>
                                        {producto.stock && <span className="text-xs text-muted-foreground">Stock: {producto.stock}</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full mt-2 text-xs"
                                    onClick={() => verDetalleProducto(producto)}
                                  >
                                    <Package className="h-3 w-3 mr-1" />
                                    Ver Detalles
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
                        placeholder="Pregunta sobre gestión del taller..."
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
                      💡 Pregúntame sobre inventario, clientes o finanzas
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