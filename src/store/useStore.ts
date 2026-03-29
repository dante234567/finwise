import { create } from 'zustand'

export interface Movimiento {
  id: string
  tipo: 'ingreso' | 'egreso'
  descripcion: string
  categoria: string
  monto: number
  fecha: string
  isFixed: boolean
  isBusiness: boolean
}

export interface Perfil {
  nombre: string
  email: string
  plan: string
  porcentajeBolsillo: number
  moneda: string
}

export interface Breakeven {
  breakeven: string
  contributionMargin: string
  totalFixedLoad: string
  error?: string
  code?: string
}

interface StoreState {
  profileId: string | null
  perfil: Perfil
  movimientos: Movimiento[]
  totalesMes: { ingresos: number; egresos: number; ganancia: number; bolsillo: number }
  breakeven: Breakeven | null | { error: string; code: string }
  loading: boolean
  error: string | null

  init: (authUserId: string) => Promise<void>
  fetchMovimientos: () => Promise<void>
  fetchDashboard: () => Promise<void>
  addMovimiento: (mov: any) => Promise<any>
  deleteMovimiento: (id: string) => Promise<any>
  fetchBreakeven: () => Promise<void>
  getTotalesMes: () => { ingresos: number; egresos: number; ganancia: number; bolsillo: number }
  getGastosPorCategoria: () => Array<{ nombre: string; presupuesto: number; color: string; gastado: number }>
  updatePerfil: (data: Partial<Perfil>) => void
}

const getStoredProfileId = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('finwise_profile_id')
}

const setStoredProfileId = (id: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('finwise_profile_id', id)
}

const useStore = create<StoreState>((set, get) => ({
  profileId: getStoredProfileId(),
  perfil: {
    nombre: 'Usuario',
    email: '',
    plan: 'Pro',
    porcentajeBolsillo: 35,
    moneda: 'ARS',
  },
  movimientos: [],
  totalesMes: { ingresos: 0, egresos: 0, ganancia: 0, bolsillo: 0 },
  breakeven: null,
  loading: false,
  error: null,

  init: async (authUserId: string) => {
    if (!authUserId) return
    try {
      const res = await fetch(`/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authUserId }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error HTTP en inicialización')
      }

      const { success, data } = await res.json()
      if (!success) return
      
      setStoredProfileId(data.id)
      set({
        profileId: data.id,
        perfil: {
          nombre: 'Usuario',
          email: '',
          plan: 'Pro',
          porcentajeBolsillo: Number(data.targetMargin) * 100,
          moneda: 'ARS',
        },
      })
      await get().fetchMovimientos()
      await get().fetchDashboard()
    } catch (err: any) {
      console.error('[store.init] Error:', err)
      alert(err.message)
    }
  },

  fetchMovimientos: async () => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) return
    set({ loading: true })
    try {
      const res = await fetch(`/api/transactions?profileId=${profileId}`)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error HTTP al cargar movimientos')
      }

      const { success, data } = await res.json()
      if (success && Array.isArray(data)) {
        const movimientos: Movimiento[] = data.map((t: any) => ({
          id: t.id,
          tipo: t.type === 'INCOME' ? 'ingreso' : 'egreso',
          descripcion: t.concept,
          categoria: t.isBusiness ? (t.isFixed ? 'Fijo' : 'Variable') : 'Personal',
          monto: Number(t.amount),
          fecha: t.createdAt,
          isFixed: t.isFixed,
          isBusiness: t.isBusiness,
        }))
        set({ movimientos, error: null })
      }
    } catch (err: any) {
      alert(err.message)
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  fetchDashboard: async () => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) return
    try {
      const res = await fetch(`/api/dashboard?profileId=${profileId}`)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error HTTP al cargar dashboard')
      }

      const { success, data } = await res.json()
      if (success) {
        set({
          totalesMes: {
            ingresos: Number(data.ingresos),
            egresos: Number(data.egresos),
            ganancia: Number(data.ganancia),
            bolsillo: Number(data.bolsillo),
          },
        })
      }
    } catch (err: any) {
      console.error('[store.fetchDashboard] Error:', err)
    }
  },

  addMovimiento: async (mov: any) => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) {
      alert('Sin ID de Perfil. Por favor, reinicia la aplicación.')
      return { success: false, error: 'Sin perfil' }
    }

    // Sanitización Estricta (Zod Compliance)
    const input = {
      profileId,
      amount: String(Number(mov.monto)), // Garantiza validación estricta decimal
      type: mov.tipo === 'ingreso' ? 'INCOME' : 'EXPENSE',
      concept: mov.descripcion, // Mapeo a nombre de BD
      quantity: 1,
      isFixed: !!mov.isFixed, // Fuerza booleano
      isBusiness: !!mov.isBusiness, // Fuerza booleano
    }

    try {
      const res = await fetch(`/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error HTTP al registrar movimiento')
      }

      const result = await res.json()
      if (result.success) {
        await get().fetchMovimientos()
        await get().fetchDashboard()
      }
      return result
    } catch (error: any) {
      alert(error.message)
      return { success: false, error: error.message }
    }
  },

  deleteMovimiento: async (id: string) => {
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error HTTP al eliminar')
      }

      const result = await res.json()
      if (result.success) {
        await get().fetchMovimientos()
        await get().fetchDashboard()
      }
      return result
    } catch (error: any) {
      alert(error.message)
      return { success: false, error: error.message }
    }
  },

  fetchBreakeven: async () => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) return
    try {
      const res = await fetch(`/api/breakeven?profileId=${profileId}`)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error HTTP al calcular breakeven')
      }

      const { success, data, error, code } = await res.json()
      set({ breakeven: success ? data : { error, code } })
    } catch (err: any) {
      console.error('[store.fetchBreakeven] Error:', err)
    }
  },

  getTotalesMes: () => get().totalesMes,

  getGastosPorCategoria: () => {
    const movs = get().movimientos.filter((m) => m.tipo === 'egreso')
    return [
      { nombre: 'Fijo',     presupuesto: 200000, color: '#3b82d4' },
      { nombre: 'Variable', presupuesto: 150000, color: '#1a4a8c' },
      { nombre: 'Personal', presupuesto: 50000,  color: '#85b7eb' },
    ].map((cat) => ({
      ...cat,
      gastado: movs.filter((m) => m.categoria === cat.nombre).reduce((a, m) => a + m.monto, 0),
    }))
  },

  updatePerfil: (data: Partial<Perfil>) => set((s) => ({ perfil: { ...s.perfil, ...data } })),
}))

export default useStore
