'use client'

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import useStore from '@/store/useStore'
import { startOfMonth, endOfMonth, isWithinInterval, getWeekOfMonth, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge, Modal, ProgressBar, EmptyState } from '@/components/ui/FlowUI'
import { Plus, LayoutDashboard, ReceiptText, Wallet, Target, Info } from 'lucide-react'

// Tooltip personalizado del gráfico
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)
    
  return (
    <div className="bg-navy-500 rounded-xl px-3 py-2 text-white text-[10px] shadow-lg border border-navy-400">
      <p className="text-navy-200 mb-1 font-bold">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span>{p.name}:</span>
          <span className="font-semibold">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function NegocioPage() {
  const { movimientos, perfil, loading, fetchMovimientos, getTotalesMes } = useStore()
  const { ingresos, egresos, ganancia } = getTotalesMes()
  
  const [tab, setTab] = useState<'finanzas' | 'presupuestos'>('finanzas')
  const [modalNuevo, setModalNuevo] = useState(false)

  useEffect(() => {
    fetchMovimientos()
  }, [fetchMovimientos])

  if (loading) return <NegocioSkeleton />

  // == Datos Reales Agrupados por Semana ======================================
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const movsMes = movimientos.filter(m => {
    const d = new Date(m.fecha)
    return isWithinInterval(d, { start: monthStart, end: monthEnd })
  })

  const weeklyData = [1, 2, 3, 4].map(s => {
    const movsSemana = movsMes.filter(m => {
      const w = getWeekOfMonth(new Date(m.fecha))
      return w === s || (s === 4 && w > 4)
    })
    
    return {
      name: `Sem ${s}`,
      Ingresos: movsSemana.filter(m => m.tipo === 'ingreso').reduce((a, b) => a + b.monto, 0),
      Egresos: movsSemana.filter(m => m.tipo === 'egreso').reduce((a, b) => a + b.monto, 0),
    }
  })

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)

  const handlePronto = () => alert('Funcionalidad próximamente: Esta opción estará disponible en la versión final.')

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold mb-4">Gestión de Negocio</h1>
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {(['finanzas', 'presupuestos'] as const).map((key) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${tab === key ? 'bg-white text-navy-500' : 'text-navy-200'}`}>
              {key === 'finanzas' ? <LayoutDashboard size={14} /> : <ReceiptText size={14} />}
              {key === 'finanzas' ? 'Finanzas' : 'Presupuestos'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-20">
        {tab === 'finanzas' ? (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="card px-2 py-3 text-center">
                <p className="text-[8px] uppercase tracking-wider text-navy-200 mb-1">Ingresos</p>
                <p className="text-xs font-bold text-emerald-600 truncate">{formatCurrency(ingresos)}</p>
              </div>
              <div className="card px-2 py-3 text-center">
                <p className="text-[8px] uppercase tracking-wider text-navy-200 mb-1">Egresos</p>
                <p className="text-xs font-bold text-orange-500 truncate">{formatCurrency(egresos)}</p>
              </div>
              <div className="card px-2 py-3 text-center">
                <p className="text-[8px] uppercase tracking-wider text-navy-200 mb-1">Ganancia</p>
                <p className="text-xs font-bold text-navy-500 truncate">{formatCurrency(ganancia)}</p>
              </div>
            </div>

            {/* Gráfico de Barras */}
            <div className="card">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-4">Balance Semanal</h2>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8aaccc' }} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="Ingresos" fill="#3b82d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Egresos" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-navy-300 rounded-full" />
                  <span className="text-[9px] uppercase font-medium text-navy-200">Ingresos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-navy-200 rounded-full" />
                  <span className="text-[9px] uppercase font-medium text-navy-200">Egresos</span>
                </div>
              </div>
            </div>

            {/* Objetivos (Fijo vs Real) */}
            <div className="card space-y-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-navy-300" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400">Objetivos del Mes</h2>
              </div>
              
              <ObjectiveRow 
                label="Meta de Ingresos" 
                current={ingresos} 
                target={1200000} 
                color="#3b82d4" 
              />
              <ObjectiveRow 
                label="Presupuesto Gastos" 
                current={egresos} 
                target={800000} 
                color="#f97316" 
                inverse
              />
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => setModalNuevo(true)} 
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Generar Presupuesto
            </button>

            <EmptyState 
              icon="📄" 
              title="Gestión de Presupuestos Cloud" 
              subtitle="Próximamente: creá, guardá y enviá presupuestos profesionales a tus clientes por WhatsApp vinculados a tu stock." 
            />

            <div className="flex gap-2 p-3 bg-navy-50 rounded-xl border border-navy-100/50">
              <Info size={16} className="text-navy-300 shrink-0 mt-0.5" />
              <p className="text-[10px] text-navy-300 italic">
                Podrás transformar presupuestos aceptados en movimientos automáticos en un solo click.
              </p>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo Presupuesto">
        <div className="space-y-4 py-2">
          <p className="text-sm text-navy-400 text-center">
            Esta funcionalidad estará disponible muy pronto. Estamos trabajando para integrar tu catálogo de productos.
          </p>
          <button onClick={() => setModalNuevo(false)} className="btn-primary w-full">Entendido</button>
        </div>
      </Modal>
    </div>
  )
}

function ObjectiveRow({ label, current, target, color, inverse = false }: any) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-medium text-navy-300">{label}</span>
        <span className="text-[10px] font-bold text-navy-500">{formatCurrency(current)} / {formatCurrency(target)}</span>
      </div>
      <ProgressBar value={current} max={target} color={color} />
    </div>
  )
}

function NegocioSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-40 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 bg-navy-50 rounded-xl" />
          <div className="h-16 bg-navy-50 rounded-xl" />
          <div className="h-16 bg-navy-50 rounded-xl" />
        </div>
        <div className="h-56 bg-navy-50 rounded-2xl w-full" />
        <div className="h-40 bg-navy-50 rounded-2xl w-full" />
      </div>
    </div>
  )
}
