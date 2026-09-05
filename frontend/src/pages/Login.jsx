import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PasswordInput } from "../components/PasswordInput";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Si llegó acá por querer entrar a una ruta protegida, volvemos ahí
    const destino = location.state?.from || "/analisis";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Completá tu email y contraseña.");
            return;
        }

        setEnviando(true);

        try {
            await login(email, password);
            navigate(destino, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="auth-screen">

            {/* Fondo glow */}
            <div className="general-background">
                <div className="general-glow glow-1"></div>
                <div className="general-glow glow-2"></div>
            </div>

            <div className="auth-card glass-panel">

                <div className="auth-card__head">
                    <span className="auth-card__icon">
                        <i className="fas fa-lock"></i>
                    </span>
                    <h1 className="auth-card__title">Iniciá sesión</h1>
                    <p className="auth-card__subtitle">
                        Accedé a las herramientas disponibles para vos.
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>

                    <div className="auth-field">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="tunombre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="login-password">Contraseña</label>
                        <PasswordInput
                            id="login-password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={enviando}>
                        {enviando ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin"></i> Ingresando...
                            </>
                        ) : (
                            <>
                                Ingresar <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>

                <p className="auth-switch">
                    ¿Todavía no tenés cuenta? <Link to="/registro" state={location.state}>Creá una gratis</Link>
                </p>

            </div>
        </div>
    );
}
