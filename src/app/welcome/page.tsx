'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import { Zap, Shield, TrendingUp } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()
  const { init } = useStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleActivate = async () => {
    setLoading(true)
    try {
      // Inicializar el sistema en modo invitado (demo)
      await init()
      setSuccess(true)
      
      // Permitir que la animación de éxito se vea brevemente antes de redirigir
      setTimeout(() => {
        router.push('/')
      }, 800)
    } catch (err) {
      console.error('Error al activar sistema:', err)
      setLoading(false)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-500 transition-opacity duration-700 ${success ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -ml-20 -mb-20" />

      <div className="relative z-10 w-full max-w-sm px-8 text-center space-y-12">
        
        {/* LOGO DE ÉLITE */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-[22px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shadow-navy-600/50">
            <Zap className="text-emerald-400" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
            FinWise
          </h1>
        </div>

        {/* ESLOGAN PRINCIPAL */}
        <div className="space-y-4">
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white">
                Tu soberanía financiera <br/>
                <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    comienza ahora.
                </span>
            </h2>
            <p className="text-navy-200 text-sm font-medium tracking-wide">
                Activá el diagnóstico operativo de élite y tomá el control total de tu negocio.
            </p>
        </div>

        {/* BENEFICIOS RÁPIDOS */}
        <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex flex-col items-start gap-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                <Shield size={16} className="text-emerald-500/80" />
                <span className="text-[10px] font-bold text-white/50 uppercase">Seguridad</span>
            </div>
            <div className="flex flex-col items-start gap-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                <TrendingUp size={16} className="text-teal-400/80" />
                <span className="text-[10px] font-bold text-white/50 uppercase">Escalabilidad</span>
            </div>
        </div>

        {/* BOTÓN DE ACCIÓN MASIVO */}
        <button
          onClick={handleActivate}
          disabled={loading}
          className={`group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-emerald-400 to-teal-600 p-5 text-sm font-bold uppercase tracking-widest text-white shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-70`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Activando núcleos...</span>
            </div>
          ) : (
            <span className="relative z-10">Activar Sistema</span>
          )}
          
          {/* Brillo dinámico en hover */}
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>

        <p className="text-[10px] text-navy-300 font-bold uppercase tracking-widest opacity-50">
            Powered by Gemini Advanced Architecture
        </p>

      </div>
    </div>
  )
}
