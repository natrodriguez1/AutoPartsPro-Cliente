export type UserRole = "usuario" | "taller" | "admin";

export type Carro = {
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
}

export type Usuario = {
  id: string;
  tipo: UserRole;
  nombres?: string;
  nombre?: string;
  email: string;
  telefono?: string;
  ruc?: string;
  permisos?: string[];
  carros?: Carro[];
}

export type AuthContextType = {
  usuario: Usuario | null;
  cargando: boolean;
  iniciarSesion: (usuario: Usuario) => void;
  cerrarSesion: () => void;
  actualizarCarros: (carros: Carro[]) => void;
}
