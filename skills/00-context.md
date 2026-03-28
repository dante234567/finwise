# 00 - Contexto General

## Objetivo
Entender qué es FinWise, su stack y convenciones antes de tocar código.

## ¿Qué es FinWise?
Aplicación web de gestión financiera para emprendedores y pequeños negocios en Argentina.
Permite registrar transacciones, calcular el punto de equilibrio, proyectar ventas y aprender conceptos financieros de forma gamificada.

## Stack
- **Framework:** Next.js 16 con App Router
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** Tailwind CSS v4 + shadcn/ui (Radix + Nova preset)
- **ORM:** Prisma con PostgreSQL
- **Auth + DB:** Supabase
- **Tests:** Vitest + Testing Library

## Convenciones
- Nombres de archivos, variables y funciones en **inglés**
- Comentarios en **español**
- Server Actions para toda la lógica de backend (nunca API routes salvo excepción aprobada)
- Componentes: siempre functional components con tipos explícitos
- Nunca usar `any` en TypeScript
- Cada archivo nuevo empieza con un comentario de una línea explicando su propósito

## Estructura de rutas
```
(auth)/login          → Login
(auth)/register       → Registro
(dashboard)/dashboard → Dashboard principal
(dashboard)/transactions → Transacciones
(dashboard)/breakeven    → Punto de equilibrio
(dashboard)/projection   → Proyección de ventas
(dashboard)/learn        → Aprendizaje gamificado
(dashboard)/settings     → Configuración
```

## Moneda
- Moneda por defecto: ARS (Peso Argentino)
- Campo `currency` en todos los modelos monetarios con `@default("ARS")`

## Git
- Ramas: `main` → `develop` → `feat/*`
- Commits: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`
- Nunca commitear a main directamente
