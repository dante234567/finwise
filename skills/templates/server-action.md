# Template: Server Action

## Estructura base

```typescript
// Descripción de una línea del propósito de esta action
'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/** Descripción de la función */
export async function nombreAction(input: TipoInput): Promise<TipoOutput> {
  // 1. Verificar autenticación
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autenticado')
  }

  // 2. Validar input
  // ...

  // 3. Ejecutar operación con Prisma
  const result = await prisma.modelo.create({
    data: {
      userId: user.id,
      ...input,
    },
  })

  // 4. Revalidar cache si corresponde
  revalidatePath('/ruta-afectada')

  return result
}
```

## Reglas
- Siempre verificar autenticación primero
- Nunca usar `any` — tipar input y output
- Revalidar paths afectados al mutar datos
- Manejar errores con try/catch y mensajes claros
