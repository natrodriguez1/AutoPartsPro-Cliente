import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Checkbox } from "@/shared/ui/checkbox";
import { Eye, EyeOff, Car, User, Building, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner@2.0.3";

interface LoginProps {
  onCambiarVista: () => void;
}

export function Login({ onCambiarVista }: LoginProps) {
  const { iniciarSesion } = useAuth();
  
  // Estados para usuario normal
  const [emailUsuario, setEmailUsuario] = useState("");
  const [passwordUsuario, setPasswordUsuario] = useState("");
  const [showPasswordUsuario, setShowPasswordUsuario] = useState(false);
  const [rememberUsuario, setRememberUsuario] = useState(false);

  // Estados para registro de usuario
  const [nombresUsuario, setNombresUsuario] = useState("");
  const [emailRegUsuario, setEmailRegUsuario] = useState("");
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [passwordRegUsuario, setPasswordRegUsuario] = useState("");
  const [confirmPasswordUsuario, setConfirmPasswordUsuario] = useState("");
  const [showPasswordRegUsuario, setShowPasswordRegUsuario] = useState(false);
  const [showConfirmPasswordUsuario, setShowConfirmPasswordUsuario] = useState(false);

  // Estados para taller
  const [emailTaller, setEmailTaller] = useState("");
  const [passwordTaller, setPasswordTaller] = useState("");
  const [showPasswordTaller, setShowPasswordTaller] = useState(false);
  const [rememberTaller, setRememberTaller] = useState(false);

  // Estados para registro de taller
  const [nombreTaller, setNombreTaller] = useState("");
  const [rucTaller, setRucTaller] = useState("");
  const [emailRegTaller, setEmailRegTaller] = useState("");
  const [passwordRegTaller, setPasswordRegTaller] = useState("");
  const [confirmPasswordTaller, setConfirmPasswordTaller] = useState("");
  const [showPasswordRegTaller, setShowPasswordRegTaller] = useState(false);
  const [showConfirmPasswordTaller, setShowConfirmPasswordTaller] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLoginUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      // Verificar si es administrador
      if (emailUsuario === "admin@autoparts.ec" && passwordUsuario === "123") {
        iniciarSesion({
          id: "admin",
          tipo: "admin",
          nombre: "Administrador General",
          email: emailUsuario,
          telefono: "+593 2 999 0000",
          permisos: ["gestion_usuarios", "gestion_talleres", "reportes", "configuracion"]
        });
        toast.success("¡Bienvenido Administrador!");
        onCambiarVista();
        return;
      }
      
      iniciarSesion({
        id: "1",
        tipo: "usuario",
        nombres: "Juan Carlos Pérez",
        email: emailUsuario
      });
      
      toast.success("¡Bienvenido de nuevo!");
      onCambiarVista();
    } catch (error) {
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordRegUsuario !== confirmPasswordUsuario) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
      
      iniciarSesion({
        id: "1",
        tipo: "usuario",
        nombres: nombresUsuario,
        email: emailRegUsuario,
        telefono: telefonoUsuario
      });
      
      toast.success("¡Cuenta creada exitosamente!");
      onCambiarVista();
    } catch (error) {
      toast.error("Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginTaller = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      
      // Verificar si es administrador desde panel de taller
      if (emailTaller === "admin@autoparts.ec" && passwordTaller === "123") {
        iniciarSesion({
          id: "admin",
          tipo: "admin",
          nombre: "Administrador General",
          email: emailTaller,
          telefono: "+593 2 999 0000",
          permisos: ["gestion_usuarios", "gestion_talleres", "reportes", "configuracion"]
        });
        toast.success("¡Bienvenido Administrador!");
        onCambiarVista();
        return;
      }
      
      iniciarSesion({
        id: "2",
        tipo: "taller",
        nombre: "AutoMaster Quito",
        email: emailTaller,
        ruc: "1792146739001"
      });
      
      toast.success("¡Bienvenido al panel de taller!");
      onCambiarVista();
    } catch (error) {
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroTaller = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordRegTaller !== confirmPasswordTaller) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
      
      iniciarSesion({
        id: "2",
        tipo: "taller",
        nombre: nombreTaller,
        email: emailRegTaller,
        ruc: rucTaller
      });
      
      toast.success("¡Taller registrado exitosamente!");
      onCambiarVista();
    } catch (error) {
      toast.error("Error al registrar el taller. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AutoParts Pro</h1>
          <p className="text-muted-foreground mt-2">
            Tu tienda de repuestos automotrices en Ecuador
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            <Tabs defaultValue="usuario" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-none rounded-t-lg">
                <TabsTrigger value="usuario" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Usuario
                </TabsTrigger>
                <TabsTrigger value="taller" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Taller
                </TabsTrigger>
              </TabsList>

              {/* Login y Registro de Usuario */}
              <TabsContent value="usuario" className="p-6 space-y-6">
                <Tabs defaultValue="login-usuario" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login-usuario">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="registro-usuario">Registrarse</TabsTrigger>
                  </TabsList>

                  {/* Login Usuario */}
                  <TabsContent value="login-usuario" className="space-y-4">
                    <div className="text-center mb-4">
                      <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
                      <CardDescription>
                        Ingresa a tu cuenta para continuar comprando
                      </CardDescription>
                    </div>

                    <form onSubmit={handleLoginUsuario} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-usuario">Correo electrónico</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-usuario"
                            type="email"
                            placeholder="tu@email.com"
                            value={emailUsuario}
                            onChange={(e) => setEmailUsuario(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password-usuario">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-usuario"
                            type={showPasswordUsuario ? "text" : "password"}
                            placeholder="Tu contraseña"
                            value={passwordUsuario}
                            onChange={(e) => setPasswordUsuario(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordUsuario(!showPasswordUsuario)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswordUsuario ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember-usuario"
                            checked={rememberUsuario}
                            onCheckedChange={setRememberUsuario}
                          />
                          <Label htmlFor="remember-usuario" className="text-sm">
                            Recordarme
                          </Label>
                        </div>
                        <Button variant="link" className="p-0 h-auto text-sm">
                          ¿Olvidaste tu contraseña?
                        </Button>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Registro Usuario */}
                  <TabsContent value="registro-usuario" className="space-y-4">
                    <div className="text-center mb-4">
                      <CardTitle className="text-xl">Crear cuenta</CardTitle>
                      <CardDescription>
                        Regístrate para acceder a ofertas exclusivas
                      </CardDescription>
                    </div>

                    <form onSubmit={handleRegistroUsuario} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombres-usuario">Nombres completos</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="nombres-usuario"
                            placeholder="Juan Carlos Pérez"
                            value={nombresUsuario}
                            onChange={(e) => setNombresUsuario(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-reg-usuario">Correo electrónico</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-reg-usuario"
                            type="email"
                            placeholder="tu@email.com"
                            value={emailRegUsuario}
                            onChange={(e) => setEmailRegUsuario(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefono-usuario">Teléfono</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="telefono-usuario"
                            placeholder="+593 99 123 4567"
                            value={telefonoUsuario}
                            onChange={(e) => setTelefonoUsuario(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password-reg-usuario">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-reg-usuario"
                            type={showPasswordRegUsuario ? "text" : "password"}
                            placeholder="Crea una contraseña segura"
                            value={passwordRegUsuario}
                            onChange={(e) => setPasswordRegUsuario(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordRegUsuario(!showPasswordRegUsuario)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswordRegUsuario ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password-usuario">Confirmar contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password-usuario"
                            type={showConfirmPasswordUsuario ? "text" : "password"}
                            placeholder="Confirma tu contraseña"
                            value={confirmPasswordUsuario}
                            onChange={(e) => setConfirmPasswordUsuario(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPasswordUsuario(!showConfirmPasswordUsuario)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPasswordUsuario ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Crear Cuenta"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Login y Registro de Taller */}
              <TabsContent value="taller" className="p-6 space-y-6">
                <Tabs defaultValue="login-taller" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login-taller">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="registro-taller">Registrarse</TabsTrigger>
                  </TabsList>

                  {/* Login Taller */}
                  <TabsContent value="login-taller" className="space-y-4">
                    <div className="text-center mb-4">
                      <CardTitle className="text-xl">Portal de Talleres</CardTitle>
                      <CardDescription>
                        Accede a tu panel de administración
                      </CardDescription>
                    </div>

                    <form onSubmit={handleLoginTaller} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-taller">Correo del taller</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-taller"
                            type="email"
                            placeholder="taller@email.com"
                            value={emailTaller}
                            onChange={(e) => setEmailTaller(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password-taller">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-taller"
                            type={showPasswordTaller ? "text" : "password"}
                            placeholder="Tu contraseña"
                            value={passwordTaller}
                            onChange={(e) => setPasswordTaller(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordTaller(!showPasswordTaller)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswordTaller ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember-taller"
                            checked={rememberTaller}
                            onCheckedChange={setRememberTaller}
                          />
                          <Label htmlFor="remember-taller" className="text-sm">
                            Recordarme
                          </Label>
                        </div>
                        <Button variant="link" className="p-0 h-auto text-sm">
                          ¿Olvidaste tu contraseña?
                        </Button>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Acceder al Panel"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Registro Taller */}
                  <TabsContent value="registro-taller" className="space-y-4">
                    <div className="text-center mb-4">
                      <CardTitle className="text-xl">Registrar Taller</CardTitle>
                      <CardDescription>
                        Únete a nuestra red de talleres especializados
                      </CardDescription>
                    </div>

                    <form onSubmit={handleRegistroTaller} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre-taller">Nombre del taller</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="nombre-taller"
                            placeholder="AutoMaster Quito"
                            value={nombreTaller}
                            onChange={(e) => setNombreTaller(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ruc-taller">RUC</Label>
                        <Input
                          id="ruc-taller"
                          placeholder="1792146739001"
                          value={rucTaller}
                          onChange={(e) => setRucTaller(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-reg-taller">Correo electrónico</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-reg-taller"
                            type="email"
                            placeholder="taller@email.com"
                            value={emailRegTaller}
                            onChange={(e) => setEmailRegTaller(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password-reg-taller">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-reg-taller"
                            type={showPasswordRegTaller ? "text" : "password"}
                            placeholder="Crea una contraseña segura"
                            value={passwordRegTaller}
                            onChange={(e) => setPasswordRegTaller(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordRegTaller(!showPasswordRegTaller)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswordRegTaller ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password-taller">Confirmar contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password-taller"
                            type={showConfirmPasswordTaller ? "text" : "password"}
                            placeholder="Confirma tu contraseña"
                            value={confirmPasswordTaller}
                            onChange={(e) => setConfirmPasswordTaller(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPasswordTaller(!showConfirmPasswordTaller)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPasswordTaller ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Registrando taller..." : "Registrar Taller"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Al continuar, aceptas nuestros{" "}
          <Button variant="link" className="p-0 h-auto text-sm">
            Términos de Servicio
          </Button>{" "}
          y{" "}
          <Button variant="link" className="p-0 h-auto text-sm">
            Política de Privacidad
          </Button>
        </div>
      </div>
    </div>
  );
}