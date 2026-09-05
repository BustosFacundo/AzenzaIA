import { PrismaClient } from "@prisma/client";

// Cliente único de Prisma para toda la app.
// En desarrollo se guarda en globalThis para que el hot-reload de nodemon
// no abra una conexión nueva en cada reinicio.
const globalForPrisma = globalThis;

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
