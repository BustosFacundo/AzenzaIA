import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Error() {
    const location = useLocation();
    const navigate = useNavigate();
    const mensaje = location.state?.mensaje;

    return (
        <div id="error-screen" className="screen d-flex justify-content-center align-items-center">

            {/* Fondo glow */}
            <div className="general-background">
                <div className="general-glow glow-1"></div>
                <div className="general-glow glow-2"></div>
            </div>

             {/* Contenedor de error */}
            <div className="text-center">
                <div className="error-box d-flex align-items-start gap-3 mb-4">

                    {/* Icono */}
                    <i className="fas fa-exclamation-circle error-icon"></i>

                    {/* Texto */}
                    <div>
                        <h3 className="fw-bold mb-1">Error en el sistema</h3>
                        <p className="mb-0 opacity-75">
                            {mensaje || "Ocurrió un problema al procesar la solicitud. Intenta nuevamente."}
                        </p>
                    </div>
                </div>

                {/* Botón volver */}
                <div className="results-button">
                    <button onClick={() => navigate('/analisis')}>
                        <i className="fas fa-redo"></i> Intentar de nuevo
                    </button>
                </div>
            </div>
        </div>
    );
}