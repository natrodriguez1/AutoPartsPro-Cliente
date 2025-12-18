import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { Dispatch, SetStateAction } from "react";
import type { Usuario } from "@/app/types/auth";

import { WorkshopLoginForm } from "./forms/WorkshopLoginForm";
import { WorkshopRegisterForm } from "./forms/WorkshopRegisterForm";

type Props = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onAuthenticated: (user: Usuario, opts: { remember: boolean; token?: string }) => void;
};

export function WorkshopAuthPanel({ loading, setLoading, onAuthenticated }: Props) {
  return (
    <Tabs defaultValue="login-taller" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login-taller">Iniciar Sesión</TabsTrigger>
        <TabsTrigger value="registro-taller">Registrarse</TabsTrigger>
      </TabsList>

      <TabsContent value="login-taller" className="space-y-4">
        <WorkshopLoginForm loading={loading} setLoading={setLoading} onAuthenticated={onAuthenticated} />
      </TabsContent>

      <TabsContent value="registro-taller" className="space-y-4">
        <WorkshopRegisterForm loading={loading} setLoading={setLoading} onAuthenticated={onAuthenticated} />
      </TabsContent>
    </Tabs>
  );
}
