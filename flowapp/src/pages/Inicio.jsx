// ─── Página Inicio ─────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useStore from '../context/store'
import { fmt, fmtRelativa } from '../utils/format'
import { Badge } from '../components/ui'

export default function Inicio() {
  const [tab, setTab] = useState('bolsillo') // 'bolsillo' | 'negocio'
  const { movimientos, perfil, getTotalesMes } = useStore()
  const { ingresos, egresos, ganancia, bolsillo } = getTotalesMes()

  // Últimos 5 movimientos
  const recientes = movimientos.slice(0, 5)

  return (
    <div className="page-enter">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-white text-lg font-semibold">
              Hola, {perfil.nombre.split(' ')[0]} 👋
            </h1>
            <p className="text-navy-200 text-xs mt-0.5">
              {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          {/* Notificaciones */}
          <button className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {[['bolsillo', 'Mi bolsillo'], ['negocio', 'Negocio']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === key ? 'bg-white text-navy-500' : 'text-navy-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {tab === 'bolsillo' ? (
          <>
            {/* ── Card Bolsillo ──────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-400 to-navy-500 p-5 text-white">
              {/* Círculo decorativo */}
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute right-8 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

              <p className="text-[11px] text-navy-200 mb-1 relative">Disponible para vos</p>
              <p className="text-4xl font-semibold tracking-tight relative">{fmt(bolsillo)}</p>
              <p className="text-xs text-navy-200 mt-1 relative">
                {perfil.porcentajeBolsillo}% de tu ganancia neta
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 relative">
                <div>
                  <p className="text-[10px] text-navy-200">Ganancia neta</p>
                  <p className="text-sm font-semibold">{fmt(ganancia)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-navy-200">Ingresado</p>
                  <p className="text-sm font-semibold">{fmt(ingresos)}</p>
                </div>
                <span className="flex items-center gap-1 bg-emerald-400/20 border border-emerald-400/30 rounded-full px-2.5 py-1 text-[10px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En vivo
                </span>
              </div>
            </div>

            {/* ── Métricas rápidas ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card">
                <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-1">Ingresos del mes</p>
                <p className="text-lg font-semibold text-navy-500">{fmt(ingresos)}</p>
              </div>
              <div className="card">
                <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-1">Gastos del mes</p>
                <p className="text-lg font-semibold text-navy-500">{fmt(egresos)}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ── Vista Negocio resumida ─────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Ingresos', value: fmt(ingresos), color: 'text-emerald-600' },
                { label: 'Egresos',  value: fmt(egresos),  color: 'text-orange-500' },
                { label: 'Resultado', value: fmt(ganancia), color: 'text-navy-400' },
              ].map((s) => (
                <div key={s.label} className="card text-center">
                  <p className="text-[9px] uppercase tracking-wider text-navy-200 mb-1">{s.label}</p>
                  <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="text-xs text-navy-300 mb-3">Para ver el detalle completo del negocio</p>
              <Link to="/negocio" className="btn-primary w-full text-center block">
                Ir a Finanzas del negocio →
              </Link>
            </div>
          </>
        )}

        {/* ── Últimos movimientos ─────────────────────────────────────────────── */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-navy-500">Últimos movimientos</h2>
            <Link to="/gastos" className="text-[11px] text-navy-300">Ver todo</Link>
          </div>

          {recientes.length === 0 ? (
            <p className="text-xs text-navy-200 text-center py-4">Sin movimientos aún</p>
          ) : (
            <div className="space-y-3">
              {recientes.map((mov) => (
                <div key={mov.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    mov.tipo === 'ingreso' ? 'bg-emerald-50' : 'bg-orange-50'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={mov.tipo === 'ingreso' ? '#059669' : '#f97316'} strokeWidth={2} className="w-3.5 h-3.5">
                      {mov.tipo === 'ingreso'
                        ? <path d="M12 5v14M5 12l7 7 7-7" />
                        : <path d="M12 19V5M5 12l7-7 7 7" />}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-navy-500 truncate">{mov.descripcion}</p>
                    <p className="text-[10px] text-navy-200">{fmtRelativa(mov.fecha)}</p>
                  </div>
                  <p className={`text-sm font-semibold flex-shrink-0 ${
                    mov.tipo === 'ingreso' ? 'text-emerald-600' : 'text-orange-500'
                  }`}>
                    {mov.tipo === 'ingreso' ? '+' : '-'}{fmt(mov.monto)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
