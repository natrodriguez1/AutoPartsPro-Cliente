import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  id: string;
  tipo: 'usuario' | 'taller' | 'admin';
  nombres?: string;
  nombre?: string;
  email: string;
  telefono?: string;
  ruc?: string;
  permisos?: string[];
  carros?: Array<{
    id: string;
    marca: string;
    modelo: string;
    año: number;
    motor?: string;
    combustible?: string;
    kilometraje?: number;
    vin?: string;
    color?: string;
    fechaCompra?: string;
  }>;
}

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (usuario: Usuario) => void;
  cerrarSesion: () => void;
  actualizarCarros: (carros: any[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión existente
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioParseado = JSON.parse(usuarioGuardado);
        setUsuario(usuarioParseado);
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('usuario');
      }
    }
    setCargando(false);
  }, []);

  const iniciarSesion = (nuevoUsuario: Usuario) => {
    // Agregar carros por defecto para usuarios nuevos
    if (nuevoUsuario.tipo === 'usuario' && !nuevoUsuario.carros) {
      nuevoUsuario.carros = [
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
          fechaCompra: "2020-03-15"
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
          fechaCompra: "2018-07-22"
        }
      ];
    }

    setUsuario(nuevoUsuario);
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const actualizarCarros = (carros: any[]) => {
    if (usuario && usuario.tipo === 'usuario') {
      const usuarioActualizado = { ...usuario, carros };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }
  };

  const valor: AuthContextType = {
    usuario,
    cargando,
    iniciarSesion,
    cerrarSesion,
    actualizarCarros,
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}