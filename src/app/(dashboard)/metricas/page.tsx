'use client'

import React, { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'

const COLORES_DONA = ['#0a2a5c', '#3b82d4', '#85b7eb', '#b5d4f4', '#d0e4f8']

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

export default function MetricasPage() {
  const { movimientos, getTotalesMes } = useStore()
  const { ingresos, egresos, ganancia } = getTotalesMes()
  const [periodo, setPeriodo] = useState('mes')

// == Métricas calculadas ====================================================
  const cantVentas  = movimientos.filter((m) => m.tipo === 'ingreso').length
  const ticketProm  = cantVentas > 0 ? Math.round(ingresos / cantVentas) : 0
  const margenNeto  = ingresos > 0 ? Math.round((ganancia / ingresos) * 100) : 0
  const costoPorVenta = cantVentas > 0 ? Math.round(egresos / cantVentas) : 0

  // == Datos del gráfico de tendencia ========================================
  const meses = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar']
  const tendencia = meses.map((mes, i) => {
    const factor = 0.55 + i * 0.08
    return {
      mes,
      Ingresos: Math.round(ingresos * factor),
      Egresos:  Math.round(egresos  * factor),
      Ganancia: Math.round(ganancia * factor),
    }
  })
  tendencia[5] = { mes: 'Mar', Ingresos: ingresos, Egresos: egresos, Ganancia: ganancia }

  // == Distribución por canal (dona) =========================================
  const canales = [
    { nombre: 'Ventas directas', pct: 60, valor: Math.round(ingresos * 0.6) },
    { nombre: 'Online',          pct: 28, valor: Math.round(ingresos * 0.28) },
    { nombre: 'Mayorista',       pct: 12, valor: Math.round(ingresos * 0.12) },
  ]

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold mb-4">Métricas</h1>
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {(['mes', 'trimestre', 'año'] as const).map((key) => (
            <button key={key} onClick={() => setPeriodo(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${periodo === key ? 'bg-white text-navy-500' : 'text-navy-200'}`}>
              {key === 'mes' ? 'Este mes' : key === 'trimestre' ? 'Trimestre' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 text-left">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Ticket promedio',  value: fmt(ticketProm),    delta: '+8%',  up: true },
            { label: 'Nro. de ventas',   value: cantVentas.toString(),         delta: '+15%', up: true },
            { label: 'Margen neto',      value: `${margenNeto}%`,   delta: '+2pp', up: true },
            { label: 'Costo por venta',  value: fmt(costoPorVenta), delta: '+3%',  up: false },
          ].map((k) => (
            <div key={k.label} className="card">
              <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-1">{k.label}</p>
              <p className="text-lg font-semibold text-navy-500">{k.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${k.up ? 'text-emerald-600' : 'text-orange-500'}`}>
                {k.up ? '▲' : '▼'} {k.delta} vs mes ant.
              </p>
            </div>
          ))}
        </div>

        {/* Tendencia */}
        <div className="card">
          <h2 className="text-sm font-semibold text-navy-500 mb-3">Tendencia mensual</h2>
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tendencia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf8" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#8aaccc' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Ingresos" stroke="#3b82d4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Egresos"  stroke="#b5d4f4" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="Ganancia" stroke="#0a2a5c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-1">
            {[['#3b82d4', 'Ingresos'], ['#b5d4f4', 'Egresos'], ['#0a2a5c', 'Ganancia']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span className="text-[10px] text-navy-200">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por canal */}
        <div className="card">
          <h2 className="text-sm font-semibold text-navy-500 mb-3">Distribución de ingresos</h2>
          <div className="flex items-center gap-4">
            <div className="h-[100px] w-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={canales} dataKey="valor" cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {canales.map((_, i) => (
                      <Cell key={i} fill={COLORES_DONA[i % COLORES_DONA.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {canales.map((c, i) => (
                <div key={c.nombre} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORES_DONA[i % COLORES_DONA.length] }} />
                  <span className="text-[11px] text-navy-300 flex-1">{c.nombre}</span>
                  <span className="text-[11px] font-semibold text-navy-500">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de barras por categoría de ingreso */}
        <div className="card">
          <h2 className="text-sm font-semibold text-navy-500 mb-3">Ingresos por mes (barras)</h2>
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tendencia} barCategoryGap="30%">
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#8aaccc' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5ff' }} />
                <Bar dataKey="Ingresos" fill="#3b82d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
