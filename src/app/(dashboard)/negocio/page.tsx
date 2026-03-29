'use client'

import React from 'react'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'
import { StatCard, ProgressBar } from '@/components/ui/FlowUI'
import { Briefcase, Info } from 'lucide-react'

export default function NegocioPage() {
  const { getDiagnosticoNegocio, loading, profileId } = useStore()

  // Sincronización determinista con el estado local para la demo
  const { Ventas, Cf, Cv, PuntoEquilibrio } = getDiagnosticoNegocio()

  const isEquilibriumReached = Ventas >= PuntoEquilibrio
  const progressPercent = Math.min((Ventas / PuntoEquilibrio) * 100, 100)

  if (loading && !profileId) return <NegocioSkeleton />

  return (
    <div className="page-enter pb-24">
      <Header />

      <div className="px-4 pt-4 space-y-6 text-left">
        
        {/* == Dashboard de Control Operativo =============================== */}
        <div className="grid grid-cols-1 gap-3">
          <StatCard 
            label="Ventas Totales (Ingresos)" 
            value={fmt(Ventas)} 
            className="bg-navy-500 text-white"
          />
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              label="Costos Fijos (Cf)" 
              value={fmt(Cf)} 
              className="border-orange-100 bg-orange-50/30"
            />
            <StatCard 
              label="Costos Variables (Cv)" 
              value={fmt(Cv)} 
              className="border-slate-100 bg-slate-50/30"
            />
          </div>
        </div>

        {/* == Survival Meter (Punto de Equilibrio) ========================= */}
        <div className="card border-2 transition-all duration-500 overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-navy-400">Survival Meter</h3>
              <h2 className="text-sm font-bold text-navy-500">Tu Punto de Equilibrio</h2>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
              isEquilibriumReached 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                : 'bg-orange-50 text-orange-600 border-orange-200'
            }`}>
              {isEquilibriumReached ? 'Zona de Ganancia Bruta' : 'Por debajo del equilibrio'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <ProgressBar 
                value={Ventas} 
                max={PuntoEquilibrio} 
                color={isEquilibriumReached ? 'emerald' : 'orange'} 
              />
              {/* Marker de Punto de Equilibrio */}
              <div className="absolute top-0 right-0 h-full w-0.5 bg-navy-200/50 z-10" />
            </div>

            <div className="flex justify-between items-start pt-1">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-navy-200 uppercase">Ventas Actuales</span>
                <span className="text-sm font-bold text-navy-500">{fmt(Ventas)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-navy-200 uppercase">Punto de Equilibrio</span>
                <span className="text-sm font-bold text-navy-500">{fmt(PuntoEquilibrio)}</span>
              </div>
            </div>

            <div className={`rounded-xl p-3 border space-y-1 ${
              isEquilibriumReached ? 'bg-emerald-50/50 border-emerald-100' : 'bg-orange-50/50 border-orange-100'
            }`}>
              <p className="text-[10px] font-bold text-navy-400 uppercase">Diagnóstico de Supervivencia</p>
              <p className="text-xs font-medium text-navy-500 leading-tight">
                {isEquilibriumReached 
                  ? `¡Felicidades! Tenés un superávit operativo de ${fmt(Ventas - PuntoEquilibrio)}. Tu estructura fija está totalmente cubierta.`
                  : `Te faltan vender ${fmt(PuntoEquilibrio - Ventas)} este mes para cubrir tus costos fijos sin perder dinero.`
                }
              </p>
            </div>
          </div>
        </div>

        {/* == Nota Didáctica =============================================== */}
        <div className="flex gap-3 p-4 bg-navy-50/50 border border-navy-100 rounded-2xl">
          <div className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-navy-400 shadow-sm">
            <Info size={16} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-tighter text-navy-400">Concepto Educativo</p>
            <p className="text-xs text-navy-500 italic leading-snug">
              Tu punto de equilibrio es el volumen de ventas necesario para que tu utilidad operativa sea cero. 
              A partir de <span className="font-bold underline decoration-navy-300">{fmt(PuntoEquilibrio)}</span>, cada peso ingresado contribuye directamente a tu ganancia neta.
            </p>
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
        <h1 className="text-white text-lg font-semibold">Salud del Negocio</h1>
      </div>
      <p className="text-navy-200 text-xs mt-0.5">Diagnóstico operativo en tiempo real</p>
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
