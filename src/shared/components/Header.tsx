import { Search, ShoppingCart, User, Car, LogOut, Home, Settings, Heart, Package, CreditCard, MapPin, Bell, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuGroup } from "../ui/dropdown-menu";
import { useAuth } from "@/app/providers/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useMemo, useEffect } from "react";

interface HeaderProps {
  cartItemsCount?: number;
  onIrCarrito?: () => void;
  onIrHome?: () => void;
  onIrPanel?: () => void;
  onIrPerfil?: () => void;
  onIrVehiculos?: () => void;
  onIrDirecciones?: () => void;
  onIrPedidos?: () => void;
  onIrConfiguracion?: () => void;
}
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  brand: string;
  compatibility: string[];
  isNew?: boolean;
  isSale?: boolean;
  salePercentage?: number;
  description?: string;
  tallerId?: string;
  tallerNombre?: string;
}

export function Header() {
  const { usuario, cerrarSesion } = useAuth();
  const [cartItems] = useState<Product[]>([]);
  const cartItemsCount = cartItems.length;
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate("/");
  };
  const handleIrHome = () => {
    navigate("/");
  }
  const handleIrPanelTaller = () => {
    navigate("/taller");
  }
  const handleIrPanelAdmin = () => {
    navigate("/admin");
  }
  const handleIrCarrito = () => {
    navigate("/carrito");
  };
  const handleIrPerfil = () => {
    navigate("/perfil")
  };

  const getUserInitials = () => {
    if (usuario?.tipo === "taller") {
      return usuario.nombre?.substring(0, 2).toUpperCase() || "TA";
    } else {
      const nombres = usuario?.nombres || "Usuario";
      return nombres.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    }
  };

  const getUserDisplayName = () => {
    if (usuario?.tipo === "admin") {
      return usuario.nombre || "Administrador";
    } else if (usuario?.tipo === "taller") {
      return usuario.nombre || "Taller";
    } else {
      return usuario?.nombres || "Usuario";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => handleIrCarrito()}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">AutoParts Pro</span>
        </div>

        {/* Search Bar - Now larger and central */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar repuestos, servicios, talleres..." 
              className="pl-12 pr-4 h-12 text-base bg-input-background border-2 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" className="relative" onClick={() => handleIrCarrito()}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemsCount}
              </Badge>
            )}
          </Button>
          
          {usuario ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border-0 bg-transparent p-0 hover:bg-accent focus:bg-accent outline-none">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={getUserDisplayName()} />
                  <AvatarFallback className="text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {usuario.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {usuario.tipo === "admin" ? "Administrador" : usuario.tipo === "taller" ? "Taller" : "Cliente"}
                      </Badge>
                      {usuario.tipo === "usuario" && (
                        <Badge variant="secondary" className="text-xs">
                          {usuario.carros?.length || 0} vehículos
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                {/* Navegación principal */}
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleIrHome}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Inicio</span>
                  </DropdownMenuItem>
                  
                  {usuario.tipo === "admin" ? (
                    <DropdownMenuItem onClick={handleIrPanelAdmin}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Panel de Administración</span>
                    </DropdownMenuItem>
                  ) : usuario.tipo === "taller" ? (
                    <DropdownMenuItem onClick={handleIrPanelTaller}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Panel de Taller</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => handleIrCarrito()}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Mi Carrito</span>
                        {cartItemsCount > 0 && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {cartItemsCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => {/* TODO: Implementar wishlist */}}>
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Lista de Deseos</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          12
                        </Badge>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={{/* TODO: Implementar pedidos */}}>
                        <Package className="mr-2 h-4 w-4" />
                        <span>Mis Pedidos</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* Configuración del perfil */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Configuración
                  </DropdownMenuLabel>
                  
                  <DropdownMenuItem onClick={() => {handleIrPerfil}}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  
                  {usuario.tipo === "usuario" && (
                    <DropdownMenuItem onClick={{/* TODO: Implementar vehiculos */}}>
                      <Car className="mr-2 h-4 w-4" />
                      <span>Mis Vehículos</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {usuario.carros?.length || 0}
                      </Badge>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={{/* TODO: Implementar direcciones */}}>
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Direcciones</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => {/* TODO: Ir a métodos de pago */}}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Métodos de Pago</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={{/* TODO: Implementar configuracion */}}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notificaciones</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* Soporte y configuración avanzada */}
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => {/* TODO: Ir a ayuda */}}>
                    <span>Centro de Ayuda</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={{/* TODO: Implementar configuracion */}}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}