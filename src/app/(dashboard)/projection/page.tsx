'use client'

import React, { useEffect } from 'react'
import useStore from '@/store/useStore'
import { StatCard, EmptyState } from '@/components/ui/FlowUI'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

export default function ProjectionPage() {
  const { movimientos, loading, fetchMovimientos } = useStore()

  useEffect(() => {
    fetchMovimientos()
  }, [fetchMovimientos])

  if (loading) return <ProjectionSkeleton />

  // ── Cálculos de Proyección ────────────────────────────────────────────────
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const currentDay = now.getDate()

  const ingresosMes = movimientos
    .filter(m => {
      const d = new Date(m.fecha)
      return m.tipo === 'ingreso' && d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((acc, m) => acc + m.monto, 0)

  if (movimientos.length === 0 || ingresosMes === 0) {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-4">
          <EmptyState 
            title="Sin ingresos este mes" 
            subtitle="Necesitás cargar ingresos para calcular proyecciones futuras." 
          />
        </div>
      </div>
    )
  }

  const promedioDiario = ingresosMes / currentDay
  
  const calcularEscenario = (dias: number, factor: number) => promedioDiario * dias * factor

  const dataChart = [
    { name: 'Hoy', conservador: ingresosMes, base: ingresosMes, optimista: ingresosMes },
    { 
      name: '30 Días', 
      conservador: calcularEscenario(30, 0.8), 
      base: calcularEscenario(30, 1.0), 
      optimista: calcularEscenario(30, 1.2) 
    },
    { 
      name: '60 Días', 
      conservador: calcularEscenario(60, 0.8), 
      base: calcularEscenario(60, 1.0), 
      optimista: calcularEscenario(60, 1.2) 
    },
    { 
      name: '90 Días', 
      conservador: calcularEscenario(90, 0.8), 
      base: calcularEscenario(90, 1.0), 
      optimista: calcularEscenario(90, 1.2) 
    },
  ]

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="page-enter">
      <Header />

      <div className="px-4 pt-4 space-y-4 pb-10">
        {/* KPI: Promedio Diario */}
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-0.5">Venta Diaria Promedio</p>
            <p className="text-lg font-bold text-navy-500">{formatCurrency(promedioDiario)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-0.5">Acumulado Mes</p>
            <p className="text-sm font-semibold text-emerald-600">{formatCurrency(ingresosMes)}</p>
          </div>
        </div>

        {/* Gráfico de Proyecciones */}
        <div className="card h-80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">Escenarios de Crecimiento</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-navy-50 rounded-xl shadow-lg space-y-1">
                          <p className="text-xs font-bold text-navy-500 mb-2">{payload[0].payload.name}</p>
                          {payload.map((p: any) => (
                            <div key={p.name} className="flex items-center gap-2 justify-between">
                              <span className="text-[10px] text-navy-300 capitalize">{p.name}:</span>
                              <span className="text-xs font-semibold" style={{ color: p.color }}>{formatCurrency(p.value)}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Line type="monotone" dataKey="conservador" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} name="Conservador" />
                <Line type="monotone" dataKey="base" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Base" />
                <Line type="monotone" dataKey="optimista" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Optimista" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cards de Resumen 30 Días */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard 
            label="Proyección 30 Días (Base)" 
            value={formatCurrency(calcularEscenario(30, 1))} 
          />
          <StatCard 
            label="Proyección 60 Días (Base)" 
            value={formatCurrency(calcularEscenario(60, 1))} 
          />
          <StatCard 
            label="Proyección 90 Días (Base)" 
            value={formatCurrency(calcularEscenario(90, 1))} 
          />
        </div>

        <div className="card bg-navy-50 border-none">
          <p className="text-[11px] text-navy-300 leading-relaxed italic">
            * El cálculo se basa en el promedio de ventas diarias del mes actual. No contempla estacionalidad ni eventos extraordinarios.
          </p>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
      <h1 className="text-white text-lg font-semibold">Proyección de Ingresos</h1>
      <p className="text-navy-200 text-xs">Simulación de facturación futura basada en ventas reales</p>
    </div>
  )
}

function ProjectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="h-20 bg-navy-50 rounded-2xl w-full" />
        <div className="h-80 bg-navy-50 rounded-2xl w-full" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-navy-50 rounded-2xl" />
          <div className="h-24 bg-navy-50 rounded-2xl" />
          <div className="h-24 bg-navy-50 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
