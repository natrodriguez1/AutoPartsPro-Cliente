import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Usuario, Carro, AuthContextType } from '../types/auth';

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
    const usuarioFinal: Usuario =
    nuevoUsuario.tipo === "usuario" && !nuevoUsuario.carros
      ? { ...nuevoUsuario, carros: [/* default cars */] }
      : nuevoUsuario;

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

    setUsuario(usuarioFinal);
    localStorage.setItem("usuario", JSON.stringify(usuarioFinal));
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const actualizarCarros = (carros: Carro[]) => {
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