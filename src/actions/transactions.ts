// ═══════════════════════════════════════════════════════════════════════════
// Server Actions — CRUD de Transacciones con validación Zod defensiva
// ═══════════════════════════════════════════════════════════════════════════
// BLINDAJE:
//   1. Retorna ActionResponse<SerializedTransaction> — nunca objetos crudos.
//   2. safeParse() en lugar de parse() — nunca lanza excepciones de Zod.
//   3. Decimal → string antes de cruzar la frontera server → client.
//   4. Errores de BD tipificados con código DB_ERROR.
//   5. Prisma.Decimal para conversión amount string → Decimal sin pérdida.
// ═══════════════════════════════════════════════════════════════════════════
'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { TransactionInputSchema } from '@/validations/financeSchemas'
import { serializeTransaction, type SerializedTransaction } from '@/lib/serializers'
import type { ActionResponse } from '@/types/action'

/**
 * createTransaction — Crea una transacción validada y serializada.
 *
 * Flujo:
 *   1. Valida el input con safeParse() (sin excepciones).
 *   2. Convierte amount (string) → Prisma.Decimal para persistencia.
 *   3. Serializa el resultado (Decimal → string) antes de retornar.
 *
 * @param profileId - UUID del perfil propietario de la transacción.
 * @param input - Payload crudo del cliente (será validado por Zod).
 * @returns ActionResponse<SerializedTransaction>
 */
export async function createTransaction(
  profileId: string,
  input: unknown
): Promise<ActionResponse<SerializedTransaction>> {
  // ── Validación de profileId ─────────────────────────────────────────
  if (!profileId || typeof profileId !== 'string' || profileId.trim().length === 0) {
    return {
      success: false,
      error: 'profileId es requerido y debe ser un string no vacío.',
      code: 'VALIDATION_ERROR',
    }
  }

  // ── Validación defensiva con safeParse (sin excepciones) ────────────
  const parseResult = TransactionInputSchema.safeParse(input)

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.issues
      .map((e) => `${String(e.path.join('.'))}: ${e.message}`)
      .join('; ')

    return {
      success: false,
      error: `Errores de validación: ${fieldErrors}`,
      code: 'VALIDATION_ERROR',
    }
  }

  const validatedData = parseResult.data

  // ── Persistencia con Prisma.Decimal ─────────────────────────────────
  try {
    const transaction = await prisma.transaction.create({
      data: {
        profileId: profileId.trim(),
        amount: new Prisma.Decimal(validatedData.amount),
        type: validatedData.type,
        concept: validatedData.concept,
        quantity: validatedData.quantity,
        isFixed: validatedData.isFixed,
        isBusiness: validatedData.isBusiness,
      },
    })

    return { success: true, data: serializeTransaction(transaction) }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido en createTransaction'
    const isNetworkError = message.includes('P1001') || message.includes("Can't reach database")
    console.error(
      `[createTransaction] ${isNetworkError ? 'NETWORK' : 'DB'} ERROR for profileId="${profileId}":`,
      message
    )
    return {
      success: false,
      error: isNetworkError
        ? 'No se puede conectar a la base de datos. Verifica la conexión de red.'
        : `Error de base de datos: ${message}`,
      code: 'DB_ERROR',
    }
  }
}
