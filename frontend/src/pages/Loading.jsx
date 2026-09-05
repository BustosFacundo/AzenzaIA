import React from "react";

export function Loading({
    titulo = "Procesando Datos...",
    subtitulo = "Cruzando estrategia con evidencia visual",
}) {

    return (
        <div id="loading-screen" className="screen d-flex justify-content-center align-items-center">

            {/* Fondo glow */}
            <div className="general-background">
                <div className="general-glow glow-1"></div>
                <div className="general-glow glow-2"></div>
            </div>

            {/* Contenido */}
            <div className="text-center text-light position-relative">

                <div className="loading-spinner-wrapper position-relative">
                    <div className="loading-spinner"></div>

                    <div className="loading-icon d-flex justify-content-center align-items-center">
                        <i className="fas fa-brain"></i>
                    </div>
                </div>

                <h3 className="mt-4 fw-bold loading-pulse">
                    {titulo}
                </h3>

                <p className="text-secondary mt-2">
                    {subtitulo}
                </p>

            </div>
        </div>
    )
}
