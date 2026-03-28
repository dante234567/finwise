# Template: Página Nueva

## Estructura base

```typescript
// Descripción de una línea del propósito de esta página

import { ComponenteA } from '@/components/feature/componente-a'
import { ComponenteB } from '@/components/feature/componente-b'

export default function NombrePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Título</h1>
        <p className="text-muted-foreground">Descripción breve</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ComponenteA />
        <ComponenteB />
      </div>
    </div>
  )
}
```

## Reglas
- Cada página es un Server Component por defecto
- Si necesita estado del cliente, extraer a un componente hijo con 'use client'
- Usar layout con padding estándar (p-6)
- h1 con text-3xl para el título principal
- Descripción con text-muted-foreground
