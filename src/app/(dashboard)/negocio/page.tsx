'use client'

import React, { useEffect } from 'react'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'
import { StatCard, EmptyState, ProgressBar, Divider } from '@/components/ui/FlowUI'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { Briefcase, Target, Plus, ChevronRight, Zap } from 'lucide-react'

export default function NegocioPage() {
  const { metrics, fetchMetrics, loading, profileId, getGastosPorCategoria } = useStore()

  useEffect(() => {
    if (profileId) fetchMetrics()
  }, [profileId, fetchMetrics])

  if (loading && !metrics) return <NegocioSkeleton />

  if (!metrics || metrics.tendencia?.length === 0) {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-10">
          <EmptyState 
            title="Sin datos del negocio" 
            subtitle="Cargá tus ingresos y egresos comerciales para ver el rendimiento de tu empresa."
          />
        </div>
      </div>
    )
  }

  const { tendencia } = metrics
  const gastosPorCat = getGastosPorCategoria()

  return (
    <div className="page-enter pb-24">
      <Header />

      <div className="px-4 pt-4 space-y-4 text-left">
        {/* Gráfico de Ingresos vs Egresos */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">Rendimiento Mensual</h3>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tendencia}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#94a3b8' }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => fmt(Number(val))}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Ingresos" fill="#3b82d4" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Egresos" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Presupuestos por Categoría */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">Control de Gastos</h3>
            <button 
              onClick={() => alert('Próximamente: definí presupuestos mensuales para cada categoría 🚀')}
              className="text-[10px] text-navy-300 font-bold uppercase flex items-center gap-1"
            >
              Definir <Plus size={12} />
            </button>
          </div>
          
          <div className="space-y-5">
            {gastosPorCat.map((cat) => (
              <div key={cat.nombre} className="space-y-2">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-bold text-navy-500">{cat.nombre}</span>
                  <span className="text-navy-300 font-medium">
                    {fmt(cat.gastado)} 
                    {cat.presupuesto > 0 && ` / ${fmt(cat.presupuesto)}`}
                  </span>
                </div>
                <ProgressBar 
                  value={cat.gastado} 
                  max={cat.presupuesto || cat.gastado * 1.2} 
                  color={cat.color} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Objetivos Siguientes */}
        <div className="card bg-navy-50/50 border-navy-100 border-dashed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-white border border-navy-100 flex items-center justify-center shadow-xs">
                  <Target className="text-navy-400" size={20} />
               </div>
               <div>
                  <h4 className="text-xs font-bold text-navy-500 uppercase">Metas de Crecimiento</h4>
                  <p className="text-[10px] text-navy-200">Definí tus próximos hitos</p>
               </div>
            </div>
            <button 
              onClick={() => alert('Próximamente: seguimiento de metas de ahorro y facturación 📈')}
              className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-300"
            >
               <ChevronRight size={16} />
            </button>
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
        <Briefcase size={18} className="text-navy-200" />
        <h1 className="text-white text-lg font-semibold">Gestión del Negocio</h1>
      </div>
      <p className="text-navy-200 text-xs">Monitoreá tus costos y presupuestos operativos</p>
    </div>
  )
}

function NegocioSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="h-56 bg-navy-50 rounded-2xl w-full" />
        <div className="h-48 bg-navy-50 rounded-2xl w-full" />
      </div>
    </div>
  )
}
