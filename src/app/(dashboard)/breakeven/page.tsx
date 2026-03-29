'use client'

import React, { useEffect } from 'react'
import useStore from '@/store/useStore'
import { StatCard, EmptyState } from '@/components/ui/FlowUI'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts'

export default function BreakevenPage() {
  const { loading, breakeven, fetchBreakeven } = useStore()

  useEffect(() => {
    fetchBreakeven()
  }, [fetchBreakeven])

  if (loading) return <BreakevenSkeleton />

  // Manejo de Error o Estado Vacío
  if (!breakeven) {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-4">
          <EmptyState 
            title="Sin datos de equilibrio" 
            subtitle="Agregá movimientos para calcular tu punto de equilibrio" 
          />
        </div>
      </div>
    )
  }

  // Si breakeven tiene un error reportado por la API
  if ('error' in breakeven && breakeven.error) {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-4">
          <EmptyState 
            icon="⚠️"
            title="No se pudo calcular" 
            subtitle={breakeven.error === 'NO_FIXED_EXPENSES' ? 'Necesitás cargar al menos un gasto fijo para calcular el punto de equilibrio.' : breakeven.error} 
          />
        </div>
      </div>
    )
  }

  // Datos tipados desde el store
  const data = breakeven as { breakeven: string; contributionMargin: string; totalFixedLoad: string }
  const beValue = parseFloat(data.breakeven) || 0
  const cmValue = parseFloat(data.contributionMargin) || 0
  const flValue = parseFloat(data.totalFixedLoad) || 0

  const chartData = [
    { name: 'Carga Fija', valor: flValue, color: '#1a4a8c' },
    { name: 'Pto. Equilibrio', valor: beValue, color: '#3b82f6' }
  ]

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="page-enter">
      <Header />
      
      <div className="px-4 pt-4 space-y-4">
        {/* Metricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard 
            label="Punto de Equilibrio" 
            value={formatCurrency(beValue)} 
            delta="Meta Mensual"
            deltaType="up"
          />
          <StatCard 
            label="Margen Contribución" 
            value={`${(cmValue * 100).toFixed(1)}%`} 
          />
          <StatCard 
            label="Carga Fija Total" 
            value={formatCurrency(flValue)} 
          />
        </div>

        {/* Explicación y Gráfico */}
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-navy-500">Análisis Comercial</h3>
          <p className="text-sm text-navy-300 leading-relaxed">
            Para cubrir tus costos fijos de <span className="font-semibold text-navy-500">{formatCurrency(flValue)}</span> con un margen del <span className="font-semibold text-navy-500">{(cmValue * 100).toFixed(0)}%</span>, necesitás facturar al menos <span className="font-bold text-navy-600">{formatCurrency(beValue)}</span> por mes para no perder plata.
          </p>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border border-navy-50 rounded-lg shadow-sm">
                          <p className="text-xs font-bold text-navy-500">{payload[0].payload.name}</p>
                          <p className="text-xs text-navy-300">{formatCurrency(Number(payload[0].value))}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
      <h1 className="text-white text-lg font-semibold">Punto de Equilibrio</h1>
      <p className="text-navy-200 text-xs">Calculado en base a tus ingresos y egresos de negocio</p>
    </div>
  )
}

function BreakevenSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-navy-50 rounded-2xl" />
          <div className="h-24 bg-navy-50 rounded-2xl" />
          <div className="h-24 bg-navy-50 rounded-2xl" />
        </div>
        <div className="h-64 bg-navy-50 rounded-2xl w-full" />
      </div>
    </div>
  )
}
