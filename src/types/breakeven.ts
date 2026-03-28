// Tipos de dominio para el análisis de punto de equilibrio

/** Datos para calcular el punto de equilibrio */
export interface BreakevenInput {
  fixedCosts: number
  variableCostPerUnit: number
  pricePerUnit: number
  currency: string
}

/** Resultado del cálculo de punto de equilibrio */
export interface BreakevenResult {
  unitBreakeven: number
  revenueBreakeven: number
  marginPerUnit: number
  currency: string
}
