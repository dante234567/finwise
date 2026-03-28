// ═══════════════════════════════════════════════════════════════════════════
// Tipos de dominio para proyecciones — computadas dinámicamente
// ═══════════════════════════════════════════════════════════════════════════
// Las proyecciones NO se persisten. Se derivan de los datos de transacciones
// y la configuración del perfil. Este archivo queda como placeholder
// tipado para el Subplan correspondiente del motor de proyecciones.
// ═══════════════════════════════════════════════════════════════════════════

/** Placeholder — se definirá en el Subplan del motor de proyecciones */
export interface ProjectionInput {
  /** Número de meses a proyectar */
  months: number
  /** Tasa de crecimiento esperada (fracción) */
  growthRate: string
}

/** Escenario individual de proyección */
export interface ProjectionScenario {
  label: 'optimistic' | 'realistic' | 'pessimistic'
  /** Valores mensuales proyectados (Decimal como string) */
  monthlyValues: string[]
  /** Revenue total acumulado del escenario */
  totalRevenue: string
}

/** Resultado completo de proyección con escenarios */
export interface ProjectionResult {
  optimistic: ProjectionScenario
  realistic: ProjectionScenario
  pessimistic: ProjectionScenario
}
