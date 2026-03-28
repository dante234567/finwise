# 09 - Configuración del Usuario

## Objetivo
Implementar la página de configuración del perfil y preferencias.

## Pre-requisitos
- Skills 01-04 completadas
- Auth funcionando

## Pasos
1. Crear rama `feat/settings` desde `develop`
2. Implementar `src/actions/user.ts` → updateProfile, updatePreferences
3. Crear formulario de perfil (nombre, email)
4. Crear formulario de preferencias (moneda por defecto)
5. Componer en `src/app/(dashboard)/settings/page.tsx`

## Verificación
- Actualizar nombre del usuario
- Cambiar moneda por defecto
- Los cambios se reflejan inmediatamente en la UI

## Notas
- El email no se puede cambiar (viene de Supabase Auth)
- La moneda por defecto afecta todas las vistas con datos monetarios
