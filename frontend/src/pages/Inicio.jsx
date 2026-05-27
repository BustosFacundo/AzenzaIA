import { useEffect, useRef } from 'react';
import { Analisis } from './Analisis';
import { useNavigate } from "react-router-dom";

export function Inicio() {
    const heroRef = useRef(null);
    const problemaRef = useRef(null);
    const navigate = useNavigate();

    const smoothScrollTo = (targetY, duration = 800) => {
        const startY = window.scrollY;
        const distance = targetY - startY - 90;
        let startTime = null;

        const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, startY + distance * easeInOut(progress));
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <main id="inicio">

            {/* ── HERO ── */}
            <section className="hero" ref={heroRef}>
                <div className="hero__bg">
                    <div className="hero__glow hero__glow--1" />
                    <div className="hero__glow hero__glow--2" />
                    <div className="hero__glow hero__glow--3" />
                    <div className="hero__grid" />
                </div>

                <div className="hero__content">
                    <div className="hero__eyebrow reveal">
                        <span className="hero__dot" />
                        Consultoría estratégica de negocios
                    </div>

                    <h1 className="hero__title reveal">
                        Menos improvisación.
                        <br />
                        <span className="text-gradient">Más sistema.</span>
                    </h1>

                    <p className="hero__subtitle reveal">
                        Transformamos estructuras desorganizadas en negocios sólidos,
                        eficientes y escalables. Estrategia, sistemas y automatización
                        en un solo enfoque.
                    </p>

                    <div className="hero__actions reveal">
                        <button className="btn-primary" onClick={() => navigate("/analisis")}>
                            Comenzar diagnóstico
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            className="btn-ghost" 
                            onClick={() => {
                                const y = problemaRef.current.getBoundingClientRect().top + window.scrollY;
                                smoothScrollTo(y);
                            }}
                        >
                            Conocer la propuesta
                        </button>
                    </div>
                </div>

                <div className="hero__visual reveal">
                    <div className="system-card glass-panel">
                        <div className="system-card__header">
                            <span className="system-card__badge">Sistema activo</span>
                            <div className="system-card__dots">
                                <span /><span /><span />
                            </div>
                        </div>
                        <div className="system-card__body">
                            {[
                                { label: 'Modelo de negocio', pct: 92 },
                                { label: 'Estrategia comercial', pct: 78 },
                                { label: 'Operaciones', pct: 85 },
                                { label: 'Escalabilidad', pct: 67 },
                            ].map(({ label, pct }) => (
                                <div className="sys-row" key={label}>
                                    <div className="sys-row__info">
                                        <span>{label}</span>
                                        <span className="sys-row__pct">{pct}%</span>
                                    </div>
                                    <div className="sys-row__bar">
                                        <div
                                            className="sys-row__fill"
                                            style={{ '--target': `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="system-card__footer">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" stroke="#4db8b8" strokeWidth="1.4"/>
                                <path d="M4.5 7l2 2 3-3" stroke="#4db8b8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Estructura optimizada
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PROBLEMA / DIFERENCIACION ── */}
            <section ref={problemaRef} className="problem">
                <div className="problem__inner">
                    <p className="section-label reveal">El problema real</p>
                    <h2 className="section-title reveal">
                        El problema no es el marketing.<br />
                        Es la falta de un modelo definido.
                    </h2>
                    <div className="problem__grid">
                        {[
                            {
                                icon: '⚡',
                                title: 'Alto esfuerzo, bajo resultado',
                                desc: 'Trabajás más horas pero el negocio no crece proporcionalmente. La energía se dispersa sin un sistema que la dirija.',
                            },
                            {
                                icon: '🔀',
                                title: 'Decisiones sin criterio',
                                desc: 'Cada decisión se toma desde la intuición y la urgencia, no desde la estrategia y la lógica del negocio.',
                            },
                            {
                                icon: '📉',
                                title: 'Escalar sin sistema es arriesgado',
                                desc: 'Crecer sin estructura sólida incrementa el riesgo de colapso. El volumen amplifica los errores, no los corrige.',
                            },
                        ].map(({ icon, title, desc }) => (
                            <div className="problem-card glass-panel reveal" key={title}>
                                <div className="problem-card__icon">{icon}</div>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ENFOQUE ── */}
            <section className="approach">
                <div className="approach__inner">
                    <div className="approach__left reveal">
                        <p className="section-label">Nuestro enfoque</p>
                        <h2 className="section-title">
                            Un negocio sostenible<br />
                            <span className="text-gradient">se diseña con criterio.</span>
                        </h2>
                        <p className="approach__desc">
                            Azenza no es una agencia de marketing ni una mentoría. Es una
                            consultora especializada en la arquitectura completa de tu negocio,
                            integrando de forma coherente modelo, estrategia, operaciones y
                            escalabilidad.
                        </p>
                        <ul className="approach__list">
                            {[
                                'Diseño integral del modelo de negocio',
                                'Estrategia comercial y de adquisición',
                                'Sistematización de operaciones',
                                'Automatización y escalabilidad',
                            ].map((item) => (
                                <li key={item}>
                                    <span className="check-icon">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7l3 3 6-6" stroke="#4db8b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="approach__right reveal">
                        <div className="pillars">
                            {[
                                { num: '01', label: 'Estructura', desc: 'Ordenamos la operación desde su base.' },
                                { num: '02', label: 'Estrategia', desc: 'Definimos dirección con lógica y criterio.' },
                                { num: '03', label: 'Escala', desc: 'Diseñamos sistemas que sostienen el crecimiento.' },
                            ].map(({ num, label, desc }) => (
                                <div className="pillar glass-panel" key={num}>
                                    <span className="pillar__num">{num}</span>
                                    <div>
                                        <h4 className="pillar__label">{label}</h4>
                                        <p className="pillar__desc">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PARA QUIEN ── */}
            <section className="audience">
                <div className="audience__inner">
                    <p className="section-label reveal">¿Para quién es Azenza?</p>
                    <h2 className="section-title reveal">
                        Para negocios que ya validaron,<br />pero aún no escalaron.
                    </h2>
                    <div className="audience__grid">
                        <div className="audience-card audience-card--yes glass-panel reveal">
                            <div className="audience-card__tag audience-card__tag--yes">Sí es para vos</div>
                            <ul>
                                {[
                                    'Tenés ventas pero no un sistema definido',
                                    'Sentís que trabajás más de lo que creces',
                                    'Querés escalar con lógica y previsibilidad',
                                    'Buscás reemplazar la improvisación por estructura',
                                    'Tu negocio tiene entre 1 y 5 años de validación comercial',
                                ].map((item) => (
                                    <li key={item}>
                                        <span className="dot dot--teal" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="audience-card audience-card--no glass-panel reveal">
                            <div className="audience-card__tag audience-card__tag--no">No es para vos (aún)</div>
                            <ul>
                                {[
                                    'Estás buscando tu primera venta',
                                    'No tenés un producto o servicio validado',
                                    'Querés solo acciones de marketing aisladas',
                                    'Dirigís una gran corporación establecida',
                                ].map((item) => (
                                    <li key={item}>
                                        <span className="dot dot--dim" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section className="cta">
                <div className="cta__bg">
                    <div className="cta__glow" />
                </div>
                <div className="cta__inner reveal">
                    <p className="section-label">Siguiente paso</p>
                    <h2 className="cta__title">
                        Estructura. Estrategia. Escala.
                    </h2>
                    <p className="cta__desc">
                        Empezá con un diagnóstico de tu modelo de negocio y descubrí
                        qué está limitando tu crecimiento.
                    </p>
                    <button className="btn-primary btn-primary--lg" onClick={() => navigate("/analisis")}>
                        Comenzar diagnóstico gratuito
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </section>

        </main>
    );
}
