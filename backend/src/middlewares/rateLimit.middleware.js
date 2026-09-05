import { randomUUID } from "crypto";

// Almacenamiento en memoria: { [key: string]: { count: number, resetAt: number } }
const usageStore = new Map();
const authStore = new Map();

const DAILY_LIMIT = 3;
const COOKIE_NAME = "uid";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 año en ms

// Límite de intentos de login/registro por IP
const AUTH_LIMIT = 10;
const AUTH_WINDOW = 15 * 60 * 1000; // 15 minutos

function getMidnightTimestamp() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // próxima medianoche
    return midnight.getTime();
}

function getIp(req) {
    return req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
}

function getOrCreateKey(req, res) {
    const ip = getIp(req);

    let cookieId = req.cookies?.[COOKIE_NAME];
    if (!cookieId) {
        cookieId = randomUUID();
        res.cookie(COOKIE_NAME, cookieId, {
            maxAge: COOKIE_MAX_AGE,
            httpOnly: true,
            sameSite: "strict",
        });
    }

    return { key: `${ip}__${cookieId}` };
}

/**
 * Límite diario de análisis.
 * Como /api/analyze ahora exige sesión, la cuota se cuenta por usuario:
 * así no se puede esquivar borrando cookies o cambiando de red.
 * El fallback por IP+cookie se mantiene por si el middleware se reutiliza
 * en alguna ruta pública.
 */
export const rateLimitMiddleware = (req, res, next) => {
    const key = req.user?.id ? `user__${req.user.id}` : getOrCreateKey(req, res).key;
    const now = Date.now();

    const record = usageStore.get(key);

    // Si no existe o ya pasó la medianoche, reiniciar contador
    if (!record || now >= record.resetAt) {
        usageStore.set(key, { count: 1, resetAt: getMidnightTimestamp() });
        return next();
    }

    if (record.count >= DAILY_LIMIT) {
        return res.status(429).json({
            error: "Has alcanzado el límite diario de análisis. Volvé mañana.",
        });
    }

    record.count += 1;
    usageStore.set(key, record);
    next();
};

/**
 * Límite de intentos para las rutas de autenticación.
 * Evita que alguien pruebe contraseñas por fuerza bruta.
 */
export const authRateLimitMiddleware = (req, res, next) => {
    const key = getIp(req);
    const now = Date.now();

    const record = authStore.get(key);

    if (!record || now >= record.resetAt) {
        authStore.set(key, { count: 1, resetAt: now + AUTH_WINDOW });
        return next();
    }

    if (record.count >= AUTH_LIMIT) {
        return res.status(429).json({
            error: "Demasiados intentos. Esperá unos minutos e intentá de nuevo.",
        });
    }

    record.count += 1;
    authStore.set(key, record);
    next();
};
