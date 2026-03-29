'use client'

import React, { useEffect } from 'react'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import useStore from '@/store/useStore'
import { startOfMonth, endOfMonth, isWithinInterval, getWeekOfMonth, format } from 'date-fns'
import { es } from 'date-fns/locale'

const COLORES_DONA = ['#0a2a5c', '#3b82d4', '#85b7eb', '#b5d4f4', '#d0e4f8']

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

export default function MetricasPage() {
  const { movimientos, loading, fetchMovimientos, getTotalesMes } = useStore()
  const { ingresos, egresos, ganancia } = getTotalesMes()

  useEffect(() => {
    fetchMovimientos()
  }, [fetchMovimientos])

  if (loading) return <MetricasSkeleton />

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const movsMes = movimientos.filter(m => {
    const d = new Date(m.fecha)
    return isWithinInterval(d, { start: monthStart, end: monthEnd })
  })

  // == KPIs Reales ============================================================
  const cantVentas = movsMes.filter(m => m.tipo === 'ingreso').length
  const ticketProm = cantVentas > 0 ? Math.round(ingresos / cantVentas) : 0
  const margenNeto = ingresos > 0 ? Math.round((ganancia / ingresos) * 100) : 0
  const costoPorVenta = cantVentas > 0 ? Math.round(egresos / cantVentas) : 0

  // == Tendencia Semanal (4 Semanas) ==========================================
  const semanas = [1, 2, 3, 4].map(s => {
    const movsSemana = movsMes.filter(m => {
      const w = getWeekOfMonth(new Date(m.fecha))
      return w === s || (s === 4 && w > 4) // Agrupar remanente en sem 4
    })
    
    return {
      name: `Sem ${s}`,
      Ingresos: movsSemana.filter(m => m.tipo === 'ingreso').reduce((a, b) => a + b.monto, 0),
      Egresos: movsSemana.filter(m => m.tipo === 'egreso').reduce((a, b) => a + b.monto, 0),
      Ganancia: movsSemana.filter(m => m.tipo === 'ingreso').reduce((a, b) => a + b.monto, 0) - 
                movsSemana.filter(m => m.tipo === 'egreso').reduce((a, b) => a + b.monto, 0)
    }
  })

  // == Distribución por Categoría (Ingresos) =================================
  const ingresosPorCat = movsMes
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc: any, m) => {
      acc[m.categoria] = (acc[m.categoria] || 0) + m.monto
      return acc
    }, {})

  const canalesData = Object.keys(ingresosPorCat).map(cat => ({
    nombre: cat,
    valor: ingresosPorCat[cat],
    pct: ingresos > 0 ? Math.round((ingresosPorCat[cat] / ingresos) * 100) : 0
  })).sort((a, b) => b.valor - a.valor)

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="page-enter">
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold">Métricas de {format(now, 'MMMM', { locale: es })}</h1>
        <p className="text-navy-200 text-xs">Análisis de rendimiento real de tu negocio</p>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-10">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <StatCardSmall label="Ticket Promedio" value={formatCurrency(ticketProm)} />
          <StatCardSmall label="Cant. Ventas" value={cantVentas.toString()} />
          <StatCardSmall label="Margen Neto" value={`${margenNeto}%`} />
          <StatCardSmall label="Costo x Venta" value={formatCurrency(costoPorVenta)} />
        </div>

        {/* Gráfico de Tendencia */}
        <div className="card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-4">Tendencia del Mes</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semanas}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8aaccc' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Ingresos" stroke="#3b82d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Ganancia" stroke="#0a2a5c" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3 justify-center">
            <LegendItem color="#3b82d4" label="Ingresos" />
            <LegendItem color="#0a2a5c" label="Ganancia" />
          </div>
        </div>

        {/* Distribución por Categoría */}
        <div className="card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-4">Fuentes de Ingreso</h2>
          {canalesData.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={canalesData} dataKey="valor" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={4}>
                      {canalesData.map((_, i) => (
                        <Cell key={i} fill={COLORES_DONA[i % COLORES_DONA.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {canalesData.slice(0, 4).map((c, i) => (
                  <div key={c.nombre} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORES_DONA[i % COLORES_DONA.length] }} />
                      <span className="text-[10px] text-navy-300 truncate">{c.nombre}</span>
                    </div>
                    <span className="text-[10px] font-bold text-navy-500">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-xs text-navy-200">No hay datos de ingresos suficientes</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCardSmall({ label, value }: { label: string, value: string }) {
  return (
    <div className="card">
      <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">{label}</p>
      <p className="text-base font-bold text-navy-500">{value}</p>
    </div>
  )
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[9px] font-medium text-navy-300 uppercase tracking-tighter">{label}</span>
    </div>
  )
}

function MetricasSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-navy-50 rounded-xl" />
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
