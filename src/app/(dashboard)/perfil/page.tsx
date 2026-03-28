'use client'

import React, { useState } from 'react'
import useStore from '@/store/useStore'
import { fmt } from '@/lib/utils/format'
import { Modal } from '@/components/ui/FlowUI'

const PORCENTAJES = [20, 25, 30, 35, 40, 50]

export default function PerfilPage() {
  const { perfil, updatePerfil, getTotalesMes } = useStore()
  const { bolsillo } = getTotalesMes()
  const [modalEditar, setModalEditar] = useState(false)
  const [saved, setSaved] = useState(false)

  const handlePct = (pct: number) => {
    updatePerfil({ porcentajeBolsillo: pct })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page-enter text-left">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-8 rounded-b-[28px]">
        <h1 className="text-white text-lg font-semibold mb-5">Mi perfil</h1>

        {/* Avatar + datos */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-300 flex items-center justify-center text-white text-lg font-semibold shrink-0">
            {perfil.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-white font-semibold">{perfil.nombre}</p>
            <p className="text-navy-200 text-xs mt-0.5">{perfil.email}</p>
            <span className="inline-block mt-1.5 text-[10px] font-medium text-navy-300 bg-navy-300/20 px-2.5 py-0.5 rounded-full">
              Plan {perfil.plan}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* Card bolsillo actual */}
        <div className="bg-linear-to-br from-navy-400 to-navy-500 rounded-2xl p-4 text-white">
          <p className="text-[11px] text-navy-200 mb-1">Tu bolsillo este mes</p>
          <p className="text-2xl font-semibold">{fmt(bolsillo)}</p>
          <p className="text-xs text-navy-200 mt-1">Basado en {perfil.porcentajeBolsillo}% de tu ganancia</p>
        </div>

        {/* Selector de porcentaje */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-navy-500">% de bolsillo</h2>
            {saved && <span className="text-xs text-emerald-500">✓ Guardado</span>}
          </div>
          <p className="text-xs text-navy-200 mb-3">
            ¿Qué porcentaje de tu ganancia neta querés asignarte como sueldo?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PORCENTAJES.map((pct) => (
              <button
                key={pct}
                onClick={() => handlePct(pct)}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                  perfil.porcentajeBolsillo === pct
                    ? 'bg-navy-500 text-white border-navy-500'
                    : 'border-navy-100 text-navy-300 bg-white hover:border-navy-300'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Datos personales */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 pb-0">
            <h2 className="text-sm font-semibold text-navy-500 mb-3">Datos personales</h2>
          </div>
          <div className="px-4">
            {[
              { label: 'Nombre', value: perfil.nombre },
              { label: 'Email',  value: perfil.email },
              { label: 'Moneda', value: `${perfil.moneda} $` },
              { label: 'Plan',   value: perfil.plan },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-navy-50' : ''}`}
              >
                <span className="text-xs text-navy-300">{row.label}</span>
                <span className="text-xs font-medium text-navy-500">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="p-4 pt-3">
            <button
              onClick={() => setModalEditar(true)}
              className="btn-secondary w-full"
            >
              Editar datos
            </button>
          </div>
        </div>

        {/* Configuración */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 pb-0">
            <h2 className="text-sm font-semibold text-navy-500 mb-3">Configuración</h2>
          </div>
          <div className="px-4">
            {[
              { label: 'Notificaciones', value: 'Activas',  icon: '🔔' },
              { label: 'Seguridad',      value: 'PIN activo', icon: '🔒' },
              { label: 'Moneda',         value: perfil.moneda, icon: '💱' },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? 'border-b border-navy-50' : ''}`}
              >
                <span className="text-base">{row.icon}</span>
                <span className="text-xs text-navy-500 flex-1">{row.label}</span>
                <span className="text-xs text-navy-200">{row.value}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-navy-100">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Cerrar sesión */}
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-100 bg-red-50 text-red-500 text-sm font-medium active:scale-95 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>

        <div className="pb-10 text-center text-[10px] text-navy-200 italic">
          FinWise v1.0 · Gestión Inteligente
        </div>
      </div>

      {/* Modal editar datos */}
      <ModalEditarPerfil
        open={modalEditar}
        perfil={perfil}
        onClose={() => setModalEditar(false)}
        onSave={(data: any) => { updatePerfil(data); setModalEditar(false) }}
      />
    </div>
  )
}

function ModalEditarPerfil({ open, perfil, onClose, onSave }: any) {
  const [form, setForm] = useState({ nombre: perfil.nombre, email: perfil.email })
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!form.nombre.trim()) return setError('El nombre es requerido')
    if (!form.email.includes('@')) return setError('Ingresá un email válido')
    setError('')
    onSave(form)
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar datos">
      <div className="space-y-3 text-left">
        <div>
          <label className="text-xs text-navy-300 mb-1 block">Nombre completo</label>
          <input className="input-base" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-navy-300 mb-1 block">Email</label>
          <input className="input-base" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button onClick={handleSave} className="btn-primary w-full">Guardar cambios</button>
      </div>
    </Modal>
  )
}
