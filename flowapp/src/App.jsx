// ─── Router principal ─────────────────────────────────────────────────────────
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout   from './components/layout/Layout'
import Inicio   from './pages/Inicio'
import Negocio  from './pages/Negocio'
import Metricas from './pages/Metricas'
import Gastos   from './pages/Gastos'
import Perfil   from './pages/Perfil'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index        element={<Inicio />}   />
        <Route path="negocio"  element={<Negocio />}  />
        <Route path="metricas" element={<Metricas />} />
        <Route path="gastos"   element={<Gastos />}   />
        <Route path="perfil"   element={<Perfil />}   />
        {/* Fallback */}
        <Route path="*" element={<Inicio />} />
      </Route>
    </Routes>
  )
}
