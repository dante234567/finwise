// ═══════════════════════════════════════════════════════════════════════════
// Tipos de dominio para transacciones — alineados con el schema dimensional
// ═══════════════════════════════════════════════════════════════════════════
// Los tipos de ingesta (TransactionInput) se definen en
// src/validations/financeSchemas.ts como inferencia de Zod.
// Este archivo contiene tipos de dominio complementarios.
// ═══════════════════════════════════════════════════════════════════════════

/** Resumen analítico consolidado de transacciones del negocio */
export interface AnalyticsSummary {
  /** Ticket promedio = Total ingresos negocio / Cantidad de operaciones de ingreso */
  averageTicket: string
  /** Volumen total de operaciones (suma de quantity de ingresos del negocio) */
  totalVolume: number
  /** Margen neto histórico = (Ingresos - Egresos) / Ingresos del negocio */
  netMargin: string
  /** Razón de gasto por venta = Egresos variables negocio / Ingresos negocio */
  expensePerSaleRatio: string
  /** Distribución de costos: { fijos: %, variables: % } del negocio */
  costDistribution: {
    fixedPercentage: string
    variablePercentage: string
  }
  /** Tendencia mensual: array de { month, income, expense, net } */
  monthlyTrend: MonthlyTrendPoint[]
}

/** Punto individual en la serie temporal de tendencia mensual */
export interface MonthlyTrendPoint {
  /** Mes en formato YYYY-MM */
  month: string
  /** Total de ingresos del negocio en el mes */
  income: string
  /** Total de egresos del negocio en el mes */
  expense: string
  /** Neto = income - expense */
  net: string
}
