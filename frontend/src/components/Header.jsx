import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserMenu } from "./UserMenu";

const NAV_LINKS = [
    { to: "/inicio", label: "Inicio" },
    { to: "/analisis", label: "Análisis" }
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const burgerRef = useRef(null);
    const mobileNavRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar el menú mobile al hacer click afuera o con Escape
    useEffect(() => {
        if (!menuAbierto) return;

        const handleClickAfuera = (e) => {
            const clickeoElBurger = burgerRef.current?.contains(e.target);
            const clickeoElMenu = mobileNavRef.current?.contains(e.target);
            if (!clickeoElBurger && !clickeoElMenu) {
                setMenuAbierto(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") setMenuAbierto(false);
        };

        document.addEventListener("mousedown", handleClickAfuera);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickAfuera);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [menuAbierto]);

    return (
        <header className={`az-header ${scrolled ? 'az-header--scrolled' : ''}`}>
            <div className="az-header__inner">

                {/* Hamburguesa (solo mobile) */}
                <button
                    ref={burgerRef}
                    type="button"
                    className={`az-header__burger ${menuAbierto ? 'az-header__burger--abierto' : ''}`}
                    onClick={() => setMenuAbierto((valor) => !valor)}
                    aria-label="Abrir menú de navegación"
                    aria-haspopup="menu"
                    aria-expanded={menuAbierto}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Brand */}
                <NavLink className="az-header__brand" to="/inicio">
                    <img src="/logo_azenza.png" alt="Logo" height="38" />
                    <img src="/nombre.png" alt="Azenza" height="34" />
                </NavLink>

                {/* Divisor vertical */}
                <div className="az-header__divider" />

                {/* Nav (desktop: inline / mobile: desplegable de la hamburguesa) */}
                <nav className="az-header__nav">
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setMenuAbierto(false)}
                            className={({ isActive }) =>
                                `az-header__link ${isActive ? 'az-header__link--active' : ''}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Menú de navegación mobile, desplegado por la hamburguesa */}
                {menuAbierto && (
                    <nav className="az-header__mobile-nav" ref={mobileNavRef} role="menu">
                        {NAV_LINKS.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                role="menuitem"
                                onClick={() => setMenuAbierto(false)}
                                className={({ isActive }) =>
                                    `az-header__mobile-link ${isActive ? 'az-header__mobile-link--active' : ''}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                )}

                {/* Menú de usuario */}
                <UserMenu />

            </div>
        </header>
    );
}
