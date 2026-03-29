'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import { IconBtn } from '@/components/ui/FlowUI'
import { LogOut, User, Mail, Wallet, Save } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { perfil, profileId, loading, updatePerfil } = useStore()
  
  const [nombre, setNombre] = useState(perfil.nombre || '')
  const [porcentaje, setPorcentaje] = useState(perfil.porcentajeBolsillo || 35)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setNombre(perfil.nombre)
    setPorcentaje(perfil.porcentajeBolsillo)
  }, [perfil])

  const handleSave = async () => {
    if (!profileId) return
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          nombre,
          targetMargin: porcentaje / 100
        })
      })

      if (res.ok) {
        updatePerfil({ nombre, porcentajeBolsillo: porcentaje })
        alert('Configuración guardada correctamente')
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Error al guardar')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('finwise_profile_id')
    router.push('/login')
  }

  if (loading) return <SettingsSkeleton />

  return (
    <div className="page-enter">
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold">Configuración</h1>
        <p className="text-navy-200 text-xs">Personalizá tu perfil y objetivos</p>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-20">
        {/* Sección Perfil */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-navy-300" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400">Datos Personales</h2>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs text-navy-200 ml-1">Nombre del Perfil</label>
            <input 
              type="text" 
              className="input-base" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mi Negocio"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-navy-200 ml-1">Email (Sólo lectura)</label>
            <div className="flex items-center gap-3 bg-navy-50 px-4 py-3 rounded-xl border border-navy-100/50">
              <Mail size={16} className="text-navy-200" />
              <span className="text-sm text-navy-300">{perfil.email || 'usuario@ejemplo.com'}</span>
            </div>
          </div>
        </div>

        {/* Sección Objetivos */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-navy-300" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-400">Objetivo de Ahorro</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-semibold text-navy-500">Porcentaje "Bolsillo"</p>
                <p className="text-[10px] text-navy-200 italic">Qué % de la ganancia retirás para gastos personales</p>
              </div>
              <span className="text-xl font-bold text-navy-500">{porcentaje}%</span>
            </div>
            
            <input 
              type="range" 
              min="10" 
              max="80" 
              step="5"
              className="w-full h-2 bg-navy-50 rounded-lg appearance-none cursor-pointer accent-navy-500"
              value={porcentaje}
              onChange={(e) => setPorcentaje(Number(e.target.value))}
            />
            
            <div className="flex justify-between text-[10px] text-navy-200 px-1">
              <span>Conservador (10%)</span>
              <span>Agresivo (80%)</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-2 space-y-3">
          <button 
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          <button 
            className="btn-secondary w-full flex items-center justify-center gap-2 text-red-500 border-red-100"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-navy-400 h-32 w-full rounded-b-[28px]" />
      <div className="px-4 pt-4 space-y-4">
        <div className="h-48 bg-navy-50 rounded-2xl w-full" />
        <div className="h-48 bg-navy-50 rounded-2xl w-full" />
        <div className="h-12 bg-navy-50 rounded-2xl w-full" />
      </div>
    </div>
  )
}
