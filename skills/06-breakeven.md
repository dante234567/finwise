# 06 - Punto de Equilibrio

## Objetivo
Implementar la calculadora de punto de equilibrio (breakeven analysis).

## Pre-requisitos
- Skills 01-04 completadas

## Pasos
1. Crear rama `feat/breakeven` desde `develop`
2. Implementar `src/actions/breakeven.ts` → calculate, save, get
3. Implementar `src/components/breakeven/breakeven-form.tsx` con inputs de costos
4. Implementar `src/components/breakeven/breakeven-card.tsx` con resultado visual
5. Componer en `src/app/(dashboard)/breakeven/page.tsx`
6. Tests para la lógica de cálculo

## Verificación
- Input: costos fijos, costo variable por unidad, precio por unidad
- Output: unidades necesarias, ingreso necesario, margen por unidad
- Persiste el análisis en la base de datos
- Moneda por defecto ARS

## Notas
- Fórmula: breakeven_units = fixed_costs / (price_per_unit - variable_cost_per_unit)
- Validar que precio > costo variable (sino no hay equilibrio)
