import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results;

    // Redirección por error
    useEffect(() => {
        if (!results) {
            navigate('/error', { state: { mensaje: 'No hay resultados para mostrar.' } });
        }
    }, []);

    if (!results) return null;

    const cards = [
        {
            key: 'profileAnalysis',
            title: 'Coherencia Bio',
            icon: 'fas fa-id-card',
            borderClass: 'border-blue',
            data: results.profileAnalysis,
        },
        {
            key: 'visualIdentity',
            title: 'Impacto Visual',
            icon: 'fas fa-eye',
            borderClass: 'border-purple',
            data: results.visualIdentity,
        },
        {
            key: 'contentStrategy',
            title: 'Contenido',
            icon: 'fas fa-photo-video',
            borderClass: 'border-pink',
            data: results.contentStrategy,
        },
    ];

    return (
        <div id="results-screen" className="container">

            {/* Fondo */}
            <div className="general-background">
                <div className="general-glow glow-1"></div>
                <div className="general-glow glow-2"></div>
            </div>

            <div className="results-wrapper">

                {/* Separador */}
                <div className="results-divider">
                    <div></div>
                    <h2>Informe Generado</h2>
                    <div></div>
                </div>

                {/* Resumen General */}
                <div className="glass-panel results-summary">
                    <i className="fas fa-quote-right results-quote"></i>
                    <h3>Veredicto General</h3>
                    <p>{results.overallSummary}</p>
                </div>

                {/* Cards */}
                <div className="results-grid">
                    {cards.map(({ key, title, icon, borderClass, data }) => (
                        <div key={key} className={`glass-panel results-card ${borderClass}`}>
                            <div className="results-card-header">
                                <h4><i className={icon}></i> {title}</h4>
                                <div className="score">{data.score}</div>
                            </div>

                            <div className="results-card-body">
                                <div>
                                    <p className="ok">✔ Aciertos</p>
                                    <p>{data.positives}</p>
                                </div>
                                <div>
                                    <p className="bad">✖ Desconexión</p>
                                    <p>{data.negatives}</p>
                                </div>
                            </div>

                            <div className="results-card-footer">
                                <p>Acción Recomendada</p>
                                <span>"{data.recommendation}"</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botón */}
                <div className="results-button">
                    <button onClick={() => navigate('/analisis')}>
                        <i className="fas fa-redo"></i> Nuevo Análisis
                    </button>
                </div>

            </div>
        </div>
    );
}