import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../pages/Loading";

/**
 * Envuelve rutas que requieren sesión.
 * Mientras se verifica la sesión muestra la pantalla de carga; si no hay
 * usuario, manda al login recordando a dónde quería entrar.
 */
export function ProtectedRoute({ children }) {
    const { user, cargando } = useAuth();
    const location = useLocation();

    if (cargando) {
        return (
            <Loading
                titulo="Verificando sesión..."
                subtitulo="Un segundo, estamos comprobando tu acceso"
            />
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}
