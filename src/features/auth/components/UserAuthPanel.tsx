import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { Dispatch, SetStateAction } from "react";
import type { Usuario } from "@/app/types/auth";

import { UserLoginForm } from "./forms/UserLoginForm";
import { UserRegisterForm } from "./forms/UserRegisterForm";

type Props = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onAuthenticated: (user: Usuario, opts: { remember: boolean; token?: string }) => void;
};

export function UserAuthPanel({ loading, setLoading, onAuthenticated }: Props) {
  return (
    <Tabs defaultValue="login-usuario" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login-usuario">Iniciar Sesión</TabsTrigger>
        <TabsTrigger value="registro-usuario">Registrarse</TabsTrigger>
      </TabsList>

      <TabsContent value="login-usuario" className="space-y-4">
        <UserLoginForm loading={loading} setLoading={setLoading} onAuthenticated={onAuthenticated} />
      </TabsContent>

      <TabsContent value="registro-usuario" className="space-y-4">
        <UserRegisterForm loading={loading} setLoading={setLoading} onAuthenticated={onAuthenticated} />
      </TabsContent>
    </Tabs>
  );
}
