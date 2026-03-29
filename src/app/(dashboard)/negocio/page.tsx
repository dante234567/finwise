'use client'

import React, { useState, useEffect } from 'react'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'
import { ProgressBar } from '@/components/ui/FlowUI'
import { Zap, Target, Shield, Info, ArrowUpRight, TrendingUp, Calendar, Briefcase } from 'lucide-react'

// ── Components Internos para la Demo ──────────────────────────────────────────

/** Animación de conteo para impacto visual */
function AnimateNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return

    const totalMiliseconds = duration
    const incrementTime = 20
    const totalSteps = totalMiliseconds / incrementTime
    const increment = end / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{fmt(displayValue)}</span>
}

/** Gráfico de anillos minimalista (Mantenimiento vs Operación) */
function BinaryDonut({ fixed, variable }: { fixed: number; variable: number }) {
  const total = fixed + variable
  if (total === 0) return <div className="h-32 w-32 rounded-full border-4 border-navy-50 flex items-center justify-center text-[10px] text-navy-200">Sin egresos</div>
  
  const pFixed = (fixed / total) * 100
  const circumference = 2 * Math.PI * 15.915 // Radio para que el perimetro sea 100
  const strokeFixed = (pFixed * circumference) / 100
  const strokeVariable = circumference - strokeFixed

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
        {/* Sector Operación (Variable) - Motor */}
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82d4" strokeWidth="6" strokeDasharray={`${circumference} 0`} />
        {/* Sector Mantenimiento (Fijo) - Peso */}
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="6" strokeDasharray={`${strokeFixed} ${strokeVariable}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-bold text-navy-500 leading-none">{Math.round(pFixed)}%</span>
        <span className="text-[8px] text-navy-200 uppercase font-bold tracking-tighter">Peso</span>
      </div>
    </div>
  )
}

// ── Vista Principal ───────────────────────────────────────────────────────────

export default function NegocioPage() {
  const { getDiagnosticoNegocio, loading, profileId } = useStore()
  const { Ventas, Cf, Cv, PuntoEquilibrio } = getDiagnosticoNegocio()

  // Lógica de Proyección: Día de la Independencia
  const now = new Date()
  const currentDay = now.getDate()
  const avgSalesDaily = Ventas / currentDay
  const victoryDay = avgSalesDaily > 0 ? Math.ceil(PuntoEquilibrio / avgSalesDaily) : 0
  const isVictoryReached = Ventas >= PuntoEquilibrio

  if (loading && !profileId) return <NegocioSkeleton />

  return (
    <div className="page-enter pb-24 bg-slate-50/50 min-h-screen">
      <Header />

      <div className="px-4 pt-4 space-y-6 text-left">
        
        {/* == Tablero de Vuelo: Ventas en High-Impact ======================= */}
        <div className="relative overflow-hidden rounded-[32px] bg-navy-500 p-8 shadow-2xl shadow-navy-100/50">
          {/* Círculos decorativos para Glassmorphism */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-teal-400/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Zap size={14} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-navy-100 uppercase tracking-widest">Ventas de este mes</span>
            </div>
            
            <h2 className="text-5xl font-black tracking-tighter bg-linear-to-r from-emerald-400 via-emerald-300 to-teal-500 bg-clip-text text-transparent py-2">
              <AnimateNumber value={Ventas} />
            </h2>
            
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-tighter">
              <ArrowUpRight size={14} />
              <span>Creciendo en tiempo real</span>
            </div>
          </div>
        </div>

        {/* == Freedom Meter (Día de la Libertad) =========================== */}
        <div className="card border-none shadow-xl shadow-navy-50/50 bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-500">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-navy-500 uppercase tracking-tight">Día de la Libertad</h3>
                <p className="text-[10px] text-navy-200">Predicción de independencia operativa</p>
              </div>
            </div>
            
            {isVictoryReached && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 animate-bounce">
                ¡NEGOCIO INDEPENDIENTE!
              </span>
            )}
          </div>

          {Ventas === 0 ? (
            <div className="py-2 text-center space-y-3">
              <div className="h-2 w-full bg-navy-50 rounded-full overflow-hidden">
                <div className="h-full w-1/12 bg-navy-200 rounded-full animate-pulse" />
              </div>
              <p className="text-xs font-medium text-navy-300 italic">
                Esperando despegue: Cargá tu primera venta para calcular tu Día de la Victoria.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <ProgressBar 
                value={Ventas} 
                max={PuntoEquilibrio} 
                color={isVictoryReached ? 'emerald' : 'orange'} 
              />
              
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="p-3 rounded-2xl bg-navy-50/50 border border-navy-50">
                  <span className="text-[9px] font-bold text-navy-200 uppercase block mb-1">Estado de Meta</span>
                  <span className={`text-[11px] font-bold ${isVictoryReached ? 'text-emerald-600' : 'text-orange-500'}`}>
                    {isVictoryReached 
                      ? `Independiente con ${fmt(Ventas - PuntoEquilibrio)} de margen`
                      : `Faltan ${fmt(PuntoEquilibrio - Ventas)} de ventas`
                    }
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-navy-50/50 border border-navy-50 text-right">
                  <span className="text-[9px] font-bold text-navy-200 uppercase block mb-1">Victoria Estimada</span>
                  <div className="flex items-center justify-end gap-1.5">
                    <Calendar size={12} className="text-navy-300" />
                    <span className="text-sm font-bold text-navy-500 uppercase">
                      {isVictoryReached ? 'ALCANZADA' : (victoryDay > 31 ? 'Próximo Mes' : `Día ${victoryDay}`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* == Traducción Didáctica de Costos (Peso vs Motor) ================ */}
        <div className="card border-none shadow-lg shadow-navy-50/50 bg-white overflow-hidden p-6">
          <div className="flex gap-6 items-center">
            <BinaryDonut fixed={Cf} variable={Cv} />
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Shield size={12} className="text-orange-500" />
                  <span className="text-[10px] font-bold text-navy-400 uppercase tracking-tighter">Costo de abrir (Peso)</span>
                </div>
                <p className="text-lg font-bold text-navy-500 leading-none">{fmt(Cf)}</p>
                <p className="text-[9px] text-navy-200 italic">Lo que te cuesta abrir la persiana</p>
              </div>

              <div className="h-px bg-navy-50 w-full" />

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={12} className="text-blue-500" />
                  <span className="text-[10px] font-bold text-navy-400 uppercase tracking-tighter">Costo de vender (Motor)</span>
                </div>
                <p className="text-lg font-bold text-navy-500 leading-none">{fmt(Cv)}</p>
                <p className="text-[9px] text-navy-200 italic">Lo que gastás para generar ventas</p>
              </div>
            </div>
          </div>
        </div>

        {/* == Nota Final =================================================== */}
        <div className="flex gap-4 p-5 bg-navy-500 rounded-[28px] text-white shadow-xl shadow-navy-100">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center text-white shrink-0">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-navy-200">Concepto Educativo</h4>
            <p className="text-[11px] text-navy-100 italic leading-relaxed">
              El <span className="font-bold text-emerald-300 underline decoration-emerald-400/30Decoration-2 offset-2">Día de la Libertad</span> marca el momento exacto del mes en que tu negocio deja de pagar deudas y empieza a construir tu futuro personal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="px-5 pt-12 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-navy-500 text-2xl font-black tracking-tighter">Tablero de Vuelo</h1>
          <p className="text-navy-300 text-[10px] font-bold uppercase tracking-widest mt-0.5">Diagnóstico Operativo de Elite</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 border border-navy-100 shadow-xs">
          <Briefcase size={20} />
        </div>
      </div>
    </div>
  )
}

function NegocioSkeleton() {
  return (
    <div className="animate-pulse px-4 py-12 space-y-6">
      <div className="h-44 bg-navy-100 rounded-[32px] w-full" />
      <div className="h-56 bg-white shadow-xl rounded-[28px] w-full" />
      <div className="h-40 bg-white shadow-xl rounded-[28px] w-full" />
    </div>
  )
}
