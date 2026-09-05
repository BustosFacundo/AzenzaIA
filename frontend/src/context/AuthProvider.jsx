import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // Arranca en true: hasta que no consultamos /me no sabemos si hay sesión.
    const [cargando, setCargando] = useState(true);

    /** Wrapper de fetch que siempre manda la cookie de sesión. */
    const request = useCallback(async (path, { method = "GET", body } = {}) => {
        const response = await fetch(`${API_URL}/api/auth${path}`, {
            method,
            credentials: "include",
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || "Ocurrió un error inesperado. Intentá de nuevo.");
        }

        return data;
    }, []);

    // Al montar la app preguntamos si hay una sesión abierta
    useEffect(() => {
        let activo = true;

        request("/me")
            .then((data) => {
                if (activo) setUser(data.user);
            })
            .catch(() => {
                if (activo) setUser(null);
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, [request]);

    const login = useCallback(async (email, password) => {
        const data = await request("/login", {
            method: "POST",
            body: { email, password },
        });

        setUser(data.user);
        return data.user;
    }, [request]);

    const registrar = useCallback(async (datos) => {
        const data = await request("/register", {
            method: "POST",
            body: datos,
        });

        setUser(data.user);
        return data.user;
    }, [request]);

    const logout = useCallback(async () => {
        try {
            await request("/logout", { method: "POST" });
        } finally {
            // Pase lo que pase del lado del servidor, en el cliente
            // dejamos de considerar al usuario logueado.
            setUser(null);
        }
    }, [request]);

    const actualizarPerfil = useCallback(async (datos) => {
        const data = await request("/me", {
            method: "PATCH",
            body: datos,
        });

        setUser(data.user);
        return data.user;
    }, [request]);

    const cambiarPassword = useCallback(async (passwordActual, passwordNueva) => {
        await request("/password", {
            method: "PATCH",
            body: { passwordActual, passwordNueva },
        });
    }, [request]);

    /** La llama Analisis.jsx si el backend responde 401 (sesión vencida). */
    const limpiarSesion = useCallback(() => setUser(null), []);

    const valor = useMemo(
        () => ({
            user,
            cargando,
            login,
            registrar,
            logout,
            actualizarPerfil,
            cambiarPassword,
            limpiarSesion,
        }),
        [user, cargando, login, registrar, logout, actualizarPerfil, cambiarPassword, limpiarSesion]
    );

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
