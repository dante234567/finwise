// ═══════════════════════════════════════════════════════════════════════════
// Serialización Decimal → String para la frontera Server → Client
// ═══════════════════════════════════════════════════════════════════════════
// INVARIANTE:
//   Next.js no puede serializar objetos Prisma.Decimal al cruzar la
//   frontera Server Component/Action → Client Component.
//   Toda entidad con campos Decimal DEBE pasar por estas funciones
//   antes de ser retornada en un ActionResponse.
// ═══════════════════════════════════════════════════════════════════════════

import type { Profile, Transaction } from '@/generated/prisma'

// ─── Tipos serializados (Decimal → string) ────────────────────────────────

/** Profile con todos los campos Decimal convertidos a string */
export interface SerializedProfile {
  id: string
  authUserId: string
  targetMargin: string
  taxFixed: string
  taxVariable: string
  createdAt: string
  updatedAt: string
}

/** Transaction con el campo amount convertido a string */
export interface SerializedTransaction {
  id: string
  profileId: string
  amount: string
  type: 'INCOME' | 'EXPENSE'
  concept: string
  quantity: number
  isFixed: boolean
  isBusiness: boolean
  createdAt: string
}

// ─── Funciones de serialización ───────────────────────────────────────────

/**
 * Convierte un Profile de Prisma a un objeto serializable para JSON.
 * Todos los campos Decimal se transforman a string vía .toString().
 * Las fechas se convierten a ISO string.
 */
export function serializeProfile(profile: Profile): SerializedProfile {
  return {
    id: profile.id,
    authUserId: profile.authUserId,
    targetMargin: profile.targetMargin.toString(),
    taxFixed: profile.taxFixed.toString(),
    taxVariable: profile.taxVariable.toString(),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  }
}

/**
 * Convierte una Transaction de Prisma a un objeto serializable para JSON.
 * El campo amount (Decimal) se transforma a string vía .toString().
 * Las fechas se convierten a ISO string.
 */
export function serializeTransaction(transaction: Transaction): SerializedTransaction {
  return {
    id: transaction.id,
    profileId: transaction.profileId,
    amount: transaction.amount.toString(),
    type: transaction.type,
    concept: transaction.concept,
    quantity: transaction.quantity,
    isFixed: transaction.isFixed,
    isBusiness: transaction.isBusiness,
    createdAt: transaction.createdAt.toISOString(),
  }
}
