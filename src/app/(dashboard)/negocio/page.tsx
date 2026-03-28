'use client'

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import useStore from '@/store/useStore'
import { fmt, fmtFecha } from '@/lib/utils/format'
import { generarPDF } from '@/lib/utils/pdf'
import { Badge, Modal, ProgressBar, EmptyState } from '@/components/ui/FlowUI'

// Tooltip personalizado del gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-500 rounded-xl px-3 py-2 text-white text-xs shadow-lg">
      <p className="text-navy-200 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  )
}

const totalPresupuesto = (items: any[]) =>
  items.reduce((a, i) => a + Number(i.cantidad) * Number(i.precio), 0)

const whatsappLink = (telefono: string, mensaje: string) => {
  const num = telefono.replace(/\D/g, '')
  const full = num.startsWith('54') ? num : `54${num}`
  return `https://wa.me/${full}?text=${encodeURIComponent(mensaje)}`
}

export default function NegocioPage() {
  const { movimientos, perfil, getTotalesMes } = useStore()
  const presupuestos: any[] = [] // TODO: Implementar presupuestos en el store persistente
  const { ingresos, egresos, ganancia } = getTotalesMes()
  const [tab, setTab] = useState<'finanzas' | 'presupuestos'>('finanzas')
  const [modalNuevo, setModalNuevo] = useState(false)
  const [modalDetalle, setModalDetalle] = useState<any>(null)

  // == Datos para el gráfico =================================================
  const meses = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar']
  const chartData = meses.map((mes, i) => {
    const factor = 0.6 + Math.random() * 0.5
    return {
      mes,
      Ingresos: Math.round(ingresos * factor),
      Egresos: Math.round(egresos * factor),
    }
  })
  chartData[5] = { mes: 'Mar', Ingresos: ingresos, Egresos: egresos }

  return (
    <div className="page-enter text-left">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold mb-4">Mi negocio</h1>
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {(['finanzas', 'presupuestos'] as const).map((key) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tab === key ? 'bg-white text-navy-500' : 'text-navy-200'}`}>
              {key === 'finanzas' ? 'Finanzas' : 'Presupuestos'}
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
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf8" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#8aaccc' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5ff' }} />
                    <Bar dataKey="Ingresos" fill="#3b82d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Egresos"  fill="#b5d4f4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
              <EmptyState icon="📋" title="Sin presupuestos" subtitle="Próximamente: gestión de presupuestos en la nube" />
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

      {/* == Modal Nuevo Presupuesto ========================================== */}
      <ModalNuevoPresupuesto
        open={modalNuevo}
        onClose={() => setModalNuevo(false)}
        onSave={(data) => { /* addPresupuesto(data); */ setModalNuevo(false) }}
      />

      {/* == Modal Detalle Presupuesto ======================================== */}
      {modalDetalle && (
        <ModalDetallePresupuesto
          presupuesto={modalDetalle}
          perfil={perfil}
          onClose={() => setModalDetalle(null)}
          onUpdateEstado={(id: string, estado: string) => { /* updatePresupuesto(id, { estado }); */ setModalDetalle(null) }}
          onDelete={(id: string) => { /* deletePresupuesto(id); */ setModalDetalle(null) }}
        />
      )}
    </div>
  )
}

// == Formulario nuevo presupuesto =============================================
function ModalNuevoPresupuesto({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({ cliente: '', telefono: '', notas: '', estado: 'pendiente' })
  const [items, setItems] = useState([{ descripcion: '', cantidad: 1, precio: 0 }])
  const [error, setError] = useState('')

  const setF = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))
  const setItem = (i: number, k: string, v: any) => setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, [k]: v } : it))
  const addItem = () => setItems((arr) => [...arr, { descripcion: '', cantidad: 1, precio: 0 }])
  const removeItem = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i))

  const handleSave = () => {
    if (!form.cliente.trim()) return setError('El nombre del cliente es requerido')
    if (items.some((it) => !it.descripcion.trim())) return setError('Completá la descripción de todos los ítems')
    setError('')
    onSave({ ...form, items: items.map((it) => ({ ...it, cantidad: Number(it.cantidad), precio: Number(it.precio) })) })
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
              <input className="input-base w-14" type="number" value={item.cantidad} onChange={(e) => setItem(i, 'cantidad', e.target.value)} />
              <input className="input-base w-20" type="number" value={item.precio} onChange={(e) => setItem(i, 'precio', e.target.value)} />
              {items.length > 1 && (
                <button onClick={() => removeItem(i)} className="text-orange-400 text-lg">×</button>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="btn-primary w-full">Guardar presupuesto</button>
      </div>
    </Modal>
  )
}

function ModalDetallePresupuesto({ presupuesto: p, perfil, onClose, onUpdateEstado, onDelete }: any) {
  const waMsg = `Hola ${p.cliente}! Te paso el presupuesto por un total de ${fmt(totalPresupuesto(p.items))}.`
  return (
    <Modal open={true} onClose={onClose} title={`Presupuesto — ${p.cliente}`}>
      <div className="space-y-3">
        <div className="card space-y-2">
          {p.items.map((it: any, i: number) => (
            <div key={i} className="flex justify-between text-xs">
              <span>{it.descripcion} ×{it.cantidad}</span>
              <span>{fmt(it.cantidad * it.precio)}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => generarPDF(p, perfil)} className="btn-secondary flex-1">PDF</button>
          {p.telefono && (
            <a href={whatsappLink(p.telefono, waMsg)} target="_blank" className="btn-primary flex-1 text-center py-2.5 no-underline">WhatsApp</a>
          )}
        </div>
      </div>
    </Modal>
  )
}
