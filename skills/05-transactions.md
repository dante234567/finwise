# 05 - Transacciones

## Objetivo
Implementar el CRUD completo de transacciones financieras.

## Pre-requisitos
- Skills 01-04 completadas

## Pasos
1. Crear rama `feat/transactions` desde `develop`
2. Implementar `src/actions/transactions.ts` → create, getAll, update, delete
3. Implementar `src/components/transactions/transaction-form.tsx` con validación
4. Implementar `src/components/transactions/transaction-list.tsx` con filtros
5. Componer en `src/app/(dashboard)/transactions/page.tsx`
6. Tests para las actions de transacciones

## Verificación
- Crear transacción con monto, categoría, fecha y descripción
- Listar transacciones con filtros por tipo, categoría y fecha
- Editar y eliminar transacciones existentes
- Moneda por defecto ARS

## Notas
- Categorías disponibles: ver TRANSACTION_CATEGORIES en constants.ts
- Tipos: "income" | "expense"
