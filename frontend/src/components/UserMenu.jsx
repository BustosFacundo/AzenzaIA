import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
    const { user, cargando, logout } = useAuth();
    const [abierto, setAbierto] = useState(false);
    const contenedorRef = useRef(null);
    const navigate = useNavigate();

    // Cerrar al hacer click afuera o con Escape
    useEffect(() => {
        if (!abierto) return;

        const handleClickAfuera = (e) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") setAbierto(false);
        };

        document.addEventListener("mousedown", handleClickAfuera);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickAfuera);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [abierto]);

    const handleLogout = async () => {
        setAbierto(false);
        await logout();
        navigate("/inicio");
    };

    // Mientras se verifica la sesión dejamos un hueco para que el header no salte
    if (cargando) {
        return <div className="az-user az-user--placeholder" aria-hidden="true" />;
    }

    // Sin sesión: invitamos a entrar
    if (!user) {
        return (
            <div className="az-user">
                <Link to="/login" className="az-user__login">
                    <i className="fas fa-user"></i>
                    <span>Iniciar sesión</span>
                </Link>
            </div>
        );
    }

    const iniciales = user.nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0].toUpperCase())
        .join("");

    return (
        <div className="az-user" ref={contenedorRef}>

            <button
                type="button"
                className={`az-user__trigger ${abierto ? "az-user__trigger--activo" : ""}`}
                onClick={() => setAbierto((valor) => !valor)}
                aria-haspopup="menu"
                aria-expanded={abierto}
                aria-label="Menú de usuario"
            >
                <span className="az-user__avatar">{iniciales || <i className="fas fa-user"></i>}</span>
                <i className={`fas fa-chevron-down az-user__chevron ${abierto ? "az-user__chevron--abierto" : ""}`}></i>
            </button>

            {abierto && (
                <div className="az-user__menu" role="menu">

                    <div className="az-user__menu-head">
                        <p className="az-user__menu-nombre">{user.nombre}</p>
                        <p className="az-user__menu-email">{user.email}</p>
                        {user.negocio && <p className="az-user__menu-negocio">{user.negocio}</p>}
                    </div>

                    <Link
                        to="/perfil"
                        className="az-user__menu-item"
                        role="menuitem"
                        onClick={() => setAbierto(false)}
                    >
                        <i className="fas fa-id-card"></i> Mi información
                    </Link>

                    <Link
                        to="/analisis"
                        className="az-user__menu-item"
                        role="menuitem"
                        onClick={() => setAbierto(false)}
                    >
                        <i className="fas fa-bolt"></i> Nuevo análisis
                    </Link>

                    <button
                        type="button"
                        className="az-user__menu-item az-user__menu-item--salir"
                        role="menuitem"
                        onClick={handleLogout}
                    >
                        <i className="fas fa-right-from-bracket"></i> Cerrar sesión
                    </button>

                </div>
            )}
        </div>
    );
}
