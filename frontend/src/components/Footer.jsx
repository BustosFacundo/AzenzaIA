import { useNavigate } from 'react-router-dom';

export function Footer() {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <footer className="az-footer">
            <div className="az-footer__bg" />

            <div className="az-footer__inner">

                {/* Columnas */}
                <div className="az-footer__cols">

                    {/* Marca */}
                    <div>
                        <img src="/titulo.png" alt="Azenza" className="az-footer__logo" />
                        <p className="az-footer__tagline">
                            Menos improvisación. Más sistema.
                        </p>
                        <div className="az-footer__socials">
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/azenzaok"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="az-footer__social-link"
                                aria-label="Instagram de Azenza"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <circle cx="12" cy="12" r="4"/>
                                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                                </svg>
                            </a>
                            {/* LinkedIn */}
                            <a
                                href="https://www.linkedin.com/company/azenzaok"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="az-footer__social-link"
                                aria-label="LinkedIn de Azenza"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="4" ry="4"/>
                                    <path d="M8 11v5M8 8v.01M12 16v-5M12 11a3 3 0 0 1 6 0v5"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navegación */}
                    <div>
                        <p className="az-footer__col-title">Navegación</p>
                        <ul className="az-footer__nav">
                            <li><a onClick={() => navigate('/')} href="#">Inicio</a></li>
                            <li><a onClick={() => navigate('/analisis')} href="#">Análisis</a></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <p className="az-footer__col-title">Contacto</p>
                        <a
                            href="mailto:contacto@azenza.com"
                            className="az-footer__contact-item"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="M2 7l10 7 10-7"/>
                            </svg>
                            azenzaok@gmail.com
                        </a>
                        <span className="az-footer__contact-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
                            </svg>
                            Córdoba, Argentina
                        </span>
                    </div>

                </div>

                {/* Línea inferior */}
                <div className="az-footer__bottom">
                    <p className="az-footer__copy">
                        © {year} Azenza. Todos los derechos reservados.
                    </p>
                    <nav className="az-footer__legal">
                        <a href="#">Política de privacidad</a>
                        <a href="#">Términos de uso</a>
                    </nav>
                </div>

            </div>
        </footer>
    );
}