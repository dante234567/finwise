// ─── Página Negocio ────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import useStore from '../context/store'
import { fmt, fmtFecha, totalPresupuesto, whatsappLink } from '../utils/format'
import { generarPDF } from '../utils/pdf'
import { Badge, Modal, ProgressBar, EmptyState } from '../components/ui'

// Tooltip personalizado del gráfico
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-500 rounded-xl px-3 py-2 text-white text-xs shadow-lg">
      <p className="text-navy-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

export default function Negocio() {
  const { movimientos, presupuestos, perfil, getTotalesMes, fetchBreakeven, breakeven, getDistribucionGanancias, addPresupuesto, updatePresupuesto, deletePresupuesto } = useStore()
  const { ingresos, egresos, ganancia } = getTotalesMes()
  const dist = getDistribucionGanancias()
  const [tab, setTab] = useState('finanzas') // 'finanzas' | 'presupuestos'
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalDetalle, setModalDetalle] = useState(null)
  
  React.useEffect(() => {
    fetchBreakeven()
  }, [])

  // ── Datos para el gráfico (últimas 6 semanas simplificado) ──────────────────
  const meses = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar']
  const chartData = meses.map((mes, i) => {
    const factor = 0.6 + Math.random() * 0.5
    return {
      mes,
      Ingresos: Math.round(ingresos * factor),
      Egresos: Math.round(egresos * factor),
    }
  })
  // El último mes usa datos reales
  chartData[5] = { mes: 'Mar', Ingresos: ingresos, Egresos: egresos }

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold mb-4">Mi negocio</h1>
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {[['finanzas', 'Finanzas'], ['presupuestos', 'Presupuestos']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tab === key ? 'bg-white text-navy-500' : 'text-navy-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {tab === 'finanzas' ? (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Ingresos', value: fmt(ingresos), sub: 'este mes', color: 'text-emerald-600' },
                { label: 'Egresos',  value: fmt(egresos),  sub: 'este mes', color: 'text-orange-500' },
                { label: 'Resultado', value: fmt(ganancia), sub: 'neto',    color: 'text-navy-400' },
              ].map((k) => (
                <div key={k.label} className="card text-center">
                  <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">{k.label}</p>
                  <p className={`text-sm font-semibold ${k.color}`}>{k.value}</p>
                  <p className="text-[9px] text-navy-200 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Gráfico */}
            <div className="card">
              <h2 className="text-sm font-semibold text-navy-500 mb-3">Ingresos vs Egresos</h2>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf8" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#8aaccc' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5ff' }} />
                  <Bar dataKey="Ingresos" fill="#3b82d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Egresos"  fill="#b5d4f4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {[['#3b82d4', 'Ingresos'], ['#b5d4f4', 'Egresos']].map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
                    <span className="text-[10px] text-navy-200">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Objetivos del mes */}
            <div className="card">
              <h2 className="text-sm font-semibold text-navy-500 mb-3">Objetivos del mes</h2>
              <div className="space-y-3">
                {[
                  { label: 'Meta de ventas',     valor: ingresos, meta: 1000000, color: '#3b82d4' },
                  { label: 'Control de gastos',  valor: egresos,  meta: 700000,  color: '#1d9e75' },
                  { label: 'Ganancia objetivo',  valor: ganancia, meta: 300000,  color: '#1a4a8c' },
                ].map((obj) => (
                  <div key={obj.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-navy-300">{obj.label}</span>
                      <span className="font-medium text-navy-500">{fmt(obj.valor)} / {fmt(obj.meta)}</span>
                    </div>
                    <ProgressBar value={obj.valor} max={obj.meta} color={obj.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Card Breakeven */}
            <div className="card">
              <h2 className="text-sm font-semibold text-navy-500 mb-3">Punto de equilibrio</h2>
              {!breakeven ? (
                <p className="text-xs text-navy-200 text-center py-4">Calculando...</p>
              ) : breakeven.error ? (
                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-orange-600 mb-1">
                    {breakeven.code === 'STRUCTURAL_INVIABILITY' ? 'Estructura de costos crítica' : 'Sin datos suficientes'}
                  </p>
                  <p className="text-[10px] text-orange-500">
                    {breakeven.code === 'STRUCTURAL_INVIABILITY'
                      ? 'Los costos variables superan los ingresos. Revisá tu estructura de gastos.'
                      : 'Registrá ingresos y egresos para calcular tu punto de equilibrio.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-navy-50 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-1">Necesitás facturar</p>
                    <p className="text-2xl font-semibold text-navy-500">{fmt(Number(breakeven.breakeven))}</p>
                    <p className="text-[10px] text-navy-200 mt-0.5">para cubrir todos tus costos</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="card bg-navy-50">
                      <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">Margen contrib.</p>
                      <p className="text-sm font-semibold text-navy-500">
                        {(Number(breakeven.contributionMargin) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="card bg-navy-50">
                      <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">Carga fija total</p>
                      <p className="text-sm font-semibold text-navy-500">{fmt(Number(breakeven.totalFixedLoad))}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

<div className="card">
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-sm font-semibold text-navy-500">Diagnóstico fiscal</h2>
    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
      dist.saludFiscal === 'reservada' ? 'bg-emerald-50 text-emerald-600'
      : dist.saludFiscal === 'critica' ? 'bg-red-50 text-red-500'
      : 'bg-orange-50 text-orange-500'
    }`}>
      {dist.saludFiscal === 'reservada' ? '✓ Reserva activa'
        : dist.saludFiscal === 'critica' ? '⚠ En pérdida'
        : '→ Sin reserva'}
    </span>
  </div>
  <div className="space-y-2 mb-4">
    {[
      { label: 'Ganancia bruta',     value: dist.ganancia,       color: 'text-navy-500' },
      { label: 'Reserva ARCA (25%)', value: -dist.reservaARCA,   color: 'text-orange-500' },
      { label: 'Ganancia neta real', value: dist.gananciaNeta,   color: 'text-emerald-600' },
      { label: 'Tu sueldo',          value: dist.sueldoDuenio,   color: 'text-navy-400' },
      { label: 'Queda en negocio',   value: dist.capitalNegocio, color: 'text-navy-300' },
    ].map((row) => (
      <div key={row.label} className="flex justify-between items-center text-xs">
        <span className="text-navy-300">{row.label}</span>
        <span className={`font-semibold ${row.color}`}>
          {row.value < 0 ? '-' : ''}{fmt(Math.abs(row.value))}
        </span>
      </div>
    ))}
  </div>
  <div className="border-t border-navy-50 my-3" />
  <h3 className="text-[10px] uppercase tracking-wider text-navy-200 mb-2">Ratios operativos</h3>
  <div className="grid grid-cols-2 gap-2">
    <div className="bg-navy-50 rounded-xl p-3">
      <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">Margen de seguridad</p>
      <p className="text-lg font-semibold text-navy-500">{dist.margenSeguridad}%</p>
      <p className="text-[9px] text-navy-200 mt-0.5">cojín antes de pérdida</p>
    </div>
    <div className="bg-navy-50 rounded-xl p-3">
      <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">Apalancamiento op.</p>
      <p className="text-lg font-semibold text-navy-500">{dist.apalancamiento}x</p>
      <p className="text-[9px] text-navy-200 mt-0.5">sensibilidad a escala</p>
    </div>
    <div className="bg-orange-50 rounded-xl p-3">
      <p className="text-[9px] uppercase tracking-wider text-orange-300 mb-1">Carga ARCA latente</p>
      <p className="text-lg font-semibold text-orange-500">{fmt(dist.reservaARCA)}</p>
      <p className="text-[9px] text-orange-300 mt-0.5">reservar para impuestos</p>
    </div>
    <div className="bg-emerald-50 rounded-xl p-3">
      <p className="text-[9px] uppercase tracking-wider text-emerald-300 mb-1">Capital operativo</p>
      <p className="text-lg font-semibold text-emerald-600">{fmt(dist.capitalNegocio)}</p>
      <p className="text-[9px] text-emerald-400 mt-0.5">disponible en negocio</p>
    </div>
  </div>
</div>
          </>
        ) : (
          <>
            {/* Botón nuevo presupuesto */}
            <button onClick={() => setModalNuevo(true)} className="btn-primary w-full flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo presupuesto
            </button>

            {/* Lista de presupuestos */}
            {presupuestos.length === 0 ? (
              <EmptyState icon="📋" title="Sin presupuestos" subtitle="Creá tu primer presupuesto" />
            ) : (
              <div className="space-y-3">
                {presupuestos.map((p) => (
                  <div key={p.id} className="card" onClick={() => setModalDetalle(p)}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-navy-500">{p.cliente}</p>
                        <p className="text-[10px] text-navy-200 mt-0.5">{fmtFecha(p.fecha)}</p>
                      </div>
                      <Badge estado={p.estado} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-navy-200">{p.items.length} ítem{p.items.length !== 1 ? 's' : ''}</span>
                      <span className="text-sm font-semibold text-navy-400">{fmt(totalPresupuesto(p.items))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal Nuevo Presupuesto ──────────────────────────────────────────── */}
      <ModalNuevoPresupuesto
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        onSave={(data) => { addPresupuesto(data); setModalNuevo(false) }}
      />

      {/* ── Modal Detalle Presupuesto ────────────────────────────────────────── */}
      {modalDetalle && (
        <ModalDetallePresupuesto
          presupuesto={modalDetalle}
          perfil={perfil}
          onClose={() => setModalDetalle(null)}
          onUpdateEstado={(id, estado) => { updatePresupuesto(id, { estado }); setModalDetalle(null) }}
          onDelete={(id) => { deletePresupuesto(id); setModalDetalle(null) }}
        />
      )}
    </div>
  )
}

// ── Formulario nuevo presupuesto ──────────────────────────────────────────────
function ModalNuevoPresupuesto({ open, onClose, onSave }) {
  const [form, setForm] = useState({ cliente: '', telefono: '', notas: '', estado: 'pendiente' })
  const [items, setItems] = useState([{ descripcion: '', cantidad: 1, precio: 0 }])
  const [error, setError] = useState('')

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setItem = (i, k, v) => setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, [k]: v } : it))
  const addItem = () => setItems((arr) => [...arr, { descripcion: '', cantidad: 1, precio: 0 }])
  const removeItem = (i) => setItems((arr) => arr.filter((_, idx) => idx !== i))

  const handleSave = () => {
    if (!form.cliente.trim()) return setError('El nombre del cliente es requerido')
    if (items.some((it) => !it.descripcion.trim())) return setError('Completá la descripción de todos los ítems')
    setError('')
    onSave({ ...form, items: items.map((it) => ({ ...it, cantidad: Number(it.cantidad), precio: Number(it.precio) })) })
    // Reset
    setForm({ cliente: '', telefono: '', notas: '', estado: 'pendiente' })
    setItems([{ descripcion: '', cantidad: 1, precio: 0 }])
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo presupuesto">
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <label className="text-xs text-navy-300 mb-1 block">Cliente *</label>
          <input className="input-base" placeholder="Nombre del cliente" value={form.cliente} onChange={(e) => setF('cliente', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-navy-300 mb-1 block">Teléfono (WhatsApp)</label>
          <input className="input-base" placeholder="11 1234 5678" value={form.telefono} onChange={(e) => setF('telefono', e.target.value)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-navy-300">Ítems</label>
            <button onClick={addItem} className="text-xs text-navy-300 hover:text-navy-400">+ Agregar</button>
          </div>
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="input-base flex-1" placeholder="Descripción" value={item.descripcion} onChange={(e) => setItem(i, 'descripcion', e.target.value)} />
              <input className="input-base w-14" type="number" min="1" placeholder="Cant" value={item.cantidad} onChange={(e) => setItem(i, 'cantidad', e.target.value)} />
              <input className="input-base w-20" type="number" min="0" placeholder="Precio" value={item.precio} onChange={(e) => setItem(i, 'precio', e.target.value)} />
              {items.length > 1 && (
                <button onClick={() => removeItem(i)} className="text-orange-400 text-lg leading-none">×</button>
              )}
            </div>
          ))}
          <div className="text-right text-sm font-semibold text-navy-500 mt-1">
            Total: {fmt(items.reduce((a, it) => a + Number(it.cantidad) * Number(it.precio), 0))}
          </div>
        </div>

        <div>
          <label className="text-xs text-navy-300 mb-1 block">Notas</label>
          <textarea className="input-base resize-none h-16" placeholder="Condiciones, plazos..." value={form.notas} onChange={(e) => setF('notas', e.target.value)} />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        <button onClick={handleSave} className="btn-primary w-full">Guardar presupuesto</button>
      </div>
    </Modal>
  )
}

// ── Modal detalle / acciones de un presupuesto ────────────────────────────────
function ModalDetallePresupuesto({ presupuesto: p, perfil, onClose, onUpdateEstado, onDelete }) {
  const waLink = whatsappLink(
    p.telefono,
    `Hola ${p.cliente}! Te paso el presupuesto por un total de ${fmt(totalPresupuesto(p.items))}. ${p.notas ? `Notas: ${p.notas}` : ''}`
  )

  return (
    <Modal open={true} onClose={onClose} title={`Presupuesto — ${p.cliente}`}>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <div className="flex items-center justify-between">
          <Badge estado={p.estado} />
          <span className="text-xs text-navy-200">{fmtFecha(p.fecha)}</span>
        </div>

        {/* Items */}
        <div className="card space-y-2">
          {p.items.map((it, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-navy-400">{it.descripcion} ×{it.cantidad}</span>
              <span className="font-medium text-navy-500">{fmt(it.cantidad * it.precio)}</span>
            </div>
          ))}
          <div className="border-t border-navy-50 pt-2 flex justify-between text-sm font-semibold">
            <span className="text-navy-400">Total</span>
            <span className="text-navy-500">{fmt(totalPresupuesto(p.items))}</span>
          </div>
        </div>

        {p.notas && <p className="text-xs text-navy-300 italic">📝 {p.notas}</p>}

        {/* Cambiar estado */}
        <div>
          <label className="text-xs text-navy-300 mb-1.5 block">Cambiar estado</label>
          <div className="flex gap-2">
            {['pendiente', 'aprobado', 'rechazado'].map((estado) => (
              <button key={estado} onClick={() => onUpdateEstado(p.id, estado)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${p.estado === estado ? 'bg-navy-500 text-white border-navy-500' : 'border-navy-100 text-navy-300'}`}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button onClick={() => generarPDF(p, perfil)} className="btn-secondary flex-1 flex items-center justify-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path d="M12 10v6m-3-3l3 3 3-3"/><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            </svg>
            PDF
          </button>
          {p.telefono && (
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-center no-underline">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          )}
        </div>

        <button onClick={() => { if (confirm('¿Eliminar este presupuesto?')) onDelete(p.id) }}
          className="w-full text-center text-xs text-red-400 py-2">
          Eliminar presupuesto
        </button>
      </div>
    </Modal>
  )
}
