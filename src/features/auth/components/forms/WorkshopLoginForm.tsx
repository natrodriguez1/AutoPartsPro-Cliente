import { useState, type FormEvent } from "react";
import { CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { Dispatch, SetStateAction } from "react";
import type { Usuario } from "@/app/types/auth";

import { login } from "../../services/auth.service";

type Props = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onAuthenticated: (user: Usuario, opts: { remember: boolean; token?: string }) => void;
};

export function WorkshopLoginForm({ loading, setLoading, onAuthenticated }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await login({ email, password, role: "taller" });

      setLoading(false);
      toast.success(session.user.tipo === "admin" ? "¡Bienvenido Administrador!" : "¡Bienvenido al panel de taller!");
      onAuthenticated(session.user, { remember, token: session.token });
    } catch (err) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión. Verifica tus credenciales.";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <CardTitle className="text-xl">Portal de Talleres</CardTitle>
        <CardDescription>Accede a tu panel de administración</CardDescription>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-taller">Correo del taller</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email-taller"
              type="email"
              placeholder="taller@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type={showPass ? "text" : "password"}
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-taller"
              checked={remember}
              onCheckedChange={(v: CheckedState) => setRemember(Boolean(v))}
            />
            <Label htmlFor="remember-taller" className="text-sm">
              Recordarme
            </Label>
          </div>

          <Button variant="link" className="p-0 h-auto text-sm" type="button">
            ¿Olvidaste tu contraseña?
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Acceder al Panel"}
        </Button>
      </form>
    </>
  );
}
