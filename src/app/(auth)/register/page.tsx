'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/actions/auth'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await signUp(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.requiresConfirmation) {
      setSuccess(true)
      setLoading(false)
    }
  }

  // Vista de éxito (Confirmación pendiente)
  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 page-enter text-center">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
              <span className="text-3xl text-emerald-500">📧</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-navy-500">¡Casi listo!</h1>
          <p className="text-sm text-navy-300">
            Enviamos un link de confirmación a tu email. Por favor, revisalo para activar tu cuenta.
          </p>
          <div className="pt-4">
            <Link href="/login" className="btn-primary w-full py-3.5 block text-center">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 page-enter">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-500">Creá tu cuenta</h1>
          <p className="text-sm text-navy-200 mt-2">Sumate a los emprendedores eficientes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-400 ml-1">Tu nombre</label>
            <input 
              name="nombre"
              type="text" 
              required
              placeholder="Juan Pérez"
              className="input-base"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-400 ml-1">Email</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="tu@email.com"
              className="input-base"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-navy-400 ml-1">Contraseña</label>
            <input 
              name="password"
              type="password" 
              required
              minLength={6}
              placeholder="••••••••"
              className="input-base"
              disabled={loading}
            />
            <p className="text-[10px] text-navy-200 ml-1">Mínimo 6 caracteres</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-navy-300">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-navy-500 font-semibold hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
