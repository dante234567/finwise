# 03 - Base de Datos

## Objetivo
Definir schema completo de Prisma, crear migraciones y seed de datos de prueba.

## Pre-requisitos
- Skill 01 completada
- Supabase con PostgreSQL habilitado
- `DATABASE_URL` configurada en `.env.local`

## Pasos
1. Completar modelos en `prisma/schema.prisma` (User, Transaction, Breakeven, Projection)
2. Correr `npx prisma migrate dev --name init` para crear la migración inicial
3. Crear `prisma/seed.ts` con datos de prueba
4. Configurar script `prisma:seed` en `package.json`
5. Correr `npx prisma db seed` para popular la base

## Verificación
- `npx prisma validate` pasa
- `npx prisma migrate dev` crea tablas sin errores
- `npx prisma studio` muestra las tablas con datos de seed

## Notas
- Todos los modelos monetarios tienen campo `currency String @default("ARS")`
- User se vincula a Supabase Auth via campo `authId`
