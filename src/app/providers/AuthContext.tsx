import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import type { Usuario, Carro, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "autoparts_user_v1";
const TOKEN_KEY = "autoparts_token_v1";

const DEFAULT_CARS: Carro[] = [
  {
    id: "1",
    marca: "Honda",
    modelo: "Civic",
    año: 2020,
    motor: "1.8L",
    combustible: "Gasolina",
    kilometraje: 45000,
    vin: "1HGBH41JXMN109186",
    color: "Negro",
    fechaCompra: "2020-03-15",
  },
  {
    id: "2",
    marca: "Toyota",
    modelo: "Corolla",
    año: 2018,
    motor: "1.6L",
    combustible: "Gasolina",
    kilometraje: 78000,
    vin: "JTDBL40E0790123456",
    color: "Blanco",
    fechaCompra: "2018-07-22",
  },
];

function normalizeUser(u: Usuario): Usuario {
  if (u.tipo === "usuario" && (!u.carros || u.carros.length === 0)) {
    return { ...u, carros: DEFAULT_CARS };
  }
  return u;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  // a qué storage estamos escribiendo la sesión actual
  const storageRef = useRef<Storage>(localStorage);

  useEffect(() => {
    // 1) intenta localStorage
    const rawLocal = localStorage.getItem(USER_KEY);
    const rawSession = sessionStorage.getItem(USER_KEY);

    const raw = rawLocal ?? rawSession;
    const fromLocal = Boolean(rawLocal);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Usuario;
        const normalized = normalizeUser(parsed);

        setUsuario(normalized);

        const tokenRaw = (fromLocal ? localStorage : sessionStorage).getItem(TOKEN_KEY);
        setToken(tokenRaw);

        storageRef.current = fromLocal ? localStorage : sessionStorage;
      } catch (error) {
        console.error("Error al parsear usuario guardado:", error);
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
      }
    }

    setCargando(false);
  }, []);

  const iniciarSesion = (
    nuevoUsuario: Usuario,
    options?: { remember?: boolean; token?: string }
  ) => {
    const remember = options?.remember ?? true; // default: persistente
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;

    const usuarioFinal = normalizeUser(nuevoUsuario);

    // limpia la otra sesión para evitar duplicados
    other.removeItem(USER_KEY);
    other.removeItem(TOKEN_KEY);

    target.setItem(USER_KEY, JSON.stringify(usuarioFinal));
    if (options?.token) target.setItem(TOKEN_KEY, options.token);

    storageRef.current = target;
    setUsuario(usuarioFinal);
    setToken(options?.token ?? null);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  };

  const actualizarCarros = (carros: Carro[]) => {
    if (usuario && usuario.tipo === "usuario") {
      const usuarioActualizado = { ...usuario, carros };
      setUsuario(usuarioActualizado);
      storageRef.current.setItem(USER_KEY, JSON.stringify(usuarioActualizado));
    }
  };

  const valor: AuthContextType = {
    usuario,
    token,
    cargando,
    iniciarSesion,
    cerrarSesion,
    actualizarCarros,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
