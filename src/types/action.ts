// ═══════════════════════════════════════════════════════════════════════════
// ActionResponse<T> — Result Wrapper unificado para todas las Server Actions
// ═══════════════════════════════════════════════════════════════════════════
// INVARIANTES:
//   1. Toda Server Action DEBE retornar ActionResponse<T>.
//   2. Nunca se retornan objetos crudos ni se lanzan excepciones al cliente.
//   3. Los códigos de error tipificados permiten al cliente discriminar
//      entre errores de validación, de base de datos, o estructurales.
// ═══════════════════════════════════════════════════════════════════════════

/** Códigos de error tipificados del backend */
export type ActionErrorCode =
  | 'VALIDATION_ERROR'
  | 'DB_ERROR'
  | 'NOT_FOUND'
  | 'STRUCTURAL_INVIABILITY'
  | 'UNKNOWN_ERROR'

/** Respuesta exitosa de una Server Action */
export interface ActionSuccess<T> {
  success: true
  data: T
}

/** Respuesta de error de una Server Action */
export interface ActionError {
  success: false
  error: string
  code: ActionErrorCode
}

/**
 * ActionResponse<T> — Unión discriminada para todas las Server Actions
 *
 * Garantiza que el cliente siempre puede verificar `response.success`
 * antes de acceder a `response.data` o `response.error`.
 */
export type ActionResponse<T> = ActionSuccess<T> | ActionError
