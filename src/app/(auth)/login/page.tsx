'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 page-enter">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-navy-500 rounded-2xl flex items-center justify-center shadow-lg shadow-navy-500/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-8 h-8">
                <path d="M12 2v20M17 5H9.5a4.5 4.5 0 100 9h5a4.5 4.5 0 110 9H6" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-navy-500">Bienvenido a FinWise</h1>
          <p className="text-sm text-navy-200 mt-2">Gestioná tu negocio con inteligencia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              className="input-base"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
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
              'Ingresar'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-navy-300">
          ¿No tenés cuenta?{' '}
          <Link href="/register" className="text-navy-500 font-semibold hover:underline">
            Registrate ahora
          </Link>
        </p>
      </div>
    </div>
  )
}
