import React, { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import useStore from '../context/store'
import { fmt } from '../utils/format'

export default function Metricas() {
  const { fetchMetrics, getTotalesMes, getDistribucionGanancias } = useStore()
  const { ingresos, egresos, ganancia } = getTotalesMes()
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const dist = getDistribucionGanancias()

  useEffect(() => {
    fetchMetrics().then(setMetrics).finally(() => setLoading(false))
  }, [])

  const tendencia = metrics?.tendencia?.map((m) => ({
    mes: m.label,
    Ingresos: Number(m.ingresos),
    Egresos: Number(m.egresos),
  })) ?? []

  const tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-navy-500 rounded-xl px-3 py-2 text-white text-xs shadow-lg">
        <p className="text-navy-200 mb-1">{label}</p>
        {payload.map((p) => <p key={p.name}>{p.name}: {fmt(Number(p.value))}</p>)}
      </div>
    )
  }

  const FISCALES = [
    { label: 'Lo que facturaste', value: dist.ingresos, color: 'text-navy-500', bg: 'bg-navy-50', edu: 'Todo el dinero que entro este mes' },
    { label: 'Lo que gastaste', value: dist.egresos, color: 'text-orange-500', bg: 'bg-orange-50', edu: 'Todos tus costos y gastos del mes' },
    { label: 'Ganancia bruta', value: dist.ganancia, color: 'text-navy-500', bg: 'bg-navy-50', edu: 'Lo que queda despues de pagar todos los gastos' },
    { label: 'Reserva impuestos (25%)', value: dist.reservaARCA, color: 'text-orange-600', bg: 'bg-orange-50', edu: 'ARCA (ex AFIP) se queda con esto. Guardalo antes de gastarlo' },
    { label: 'Tu ganancia real', value: dist.gananciaNeta, color: 'text-emerald-600', bg: 'bg-emerald-50', edu: 'Lo que realmente te quedo despues de impuestos' },
    { label: 'Tu sueldo del mes', value: dist.sueldoDuenio, color: 'text-navy-400', bg: 'bg-navy-50', edu: 'Lo que podes retirar para vos como dueno del negocio' },
    { label: 'Reinvertir en negocio', value: dist.capitalNegocio, color: 'text-navy-300', bg: 'bg-navy-50', edu: 'Lo que queda para hacer crecer tu negocio' },
  ]

  return (
    <div className="page-enter pb-24">
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold">Metricas</h1>
        <p className="text-navy-200 text-xs mt-1">Entende tu negocio con numeros reales</p>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* Resumen rapido */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Ingresos', value: fmt(ingresos), color: 'text-emerald-600' },
            { label: 'Egresos', value: fmt(egresos), color: 'text-orange-500' },
            { label: 'Ganancia', value: fmt(ganancia), color: 'text-navy-500' },
          ].map((k) => (
            <div key={k.label} className="card text-center">
              <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">{k.label}</p>
              <p className={`text-sm font-semibold ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Grafico tendencia */}
        {!loading && tendencia.length > 0 && (
          <div className="card">
            <h2 className="text-sm font-semibold text-navy-500 mb-1">Ultimos 6 meses</h2>
            <p className="text-[10px] text-navy-200 mb-3">Como evolucionaron tus ingresos y gastos</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={tendencia} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf8" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#8aaccc' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={tip} />
                <Bar dataKey="Ingresos" fill="#3b82d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Egresos" fill="#b5d4f4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Estado fiscal */}
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-navy-500">Estado fiscal del mes</h2>
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
              dist.saludFiscal === 'reservada' ? 'bg-emerald-50 text-emerald-600'
              : dist.saludFiscal === 'critica' ? 'bg-red-50 text-red-500'
              : 'bg-orange-50 text-orange-500'
            }`}>
              {dist.saludFiscal === 'reservada' ? 'Bien' : dist.saludFiscal === 'critica' ? 'En perdida' : 'Sin reserva'}
            </span>
          </div>
          <p className="text-[10px] text-navy-200 mb-4">
            {dist.saludFiscal === 'reservada'
              ? 'Tu negocio esta generando ganancias y tiene reserva para impuestos'
              : dist.saludFiscal === 'critica'
              ? 'Tus gastos superan tus ingresos este mes. Hay que revisar los costos'
              : 'Estas generando ganancia pero no tenes reserva para impuestos aun'}
          </p>

          <div className="space-y-3">
            {FISCALES.map((row) => (
              <div key={row.label} className={`${row.bg} rounded-xl p-3`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-navy-500">{row.label}</span>
                  <span className={`text-sm font-bold ${row.color}`}>{fmt(Math.abs(row.value))}</span>
                </div>
                <p className="text-[10px] text-navy-300">{row.edu}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ratios */}
        <div className="card">
          <h2 className="text-sm font-semibold text-navy-500 mb-1">Salud del negocio</h2>
          <p className="text-[10px] text-navy-200 mb-3">Indicadores clave para tomar decisiones</p>
          <div className="space-y-3">
            <div className="bg-navy-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-navy-500">Margen de seguridad</span>
                <span className="text-sm font-bold text-navy-500">{dist.margenSeguridad}%</span>
              </div>
              <p className="text-[10px] text-navy-300">Cuanto podrian bajar tus ventas antes de entrar en perdidas. Cuanto mas alto, mejor</p>
            </div>
            <div className="bg-navy-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-navy-500">Apalancamiento operativo</span>
                <span className="text-sm font-bold text-navy-500">{dist.apalancamiento}x</span>
              </div>
              <p className="text-[10px] text-navy-300">Si vendas 10% mas, tu ganancia crece {dist.apalancamiento}x mas. Negocios con muchos costos fijos tienen este numero alto</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-orange-600">Lo que le debas a ARCA</span>
                <span className="text-sm font-bold text-orange-600">{fmt(dist.reservaARCA)}</span>
              </div>
              <p className="text-[10px] text-orange-400">Guarda esta plata aparte. No es tuya, es del fisco. Si no la reservas, despues duele</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
