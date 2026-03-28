// ═══════════════════════════════════════════════════════════════════════════
// Server Actions — Perfil del Tenant (upsert y configuración fiscal)
// ═══════════════════════════════════════════════════════════════════════════
// BLINDAJE:
//   1. Retorna ActionResponse<SerializedProfile> — nunca objetos crudos.
//   2. Decimal → string antes de cruzar la frontera server → client.
//   3. Errores de BD capturados con código tipificado DB_ERROR.
//   4. Log descriptivo para trazabilidad de fallos de red vs. lógica.
// ═══════════════════════════════════════════════════════════════════════════
'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { serializeProfile, type SerializedProfile } from '@/lib/serializers'
import type { ActionResponse } from '@/types/action'

/**
 * getOrCreateProfile — Upsert atómico del perfil del tenant.
 *
 * Si el perfil no existe, lo crea con los coeficientes económicos del MVP:
 *   α = 0.15  (Margen objetivo del 15%)
 *   T_F = 5000 (Costo fijo simulado de Monotributo)
 *   t_v = 0.035 (Alícuota simulada de IIBB del 3.5%)
 *
 * @param authUserId - Identificador único del usuario en Supabase Auth.
 * @returns ActionResponse<SerializedProfile> con Decimales serializados.
 */
export async function getOrCreateProfile(
  authUserId: string
): Promise<ActionResponse<SerializedProfile>> {
  if (!authUserId || typeof authUserId !== 'string' || authUserId.trim().length === 0) {
    return {
      success: false,
      error: 'authUserId es requerido y debe ser un string no vacío.',
      code: 'VALIDATION_ERROR',
    }
  }

  try {
    const profile = await prisma.profile.upsert({
      where: { authUserId: authUserId.trim() },
      update: {},
      create: {
        authUserId: authUserId.trim(),
        targetMargin: new Prisma.Decimal('0.1500'),
        taxFixed: new Prisma.Decimal('5000.00'),
        taxVariable: new Prisma.Decimal('0.0350'),
      },
    })

    return { success: true, data: serializeProfile(profile) }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido en getOrCreateProfile'
    const isNetworkError = message.includes('P1001') || message.includes("Can't reach database")
    console.error(
      `[getOrCreateProfile] ${isNetworkError ? 'NETWORK' : 'DB'} ERROR for authUserId="${authUserId}":`,
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
