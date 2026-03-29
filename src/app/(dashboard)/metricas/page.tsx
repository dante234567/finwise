'use client'

import React, { useEffect } from 'react'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'
import { StatCard, EmptyState } from '@/components/ui/FlowUI'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function MetricasPage() {
  const { metrics, fetchMetrics, loading, profileId } = useStore()

  useEffect(() => {
    if (profileId) fetchMetrics()
  }, [profileId, fetchMetrics])

  if (loading && !metrics) return <MetricsSkeleton />

  if (!metrics || (metrics.kpis?.cantVentas === 0 && metrics.tendencia?.length === 0)) {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-10">
          <EmptyState 
            title="Sin métricas aún" 
            subtitle="Registrá movimientos o cargá el Modo Demo para ver el análisis detallado de tu negocio."
          />
        </div>
      </div>
    )
  }

  const { kpis, tendencia, distribucion } = metrics

  // Formatear datos para PieChart
  const pieData = Object.entries(distribucion || {}).map(([name, value]) => ({
    name,
    value: Number(value)
  })).filter(d => d.value > 0)

  const COLORS = ['#0a2a5c', '#3b82d4', '#8aaccc', '#c1d4e5']

  return (
    <div className="page-enter pb-20">
      <Header />

      <div className="px-4 pt-4 space-y-4 text-left">
        {/* KPIs Reales */}
        <div className="grid grid-cols-2 gap-3">
          <StatCardSmall 
            label="Ticket Promedio" 
            value={fmt(kpis.ticketPromedio)} 
          />
          <StatCardSmall 
            label="Cant. Ventas" 
            value={String(kpis.cantVentas)} 
          />
          <StatCardSmall 
            label="Margen Neto" 
            value={`${Number(kpis.margenNeto).toFixed(1)}%`} 
          />
          <StatCardSmall 
            label="Costo x Venta" 
            value={fmt(kpis.costoPorVenta)} 
          />
        </div>

        {/* Tendencia Semanal */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-navy-300" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">Tendencia Semanal</h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tendencia}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#94a3b8' }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => fmt(Number(val))}
                />
                <Line 
                  type="monotone" 
                  dataKey="Ingresos" 
                  stroke="#3b82d4" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82d4', strokeWidth: 0 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Ganancia" 
                  stroke="#0a2a5c" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0a2a5c', strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
              <LegendItem color="#3b82d4" label="Ingresos" />
              <LegendItem color="#0a2a5c" label="Ganancia" />
          </div>
        </div>

        {/* Distribución por Concepto */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={16} className="text-navy-300" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">Fuentes de Ingreso</h3>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="h-32 w-32 shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
               {pieData.map((d, i) => (
                 <div key={d.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                       <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                       <span className="text-navy-400 font-medium truncate">{d.name}</span>
                    </div>
                    <span className="text-navy-200 font-bold ml-2">{( (d.value / kpis.ingresosTotales) * 100).toFixed(0)}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCardSmall({ label, value }: { label: string, value: string }) {
  return (
    <div className="card py-3.5">
      <p className="text-[10px] uppercase text-navy-200 mb-1 font-semibold">{label}</p>
      <p className="text-base font-bold text-navy-500">{value}</p>
    </div>
  )
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[9px] font-bold text-navy-300 uppercase tracking-tighter">{label}</span>
    </div>
  )
}

function Header() {
  return (
    <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 size={18} className="text-navy-200" />
        <h1 className="text-white text-lg font-semibold">Métricas Avanzadas</h1>
      </div>
      <p className="text-navy-200 text-xs">Análisis profundo de tu rendimiento comercial</p>
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-navy-50 rounded-2xl" />)}
        </div>
        <div className="h-48 bg-navy-50 rounded-2xl w-full" />
      </div>
    </div>
  )
}
