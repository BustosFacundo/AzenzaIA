import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PasswordInput } from "../components/PasswordInput";

const MIN_PASSWORD = 8;

export function Registro() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [negocio, setNegocio] = useState("");
    const [password, setPassword] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const { registrar } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const destino = location.state?.from || "/analisis";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !email.trim() || !password) {
            setError("Completá nombre, email y contraseña.");
            return;
        }

        if (password.length < MIN_PASSWORD) {
            setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
            return;
        }

        if (password !== confirmacion) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setEnviando(true);

        try {
            await registrar({ nombre, email, negocio, password });
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
                        <i className="fas fa-user-plus"></i>
                    </span>
                    <h1 className="auth-card__title">Creá tu cuenta</h1>
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
                        <label htmlFor="reg-nombre">Nombre</label>
                        <input
                            id="reg-nombre"
                            type="text"
                            autoComplete="name"
                            placeholder="Cómo te llamás"
                            maxLength={80}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            autoComplete="email"
                            placeholder="tunombre@email.com"
                            maxLength={160}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="reg-negocio">
                            Negocio <span className="auth-field__optional">(opcional)</span>
                        </label>
                        <input
                            id="reg-negocio"
                            type="text"
                            autoComplete="organization"
                            placeholder="Nombre de tu marca o emprendimiento"
                            maxLength={120}
                            value={negocio}
                            onChange={(e) => setNegocio(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="reg-password">Contraseña</label>
                        <PasswordInput
                            id="reg-password"
                            autoComplete="new-password"
                            placeholder={`Mínimo ${MIN_PASSWORD} caracteres`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="reg-confirmacion">Repetir contraseña</label>
                        <PasswordInput
                            id="reg-confirmacion"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={confirmacion}
                            onChange={(e) => setConfirmacion(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={enviando}>
                        {enviando ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin"></i> Creando cuenta...
                            </>
                        ) : (
                            <>
                                Crear cuenta <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>

                <p className="auth-switch">
                    ¿Ya tenés cuenta? <Link to="/login" state={location.state}>Iniciá sesión</Link>
                </p>

            </div>
        </div>
    );
}
