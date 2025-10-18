import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { JSX } from 'react';

type Role = 'usuario' | 'taller' | 'admin';
export function ProtectedRoute({ children, roles }: { children: JSX.Element,
roles?: Role[] }) {
    const { usuario, cargando } = useAuth();
    const location = useLocation();
    if (cargando) return null; // o spinner
    if (!usuario) return <Navigate to="/login" state={{ from: location }}
replace />;
    if (roles && !roles.includes(usuario.tipo)) return <Navigate to="/" replace />;
    return children;
}
    export const RoleRoute = ProtectedRoute;