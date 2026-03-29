'use client'

import React, { useState } from 'react'
import useStore from '@/store/useStore'
import { fmt, fmtRelativa } from '@/lib/utils/format'
import { Badge, Modal, ProgressBar, EmptyState } from '@/components/ui/FlowUI'

const CATEGORIAS_DEFAULT = ['Insumos', 'Personal', 'Alquiler', 'Marketing', 'Ventas', 'Otros']

export default function GastosPage() {
  const { movimientos, addMovimiento, deleteMovimiento, getGastosPorCategoria } = useStore()
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'ingreso' | 'egreso'>('todos')
  const [movSelected, setMovSelected] = useState<any>(null)
  const [mostrarMas, setMostrarMas] = useState(false)

  // Formulario integrado en la parte superior
  const [form, setForm] = useState({
    tipo: 'egreso' as 'ingreso' | 'egreso',
    descripcion: '',
    monto: '',
    cantidad: '1',
    categoria: 'Insumos',
    isFixed: false,
    isBusiness: true,
  })
  const [error, setError] = useState('')

  const setF = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.descripcion.trim()) return setError('La descripción es requerida')
    if (!form.monto || Number(form.monto) <= 0) return setError('Ingresá un monto válido')
    setError('')
    
    // Lógica matemática: Total = Monto * Cantidad
    const total = Number(form.monto) * Number(form.cantidad)
    
    await addMovimiento({ 
      ...form, 
      monto: total, 
      quantity: Number(form.cantidad) 
    })

    // Reset formulario conservando tipo
    setForm({ 
      ...form,
      descripcion: '', 
      monto: '', 
      cantidad: '1', 
      isFixed: false 
    })
  }

  const gastosCategoria = getGastosPorCategoria()

  // Filtro y Truncamiento de movimientos
  const movFiltrados = movimientos.filter((m) =>
    tipoFiltro === 'todos' ? true : m.tipo === tipoFiltro
  )
  const movimientosVisibles = mostrarMas ? movFiltrados : movFiltrados.slice(0, 5)

  return (
    <div className="page-enter pb-20">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-lg font-semibold">Movimientos</h1>
        </div>

        {/* Filtros de Pestaña Principal */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {(['todos', 'ingreso', 'egreso'] as const).map((key) => (
            <button key={key} onClick={() => setTipoFiltro(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tipoFiltro === key ? 'bg-white text-navy-500 shadow-sm' : 'text-navy-200'}`}>
              {key === 'todos' ? 'Todos' : key === 'ingreso' ? 'Ingresos' : 'Egresos'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 text-left">
        
        {/* TAREA 2 & 3: Formulario de Captura Bifurcado en la parte superior */}
        <div className="card space-y-3 bg-navy-50/50 border-navy-100">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400">Registrar {form.tipo}</h2>
            <div className="flex bg-navy-100 rounded-lg p-0.5 gap-0.5">
              {[['egreso', 'Gasto'], ['ingreso', 'Ingreso']].map(([key, label]) => (
                <button 
                  key={key} 
                  onClick={() => setF('tipo', key)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${form.tipo === key ? 'bg-white text-navy-500 shadow-xs' : 'text-navy-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <input 
              className="input-base text-sm" 
              placeholder="Descripción (ej: Venta Pizza / Alquiler)" 
              value={form.descripcion} 
              onChange={(e) => setF('descripcion', e.target.value)} 
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300 text-xs">$</span>
                <input 
                  className="input-base pl-6 text-sm" 
                  type="number" 
                  placeholder="Monto" 
                  value={form.monto} 
                  onChange={(e) => setF('monto', e.target.value)} 
                />
              </div>
              <input 
                className="input-base text-sm" 
                type="number" 
                placeholder="Cant" 
                value={form.cantidad} 
                onChange={(e) => setF('cantidad', e.target.value)} 
              />
            </div>

            <select className="input-base text-sm" value={form.categoria} onChange={(e) => setF('categoria', e.target.value)}>
              {CATEGORIAS_DEFAULT.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex flex-col gap-3 pt-1 border-t border-navy-100 mt-1">
              {/* Selector de Negocio vs Personal */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-navy-400 font-medium">¿Es del negocio o personal?</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setF('isBusiness', true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${form.isBusiness ? 'bg-navy-500 text-white border-navy-500' : 'bg-white text-navy-300 border-navy-100'}`}
                  >
                    Negocio
                  </button>
                  <button 
                    onClick={() => setF('isBusiness', false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${!form.isBusiness ? 'bg-navy-500 text-white border-navy-500' : 'bg-white text-navy-300 border-navy-100'}`}
                  >
                    Personal
                  </button>
                </div>
              </div>

              {/* Bifurcación: Periodicidad (Solo para Egresos) */}
              {form.tipo === 'egreso' && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-navy-400 font-medium">Periodicidad</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setF('isFixed', true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${form.isFixed ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-navy-300 border-navy-100'}`}
                    >
                      Lo pago mensualmente
                    </button>
                    <button 
                      onClick={() => setF('isFixed', false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${!form.isFixed ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-navy-300 border-navy-100'}`}
                    >
                      La paga varía
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
          <button onClick={handleSave} className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-widest shadow-lg shadow-navy-100">
            Registrar Ahora
          </button>
        </div>

        {/* Presupuesto por categoría (solo egresos) */}
        {tipoFiltro !== 'ingreso' && (
          <div className="card">
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-3">Presupuesto por categoría</h2>
            <div className="space-y-3">
              {gastosCategoria.map((cat) => (
                <div key={cat.nombre}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-bold text-navy-300 uppercase">{cat.nombre}</span>
                    <span className="font-bold text-navy-500">{fmt(cat.gastado)} {cat.presupuesto > 0 && `/ ${fmt(cat.presupuesto)}`}</span>
                  </div>
                  <ProgressBar value={cat.gastado} max={cat.presupuesto || cat.gastado * 1.2} color={cat.color} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listado de movimientos truncado */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400">
              {tipoFiltro === 'todos' ? 'Todos los movimientos' : tipoFiltro === 'ingreso' ? 'Ingresos Registrados' : 'Gastos Detallados'}
            </h2>
            <Badge estado={tipoFiltro === 'todos' ? 'neutral' : tipoFiltro} texto={String(movFiltrados.length)} />
          </div>

          {movFiltrados.length === 0 ? (
            <EmptyState icon="📭" title="Sin movimientos" subtitle="Utilizá el formulario superior para empezar" />
          ) : (
            <div className="space-y-3">
              {movimientosVisibles.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-navy-50 rounded-xl p-2 -mx-2 transition-colors border border-transparent active:border-navy-100"
                  onClick={() => setMovSelected(mov)}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    mov.tipo === 'ingreso' ? 'bg-emerald-50' : 'bg-orange-50'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none"
                      stroke={mov.tipo === 'ingreso' ? '#059669' : '#f97316'}
                      strokeWidth={2} className="w-4 h-4">
                      {mov.tipo === 'ingreso'
                        ? <path d="M12 5v14M5 12l7 7 7-7" />
                        : <path d="M12 19V5M5 12l7-7 7 7" />}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-navy-500 truncate">{mov.descripcion}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] font-medium text-navy-300 uppercase">{fmtRelativa(mov.fecha)}</p>
                      <span className="text-[10px] text-navy-200">·</span>
                      <p className="text-[9px] font-bold text-navy-400 uppercase tracking-tighter">{mov.categoria}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold shrink-0 ${
                      mov.tipo === 'ingreso' ? 'text-emerald-600' : 'text-orange-500'
                    }`}>
                      {mov.tipo === 'ingreso' ? '+' : '-'}{fmt(mov.monto)}
                    </p>
                    {mov.quantity > 1 && (
                      <p className="text-[8px] text-navy-200 font-medium">x{mov.quantity} unid.</p>
                    )}
                  </div>
                </div>
              ))}

              {/* TAREA 1: Botón Mostrar más condicional */}
              {!mostrarMas && movFiltrados.length > 5 && (
                <button 
                  onClick={() => setMostrarMas(true)}
                  className="w-full py-3 mt-2 text-[10px] font-bold uppercase tracking-widest text-navy-300 border-t border-navy-50 hover:text-navy-500 transition-colors"
                >
                  Ver todos los movimientos ({movFiltrados.length}) ↓
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* == Modal detalle movimiento =========================================== */}
      {movSelected && (
        <ModalDetalleMovimiento
          mov={movSelected}
          onClose={() => setMovSelected(null)}
          onDelete={(id) => { deleteMovimiento(id); setMovSelected(null) }}
        />
      )}
    </div>
  )
}

// == Modal detalle movimiento ===================================================
function ModalDetalleMovimiento({ mov, onClose, onDelete }: { mov: any; onClose: () => void; onDelete: (id: string) => void }) {
  return (
    <Modal open={true} onClose={onClose} title="Detalle del movimiento">
      <div className="space-y-3">
        <div className="card space-y-2 text-left bg-navy-50">
          <div className="flex justify-between items-center py-1">
            <span className="text-[10px] font-bold text-navy-300 uppercase">Clasificación</span>
            <Badge estado={mov.tipo} />
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[10px] font-bold text-navy-300 uppercase">Descripción</span>
            <span className="text-xs font-bold text-navy-500 text-right max-w-[60%]">{mov.descripcion}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[10px] font-bold text-navy-300 uppercase">Impacto Total</span>
            <span className={`text-sm font-bold ${mov.tipo === 'ingreso' ? 'text-emerald-600' : 'text-orange-500'}`}>
              {mov.tipo === 'ingreso' ? '+' : '-'}{fmt(mov.monto)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[10px] font-bold text-navy-300 uppercase">Origen / Tipo</span>
            <span className="text-xs font-bold text-navy-400">
               {mov.isBusiness ? 'Negocio' : 'Personal'} {mov.isFixed ? '· Fijo' : '· Variable'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[10px] font-bold text-navy-300 uppercase">Categoría</span>
            <span className="text-xs font-bold text-navy-500">{mov.categoria}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[10px] font-bold text-navy-300 uppercase">Fecha</span>
            <span className="text-xs font-bold text-navy-500">{fmtRelativa(mov.fecha)}</span>
          </div>
        </div>

        <button onClick={() => { if (confirm('¿Eliminar este registro de forma permanente?')) onDelete(mov.id) }}
          className="w-full text-center text-[10px] font-extrabold uppercase tracking-tighter text-red-400 py-3 hover:text-red-600 transition-colors">
          Destruir movimiento
        </button>
      </div>
    </Modal>
  )
}
