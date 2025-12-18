import { useState, type FormEvent } from "react";
import { CardDescription, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff, Building, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import type { Usuario } from "@/app/types/auth";

import { registerWorkshop } from "../../services/auth.service";

type Props = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onAuthenticated: (user: Usuario, opts: { remember: boolean; token?: string }) => void;
};

export function WorkshopRegisterForm({ loading, setLoading, onAuthenticated }: Props) {
  const [nombre, setNombre] = useState("");
  const [ruc, setRuc] = useState("");
  const [email, setEmail] = useState("");
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
      const session = await registerWorkshop({ nombre, ruc, email, password: pass });

      setLoading(false);

      toast.success("¡Taller registrado exitosamente!");
      onAuthenticated(session.user, { remember: true, token: session.token });
    } catch(err) {
      setLoading(false);
      toast.error(err instanceof Error ? err.message : "Error al crear la cuenta. Intenta de nuevo.");
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <CardTitle className="text-xl">Registrar Taller</CardTitle>
        <CardDescription>Únete a nuestra red de talleres especializados</CardDescription>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre-taller">Nombre del taller</Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="nombre-taller"
              placeholder="AutoMaster Quito"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <Label htmlFor="confirm-password-taller">Confirmar contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm-password-taller"
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
          {loading ? "Registrando taller..." : "Registrar Taller"}
        </Button>
      </form>
    </>
  );
}
