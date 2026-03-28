// ─── Utilidades generales ────────────────────────────────────────────────────

/**
 * Formatea un número como moneda argentina
 * @param {number} n
 * @returns {string}  ej: "$284.500"
 */
export const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

/**
 * Formatea una fecha ISO a texto legible
 * @param {string} iso
 * @returns {string}  ej: "28 mar 2026"
 */
export const fmtFecha = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Formatea hora de una fecha ISO
 * @param {string} iso
 * @returns {string}  ej: "10:32"
 */
export const fmtHora = (iso) => {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Retorna "Hoy", "Ayer" o la fecha formateada
 */
export const fmtRelativa = (iso) => {
  const d = new Date(iso)
  const hoy = new Date()
  const diff = Math.floor((hoy - d) / 86400000)
  if (diff === 0) return `Hoy, ${fmtHora(iso)}`
  if (diff === 1) return `Ayer, ${fmtHora(iso)}`
  return fmtFecha(iso)
}

/**
 * Calcula el total de un presupuesto
 */
export const totalPresupuesto = (items) =>
  items.reduce((a, i) => a + i.cantidad * i.precio, 0)

/**
 * Genera un link de WhatsApp con mensaje prearmado
 */
export const whatsappLink = (telefono, mensaje) => {
  const num = telefono.replace(/\D/g, '')
  const full = num.startsWith('54') ? num : `54${num}`
  return `https://wa.me/${full}?text=${encodeURIComponent(mensaje)}`
}

/**
 * Porcentaje de uso respecto a un máximo
 */
export const pct = (valor, maximo) => Math.min(100, Math.round((valor / maximo) * 100))
