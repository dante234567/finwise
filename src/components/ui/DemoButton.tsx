'use client'

import React, { useState } from 'react'
import useStore from '@/store/useStore'
import { Modal } from '@/components/ui/FlowUI'
import { Zap, Loader2, Info } from 'lucide-react'

export default function DemoButton() {
  const { movimientos, profileId, fetchMovimientos, fetchDashboard } = useStore()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Solo visible si no hay movimientos
  if (movimientos.length > 0) return null

  const handleCargarDemo = async () => {
    if (!profileId) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId })
      })

      const data = await res.json()
      if (data.success) {
        await fetchMovimientos()
        await fetchDashboard()
        setOpen(false)
      } else {
        throw new Error(data.error || 'Error al cargar demo')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-50 bg-amber-500 text-white flex items-center gap-2 px-4 py-3 rounded-full shadow-lg shadow-amber-500/30 hover:bg-amber-600 active:scale-95 transition-all animate-bounce"
      >
        <Zap size={18} fill="currentColor" />
        <span className="text-sm font-bold uppercase tracking-tight">Demo</span>
      </button>

      <Modal open={open} onClose={() => !loading && setOpen(false)} title="Modo Demo — Hackathon">
        <div className="space-y-4">
          <div className="flex gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-bold text-amber-700 mb-1">Cargar Pizzería de Marcos</p>
              <p className="text-[11px] text-amber-600 leading-relaxed">
                Esto cargará 27 movimientos reales de una pizzería en Palermo (ventas, alquiler, insumos, sueldos) para mostrar el potencial de FinWise.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleCargarDemo}
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 border-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Cargando datos...
                </>
              ) : (
                'Cargar datos de ejemplo'
              )}
            </button>
            {!loading && (
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-navy-200 py-2 hover:text-navy-300 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
