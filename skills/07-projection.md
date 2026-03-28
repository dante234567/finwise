# 07 - Proyección de Ventas

## Objetivo
Implementar proyecciones de ventas con escenarios optimista, realista y pesimista.

## Pre-requisitos
- Skills 01-04 completadas

## Pasos
1. Crear rama `feat/projection` desde `develop`
2. Implementar `src/actions/projection.ts` → create, getAll, calculateScenarios, delete
3. Implementar `src/components/projection/projection-form.tsx`
4. Implementar `src/components/projection/projection-card.tsx` con gráfico de escenarios
5. Componer en `src/app/(dashboard)/projection/page.tsx`
6. Tests para la lógica de proyección

## Verificación
- Input: ingresos mensuales actuales, tasa de crecimiento, meses a proyectar
- Output: 3 escenarios (optimista +50% growth, realista, pesimista -50% growth)
- Gráfico de líneas con los 3 escenarios
- Persiste la proyección en la base de datos

## Notas
- Los multiplicadores de escenarios son configurables
- Moneda por defecto ARS
