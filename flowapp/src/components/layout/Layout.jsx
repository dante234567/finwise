// ─── Layout principal ─────────────────────────────────────────────────────────
import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      {/* Contenido de cada página */}
      <main className="flex-1 pb-20 max-w-md mx-auto w-full">
        <Outlet />
      </main>

      {/* Navegación inferior fija */}
      <BottomNav />
    </div>
  )
}
