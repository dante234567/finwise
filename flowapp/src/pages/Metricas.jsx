// ─── Página Métricas — datos reales del backend ───────────────────────────────
import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import useStore from '../context/store'
import { fmt } from '../utils/format'

const COLORES_DONA = ['#0a2a5c', '#3b82d4', '#b5d4f4']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-500 rounded-xl px-3 py-2 text-white text-xs shadow-lg">
      <p className="text-navy-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name}>{p.name}: {fmt(Number(p.value))}</p>
      ))}
    </div>
  )
}

export default function Metricas() {
  const { fetchMetrics, getTotalesMes, getDistribucionGanancias } = useStore()
  const { ingresos, egresos, ganancia } = getTotalesMes()
  const [periodo, setPeriodo] = useState('mes')
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      setLoading(true)
      const data = await fetchMetrics()
      setMetrics(data)
      setLoading(false)
    }
    cargar()
  }, [])

  // Datos de tendencia — reales del backend o vacíos
  const tendencia = metrics?.tendencia?.map((m) => ({
    mes: m.label,
    Ingresos: Number(m.ingresos),
    Egresos: Number(m.egresos),
    Ganancia: Number(m.ganancia),
  })) ?? []

  // KPIs reales
  const cantVentas = metrics?.kpis?.cantVentas ?? 0
  const ticketProm = Number(metrics?.kpis?.ticketProm ?? 0)
  const margenNeto = Number(metrics?.kpis?.margenNeto ?? 0)
  const costoPorVenta = Number(metrics?.kpis?.costoPorVenta ?? 0)

  // Distribución negocio vs personal
  const distNegocio = Number(metrics?.distribucion?.negocio ?? 0)
  const distPersonal = Number(metrics?.distribucion?.personal ?? 0)
  const distTotal = distNegocio + distPersonal
  const canales = distTotal > 0
    ? [
        { nombre: 'Negocio',  valor: distNegocio,  pct: Math.round((distNegocio / distTotal) * 100) },
        { nombre: 'Personal', valor: distPersonal, pct: Math.round((distPersonal / distTotal) * 100) },
      ]
    : [
        { nombre: 'Negocio',  valor: 0, pct: 50 },
        { nombre: 'Personal', valor: 0, pct: 50 },
      ]

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold mb-4">Métricas</h1>
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {[['mes', 'Este mes'], ['trimestre', 'Trimestre'], ['año', 'Año']].map(([key, label]) => (
            <button key={key} onClick={() => setPeriodo(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${periodo === key ? 'bg-white text-navy-500' : 'text-navy-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-navy-300 border-t-navy-500 animate-spin" />
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">

          {/* KPIs reales */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Ticket promedio',  value: fmt(ticketProm) },
              { label: 'Nro. de ingresos', value: cantVentas },
              { label: 'Margen neto',      value: `${margenNeto}%` },
              { label: 'Costo por egreso', value: fmt(costoPorVenta) },
            ].map((k) => (
              <div key={k.label} className="card">
                <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-1">{k.label}</p>
                <p className="text-lg font-semibold text-navy-500">{k.value}</p>
              </div>
            ))}
          </div>

          {/* Tendencia histórica real */}
          <div className="card">
            <h2 className="text-sm font-semibold text-navy-500 mb-3">Tendencia últimos 6 meses</h2>
            {tendencia.length === 0 || tendencia.every(m => m.Ingresos === 0 && m.Egresos === 0) ? (
              <p className="text-xs text-navy-200 text-center py-6">Sin datos históricos aún</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
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
                <div className="flex gap-4 mt-1">
                  {[['#3b82d4', 'Ingresos'], ['#b5d4f4', 'Egresos'], ['#0a2a5c', 'Ganancia']].map(([c, l]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                      <span className="text-[10px] text-navy-200">{l}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Distribución negocio vs personal */}
          <div className="card">
            <h2 className="text-sm font-semibold text-navy-500 mb-3">Ingresos por origen</h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie data={canales} dataKey="valor" cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {canales.map((_, i) => (
                      <Cell key={i} fill={COLORES_DONA[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {canales.map((c, i) => (
                  <div key={c.nombre} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORES_DONA[i] }} />
                    <span className="text-[11px] text-navy-300 flex-1">{c.nombre}</span>
                    <span className="text-[11px] font-semibold text-navy-500">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Barras por mes */}
          <div className="card">
            <h2 className="text-sm font-semibold text-navy-500 mb-3">Ingresos por mes</h2>
            {tendencia.length === 0 ? (
              <p className="text-xs text-navy-200 text-center py-4">Sin datos aún</p>
            ) : (
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={tendencia} barCategoryGap="30%">
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#8aaccc' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f5ff' }} />
                  <Bar dataKey="Ingresos" fill="#3b82d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>


          {/* Diagnostico Fiscal ARCA */}
          {(() => {
            const dist = getDistribucionGanancias()
            return (
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-navy-500">Diagnostico fiscal ARCA</h2>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                    dist.saludFiscal === 'reservada' ? 'bg-emerald-50 text-emerald-600'
                    : dist.saludFiscal === 'critica' ? 'bg-red-50 text-red-500'
                    : 'bg-orange-50 text-orange-500'
                  }`}>
                    {dist.saludFiscal === 'reservada' ? 'Reserva activa'
                      : dist.saludFiscal === 'critica' ? 'En perdida'
                      : 'Sin reserva'}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Ganancia bruta',     value: dist.ganancia,       color: 'text-navy-500' },
                    { label: 'Reserva ARCA (25%)', value: -dist.reservaARCA,   color: 'text-orange-500' },
                    { label: 'Ganancia neta real', value: dist.gananciaNeta,   color: 'text-emerald-600' },
                    { label: 'Tu sueldo',          value: dist.sueldoDuenio,   color: 'text-navy-400' },
                    { label: 'Queda en negocio',   value: dist.capitalNegocio, color: 'text-navy-300' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center text-xs">
                      <span className="text-navy-300">{row.label}</span>
                      <span className={`font-semibold ${row.color}`}>
                        {row.value < 0 ? '-' : ''}{fmt(Math.abs(row.value))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-navy-50 my-3" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-navy-50 rounded-xl p-3">
                    <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">Margen de seguridad</p>
                    <p className="text-lg font-semibold text-navy-500">{dist.margenSeguridad}%</p>
                  </div>
                  <div className="bg-navy-50 rounded-xl p-3">
                    <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">Apalancamiento op.</p>
                    <p className="text-lg font-semibold text-navy-500">{dist.apalancamiento}x</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-[9px] uppercase tracking-wider text-orange-300 mb-1">Carga ARCA latente</p>
                    <p className="text-lg font-semibold text-orange-500">{fmt(dist.reservaARCA)}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-[9px] uppercase tracking-wider text-emerald-300 mb-1">Capital operativo</p>
                    <p className="text-lg font-semibold text-emerald-600">{fmt(dist.capitalNegocio)}</p>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
