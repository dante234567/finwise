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
  quantity: number
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
  metrics: any | null
  loading: boolean
  error: string | null
  porcentajeSueldo: number
  setPorcentajeSueldo: (porcentaje: number) => void
  getDistribucionGanancias: () => {
    ingresosTotales: number
    egresosTotales: number
    gananciaBruta: number
    sueldoRetenido: number
    gananciaNetaNegocio: number
  }

  init: (authUserId: string) => Promise<void>
  fetchMovimientos: () => Promise<void>
  fetchDashboard: () => Promise<void>
  fetchMetrics: () => Promise<void>
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
  metrics: null,
  loading: false,
  error: null,
  porcentajeSueldo: 0,
  setPorcentajeSueldo: (porcentaje: number) => set({ porcentajeSueldo: porcentaje }),

  init: async (authUserId: string) => {
    if (!authUserId) return
    set({ loading: true })
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
          nombre: data.nombre || 'Usuario',
          email: '',
          plan: 'Pro',
          porcentajeBolsillo: Number(data.targetMargin) * 100 || 35,
          moneda: 'ARS',
        },
        porcentajeSueldo: Number(data.targetMargin) * 100 || 0,
      })
      
      await Promise.all([
        get().fetchMovimientos(),
        get().fetchDashboard(),
        get().fetchMetrics()
      ])
    } catch (err: any) {
      console.error('[store.init] Error:', err)
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  fetchMovimientos: async () => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) return
    set({ loading: true })
    try {
      const res = await fetch(`/api/transactions?profileId=${profileId}`)
      if (!res.ok) throw new Error('Error al cargar movimientos')
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
          quantity: t.quantity || 1,
        }))
        set({ movimientos, error: null })
      }
    } catch (err: any) {
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
      if (!res.ok) throw new Error('Error al cargar dashboard')
      const { success, data } = await res.json()
      if (success) {
        set({
          totalesMes: {
            ingresos: Number(data.ingresos) || 0,
            egresos: Number(data.egresos) || 0,
            ganancia: Number(data.ganancia) || 0,
            bolsillo: Number(data.bolsillo) || 0,
          },
        })
      }
    } catch (err: any) {
      console.error('[store.fetchDashboard] Error:', err)
    }
  },

  fetchMetrics: async () => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) return
    try {
      const res = await fetch(`/api/metrics?profileId=${profileId}`)
      if (!res.ok) throw new Error('Error al cargar métricas')
      const { success, data } = await res.json()
      if (success) set({ metrics: data })
    } catch (err: any) {
      console.error('[store.fetchMetrics] Error:', err)
    }
  },

  addMovimiento: async (mov: any) => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) return { success: false, error: 'Sin perfil' }
    const input = {
      profileId,
      amount: String(Number(mov.monto)),
      type: mov.tipo === 'ingreso' ? 'INCOME' : 'EXPENSE',
      concept: mov.descripcion,
      quantity: 1,
      isFixed: !!mov.isFixed,
      isBusiness: !!mov.isBusiness,
    }
    try {
      const res = await fetch(`/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Error al registrar movimiento')
      const result = await res.json()
      if (result.success) {
        await Promise.all([get().fetchMovimientos(), get().fetchDashboard()])
      }
      return result
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  deleteMovimiento: async (id: string) => {
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      const result = await res.json()
      if (result.success) {
        await Promise.all([get().fetchMovimientos(), get().fetchDashboard()])
      }
      return result
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  fetchBreakeven: async () => {
    const profileId = get().profileId || getStoredProfileId()
    if (!profileId) return
    try {
      const res = await fetch(`/api/breakeven?profileId=${profileId}`)
      if (!res.ok) throw new Error('Error al calcular breakeven')
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
      { nombre: 'Fijo',     presupuesto: 0, color: '#3b82d4' },
      { nombre: 'Variable', presupuesto: 0, color: '#1a4a8c' },
      { nombre: 'Personal', presupuesto: 0, color: '#85b7eb' },
    ].map((cat) => ({
      ...cat,
      gastado: movs.filter((m) => m.categoria === cat.nombre).reduce((a, m) => a + m.monto, 0),
    }))
  },

  updatePerfil: (data: Partial<Perfil>) => set((s) => ({ perfil: { ...s.perfil, ...data } })),

  getDistribucionGanancias: () => {
    const movs = get().movimientos
    const ingresosTotales = movs
      .filter((m) => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + m.monto, 0)
    const egresosTotales = movs
      .filter((m) => m.tipo === 'egreso')
      .reduce((acc, m) => acc + m.monto, 0)
    
    const gananciaBruta = ingresosTotales - egresosTotales
    const sueldoRetenido = gananciaBruta > 0 
      ? gananciaBruta * (get().porcentajeSueldo / 100) 
      : 0
    const gananciaNetaNegocio = gananciaBruta - sueldoRetenido

    return {
      ingresosTotales,
      egresosTotales,
      gananciaBruta,
      sueldoRetenido,
      gananciaNetaNegocio,
    }
  },
}))

export default useStore
