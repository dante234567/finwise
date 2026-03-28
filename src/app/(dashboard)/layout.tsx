'use client'

import React from 'react'
import BottomNav from '@/components/layout/BottomNav'

/**
 * Layout compartido de Dashboard
 * Replica la estructura (max-w-md, centrado móvil) de FlowApp
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      {/* Contenido de cada página */}
      <main className="flex-1 pb-20 max-w-md mx-auto w-full">
        {children}
      </main>

      {/* Navegación inferior fija */}
      <BottomNav />
    </div>
  )
}
