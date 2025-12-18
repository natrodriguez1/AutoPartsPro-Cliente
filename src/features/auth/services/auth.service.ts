import api from "@/shared/lib/axios";

import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  RegisterUserPayload,
  RegisterWorkshopPayload,
  FastApiLoginBody,
  FastApiLoginResponse,
  FastApiRegisterBody,
  FastApiRegisterResponse,
  FastApiUserUpdateBody,
  FastApiUserResponse,
} from "../types";

import type { Usuario, UserRole } from "@/app/types/auth";
import axios from "axios";

// Si aún no hay backend, puedes dejar esto en true y simular.
// Cuando tengas backend, ponlo en false.
const USE_MOCKS = false;

const ROLE_ID_BY_CONTEXT = {
  usuario: 2,
  taller: 3,
};

const ADMIN_ROLE_ID = 1;

const ROLE_BY_ROLE_ID: Record<number, UserRole> = {
  1: "admin",
  2: "usuario",
  3: "taller",
};

function extractErrorMessage(err: unknown, fallback = "Ocurrió un error."): string {
  if (!axios.isAxiosError(err)) return "Error al iniciar sesión.";

  const status = err.response?.status;
  const data = err.response?.data as { detail?: unknown } | undefined;

  const detail = data?.detail;
  if (typeof detail === "string") return detail;

  if (status === 401) return "Credenciales inválidas.";
  if (status === 403) return "No tienes permisos para acceder.";
  if (status === 422) return "Datos inválidos. Revisa email/contraseña/rol.";

  return "No se pudo iniciar sesión. Intenta nuevamente.";
}

function mapFastApiUserToUsuario(data: FastApiLoginResponse, fallbackRole: LoginPayload["role"]): Usuario {
  const tipo = ROLE_BY_ROLE_ID[data.role_id] ?? fallbackRole;

  return {
    id: String(data.id),
    tipo,
    email: data.email,
    ...(tipo === "usuario" ? { nombres: data.name } : { nombre: data.name }),
    telefono: data.phone,
  };
}

function mapFastApiUserResponseToUsuario(data: FastApiUserResponse): Usuario {
  const tipo = ROLE_BY_ROLE_ID[data.role_id] ?? "usuario";
  return {
    id: String(data.id),
    tipo,
    email: data.email,
    ...(tipo === "usuario" ? { nombres: data.name } : { nombre: data.name }),
    telefono: data.phone ?? undefined,
  };
}

export async function updateUser(userId: number, body: FastApiUserUpdateBody): Promise<Usuario> {
  try {
    const { data } = await api.put<FastApiUserResponse>(`/users/${userId}`, body);
    return mapFastApiUserResponseToUsuario(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("STATUS", err.response?.status);
      console.log("DATA", err.response?.data); // <-- aquí sale detail con campos faltantes
    }
    throw err;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


async function postLogin(body: FastApiLoginBody) {
  return api.post<FastApiLoginResponse>("/users/login", body);
}

async function postRegister(body: FastApiRegisterBody) {
  return api.post<FastApiRegisterResponse>("/users/", body);
}

export async function login(payload: LoginPayload): Promise<AuthSession> {


  if (USE_MOCKS) {
    await sleep(700);

    // mock admin
    if (payload.email === "admin@autoparts.ec" && payload.password === "123") {
      return {
        user: {
          id: "admin",
          tipo: "admin",
          nombre: "Administrador General",
          email: payload.email,
          telefono: "+593 2 999 0000",
          permisos: ["gestion_usuarios", "gestion_talleres", "reportes", "configuracion"],
        },
        token: "mock-admin-token",
      };
    }

    // mock taller / usuario según role enviado
    if (payload.role === "taller") {
      return {
        user: {
          id: "2",
          tipo: "taller",
          nombre: "AutoMaster Quito",
          email: payload.email,
          ruc: "1792146739001",
        },
        token: "mock-taller-token",
      };
    }

    return {
      user: {
        id: "1",
        tipo: "usuario",
        nombres: "Juan Carlos Pérez",
        email: payload.email,
      },
      token: "mock-user-token",
    };
  }

  const primaryRoleId = ROLE_ID_BY_CONTEXT[payload.role];

  const base: Omit<FastApiLoginBody, "role_id"> = {
    email: payload.email,
    password: payload.password,
  };

  try {
    const { data } = await postLogin({ ...base, role_id: primaryRoleId });
    return { user: mapFastApiUserToUsuario(data, payload.role) };
  } catch (err) {
    // 2) si falla con 401, intento como admin
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      try {
        const { data } = await postLogin({ ...base, role_id: ADMIN_ROLE_ID });
        return { user: mapFastApiUserToUsuario(data, payload.role) };
      } catch (err2) {
        throw new Error(extractErrorMessage(err2));
      }
    }
    throw new Error(extractErrorMessage(err));
  }
  
  
}

// Mantienes 2 funciones para la UI, pero por dentro puedes apuntar a un solo endpoint si quieres.
export async function registerUser(
  payload: Omit<RegisterUserPayload, "role">
): Promise<AuthSession> {
  return register({ role: "usuario", ...payload });
}

export async function registerWorkshop(
  payload: Omit<RegisterWorkshopPayload, "role">
): Promise<AuthSession> {
  return register({ role: "taller", ...payload });
}

function buildRegisterBody(payload: RegisterPayload): FastApiRegisterBody {
  if (payload.role === "usuario") {
    return {
      name: payload.nombres,
      email: payload.email,
      phone: payload.telefono,
      birthday: null,      // o fija una fecha si tu BD lo exige
      document_id: null,   // si luego pides cédula, aquí va
      role_id: ROLE_ID_BY_CONTEXT.usuario,
      password: payload.password,
    };
  }

  // taller
  return {
    name: payload.nombre,
    email: payload.email,
    phone: null,
    birthday: null,
    document_id: payload.ruc, // ✅ document_id = ruc
    role_id: ROLE_ID_BY_CONTEXT.taller,
    password: payload.password,
  };
}

// Si tu backend maneja un solo endpoint /auth/register:
async function register(payload: RegisterPayload): Promise<AuthSession> {
  if (USE_MOCKS) {
    await sleep(900);

    if (payload.role === "taller") {
      return {
        user: {
          id: "2",
          tipo: "taller",
          nombre: payload.nombre,
          email: payload.email,
          ruc: payload.ruc,
        },
        token: "mock-taller-token",
      };
    }

    return {
      user: {
        id: "1",
        tipo: "usuario",
        nombres: payload.nombres,
        email: payload.email,
        telefono: payload.telefono,
      },
      token: "mock-user-token",
    };
  }

  try {
    const body = buildRegisterBody(payload);
    const { data } = await postRegister(body);
    return { user: mapFastApiUserToUsuario(data, payload.role) };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "No se pudo registrar."));
  }
}
