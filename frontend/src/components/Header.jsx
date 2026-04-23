import React from "react";
import { NavLink } from "react-router-dom";

export function Header() {
    return (
        <nav id="menu" className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <NavLink id="marca" className="navbar-brand" to="/inicio">
                    <img src="/logo_azenza.png" alt="Logo" width="40" height="40" />
                    <img src="/titulo.png" alt="Nombre marca" height="22" />
                </NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="items-navegacion nav-link" to="/inicio">
                                Inicio
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="items-navegacion nav-link" to="/analisis">
                                Análisis
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="items-navegacion nav-link" to="/loading">
                                Loading
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="items-navegacion nav-link" to="/error">
                                Error
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="items-navegacion nav-link" to="/results">
                                Results
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
