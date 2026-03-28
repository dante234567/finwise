// Utilidades generales de la app — cn helper para Tailwind class merging, formateo de moneda
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combina clases de Tailwind resolviendo conflictos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea un número como moneda ARS */
export function formatCurrency(
  amount: number,
  currency: string = 'ARS'
): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
  }).format(amount)
}

/** Formatea una fecha al formato local argentino */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
