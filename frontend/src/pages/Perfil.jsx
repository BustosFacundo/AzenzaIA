import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PasswordInput } from "../components/PasswordInput";

const MIN_PASSWORD = 8;

export function Perfil() {
    const { user, actualizarPerfil, cambiarPassword, logout } = useAuth();
    const navigate = useNavigate();

    // ── Datos del perfil ──
    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState(user?.nombre ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [negocio, setNegocio] = useState(user?.negocio ?? "");
    const [errorPerfil, setErrorPerfil] = useState("");
    const [okPerfil, setOkPerfil] = useState("");
    const [guardando, setGuardando] = useState(false);

    // ── Contraseña ──
    const [abrirPassword, setAbrirPassword] = useState(false);
    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNueva, setPasswordNueva] = useState("");
    const [confirmacion, setConfirmacion] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [okPassword, setOkPassword] = useState("");
    const [cambiando, setCambiando] = useState(false);

    // Si el usuario cambia (por ejemplo al recargar la sesión), sincronizamos
    useEffect(() => {
        if (!user) return;
        setNombre(user.nombre ?? "");
        setEmail(user.email ?? "");
        setNegocio(user.negocio ?? "");
    }, [user]);

    if (!user) return null;

    const iniciales = user.nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0].toUpperCase())
        .join("");

    const miembroDesde = new Date(user.createdAt).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
    });

    const cancelarEdicion = () => {
        setNombre(user.nombre ?? "");
        setEmail(user.email ?? "");
        setNegocio(user.negocio ?? "");
        setErrorPerfil("");
        setEditando(false);
    };

    const handleGuardarPerfil = async (e) => {
        e.preventDefault();
        setErrorPerfil("");
        setOkPerfil("");

        if (!nombre.trim() || !email.trim()) {
            setErrorPerfil("El nombre y el email no pueden quedar vacíos.");
            return;
        }

        setGuardando(true);

        try {
            await actualizarPerfil({ nombre, email, negocio });
            setOkPerfil("Datos actualizados correctamente.");
            setEditando(false);
        } catch (err) {
            setErrorPerfil(err.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleCambiarPassword = async (e) => {
        e.preventDefault();
        setErrorPassword("");
        setOkPassword("");

        if (!passwordActual || !passwordNueva) {
            setErrorPassword("Completá tu contraseña actual y la nueva.");
            return;
        }

        if (passwordNueva.length < MIN_PASSWORD) {
            setErrorPassword(`La contraseña nueva debe tener al menos ${MIN_PASSWORD} caracteres.`);
            return;
        }

        if (passwordNueva !== confirmacion) {
            setErrorPassword("Las contraseñas nuevas no coinciden.");
            return;
        }

        setCambiando(true);

        try {
            await cambiarPassword(passwordActual, passwordNueva);
            setOkPassword("Contraseña actualizada.");
            setPasswordActual("");
            setPasswordNueva("");
            setConfirmacion("");
            setAbrirPassword(false);
        } catch (err) {
            setErrorPassword(err.message);
        } finally {
            setCambiando(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/inicio");
    };

    return (
        <div className="perfil-screen">

            {/* Fondo glow */}
            <div className="general-background">
                <div className="general-glow glow-1"></div>
                <div className="general-glow glow-2"></div>
            </div>

            <div className="perfil-wrapper">

                {/* Encabezado */}
                <div className="perfil-header glass-panel">
                    <div className="perfil-avatar">{iniciales || <i className="fas fa-user"></i>}</div>
                    <div className="perfil-header__info">
                        <h1>{user.nombre}</h1>
                        <p>{user.email}</p>
                        {user.negocio && (
                            <span className="perfil-badge">
                                <i className="fas fa-briefcase"></i> {user.negocio}
                            </span>
                        )}
                    </div>
                    <span className="perfil-header__desde">Miembro desde {miembroDesde}</span>
                </div>

                {/* Datos de la cuenta */}
                <section className="perfil-panel glass-panel">

                    <div className="perfil-panel__head">
                        <h2><i className="fas fa-id-card"></i> Tus datos</h2>
                        {!editando && (
                            <button
                                type="button"
                                className="perfil-btn perfil-btn--ghost"
                                onClick={() => { setEditando(true); setOkPerfil(""); }}
                            >
                                <i className="fas fa-pen"></i> Editar
                            </button>
                        )}
                    </div>

                    {errorPerfil && (
                        <div className="auth-error">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{errorPerfil}</span>
                        </div>
                    )}

                    {okPerfil && (
                        <div className="auth-ok">
                            <i className="fas fa-check-circle"></i>
                            <span>{okPerfil}</span>
                        </div>
                    )}

                    {editando ? (
                        <form className="auth-form" onSubmit={handleGuardarPerfil} noValidate>

                            <div className="auth-field">
                                <label htmlFor="perfil-nombre">Nombre</label>
                                <input
                                    id="perfil-nombre"
                                    type="text"
                                    maxLength={80}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="perfil-email">Email</label>
                                <input
                                    id="perfil-email"
                                    type="email"
                                    maxLength={160}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="perfil-negocio">
                                    Negocio <span className="auth-field__optional">(opcional)</span>
                                </label>
                                <input
                                    id="perfil-negocio"
                                    type="text"
                                    maxLength={120}
                                    value={negocio}
                                    onChange={(e) => setNegocio(e.target.value)}
                                />
                            </div>

                            <div className="perfil-acciones">
                                <button type="submit" className="auth-submit" disabled={guardando}>
                                    {guardando ? (
                                        <><i className="fas fa-circle-notch fa-spin"></i> Guardando...</>
                                    ) : (
                                        <><i className="fas fa-check"></i> Guardar cambios</>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="perfil-btn perfil-btn--ghost"
                                    onClick={cancelarEdicion}
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <dl className="perfil-datos">
                            <div>
                                <dt>Nombre</dt>
                                <dd>{user.nombre}</dd>
                            </div>
                            <div>
                                <dt>Email</dt>
                                <dd>{user.email}</dd>
                            </div>
                            <div>
                                <dt>Negocio</dt>
                                <dd>{user.negocio || <span className="perfil-vacio">Sin especificar</span>}</dd>
                            </div>
                        </dl>
                    )}
                </section>

                {/* Seguridad */}
                <section className="perfil-panel glass-panel">

                    <div className="perfil-panel__head">
                        <h2><i className="fas fa-shield-halved"></i> Seguridad</h2>
                        {!abrirPassword && (
                            <button
                                type="button"
                                className="perfil-btn perfil-btn--ghost"
                                onClick={() => { setAbrirPassword(true); setOkPassword(""); }}
                            >
                                <i className="fas fa-key"></i> Cambiar contraseña
                            </button>
                        )}
                    </div>

                    {errorPassword && (
                        <div className="auth-error">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{errorPassword}</span>
                        </div>
                    )}

                    {okPassword && (
                        <div className="auth-ok">
                            <i className="fas fa-check-circle"></i>
                            <span>{okPassword}</span>
                        </div>
                    )}

                    {abrirPassword ? (
                        <form className="auth-form" onSubmit={handleCambiarPassword} noValidate>

                            <div className="auth-field">
                                <label htmlFor="perfil-password-actual">Contraseña actual</label>
                                <PasswordInput
                                    id="perfil-password-actual"
                                    autoComplete="current-password"
                                    value={passwordActual}
                                    onChange={(e) => setPasswordActual(e.target.value)}
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="perfil-password-nueva">Contraseña nueva</label>
                                <PasswordInput
                                    id="perfil-password-nueva"
                                    autoComplete="new-password"
                                    placeholder={`Mínimo ${MIN_PASSWORD} caracteres`}
                                    value={passwordNueva}
                                    onChange={(e) => setPasswordNueva(e.target.value)}
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="perfil-password-confirmacion">Repetir contraseña nueva</label>
                                <PasswordInput
                                    id="perfil-password-confirmacion"
                                    autoComplete="new-password"
                                    value={confirmacion}
                                    onChange={(e) => setConfirmacion(e.target.value)}
                                />
                            </div>

                            <div className="perfil-acciones">
                                <button type="submit" className="auth-submit" disabled={cambiando}>
                                    {cambiando ? (
                                        <><i className="fas fa-circle-notch fa-spin"></i> Guardando...</>
                                    ) : (
                                        <><i className="fas fa-check"></i> Cambiar contraseña</>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="perfil-btn perfil-btn--ghost"
                                    onClick={() => {
                                        setAbrirPassword(false);
                                        setErrorPassword("");
                                        setPasswordActual("");
                                        setPasswordNueva("");
                                        setConfirmacion("");
                                    }}
                                    disabled={cambiando}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="perfil-nota">
                            Tu contraseña está guardada de forma cifrada. Si querés cambiarla,
                            vas a necesitar la actual.
                        </p>
                    )}
                </section>

                {/* Cerrar sesión */}
                <div className="perfil-logout">
                    <button type="button" onClick={handleLogout}>
                        <i className="fas fa-right-from-bracket"></i> Cerrar sesión
                    </button>
                </div>

            </div>
        </div>
    );
}
