import type { Usuario, UserRole } from "@/app/types/auth";

export type AuthRole = Exclude<UserRole, "admin">; // "usuario" | "taller"

export type AuthSession = {
  user: Usuario;
  token?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  role: AuthRole; // la UI manda usuario/taller, pero el backend puede responder admin si aplica
};

export type RegisterUserPayload = {
  role: "usuario";
  nombres: string;
  email: string;
  telefono: string;
  password: string;
};

export type RegisterWorkshopPayload = {
  role: "taller";
  nombre: string;
  ruc: string;
  email: string;
  password: string;
};

export type RegisterPayload = RegisterUserPayload | RegisterWorkshopPayload;

export type FastApiLoginBody = {
  email: string;
  password: string;
  role_id: number; // "1", "2", etc.
};

export type FastApiLoginResponse = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  document_id?: string;
  role_id: number;
  created_at?: string;
  updated_at?: string;
};

export type FastApiRegisterBody = {
  name: string;
  email: string;
  phone?: string | null;
  birthday?: string | null;     // "YYYY-MM-DD" o null
  document_id?: string | null;  // en tu caso, para taller = ruc
  role_id: number;              // 2 usuario, 3 taller
  password: string;
};

// Tu backend responde el mismo "User" que ya usas en login,
// así que puedes reutilizar FastApiLoginResponse como respuesta de register.
export type FastApiRegisterResponse = FastApiLoginResponse;

export type FastApiUserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  birthday: string | null;
  document_id: string | null;
  role_id: number;
  created_at: string;
  updated_at: string;
};

export type FastApiUserUpdateBody = {
  name?: string;
  email?: string;
  phone?: string | null;
  birthday?: string | null;
  document_id?: string | null;
  role_id?: number;
  password?: string; // opcional si aplicas el UserUpdate en backend
};