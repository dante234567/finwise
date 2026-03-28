// Tests de utilidades generales
import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('combina clases simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('resuelve conflictos de Tailwind', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })

  it('ignora valores falsy', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })
})

describe('formatCurrency', () => {
  it('formatea ARS por defecto', () => {
    const result = formatCurrency(1500)
    // Verifica que contiene el número formateado (formato argentino usa punto como separador de miles)
    expect(result).toContain('1.500')
  })

  it('acepta moneda explícita', () => {
    const result = formatCurrency(100, 'USD')
    expect(result).toContain('100')
    expect(result).toContain('US$')
  })
})

describe('formatDate', () => {
  it('formatea fecha al formato argentino', () => {
    // Usamos Date con componentes explícitos para evitar offset de timezone
    const result = formatDate(new Date(2024, 2, 15)) // marzo = 2 (0-indexed)
    expect(result).toContain('15')
    expect(result).toContain('03')
    expect(result).toContain('2024')
  })
})
