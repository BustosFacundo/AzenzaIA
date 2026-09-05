import { prisma } from "../config/db.js";

/**
 * Bloquea la ruta si no hay sesión activa.
 * Si la hay, deja el usuario disponible en req.user.
 */
export const requireAuth = async (req, res, next) => {
    if (!req.session?.userId) {
        return res.status(401).json({ error: "Necesitás iniciar sesión para usar esta función." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });

        // La sesión apunta a un usuario que ya no existe (cuenta eliminada)
        if (!user) {
            req.session.destroy(() => {});
            return res.status(401).json({ error: "Tu sesión ya no es válida. Iniciá sesión de nuevo." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verificando la sesión:", error);
        res.status(500).json({ error: "No se pudo verificar la sesión." });
    }
};
