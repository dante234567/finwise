# 04 - Dashboard y Layout

## Objetivo
Construir el layout principal (sidebar + header) y la página de dashboard con resumen.

## Pre-requisitos
- Skills 01-03 completadas
- Auth funcionando

## Pasos
1. Crear rama `feat/dashboard-layout` desde `develop`
2. Implementar `src/components/layout/sidebar.tsx` con NAV_ITEMS de constants
3. Implementar `src/components/layout/header.tsx` con avatar y nombre del usuario
4. Implementar `src/components/layout/mobile-nav.tsx` con sheet/drawer
5. Integrar sidebar + header en `src/app/(dashboard)/layout.tsx`
6. Implementar `src/components/dashboard/balance-card.tsx`
7. Implementar `src/components/dashboard/recent-transactions.tsx`
8. Implementar `src/components/dashboard/breakeven-progress.tsx`
9. Componer todo en `src/app/(dashboard)/dashboard/page.tsx`

## Verificación
- Layout muestra sidebar en desktop, hamburguesa en mobile
- Dashboard muestra cards con datos (pueden ser mock inicialmente)
- Navegación entre rutas funciona sin recarga completa

## Notas
- Usar componentes de shadcn/ui: Card, Button, Sheet
- El sidebar debe marcar la ruta activa
