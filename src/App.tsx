import { useState } from "react";
import { Header } from "./components/Header";
import { ProductCatalogue } from "./components/ProductCatalogue";
import { ProductDetail } from "./components/ProductDetail";
import { ServiceDetail } from "./components/ServiceDetail";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { PanelTaller } from "./components/PanelTaller";
import { PanelAdmin } from "./components/PanelAdmin";

import { PerfilTaller } from "./components/PerfilTaller";
import { ChatTaller } from "./components/ChatTaller";
import { Carrito } from "./components/Carrito";
import { Checkout } from "./components/Checkout";
import { PerfilUsuario } from "./components/PerfilUsuario";
import { Chatbot } from "./components/Chatbot";
import { ChatbotTaller } from "./components/ChatbotTaller";
import { InventarioTaller } from "./components/InventarioTaller";
import { OrdenesCompra } from "./components/OrdenesCompra";
import { GestionUsuarios } from "./components/GestionUsuarios";
import { RegistroProductos } from "./components/RegistroProductos";
import { RegistroServicios } from "./components/RegistroServicios";
import { ServiciosTaller } from "./components/ServiciosTaller";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { Toaster } from "./components/ui/sonner";

type Vista = "home" | "login" | "panel-taller" | "panel-admin" | "perfil-taller" | "chat" | "carrito" | "checkout" | "perfil-usuario" | "product-detail" | "service-detail" | "inventario" | "ordenes" | "gestion-usuarios" | "registro-productos" | "registro-servicios" | "servicios";

function AppContent() {
  const { usuario, cargando } = useAuth();
  const [vista, setVista] = useState<Vista>("home");
  const [tallerSeleccionado, setTallerSeleccionado] = useState<any>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
  const [carritoItems, setCarritoItems] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [itemsEliminados, setItemsEliminados] = useState<any[]>([]);
  
  // Estado para controlar qué pestaña del perfil mostrar
  const [perfilTab, setPerfilTab] = useState<string>("personal");

  const cambiarVista = (nuevaVista: Vista, datos?: any) => {
    if (datos) {
      if (nuevaVista === "perfil-taller") {
        setTallerSeleccionado(datos);
      } else if (nuevaVista === "product-detail") {
        setProductoSeleccionado(datos);
      } else if (nuevaVista === "service-detail") {
        setServicioSeleccionado(datos);
      } else if (nuevaVista === "chat") {
        setTallerSeleccionado(datos);
      } else {
        setTallerSeleccionado(datos);
      }
    }
    setVista(nuevaVista);
  };

  // Función para ir al perfil con una pestaña específica
  const irAPerfilTab = (tab: string) => {
    setPerfilTab(tab);
    setVista("perfil-usuario");
  };

  // Función para iniciar chat directamente
  const iniciarChat = (taller: any) => {
    setTallerSeleccionado(taller);
    setVista("chat");
  };

  const agregarAlCarrito = (producto: any, cantidad: number = 1) => {
    setCarritoItems(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const solicitarServicio = (servicio: any, datos: any) => {
    // En una implementación real, aquí se enviaría la solicitud al backend
    console.log("Solicitar servicio:", servicio, datos);
    // Por ahora solo mostramos un mensaje de éxito
  };

  const toggleWishlist = (producto: any) => {
    setWishlistItems(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.filter(item => item.id !== producto.id);
      }
      return [...prev, producto];
    });
  };

  const eliminarDelCarrito = (productoId: string) => {
    const itemEliminado = carritoItems.find(item => item.id === productoId);
    if (itemEliminado) {
      setItemsEliminados(prev => [...prev, itemEliminado]);
      setCarritoItems(prev => prev.filter(item => item.id !== productoId));
      // Auto-limpiar después de 10 segundos
      setTimeout(() => {
        setItemsEliminados(prev => prev.filter(item => item.id !== productoId));
      }, 10000);
    }
  };

  const restaurarItem = (productoId: string) => {
    const itemRestaurar = itemsEliminados.find(item => item.id === productoId);
    if (itemRestaurar) {
      setCarritoItems(prev => [...prev, itemRestaurar]);
      setItemsEliminados(prev => prev.filter(item => item.id !== productoId));
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar login
  if (!usuario) {
    return <Login onCambiarVista={() => cambiarVista("home")} />;
  }

  const renderContent = () => {
    switch (vista) {
      case "panel-admin":
        return <PanelAdmin onCambiarVista={cambiarVista} />;
      case "panel-taller":
        return <PanelTaller onCambiarVista={cambiarVista} onAgregarCarrito={agregarAlCarrito} onVerPerfil={(taller) => cambiarVista("perfil-taller", taller)} onIniciarChat={iniciarChat} />;
      case "inventario":
        return <InventarioTaller onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;
      case "ordenes":
        return <OrdenesCompra onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;
      case "gestion-usuarios":
        return <GestionUsuarios onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;
      case "registro-productos":
        return <RegistroProductos onRegresar={() => cambiarVista("inventario")} onCambiarVista={cambiarVista} />;
      case "registro-servicios":
        return <RegistroServicios onRegresar={() => cambiarVista("servicios")} onCambiarVista={cambiarVista} />;
      case "servicios":
        return <ServiciosTaller onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;

      case "perfil-taller":
        return (
          <PerfilTaller 
            taller={tallerSeleccionado} 
            onRegresar={() => cambiarVista("home")} 
            onIniciarChat={() => cambiarVista("chat", tallerSeleccionado)}
            onAgregarCarrito={agregarAlCarrito}
            onToggleWishlist={toggleWishlist}
            onVerProducto={(producto) => cambiarVista("product-detail", producto)}
            wishlistItems={wishlistItems}
          />
        );
      case "chat":
        return <ChatTaller taller={tallerSeleccionado} onRegresar={() => cambiarVista("home")} />;
      case "product-detail":
        return (
          <ProductDetail 
            product={productoSeleccionado} 
            onRegresar={() => cambiarVista("home")}
            onAgregarCarrito={agregarAlCarrito}
            onToggleWishlist={toggleWishlist}
            onVerProducto={(producto) => cambiarVista("product-detail", producto)}
            isInWishlist={wishlistItems.some(item => item.id === productoSeleccionado?.id)}
            userCars={usuario?.carros || []}
          />
        );
      case "service-detail":
        return (
          <ServiceDetail 
            service={servicioSeleccionado} 
            onRegresar={() => cambiarVista("home")}
            onSolicitarServicio={solicitarServicio}
            userCars={usuario?.carros || []}
          />
        );
      case "carrito":
        return (
          <Carrito 
            items={carritoItems} 
            wishlistItems={wishlistItems}
            itemsEliminados={itemsEliminados}
            onRegresar={() => cambiarVista("home")} 
            onActualizar={setCarritoItems}
            onIrCheckout={() => cambiarVista("checkout")}
            onEliminar={eliminarDelCarrito}
            onRestaurar={restaurarItem}
            onToggleWishlist={toggleWishlist}
            onAgregarCarrito={agregarAlCarrito}
          />
        );
      case "checkout":
        return <Checkout items={carritoItems} onRegresar={() => cambiarVista("carrito")} onCompletado={() => {
          setCarritoItems([]);
          cambiarVista("home");
        }} />;
      case "perfil-usuario":
        return (
          <PerfilUsuario 
            onRegresar={() => cambiarVista("home")}
            initialTab={perfilTab}
            onTabChange={setPerfilTab}
          />
        );
      default:
        // Redirigir según tipo de usuario
        if (usuario.tipo === "admin") {
          return <PanelAdmin onCambiarVista={cambiarVista} />;
        } else if (usuario.tipo === "taller") {
          return <PanelTaller onCambiarVista={cambiarVista} onAgregarCarrito={agregarAlCarrito} onVerPerfil={(taller) => cambiarVista("perfil-taller", taller)} onIniciarChat={iniciarChat} />;
        }
        return (
          <ProductCatalogue 
            onVerPerfil={(taller) => cambiarVista("perfil-taller", taller)} 
            onAgregarCarrito={agregarAlCarrito}
            onToggleWishlist={toggleWishlist}
            onVerProducto={(producto) => cambiarVista("product-detail", producto)}
            onVerServicio={(servicio) => cambiarVista("service-detail", servicio)}
            onIniciarChat={iniciarChat}
            wishlistItems={wishlistItems}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={carritoItems.reduce((total, item) => total + item.cantidad, 0)}
        onIrCarrito={() => cambiarVista("carrito")}
        onIrHome={() => cambiarVista("home")}
        onIrPanel={() => cambiarVista(usuario.tipo === "admin" ? "panel-admin" : "panel-taller")}
        onIrPerfil={() => irAPerfilTab("personal")}
        onIrVehiculos={() => irAPerfilTab("carros")}
        onIrDirecciones={() => irAPerfilTab("direcciones")}
        onIrPedidos={() => irAPerfilTab("pedidos")}
        onIrConfiguracion={() => irAPerfilTab("configuracion")}
      />
      <main>
        {renderContent()}
      </main>
      <Footer />
      
      {/* Chatbot según tipo de usuario (no mostrar para admin) */}
      {usuario.tipo === "usuario" && <Chatbot />}
      {usuario.tipo === "taller" && <ChatbotTaller />}
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}