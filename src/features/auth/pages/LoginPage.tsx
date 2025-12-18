import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { User, Building } from "lucide-react";

import { useAuth } from "@/app/providers/AuthContext";
import type { Usuario } from "@/app/types/auth";

import { AuthHeader } from "../components/AuthHeader";
import { UserAuthPanel } from "../components/UserAuthPanel";
import { WorkshopAuthPanel } from "../components/WorkshopAuthPanel";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, iniciarSesion } = useAuth();

  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const irDespuesDeLogin = (u: Usuario) => {
    if (u.tipo === "admin") return navigate("/admin", { replace: true });
    if (u.tipo === "taller") return navigate("/taller", { replace: true });

    if (fromPath && fromPath !== "/login") return navigate(fromPath, { replace: true });
    return navigate("/", { replace: true });
  };

  useEffect(() => {
    if (usuario) irDespuesDeLogin(usuario);
  }, [usuario]); // eslint-disable-line react-hooks/exhaustive-deps

  const [loading, setLoading] = useState(false);

  const onAuthenticated = (user: Usuario, opts: { remember: boolean; token?: string }) => {
    iniciarSesion(user, opts);
    // ❌ NO navegues aquí. Deja que el useEffect lo haga.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

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

              <TabsContent value="usuario" className="p-6 space-y-6">
                <UserAuthPanel loading={loading} setLoading={setLoading} onAuthenticated={onAuthenticated} />
              </TabsContent>

              <TabsContent value="taller" className="p-6 space-y-6">
                <WorkshopAuthPanel loading={loading} setLoading={setLoading} onAuthenticated={onAuthenticated} />
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
