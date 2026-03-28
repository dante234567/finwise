// Tipos de dominio para proyecciones de ventas

/** Datos para crear una proyección */
export interface CreateProjectionInput {
  name: string
  monthlyRevenue: number
  growthRate: number
  months: number
  currency: string
}

/** Escenario de proyección */
export interface ProjectionScenario {
  label: string
  monthlyValues: number[]
  totalRevenue: number
}

/** Resultado completo de una proyección con escenarios */
export interface ProjectionResult {
  optimistic: ProjectionScenario
  realistic: ProjectionScenario
  pessimistic: ProjectionScenario
}
