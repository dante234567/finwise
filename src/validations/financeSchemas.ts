// ═══════════════════════════════════════════════════════════════════════════
// Fronteras de Validación — Esquemas Zod para ingesta de datos al servidor
// ═══════════════════════════════════════════════════════════════════════════
// INVARIANTES:
//   1. Los montos (amount) se transportan como string para preservar
//      precisión decimal en el tránsito JSON → Prisma Decimal.
//   2. Las fracciones fiscales y de margen se validan en rango [0, 0.99)
//      para prevenir la singularidad del denominador del punto de equilibrio:
//      si (1 - v - t_v - α) ≤ 0, el modelo diverge.
//   3. quantity debe ser un entero positivo (volumen de operación).
// ═══════════════════════════════════════════════════════════════════════════

import { z } from 'zod'

// ─── Constantes de Validación ─────────────────────────────────────────────

/** Precisión máxima para montos monetarios: 12 dígitos, 2 decimales */
const DECIMAL_AMOUNT_REGEX = /^\d{1,10}(\.\d{1,2})?$/

/** Precisión máxima para fracciones: 5 dígitos, 4 decimales (ej. 0.3500) */
const DECIMAL_FRACTION_REGEX = /^\d(\.\d{1,4})?$/

// ─── Helpers reutilizables ────────────────────────────────────────────────

/**
 * Validador de monto monetario transportado como string.
 * Garantiza formato numérico positivo compatible con Prisma Decimal(12,2).
 */
const decimalAmountSchema = z
  .string()
  .regex(DECIMAL_AMOUNT_REGEX, {
    message: 'El monto debe ser un número válido con hasta 2 decimales (ej. "15000.50")',
  })
  .refine((val) => parseFloat(val) > 0, {
    message: 'El monto debe ser estrictamente positivo',
  })

/**
 * Validador de fracción decimal (para tasas impositivas y márgenes).
 * Rango válido: [0, 0.99) — el límite superior previene singularidad.
 */
const decimalFractionSchema = z
  .string()
  .regex(DECIMAL_FRACTION_REGEX, {
    message: 'La fracción debe ser un número válido con hasta 4 decimales (ej. "0.0350")',
  })
  .refine((val) => {
    const n = parseFloat(val)
    return n >= 0 && n < 0.99
  }, {
    message: 'La fracción debe estar en el rango [0, 0.99)',
  })

// ─── Enum de tipo de transacción ──────────────────────────────────────────

export const TransactionTypeEnum = z.enum(['INCOME', 'EXPENSE'])

// ─── Schema: Ingesta de Transacción ───────────────────────────────────────

/**
 * TransactionInputSchema
 *
 * Valida el payload de entrada para crear una transacción.
 * - amount: string decimal positivo (preserva precisión en tránsito JSON)
 * - type: "INCOME" | "EXPENSE" (enum PostgreSQL nativo)
 * - concept: texto descriptivo no vacío
 * - quantity: entero ≥ 1 (volumen de la operación)
 * - isFixed: booleano obligatorio (Dimensión de Comportamiento)
 * - isBusiness: booleano obligatorio (Dimensión de Pertenencia)
 */
export const TransactionInputSchema = z.object({
  amount: decimalAmountSchema,
  type: TransactionTypeEnum,
  concept: z
    .string()
    .trim()
    .min(1, { message: 'El concepto no puede estar vacío' })
    .max(255, { message: 'El concepto no puede exceder 255 caracteres' }),
  quantity: z
    .number()
    .int({ message: 'La cantidad debe ser un número entero' })
    .min(1, { message: 'La cantidad debe ser al menos 1' }),
  isFixed: z.boolean({
    error: 'La dimensión de comportamiento (isFixed) es obligatoria',
  }),
  isBusiness: z.boolean({
    error: 'La dimensión de pertenencia (isBusiness) es obligatoria',
  }),
})

// ─── Schema: Configuración del Perfil Fiscal ──────────────────────────────

/**
 * ProfileConfigSchema
 *
 * Valida la configuración fiscal y de margen del perfil del tenant.
 * - targetMargin (α): fracción [0, 0.99) — ganancia deseada
 * - taxFixed (T_F): monto absoluto mensual de Monotributo
 * - taxVariable (t_v): alícuota [0, 0.99) de Ingresos Brutos
 *
 * RESTRICCIÓN DE SINGULARIDAD: La validación individual de cada fracción
 * en [0, 0.99) es necesaria pero no suficiente. La validación cruzada
 * (1 - v - t_v - α > 0) se realiza en el motor analítico, no aquí,
 * porque depende de datos calculados dinámicamente (v = razón variable/ventas).
 */
export const ProfileConfigSchema = z.object({
  targetMargin: decimalFractionSchema,
  taxFixed: decimalAmountSchema,
  taxVariable: decimalFractionSchema,
})

// ─── Tipos inferidos (para uso en Server Actions) ─────────────────────────

/** Tipo inferido del payload de transacción validado */
export type TransactionInput = z.infer<typeof TransactionInputSchema>

/** Tipo inferido de la configuración del perfil validada */
export type ProfileConfig = z.infer<typeof ProfileConfigSchema>
