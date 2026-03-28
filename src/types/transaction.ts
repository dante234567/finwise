// Tipos de dominio para transacciones
import type { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '@/lib/constants'

/** Categoría de transacción */
export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]

/** Tipo de transacción: ingreso o gasto */
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

/** Datos para crear una transacción */
export interface CreateTransactionInput {
  amount: number
  type: TransactionType
  category: TransactionCategory
  description: string
  date: Date
  currency: string
}

/** Datos para actualizar una transacción */
export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
  id: string
}
