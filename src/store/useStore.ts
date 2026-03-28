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
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authUserId }),
      })
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
    } catch (err) {
      console.error('[store.init] Error:', err)
    }
  },

  fetchMovimientos: async () => {
    const profileId = get().profileId
    if (!profileId) return
    set({ loading: true })
    try {
      const res = await fetch(`/api/transactions?profileId=${profileId}`)
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
    } catch {
      set({ error: 'No se pudo conectar al servidor' })
    } finally {
      set({ loading: false })
    }
  },

  fetchDashboard: async () => {
    const profileId = get().profileId
    if (!profileId) return
    try {
      const res = await fetch(`/api/dashboard?profileId=${profileId}`)
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
    } catch {}
  },

  addMovimiento: async (mov: any) => {
    const profileId = get().profileId
    if (!profileId) return { success: false, error: 'Sin perfil' }
    const input = {
      profileId,
      amount: String(mov.monto),
      type: mov.tipo === 'ingreso' ? 'INCOME' : 'EXPENSE',
      concept: mov.descripcion,
      quantity: 1,
      isFixed: mov.isFixed ?? false,
      isBusiness: mov.isBusiness ?? true,
    }
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const result = await res.json()
      if (result.success) {
        await get().fetchMovimientos()
        await get().fetchDashboard()
      }
      return result
    } catch {
      return { success: false, error: 'Error de red', code: 'UNKNOWN_ERROR' }
    }
  },

  deleteMovimiento: async (id: string) => {
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        await get().fetchMovimientos()
        await get().fetchDashboard()
      }
      return result
    } catch {
      return { success: false, error: 'Error de red', code: 'UNKNOWN_ERROR' }
    }
  },

  fetchBreakeven: async () => {
    const profileId = get().profileId
    if (!profileId) return
    try {
      const res = await fetch(`/api/breakeven?profileId=${profileId}`)
      const { success, data, error, code } = await res.json()
      set({ breakeven: success ? data : { error, code } })
    } catch {
      set({ breakeven: { error: 'No se pudo calcular', code: 'UNKNOWN_ERROR' } })
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
