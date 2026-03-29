// ═══════════════════════════════════════════════════════════════════════════
// Server Actions — Motor de Punto de Equilibrio Dinámico
// ═══════════════════════════════════════════════════════════════════════════
// INVARIANTES MATEMÁTICAS:
//   1. Toda aritmética usa Prisma.Decimal — NUNCA number de JavaScript.
//   2. Antes de cualquier división, se verifica denominador > 0.
//   3. Si (1 - v - t_v - α) ≤ 0, retorna STRUCTURAL_INVIABILITY.
//   4. El resultado es ActionResponse<BreakevenSuccess> | ActionError.
//
// Fórmula: P = (CF + T_F) / (1 - v - t_v - α)
// ═══════════════════════════════════════════════════════════════════════════
'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import type { ActionResponse } from '@/types/action'

/** Resultado exitoso del cálculo (todos los valores como string) */
export interface BreakevenSuccess {
  /** P — Punto de equilibrio en ingresos */
  breakeven: string
  /** Margen de contribución: (1 - v - t_v - α) */
  contributionMargin: string
  /** Carga fija total: (CF + T_F) */
  totalFixedLoad: string
}

/**
 * calculateBreakeven — Computa el punto de equilibrio dinámicamente.
 *
 * Agrega las transacciones del negocio del perfil, calcula CF (costos fijos),
 * la razón de costo variable v, y evalúa P = (CF + T_F) / (1 - v - t_v - α).
 *
 * @param profileId - UUID del perfil del tenant.
 * @returns ActionResponse<BreakevenSuccess>
 */
export async function calculateBreakeven(
  profileId: string
): Promise<ActionResponse<BreakevenSuccess>> {
  if (!profileId || typeof profileId !== 'string' || profileId.trim().length === 0) {
    return {
      success: false,
      error: 'profileId es requerido y debe ser un string no vacío.',
      code: 'VALIDATION_ERROR',
    }
  }

  try {
    // ── Obtener perfil con configuración fiscal ─────────────────────
    const profile = await prisma.profile.findUnique({
      where: { id: profileId.trim() },
    })

    if (!profile) {
      return {
        success: false,
        error: `Perfil no encontrado con id="${profileId}".`,
        code: 'NOT_FOUND',
      }
    }

    // ── Obtener transacciones del negocio ──────────────────────────
    const businessTransactions = await prisma.transaction.findMany({
      where: { profileId: profileId.trim(), isBusiness: true },
    })

    // ── Aritmética con Prisma.Decimal — PROHIBIDO usar number ──────
    const ZERO = new Prisma.Decimal('0')
    const ONE = new Prisma.Decimal('1')

    // CF — Suma de montos de egresos fijos del negocio
    const fixedCosts = businessTransactions
      .filter((t: any) => t.type === 'EXPENSE' && t.isFixed)
      .reduce((sum: Prisma.Decimal, t: any) => sum.add(t.amount), ZERO)

    // Ingresos totales del negocio
    const totalIncome = businessTransactions
      .filter((t: any) => t.type === 'INCOME')
      .reduce((sum: Prisma.Decimal, t: any) => sum.add(t.amount), ZERO)

    // Egresos variables del negocio
    const variableCosts = businessTransactions
      .filter((t: any) => t.type === 'EXPENSE' && !t.isFixed)
      .reduce((sum: Prisma.Decimal, t: any) => sum.add(t.amount), ZERO)

    // v — Razón de costo variable / ventas
    const v = totalIncome.isZero() ? ZERO : variableCosts.div(totalIncome)

    // Parámetros del perfil (ya son Decimal en Prisma)
    const T_F = profile.taxFixed
    const t_v = profile.taxVariable
    const alpha = profile.targetMargin

    // ── RESTRICCIÓN CRÍTICA DE SINGULARIDAD ────────────────────────
    // Denominador: (1 - v - t_v - α)
    const denominator = ONE.sub(v).sub(t_v).sub(alpha)

    if (denominator.lte(ZERO)) {
      return {
        success: false,
        error: `Inviabilidad estructural: el margen de contribución (1 - v - t_v - α) = ${denominator.toFixed(4)} es ≤ 0. ` +
          'La estructura de costos actual no permite alcanzar el punto de equilibrio. ' +
          'Reduzca costos variables, impuestos o el margen objetivo.',
        code: 'STRUCTURAL_INVIABILITY',
      }
    }

    // ── Numerador: (CF + T_F) ──────────────────────────────────────
    const totalFixedLoad = fixedCosts.add(T_F)

    // ── P = (CF + T_F) / (1 - v - t_v - α) ───────────────────────
    const breakeven = totalFixedLoad.div(denominator)

    return {
      success: true,
      data: {
        breakeven: breakeven.toFixed(2),
        contributionMargin: denominator.toFixed(4),
        totalFixedLoad: totalFixedLoad.toFixed(2),
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido en calculateBreakeven'
    const isNetworkError = message.includes('P1001') || message.includes("Can't reach database")
    console.error(
      `[calculateBreakeven] ${isNetworkError ? 'NETWORK' : 'DB'} ERROR for profileId="${profileId}":`,
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
