import { redirect } from 'next/navigation'

/**
 * Redirección de legado para asegurar compatibilidad de rutas
 */
export default function TransactionsPage() {
  redirect('/gastos')
}
