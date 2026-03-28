// Constantes compartidas de la app — categorías, monedas, límites

/** Tipos de transacción — alineados con enum TransactionType de Prisma */
export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const

/** Moneda por defecto */
export const DEFAULT_CURRENCY = 'ARS'

/** Rutas de navegación del dashboard */
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Transacciones', href: '/transactions', icon: 'ArrowLeftRight' },
  { label: 'Punto de Equilibrio', href: '/breakeven', icon: 'Scale' },
  { label: 'Proyección', href: '/projection', icon: 'TrendingUp' },
  { label: 'Aprender', href: '/learn', icon: 'GraduationCap' },
  { label: 'Configuración', href: '/settings', icon: 'Settings' },
] as const
