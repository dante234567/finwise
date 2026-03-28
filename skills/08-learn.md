# 08 - Ruta de Aprendizaje

## Objetivo
Implementar la sección de aprendizaje financiero gamificada.

## Pre-requisitos
- Skills 01-04 completadas

## Pasos
1. Crear rama `feat/learn` desde `develop`
2. Definir módulos de aprendizaje (contenido estático o en DB — pendiente decisión)
3. Implementar `src/components/learn/learn-module-card.tsx` con progreso
4. Implementar `src/components/learn/learn-progress.tsx` con nivel general
5. Componer en `src/app/(dashboard)/learn/page.tsx`

## Verificación
- Lista de módulos con estado (bloqueado, en progreso, completado)
- Barra de progreso general
- Interfaz gamificada con puntos/nivel

## Notas
- [DUDA] Definir si los módulos son estáticos (markdown) o dinámicos (DB)
- [DUDA] Definir sistema de puntos y niveles
