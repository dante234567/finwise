# Template: Componente de Feature

## Estructura base

```typescript
// Descripción de una línea del propósito de este componente
'use client' // solo si necesita interactividad

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NombreComponenteProps {
  // Props con tipos explícitos
  dato: string
  onAccion?: (valor: string) => void
}

export function NombreComponente({ dato, onAccion }: NombreComponenteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Contenido del componente */}
      </CardContent>
    </Card>
  )
}
```

## Reglas
- Solo usar 'use client' si el componente necesita estado, efectos o eventos
- Siempre definir interface para las props (nunca inline)
- Usar componentes de shadcn/ui como base (Card, Button, etc.)
- Nombres de componentes en PascalCase
- Nombres de archivos en kebab-case
- Export nombrado (nunca default en componentes)
