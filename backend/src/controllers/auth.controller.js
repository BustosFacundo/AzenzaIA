import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

const SALT_ROUNDS = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

// ===============================
// ========= HELPERS =============
// ===============================

/** Nunca devolvemos el hash de la contraseña al frontend. */
const publicUser = (user) => ({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    negocio: user.negocio,
    createdAt: user.createdAt,
});

/**
 * Regenera el id de sesión antes de guardar el usuario.
 * Previene ataques de session fixation.
 */
const iniciarSesion = (req, userId) =>
    new Promise((resolve, reject) => {
        req.session.regenerate((errRegenerar) => {
            if (errRegenerar) return reject(errRegenerar);

            req.session.userId = userId;

            req.session.save((errGuardar) => {
                if (errGuardar) return reject(errGuardar);
                resolve();
            });
        });
    });

const limpiar = (valor) => (typeof valor === "string" ? valor.trim() : "");

// ===============================
// ========= REGISTRO ============
// ===============================

export const register = async (req, res) => {
    try {
        const nombre = limpiar(req.body.nombre);
        const email = limpiar(req.body.email).toLowerCase();
        const negocio = limpiar(req.body.negocio) || null;
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: "Completá nombre, email y contraseña." });
        }

        if (nombre.length > 80) {
            return res.status(400).json({ error: "El nombre no puede superar los 80 caracteres." });
        }

        if (negocio && negocio.length > 120) {
            return res.status(400).json({ error: "El nombre del negocio no puede superar los 120 caracteres." });
        }

        if (!EMAIL_REGEX.test(email) || email.length > 160) {
            return res.status(400).json({ error: "Ingresá un email válido." });
        }

        if (password.length < MIN_PASSWORD) {
            return res.status(400).json({ error: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.` });
        }

        const existente = await prisma.user.findUnique({ where: { email } });

        if (existente) {
            return res.status(409).json({ error: "Ya existe una cuenta registrada con ese email." });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: { nombre, email, passwordHash, negocio },
        });

        await iniciarSesion(req, user.id);

        res.status(201).json({ user: publicUser(user) });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "No se pudo crear la cuenta. Intentá de nuevo." });
    }
};

// ===============================
// ========== LOGIN ==============
// ===============================

export const login = async (req, res) => {
    try {
        const email = limpiar(req.body.email).toLowerCase();
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!email || !password) {
            return res.status(400).json({ error: "Ingresá tu email y contraseña." });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Mensaje genérico a propósito: no revelamos si el email existe o no.
        const credencialesInvalidas = { error: "Email o contraseña incorrectos." };

        if (!user) {
            // Comparación falsa para que el tiempo de respuesta sea parecido
            // exista o no el usuario (mitiga timing attacks).
            await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidooo");
            return res.status(401).json(credencialesInvalidas);
        }

        const coincide = await bcrypt.compare(password, user.passwordHash);

        if (!coincide) {
            return res.status(401).json(credencialesInvalidas);
        }

        await iniciarSesion(req, user.id);

        res.json({ user: publicUser(user) });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "No se pudo iniciar sesión. Intentá de nuevo." });
    }
};

// ===============================
// ========== LOGOUT =============
// ===============================

export const logout = (req, res) => {
    if (!req.session) {
        return res.json({ ok: true });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Error cerrando sesión:", error);
            return res.status(500).json({ error: "No se pudo cerrar la sesión." });
        }

        res.clearCookie("azenza.sid");
        res.json({ ok: true });
    });
};

// ===============================
// ====== SESIÓN ACTUAL ==========
// ===============================

/**
 * Devuelve el usuario logueado, o null si no hay sesión.
 * Responde 200 en ambos casos para que el frontend pueda consultar
 * el estado al cargar la página sin tratar la ausencia como un error.
 */
export const me = async (req, res) => {
    try {
        if (!req.session?.userId) {
            return res.json({ user: null });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });

        if (!user) {
            req.session.destroy(() => {});
            return res.json({ user: null });
        }

        res.json({ user: publicUser(user) });

    } catch (error) {
        console.error("Error obteniendo la sesión:", error);
        res.status(500).json({ error: "No se pudo obtener la sesión." });
    }
};

// ===============================
// ===== ACTUALIZAR PERFIL =======
// ===============================

export const updateProfile = async (req, res) => {
    try {
        const datos = {};

        if (req.body.nombre !== undefined) {
            const nombre = limpiar(req.body.nombre);

            if (!nombre) {
                return res.status(400).json({ error: "El nombre no puede quedar vacío." });
            }

            if (nombre.length > 80) {
                return res.status(400).json({ error: "El nombre no puede superar los 80 caracteres." });
            }

            datos.nombre = nombre;
        }

        if (req.body.negocio !== undefined) {
            const negocio = limpiar(req.body.negocio);

            if (negocio.length > 120) {
                return res.status(400).json({ error: "El nombre del negocio no puede superar los 120 caracteres." });
            }

            datos.negocio = negocio || null;
        }

        if (req.body.email !== undefined) {
            const email = limpiar(req.body.email).toLowerCase();

            if (!EMAIL_REGEX.test(email) || email.length > 160) {
                return res.status(400).json({ error: "Ingresá un email válido." });
            }

            if (email !== req.user.email) {
                const ocupado = await prisma.user.findUnique({ where: { email } });

                if (ocupado) {
                    return res.status(409).json({ error: "Ese email ya está en uso por otra cuenta." });
                }

                datos.email = email;
            }
        }

        if (Object.keys(datos).length === 0) {
            return res.json({ user: publicUser(req.user) });
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: datos,
        });

        res.json({ user: publicUser(user) });

    } catch (error) {
        console.error("Error actualizando el perfil:", error);
        res.status(500).json({ error: "No se pudieron guardar los cambios." });
    }
};

// ===============================
// ==== CAMBIAR CONTRASEÑA =======
// ===============================

export const updatePassword = async (req, res) => {
    try {
        const actual = typeof req.body.passwordActual === "string" ? req.body.passwordActual : "";
        const nueva = typeof req.body.passwordNueva === "string" ? req.body.passwordNueva : "";

        if (!actual || !nueva) {
            return res.status(400).json({ error: "Ingresá tu contraseña actual y la nueva." });
        }

        if (nueva.length < MIN_PASSWORD) {
            return res.status(400).json({ error: `La contraseña nueva debe tener al menos ${MIN_PASSWORD} caracteres.` });
        }

        const coincide = await bcrypt.compare(actual, req.user.passwordHash);

        if (!coincide) {
            return res.status(401).json({ error: "La contraseña actual es incorrecta." });
        }

        const passwordHash = await bcrypt.hash(nueva, SALT_ROUNDS);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { passwordHash },
        });

        res.json({ ok: true });

    } catch (error) {
        console.error("Error cambiando la contraseña:", error);
        res.status(500).json({ error: "No se pudo cambiar la contraseña." });
    }
};
