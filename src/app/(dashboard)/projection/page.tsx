'use client'

import React from 'react'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'
import { EmptyState } from '@/components/ui/FlowUI'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Calendar, Target } from 'lucide-react'

export default function ProjectionPage() {
  const { totalesMes, loading } = useStore()

  const ingresosMes = totalesMes.ingresos
  const diaActual = new Date().getDate()
  
  // Cálculo de promedio diario
  const promedioDiario = ingresosMes > 0 ? ingresosMes / diaActual : 0
  
  // Proyecciones a 30, 60 y 90 días
  const horizontes = [30, 60, 90]
  const escenarios = horizontes.map(dias => {
    const base = promedioDiario * dias
    return {
      dias,
      conservador: base * 0.8,
      base: base,
      optimista: base * 1.2
    }
  })

  // Datos para el gráfico
  const chartData = horizontes.map(dias => {
    const base = promedioDiario * dias
    return {
      name: `${dias} días`,
      Conservador: Math.round(base * 0.8),
      Base: Math.round(base),
      Optimista: Math.round(base * 1.2)
    }
  })

  if (loading && ingresosMes === 0) return <ProjectionSkeleton />

  if (ingresosMes === 0) {
    return (
      <div className="page-enter">
        <Header />
        <div className="px-4 pt-10">
          <EmptyState 
            title="Sin datos para proyectar" 
            subtitle="Necesitás registrar ingresos este mes para que podamos calcular tu tendencia y proyectar tu crecimiento."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter pb-20">
      <Header />
      
      <div className="px-4 pt-4 space-y-4 text-left">
        {/* KPI: Tendencia Actual */}
        <div className="card bg-linear-to-br from-navy-500 to-navy-600 text-white border-none">
          <p className="text-[10px] uppercase tracking-widest text-navy-200 mb-1">Promedio Diario Actual</p>
          <p className="text-3xl font-bold">{fmt(promedioDiario)}</p>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-navy-200" />
              <span className="text-[10px] text-navy-100 italic font-medium">Día {diaActual} del mes</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Tendencia Activa</span>
            </div>
          </div>
        </div>

        {/* Tabla de Proyecciones */}
        <div className="card overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-navy-50 bg-navy-50/30">
             <h3 className="text-xs font-bold uppercase tracking-wider text-navy-400">Escenarios Estimados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-navy-300 font-bold">
                  <th className="px-5 py-3 border-b border-navy-50">Plazo</th>
                  <th className="px-5 py-3 border-b border-navy-50">Cons. (80%)</th>
                  <th className="px-5 py-3 border-b border-navy-50">Base</th>
                  <th className="px-5 py-3 border-b border-navy-50">Opt. (120%)</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {escenarios.map((e) => (
                  <tr key={e.dias} className="border-b border-navy-50/50 hover:bg-navy-50/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-navy-500 underline decoration-navy-100 underline-offset-4">{e.dias} días</td>
                    <td className="px-5 py-4 text-amber-600 font-medium">{fmt(e.conservador)}</td>
                    <td className="px-5 py-4 text-navy-400 font-semibold">{fmt(e.base)}</td>
                    <td className="px-5 py-4 text-emerald-600 font-bold">{fmt(e.optimista)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico de Tendencia */}
        <div className="card">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-300 mb-6">Visualización de Crecimiento</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => fmt(Number(value))}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Optimista" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Base" stroke="#3b82d4" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Conservador" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/50 border border-navy-100 p-4 rounded-2xl">
          <p className="text-[10px] text-navy-300 italic leading-relaxed text-center font-medium">
            * Los cálculos se basan en tu promedio diario de ventas del mes actual. 
            El escenario base asume que mantendrás el mismo ritmo de facturación.
          </p>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={18} className="text-navy-200" />
        <h1 className="text-white text-lg font-semibold">Proyecciones</h1>
      </div>
      <p className="text-navy-200 text-xs text-left">Tendencia estimada basándonos en tus números reales</p>
    </div>
  )
}

function ProjectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="h-40 bg-navy-50 rounded-2xl w-full" />
        <div className="h-56 bg-navy-50 rounded-2xl w-full" />
      </div>
    </div>
  )
}
