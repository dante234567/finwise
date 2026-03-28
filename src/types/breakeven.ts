// ═══════════════════════════════════════════════════════════════════════════
// Tipos de dominio para el Motor de Punto de Equilibrio Dinámico
// ═══════════════════════════════════════════════════════════════════════════
// El breakeven NO se persiste en la base de datos.
// Se computa dinámicamente a partir de las transacciones del negocio y
// la configuración fiscal del perfil del usuario.
//
// Fórmula: P = (CF + T_F) / (1 - v - t_v - α)
// ═══════════════════════════════════════════════════════════════════════════

/** Variables de entrada para el cálculo del punto de equilibrio */
export interface BreakevenInput {
  /** CF — Suma de costos fijos del negocio (Decimal como string) */
  fixedCosts: string
  /** T_F — Impuesto fijo mensual (Monotributo, del perfil) */
  taxFixed: string
  /** v — Razón costo variable / ventas (computada dinámicamente) */
  variableCostRatio: string
  /** t_v — Alícuota variable de impuestos (del perfil) */
  taxVariable: string
  /** α — Ganancia deseada (del perfil) */
  targetMargin: string
}

/** Resultado exitoso del cálculo del punto de equilibrio */
export interface BreakevenSuccess {
  success: true
  /** P — Punto de equilibrio en ingresos (Decimal como string) */
  breakeven: string
  /** Denominador evaluado: (1 - v - t_v - α) */
  contributionMargin: string
  /** Numerador evaluado: (CF + T_F) */
  totalFixedLoad: string
}

/** Error tipificado de inviabilidad estructural */
export interface BreakevenDivergence {
  success: false
  error: 'STRUCTURAL_INVIABILITY'
  /** Valor del denominador que causó la divergencia (≤ 0) */
  denominatorValue: string
  /** Mensaje descriptivo para el usuario */
  message: string
}

/** Resultado discriminado del motor de punto de equilibrio */
export type BreakevenResult = BreakevenSuccess | BreakevenDivergence
