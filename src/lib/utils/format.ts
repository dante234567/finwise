/**
 * Utilidades de formateo FinWise
 */

/**
 * Formatea un número como moneda argentina
 * @param n número o string
 * @returns string ej: "$ 284.500"
 */
export const fmt = (n: number | string): string => {
  const value = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(value)) return '$ 0'
  return new Intl.NumberFormat('es-AR', { 
    style: 'currency', 
    currency: 'ARS', 
    maximumFractionDigits: 0 
  }).format(value)
}

/**
 * Formatea una fecha ISO a texto legible
 * @param iso string ISO
 * @returns string ej: "28 mar 2026"
 */
export const fmtFecha = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Formatea hora de una fecha ISO
 * @param iso string ISO
 * @returns string ej: "10:32"
 */
export const fmtHora = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Retorna "Hoy", "Ayer" o la fecha formateada
 */
export const fmtRelativa = (iso: string): string => {
  const d = new Date(iso)
  const hoy = new Date()
  
  // Normalizar a inicio del día para comparación
  const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const hoyStart = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  
  const diffTime = hoyStart.getTime() - dStart.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return `Hoy, ${fmtHora(iso)}`
  if (diffDays === 1) return `Ayer, ${fmtHora(iso)}`
  return fmtFecha(iso)
}

/**
 * Porcentaje de uso respecto a un máximo
 */
export const pct = (valor: number, maximo: number): number => 
  maximo === 0 ? 0 : Math.min(100, Math.round((valor / maximo) * 100))
