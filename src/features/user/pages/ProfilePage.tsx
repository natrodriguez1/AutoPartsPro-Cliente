import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthContext";
import { ProfileTabs } from "../components/ProfileTabs";

const TABS_VALIDAS = ["personal", "carros", "pedidos", "direcciones", "configuracion"] as const;
type TabPerfil = (typeof TABS_VALIDAS)[number];

function normalizarTab(value: string | null): TabPerfil {
  if (!value) return "personal";
  return (TABS_VALIDAS as readonly string[]).includes(value) ? (value as TabPerfil) : "personal";
}

export function UserProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { usuario, cerrarSesion, actualizarCarros } = useAuth();

  const tabActiva = useMemo(() => normalizarTab(searchParams.get("tab")), [searchParams]);

  const onTabChange = (tab: string) => {
    const nextTab = normalizarTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", nextTab);
      return next;
    }, { replace: true });
  };

  const onRegresar = () => navigate(-1);

  const onCerrarSesion = () => {
    cerrarSesion();
    navigate("/login", { replace: true });
  };

  // RoleRoute ya debería proteger, pero si usuario todavía no carga:
  if (!usuario) return null;

  return (
    <ProfileTabs
      usuario={usuario}
      tabActiva={tabActiva}
      onTabChange={onTabChange}
      onRegresar={onRegresar}
      onCerrarSesion={onCerrarSesion}
      actualizarCarros={actualizarCarros}
    />
  );
}
