// Store global conectado al backend FinWise
import { create } from 'zustand'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const getProfileId = () => localStorage.getItem('finwise_profile_id')
const setProfileId = (id) => localStorage.setItem('finwise_profile_id', id)

const useStore = create((set, get) => ({
  profileId: getProfileId(),
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

  init: async (authUserId) => {
    if (!authUserId) return
    try {
      const res = await fetch(`${API}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authUserId }),
      })
      const { success, data } = await res.json()
      if (!success) return
      setProfileId(data.id)
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
      const res = await fetch(`${API}/api/transactions?profileId=${profileId}`)
      const { success, data } = await res.json()
      if (success) {
        const movimientos = data.map((t) => ({
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
    set({ loading: true })
    try {
      const res = await fetch(`${API}/api/dashboard?profileId=${profileId}`)
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
    } catch {
    } finally {
      set({ loading: false })
    }
  },

  addMovimiento: async (mov) => {
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
      const res = await fetch(`${API}/api/transactions`, {
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

  deleteMovimiento: async (id) => {
    try {
      const res = await fetch(`${API}/api/transactions?id=${id}`, { method: 'DELETE' })
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
      const res = await fetch(`${API}/api/breakeven?profileId=${profileId}`)
      const { success, data, error, code } = await res.json()
      set({ breakeven: success ? data : { error, code } })
    } catch {
      set({ breakeven: { error: 'No se pudo calcular', code: 'UNKNOWN_ERROR' } })
    }
  },

  // Actualizar % de bolsillo en el backend
  updateBolsillo: async (porcentaje) => {
    const profileId = get().profileId
    if (!profileId) return
    // porcentaje viene como número 20-50, convertir a fracción 0.20-0.50
    const targetMargin = porcentaje / 100
    try {
      const res = await fetch(`${API}/api/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, targetMargin }),
      })
      const { success } = await res.json()
      if (success) {
        set((s) => ({ perfil: { ...s.perfil, porcentajeBolsillo: porcentaje } }))
        await get().fetchDashboard()
      }
    } catch (err) {
      console.error('[store.updateBolsillo]', err)
    }
  },

  // Cargar métricas históricas del backend
  fetchMetrics: async () => {
    const profileId = get().profileId
    if (!profileId) return null
    try {
      const res = await fetch(`${API}/api/metrics?profileId=${profileId}`)
      const { success, data } = await res.json()
      if (success) {
        set({ metrics: data })
        return data
      }
    } catch (err) {
      console.error('[store.fetchMetrics]', err)
    }
    return null
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

  presupuestos: [],
  addPresupuesto: () => {},
  updatePresupuesto: () => {},
  deletePresupuesto: () => {},
  categorias: [],
  updateCategoria: () => {},
  updatePerfil: (data) => set((s) => ({ perfil: { ...s.perfil, ...data } })),
}))

export default useStore
