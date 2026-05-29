import { randomUUID } from "crypto";

// Almacenamiento en memoria: { [key: string]: { count: number, resetAt: number } }
const usageStore = new Map();

const DAILY_LIMIT = 3;
const COOKIE_NAME = "uid";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 año en ms

function getMidnightTimestamp() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // próxima medianoche
    return midnight.getTime();
}

function getOrCreateKey(req, res) {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;

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

export const rateLimitMiddleware = (req, res, next) => {
    const { key } = getOrCreateKey(req, res);
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
