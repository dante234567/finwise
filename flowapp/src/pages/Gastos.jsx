// ─── Página Gastos ─────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import useStore from '../context/store'
import { fmt, fmtRelativa } from '../utils/format'
import { Badge, Modal, ProgressBar, EmptyState } from '../components/ui'

const CATEGORIAS_DEFAULT = ['Insumos', 'Personal', 'Alquiler', 'Marketing', 'Ventas', 'Otros']

export default function Gastos() {
  const { movimientos, categorias, addMovimiento, deleteMovimiento, getGastosPorCategoria } = useStore()
  const [modalNuevo, setModalNuevo] = useState(false)
  const [tipoFiltro, setTipoFiltro] = useState('todos') // 'todos' | 'ingreso' | 'egreso'
  const [movSelected, setMovSelected] = useState(null)

  const gastosCategoria = getGastosPorCategoria()

  // Filtro de movimientos
  const movFiltrados = movimientos.filter((m) =>
    tipoFiltro === 'todos' ? true : m.tipo === tipoFiltro
  )

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-lg font-semibold">Gastos</h1>
          <button
            onClick={() => setModalNuevo(true)}
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Filtros */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {[['todos', 'Todos'], ['ingreso', 'Ingresos'], ['egreso', 'Egresos']].map(([key, label]) => (
            <button key={key} onClick={() => setTipoFiltro(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tipoFiltro === key ? 'bg-white text-navy-500' : 'text-navy-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Botón registrar gasto */}
        <button onClick={() => setModalNuevo(true)} className="btn-primary w-full flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Registrar movimiento
        </button>

        {/* Presupuesto por categoría (solo egresos) */}
        {tipoFiltro !== 'ingreso' && (
          <div className="card">
            <h2 className="text-sm font-semibold text-navy-500 mb-3">Presupuesto por categoría</h2>
            <div className="space-y-3">
              {gastosCategoria.map((cat) => (
                <div key={cat.nombre}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-navy-300">{cat.nombre}</span>
                    <span className="font-medium text-navy-500">{fmt(cat.gastado)} / {fmt(cat.presupuesto)}</span>
                  </div>
                  <ProgressBar value={cat.gastado} max={cat.presupuesto} color={cat.color} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listado de movimientos */}
        <div className="card">
          <h2 className="text-sm font-semibold text-navy-500 mb-3">
            {tipoFiltro === 'todos' ? 'Todos los movimientos' : tipoFiltro === 'ingreso' ? 'Ingresos' : 'Egresos'}
            <span className="ml-2 text-xs font-normal text-navy-200">({movFiltrados.length})</span>
          </h2>

          {movFiltrados.length === 0 ? (
            <EmptyState icon="📭" title="Sin movimientos" subtitle="Registrá tu primer ingreso o gasto" />
          ) : (
            <div className="space-y-3">
              {movFiltrados.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-navy-50 rounded-xl p-2 -mx-2 transition-colors"
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
                    <p className="text-xs font-medium text-navy-500 truncate">{mov.descripcion}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-navy-200">{fmtRelativa(mov.fecha)}</p>
                      <span className="text-[10px] text-navy-200">·</span>
                      <p className="text-[10px] text-navy-300">{mov.categoria}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold shrink-0 ${
                    mov.tipo === 'ingreso' ? 'text-emerald-600' : 'text-orange-500'
                  }`}>
                    {mov.tipo === 'ingreso' ? '+' : '-'}{fmt(mov.monto)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Nuevo movimiento ───────────────────────────────────────────── */}
      <ModalNuevoMovimiento
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        onSave={(data) => { addMovimiento(data); setModalNuevo(false) }}
      />

      {/* ── Modal detalle movimiento ─────────────────────────────────────────── */}
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

// ── Formulario de nuevo movimiento ────────────────────────────────────────────
function ModalNuevoMovimiento({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    tipo: 'egreso',
    descripcion: '',
    monto: '',
    categoria: 'Insumos',
    isFixed: false,
    isBusiness: true,
  })
  const [error, setError] = useState('')

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.descripcion.trim()) return setError('La descripción es requerida')
    if (!form.monto || Number(form.monto) <= 0) return setError('Ingresá un monto válido')
    setError('')
    onSave({ ...form, monto: Number(form.monto) })
    setForm({ tipo: 'egreso', descripcion: '', monto: '', categoria: 'Insumos', isFixed: false, isBusiness: true })
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar movimiento">
      <div className="space-y-3">
        {/* Tipo */}
        <div className="flex bg-navy-50 rounded-xl p-1 gap-1">
          {[['egreso', 'Gasto'], ['ingreso', 'Ingreso']].map(([key, label]) => (
            <button key={key} onClick={() => setF('tipo', key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${form.tipo === key ? 'bg-white text-navy-500 shadow-sm' : 'text-navy-300'}`}>
              {label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs text-navy-300 mb-1 block">Descripción *</label>
          <input className="input-base" placeholder="Ej: Pago proveedor" value={form.descripcion} onChange={(e) => setF('descripcion', e.target.value)} />
        </div>

        <div>
          <label className="text-xs text-navy-300 mb-1 block">Monto *</label>
          <input className="input-base" type="number" min="1" placeholder="0" value={form.monto} onChange={(e) => setF('monto', e.target.value)} />
        </div>

        <div>
          <label className="text-xs text-navy-300 mb-1 block">Categoría</label>
          <select className="input-base" value={form.categoria} onChange={(e) => setF('categoria', e.target.value)}>
            {CATEGORIAS_DEFAULT.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 pt-1">
          <label className="flex items-center gap-2 text-xs text-navy-300 cursor-pointer">
            <input type="checkbox" checked={form.isFixed} onChange={(e) => setF('isFixed', e.target.checked)} className="rounded" />
            Costo fijo
          </label>
          <label className="flex items-center gap-2 text-xs text-navy-300 cursor-pointer">
            <input type="checkbox" checked={form.isBusiness} onChange={(e) => setF('isBusiness', e.target.checked)} className="rounded" />
            Del negocio
          </label>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        <button onClick={handleSave} className="btn-primary w-full">Guardar</button>
      </div>
    </Modal>
  )
}

// ── Modal detalle movimiento ───────────────────────────────────────────────────
function ModalDetalleMovimiento({ mov, onClose, onDelete }) {
  return (
    <Modal open={true} onClose={onClose} title="Detalle del movimiento">
      <div className="space-y-3">
        <div className="card space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-navy-300">Tipo</span>
            <Badge estado={mov.tipo} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy-300">Descripción</span>
            <span className="font-medium text-navy-500 text-right max-w-[60%]">{mov.descripcion}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy-300">Monto</span>
            <span className={`font-semibold ${mov.tipo === 'ingreso' ? 'text-emerald-600' : 'text-orange-500'}`}>
              {mov.tipo === 'ingreso' ? '+' : '-'}{fmt(mov.monto)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy-300">Categoría</span>
            <span className="text-navy-500">{mov.categoria}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy-300">Fecha</span>
            <span className="text-navy-500">{fmtRelativa(mov.fecha)}</span>
          </div>
        </div>

        <button onClick={() => { if (confirm('¿Eliminar este movimiento?')) onDelete(mov.id) }}
          className="w-full text-center text-xs text-red-400 py-2">
          Eliminar movimiento
        </button>
      </div>
    </Modal>
  )
}
