import { PrismaClient } from '@/generated/prisma'

declare global {
  var prismaGlobal: PrismaClient | undefined
}

/**
 * Patrón Proxy Lazy para el Cliente de Prisma.
 *
 * Durante 'next build', Next.js evalúa todos los módulos. Si se instancia
 * PrismaClient de forma estática y DATABASE_URL no está definida, el build falla.
 * El uso de un Proxy garantiza que New PrismaClient() solo se ejecute cuando 
 * se acceda a una de sus propiedades (ej. al llamar a una consulta).
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (prop === 'then') return undefined; // Compatibility with Promise-like checks if any

    if (!globalThis.prismaGlobal) {
      globalThis.prismaGlobal = new PrismaClient()
    }
    return Reflect.get(globalThis.prismaGlobal, prop, receiver)
  }
})