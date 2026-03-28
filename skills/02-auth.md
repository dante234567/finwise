# 02 - Autenticación

## Objetivo
Implementar login, registro y logout con Supabase Auth.

## Pre-requisitos
- Skill 01 completada
- Proyecto de Supabase creado con variables en `.env.local`

## Pasos
1. Crear rama `feat/auth` desde `develop`
2. Implementar `src/actions/auth.ts` → signIn, signUp, signOut
3. Implementar `src/app/(auth)/login/page.tsx` → formulario con Server Action
4. Implementar `src/app/(auth)/register/page.tsx` → formulario con Server Action
5. Configurar `src/middleware.ts` → proteger rutas de `(dashboard)/`
6. Implementar redirect: login exitoso → `/dashboard`, logout → `/login`
7. Tests para las actions de auth

## Verificación
- Login con email/password funciona
- Registro crea usuario en Supabase
- Rutas de dashboard redirigen a login si no hay sesión
- Logout destruye sesión y redirige a login

## Notas
- Usar `@supabase/ssr` para Server Components y Server Actions
- No usar `@supabase/auth-helpers-nextjs` (deprecado)
