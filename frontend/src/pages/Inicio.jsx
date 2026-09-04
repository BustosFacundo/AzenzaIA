import { useEffect, useRef } from 'react';
import { Analisis } from './Analisis';
import { useNavigate } from "react-router-dom";

/* Íconos de la sección "Profesionalizar" */
const IconIdentidad = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    </svg>
);

const IconComunicacion = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 5.5h15a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9.2L4.5 20V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="8.5" cy="10.7" r="1" fill="currentColor" />
        <circle cx="12" cy="10.7" r="1" fill="currentColor" />
        <circle cx="15.5" cy="10.7" r="1" fill="currentColor" />
    </svg>
);

const IconProcesos = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7.3 8.6l1.3 1.3 2.3-2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 8h3.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7.3 13.6l1.3 1.3 2.3-2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 13h3.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 17.5h9.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const IconPlanificacion = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 9.7h17" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8.3 14.3l1.8 1.8L15 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconGestionFinanciera = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7.2v9.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.6 9.6c0-1.1-1.16-2-2.6-2s-2.6.9-2.6 2c0 1.1 1.16 1.6 2.6 2s2.6.9 2.6 2-1.16 2-2.6 2-2.6-.9-2.6-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconIndicadores = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20V11M9.5 20V6.5M15 20v-7M20 20V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 9.3l5-4 4.5 3L20 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

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

                <div className="hero__side reveal">
                    <span className="hero__divider" />
                    <p className="hero__side-text">
                        <strong>Profesionaliza</strong> tu negocio y <strong>compite</strong> por
                        el liderazgo de tu nicho.
                    </p>
                </div>
            </section>

            {/* ── PROFESIONALIZAR ── */}
            <section ref={problemaRef} className="profesionalizar">
                <div className="profesionalizar__inner">
                    <h2 className="profesionalizar__title reveal">
                        ¿Qué significa <span className="profesionalizar__emphasis">profesionalizar</span> un negocio?
                    </h2>
                    <p className="profesionalizar__subtitle reveal">
                        Profesionalizar un negocio significa dejar de manejarlo "como se puede" y
                        empezar a gestionarlo con orden, estrategia y procesos claros para que
                        pueda crecer de forma sostenible.
                    </p>

                    <div className="profesionalizar__steps">
                        {[
                            {
                                icon: <IconIdentidad />,
                                num: '01',
                                title: 'Identidad clara:',
                                desc: 'definir quién es el negocio, qué ofrece, a quién ayuda y por qué es diferente.',
                            },
                            {
                                icon: <IconComunicacion />,
                                num: '02',
                                title: 'Comunicación específica:',
                                desc: 'transmitir un mensaje coherente en redes sociales, publicidad, atención al cliente y ventas.',
                            },
                            {
                                icon: <IconProcesos />,
                                num: '03',
                                title: 'Procesos documentados:',
                                desc: 'establecer paso a paso cómo se realizan las tareas para evitar errores, ahorrar tiempo y facilitar el crecimiento.',
                            },
                            {
                                icon: <IconPlanificacion />,
                                num: '04',
                                title: 'Planificación:',
                                desc: 'fijar objetivos, prioridades y un plan de acción en lugar de actuar únicamente por urgencias.',
                            },
                            {
                                icon: <IconGestionFinanciera />,
                                num: '05',
                                title: 'Gestión financiera:',
                                desc: 'conocer costos, ingresos, rentabilidad y flujo de caja para tomar decisiones con datos y no por intuición.',
                            },
                            {
                                icon: <IconIndicadores />,
                                num: '06',
                                title: 'Indicadores de desempeño:',
                                desc: 'medir resultados para saber qué funciona, qué no y dónde mejorar.',
                            },
                        ].map(({ icon, num, title, desc }) => (
                            <div className="pro-step glass-panel reveal" key={num}>
                                <div className="pro-step__icon">{icon}</div>
                                <span className="pro-step__number">{num}</span>
                                <div className="pro-step__text">
                                    <h3 className="pro-step__title">{title}</h3>
                                    <p className="pro-step__desc">{desc}</p>
                                </div>
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
                                { num: '01', label: 'Estrategia', desc: 'Ordenamos la operación desde su base.' },
                                { num: '02', label: 'Estructura', desc: 'Definimos dirección con lógica y criterio.' },
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

            {/* ── POR QUÉ AZENZA IA ── */}
            <section className="why-ai">
                <div className="why-ai__inner">
                    <div className="why-ai__visual reveal">
                        <img
                            src="/ecosistema.jpeg"
                            alt="Ecosistema de negocios: identidad, comunicación, finanzas, crecimiento y procesos"
                            className="why-ai__img"
                        />
                    </div>
                    <div className="why-ai__content glass-panel reveal">
                        <p className="section-label">Nuestra motivacion</p>
                        <h2 className="section-title">¿Para qué creamos Azenza IA?</h2>
                        <p className="why-ai__desc">
                            Para transformar respuestas genéricas en decisiones estratégicas. Azenza
                            IA busca guíar al emprendedor a través de un formulario estructurado para
                            brindar el contexto correcto y obtener análisis realmente útiles para
                            su negocio.
                        </p>
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
                        Estrategia. Estructura. Escala.
                    </h2>
                    <p className="cta__desc">
                        Empezá con un diagnóstico de tu comunicación en redes y descubrí
                        cómo alinearla con tu público objetivo.
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
