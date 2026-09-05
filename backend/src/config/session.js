import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET) {
    throw new Error("Falta la variable de entorno SESSION_SECRET");
}

if (!process.env.DATABASE_URL) {
    throw new Error("Falta la variable de entorno DATABASE_URL");
}

// Las sesiones se guardan en la misma base Postgres (tabla "session").
// createTableIfMissing hace que la tabla se cree sola la primera vez.
export const sessionMiddleware = session({
    store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: "session",
        createTableIfMissing: true,
        // Limpia sesiones vencidas cada 15 minutos
        pruneSessionInterval: 60 * 15,
    }),
    name: "azenza.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Renueva la expiración en cada request, así el usuario activo no se desloguea
    rolling: true,
    cookie: {
        httpOnly: true,
        // En producción el frontend (Netlify) y el backend (Render) están en
        // dominios distintos, así que la cookie tiene que ser cross-site.
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    },
});
