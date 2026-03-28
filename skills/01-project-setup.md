# 01 - Project Setup

## Objetivo
Montar la estructura base de carpetas, instalar dependencias y configurar herramientas.

## Pre-requisitos
- Node.js instalado
- Repo clonado con Next.js 16 funcionando

## Pasos
1. Crear rama `feat/project-setup` desde `develop`
2. Crear estructura de carpetas en `/src` → ver 00-context.md para rutas
3. Instalar dependencias de producción → `@supabase/ssr`, `@supabase/supabase-js`, `@prisma/client`, `clsx`, `tailwind-merge`
4. Instalar dependencias de desarrollo → `prisma`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
5. Inicializar shadcn/ui → `npx shadcn@latest init`
6. Crear `prisma/schema.prisma` con modelos iniciales
7. Crear `.env.local` y `.env.example`
8. Crear `vitest.config.ts` y `src/test/setup.ts`
9. Crear archivos base en `lib/`, `hooks/`, `types/`, `actions/`

## Verificación
- `npm run build` compila sin errores
- `npx prisma validate` valida el schema
- `npx vitest run` ejecuta tests sin errores

## Notas
- shadcn/ui se inicializó con Radix + Nova preset
- El `.env.local` NO se commitea (está en `.gitignore`)
