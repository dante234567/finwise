'use client'

import React, { useEffect } from 'react'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'
import { StatCard, EmptyState, ProgressBar } from '@/components/ui/FlowUI'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { Target, Zap, ArrowRight } from 'lucide-react'

export default function BreakevenPage() {
  const { breakeven, fetchBreakeven, loading, profileId, totalesMes } = useStore()

  useEffect(() => {
    if (profileId) fetchBreakeven()
  }, [profileId, fetchBreakeven])

  if (loading && !breakeven) {
    return <BreakevenSkeleton />
  }

  // Caso: Datos Insuficientes
  if (breakeven && 'code' in breakeven && breakeven.code === 'INSUFFICIENT_DATA') {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-8">
          <EmptyState 
            title="Datos insuficientes" 
            subtitle="Necesitás cargar al menos un ingreso y un egreso de tu negocio para que podamos calcular tu punto de equilibrio."
          />
        </div>
      </div>
    )
  }

  // Caso: Sin datos
  if (!breakeven || ('error' in breakeven && !('breakeven' in breakeven))) {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-8 text-center">
            <EmptyState 
              title="Calculando..." 
              subtitle="Estamos procesando tus números. Intentá registrar más movimientos si esto persiste."
            />
        </div>
      </div>
    )
  }

  const data = breakeven as any
  const beValue = Number(data.breakeven)
  const marginValue = Number(data.contributionMargin)
  const fixedValue = Number(data.totalFixedLoad)
  const actualSales = totalesMes.ingresos

  const chartData = [
    { name: 'Costo Fijo', value: fixedValue, color: '#94a3b8' },
    { name: 'Punto de Equilibrio', value: beValue, color: '#0a2a5c' }
  ]

  const percentToGoal = Math.min(Math.round((actualSales / beValue) * 100), 100)
  const isSafe = actualSales >= beValue

  return (
    <div className="page-enter pb-20">
      <Header />

      <div className="px-4 pt-4 space-y-4 text-left">
        <div className="grid grid-cols-1 gap-3">
          <StatCard 
            label="Punto de Equilibrio" 
            value={fmt(beValue)} 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            label="Margen Contrib." 
            value={`${(marginValue * 100).toFixed(1)}%`} 
          />
          <StatCard 
            label="Carga Fija Total" 
            value={fmt(fixedValue)} 
          />
        </div>

        <div className="card space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-sm font-bold text-navy-500">Progreso del mes</h3>
              <p className="text-[10px] text-navy-200">Hoy llevás {fmt(actualSales)}</p>
            </div>
            <span className={`text-lg font-bold ${isSafe ? 'text-emerald-500' : 'text-amber-500'}`}>
              {percentToGoal}%
            </span>
          </div>
          
          <ProgressBar value={actualSales} max={beValue} color={isSafe ? '#10b981' : '#f59e0b'} />
          
          <div className={`p-4 rounded-2xl border ${isSafe ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
             <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSafe ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                  {isSafe ? <Zap size={16} className="text-emerald-600" /> : <ArrowRight size={16} className="text-amber-600" />}
                </div>
                <p className="text-xs text-navy-400 leading-relaxed">
                  {isSafe 
                    ? `¡Felicidades! Ya superaste tu punto de equilibrio por ${fmt(actualSales - beValue)}. Todo lo que vendas ahora es ganancia pura.`
                    : `Necesitás facturar ${fmt(beValue)} para cubrir tus costos. Te faltan ${fmt(beValue - actualSales)} para llegar al equilibrio.`
                  }
                </p>
             </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-300 mb-6">Equilibrio vs Carga Fija</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [fmt(Number(value)), 'Valor']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    formatter={(val: any) => fmt(Number(val))} 
                    style={{ fontSize: 10, fontWeight: 600, fill: '#1e293b' }}
                  />
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
      <div className="flex items-center gap-2 mb-1">
        <Target size={18} className="text-navy-200" />
        <h1 className="text-white text-lg font-semibold">Punto de Equilibrio</h1>
      </div>
      <p className="text-navy-200 text-xs">Entendé cuánto necesitás vender para ser rentable</p>
    </div>
  )
}

function BreakevenSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="h-32 bg-navy-50 rounded-2xl w-full" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 bg-navy-50 rounded-2xl w-full" />
          <div className="h-24 bg-navy-50 rounded-2xl w-full" />
        </div>
        <div className="h-48 bg-navy-50 rounded-2xl w-full" />
      </div>
    </div>
  )
}
