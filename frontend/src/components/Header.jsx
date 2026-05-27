import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
    { to: "/inicio", label: "Inicio" },
    { to: "/analisis", label: "Análisis" },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`az-header ${scrolled ? 'az-header--scrolled' : ''}`}>
            <div className="az-header__inner">

                {/* Brand */}
                <NavLink className="az-header__brand" to="/inicio">
                    <img src="/logo_azenza.png" alt="Logo" height="38" />
                    <img src="/nombre.png" alt="Azenza" height="34" />
                </NavLink>

                {/* Divisor vertical */}
                <div className="az-header__divider" />

                {/* Nav */}
                <nav className="az-header__nav">
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `az-header__link ${isActive ? 'az-header__link--active' : ''}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

            </div>
        </header>
    );
}
