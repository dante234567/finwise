// ─── Datos mock iniciales para FlowApp ──────────────────────────────────────
// Se cargan en el store si localStorage está vacío

export const MOCK_MOVIMIENTOS = [
  { id: '1', tipo: 'ingreso', descripcion: 'Venta — Pedido #412', categoria: 'Ventas', monto: 18000, fecha: new Date().toISOString() },
  { id: '2', tipo: 'egreso',  descripcion: 'Pago proveedor materiales', categoria: 'Insumos', monto: 42000, fecha: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', tipo: 'ingreso', descripcion: 'Venta — Pedido #411', categoria: 'Ventas', monto: 27500, fecha: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', tipo: 'egreso',  descripcion: 'Alquiler marzo', categoria: 'Alquiler', monto: 120000, fecha: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: '5', tipo: 'ingreso', descripcion: 'Venta — Pedido #410', categoria: 'Ventas', monto: 35000, fecha: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: '6', tipo: 'egreso',  descripcion: 'Sueldos marzo', categoria: 'Personal', monto: 180000, fecha: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: '7', tipo: 'egreso',  descripcion: 'Meta Ads', categoria: 'Marketing', monto: 15000, fecha: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: '8', tipo: 'ingreso', descripcion: 'Venta mayorista #08', categoria: 'Ventas', monto: 98000, fecha: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: '9', tipo: 'egreso',  descripcion: 'Proveedor packaging', categoria: 'Insumos', monto: 28000, fecha: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: '10', tipo: 'ingreso', descripcion: 'Venta online #409', categoria: 'Ventas', monto: 12500, fecha: new Date(Date.now() - 9 * 86400000).toISOString() },
]

export const MOCK_PRESUPUESTOS = [
  {
    id: 'p1',
    cliente: 'Café Brío',
    telefono: '1154321098',
    items: [
      { descripcion: 'Packaging x 500u', cantidad: 2, precio: 15000 },
      { descripcion: 'Diseño etiqueta', cantidad: 1, precio: 8000 },
    ],
    estado: 'pendiente',
    fecha: new Date().toISOString(),
    notas: 'Entregar antes del viernes',
  },
  {
    id: 'p2',
    cliente: 'Restaurante La Esquina',
    telefono: '1167890123',
    items: [
      { descripcion: 'Insumos cocina', cantidad: 10, precio: 4500 },
      { descripcion: 'Mantenimiento mensual', cantidad: 1, precio: 12000 },
    ],
    estado: 'aprobado',
    fecha: new Date(Date.now() - 3 * 86400000).toISOString(),
    notas: '',
  },
]

export const MOCK_CATEGORIAS_GASTO = [
  { nombre: 'Insumos',   presupuesto: 250000, color: '#3b82d4' },
  { nombre: 'Personal',  presupuesto: 200000, color: '#1a4a8c' },
  { nombre: 'Alquiler',  presupuesto: 120000, color: '#85b7eb' },
  { nombre: 'Marketing', presupuesto: 150000, color: '#0a2a5c' },
  { nombre: 'Otros',     presupuesto: 50000,  color: '#b5d4f4' },
]

export const MOCK_PERFIL = {
  nombre: 'Martín García',
  email: 'martin@flowapp.ar',
  plan: 'Pro',
  porcentajeBolsillo: 35, // % de la ganancia neta asignada al emprendedor
  moneda: 'ARS',
}
