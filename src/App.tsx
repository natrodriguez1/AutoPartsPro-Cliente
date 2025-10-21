import { useState } from "react";
import { Header } from "./shared/components/Header";
import { HomePage } from "./features/catalog/pages/HomePage";
import { ProductDetailPage } from "./features/catalog/pages/ProductDetailPage";
import { ServiceDetailPage } from "./features/catalog/pages/ServiceDetailPage";
import { Footer } from "./shared/components/Footer";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { TallerDashboard } from "./features/taller/pages/DashboardPage";
import { AdminDashboard } from "./features/admin/pages/DashboardPage";

import { TallerProfilePage } from "./features/taller/pages/ProfilePage";
import { ChatTaller } from "./features/taller/pages/ChatPage";
import { CartPage } from "./features/cart/pages/CartPage";
import { CheckoutPage } from "./features/cart/pages/CheckoutPage";
import { UserProfilePage } from "./features/user/pages/ProfilePage";
import { Chatbot } from "./features/chatbot/components/Chatbot";
import { ChatbotTaller } from "./features/chatbot/components/ChatbotTaller";
import { InventoryPage } from "./features/taller/pages/InventoryPage";
import { OrdersPage } from "./features/admin/pages/OrdersPage";
import { UsersPage } from "./features/admin/pages/UsersPage";
import { RegisterProductPage } from "./features/admin/pages/RegisterProductPage";
import { RegisterServicePage } from "./features/admin/pages/RegisterServicePage";
import { ServicesPage } from "./features/taller/pages/ServicesPage";
import { AuthProvider, useAuth } from "./app/providers/AuthContext";
import { Toaster } from "sonner";

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
    return <LoginPage onCambiarVista={() => cambiarVista("home")} />;
  }

  const renderContent = () => {
    switch (vista) {
      case "panel-admin":
        return <AdminDashboard onCambiarVista={cambiarVista} />;
      case "panel-taller":
        return <TallerDashboard onCambiarVista={cambiarVista} onAgregarCarrito={agregarAlCarrito} onVerPerfil={(taller) => cambiarVista("perfil-taller", taller)} onIniciarChat={iniciarChat} />;
      case "inventario":
        return <InventoryPage onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;
      case "ordenes":
        return <OrdersPage onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;
      case "gestion-usuarios":
        return <UsersPage onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;
      case "registro-productos":
        return <RegisterProductPage onRegresar={() => cambiarVista("inventario")} onCambiarVista={cambiarVista} />;
      case "registro-servicios":
        return <RegisterServicePage onRegresar={() => cambiarVista("servicios")} onCambiarVista={cambiarVista} />;
      case "servicios":
        return <ServicesPage onRegresar={() => cambiarVista("panel-taller")} onCambiarVista={cambiarVista} />;

      case "perfil-taller":
        return (
          <TallerProfilePage 
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
          <ProductDetailPage 
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
          <ServiceDetailPage 
            service={servicioSeleccionado} 
            onRegresar={() => cambiarVista("home")}
            onSolicitarServicio={solicitarServicio}
            userCars={usuario?.carros || []}
          />
        );
      case "carrito":
        return (
          <CartPage 
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
        return <CheckoutPage items={carritoItems} onRegresar={() => cambiarVista("carrito")} onCompletado={() => {
          setCarritoItems([]);
          cambiarVista("home");
        }} />;
      case "perfil-usuario":
        return (
          <UserProfilePage 
            onRegresar={() => cambiarVista("home")}
            initialTab={perfilTab}
            onTabChange={setPerfilTab}
          />
        );
      default:
        // Redirigir según tipo de usuario
        if (usuario.tipo === "admin") {
          return <AdminDashboard onCambiarVista={cambiarVista} />;
        } else if (usuario.tipo === "taller") {
          return <TallerDashboard onCambiarVista={cambiarVista} onAgregarCarrito={agregarAlCarrito} onVerPerfil={(taller) => cambiarVista("perfil-taller", taller)} onIniciarChat={iniciarChat} />;
        }
        return (
          <HomePage 
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
