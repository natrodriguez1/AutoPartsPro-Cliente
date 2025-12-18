import { useState, type FormEvent } from "react";
import { CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import type { Usuario } from "@/app/types/auth";

import { registerUser } from "../../services/auth.service";

type Props = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onAuthenticated: (user: Usuario, opts: { remember: boolean; token?: string }) => void;
};

export function UserRegisterForm({ loading, setLoading, onAuthenticated }: Props) {
  const [nombres, setNombres] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pass !== pass2) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const session = await registerUser({ nombres, email, telefono, password: pass });

      setLoading(false);

      toast.success("¡Cuenta creada exitosamente!");
      onAuthenticated(session.user, { remember: true, token: session.token });
    } catch(err) {
      setLoading(false);
      toast.error(err instanceof Error ? err.message : "Error al crear la cuenta. Intenta de nuevo.");
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <CardTitle className="text-xl">Crear cuenta</CardTitle>
        <CardDescription>Regístrate para acceder a ofertas exclusivas</CardDescription>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombres-usuario">Nombres completos</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="nombres-usuario"
              placeholder="Juan Carlos Pérez"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
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
              type={showPass ? "text" : "password"}
              placeholder="Crea una contraseña segura"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
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

        <div className="space-y-2">
          <Label htmlFor="confirm-password-usuario">Confirmar contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm-password-usuario"
              type={showPass2 ? "text" : "password"}
              placeholder="Confirma tu contraseña"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass2((v) => !v)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              aria-label={showPass2 ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPass2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </Button>
      </form>
    </>
  );
}
