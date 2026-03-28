'use client'

import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Utility to merge tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Tarjeta de métrica ────────────────────────────────────────────────────────
export function StatCard({ 
  label, 
  value, 
  delta, 
  deltaType = 'up', 
  className = '' 
}: { 
  label: string; 
  value: string; 
  delta?: string; 
  deltaType?: 'up' | 'down'; 
  className?: string 
}) {
  return (
    <div className={cn("card", className)}>
      <p className="text-[10px] uppercase tracking-wider text-navy-200 mb-1.5">{label}</p>
      <p className="text-xl font-semibold text-navy-500">{value}</p>
      {delta && (
        <p className={cn("mt-1", deltaType === 'up' ? 'text-emerald-600' : 'text-orange-500', "text-xs flex items-center gap-1")}>
          {deltaType === 'up' ? '▲' : '▼'} {delta}
        </p>
      )}
    </div>
  )
}

// ── Badge de estado ────────────────────────────────────────────────────────────
const ESTADO_STYLES: Record<string, string> = {
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  aprobado:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  rechazado: 'bg-red-50 text-red-600 border-red-200',
  ingreso:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  egreso:    'bg-orange-50 text-orange-600 border-orange-200',
}

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  aprobado:  'Aprobado',
  rechazado: 'Rechazado',
  ingreso:   'Ingreso',
  egreso:    'Egreso',
}

export function Badge({ estado }: { estado: string }) {
  return (
    <span className={cn(
      "text-[10px] font-medium px-2 py-0.5 rounded-full border",
      ESTADO_STYLES[estado] || 'bg-navy-50 text-navy-300 border-navy-100'
    )}>
      {ESTADO_LABEL[estado] || estado}
    </span>
  )
}

// ── Estado vacío ───────────────────────────────────────────────────────────────
export function EmptyState({ 
  icon = '📭', 
  title, 
  subtitle, 
  action 
}: { 
  icon?: string; 
  title: string; 
  subtitle?: string; 
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-sm font-medium text-navy-400 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-navy-200 mb-4">{subtitle}</p>}
      {action}
    </div>
  )
}

// ── Modal genérico ─────────────────────────────────────────────────────────────
export function Modal({ 
  open, 
  onClose, 
  title, 
  children 
}: { 
  open: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-600/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 pb-8 animate-[slideUp_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-navy-100 rounded-full mx-auto mb-4" />
        <h2 className="text-base font-semibold text-navy-500 mb-4">{title}</h2>
        {children}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  )
}

// ── Barra de progreso ──────────────────────────────────────────────────────────
export function ProgressBar({ 
  value, 
  max, 
  color = '#3b82d4' 
}: { 
  value: number; 
  max: number; 
  color?: string 
}) {
  const percentage = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  const danger = percentage > 90
  return (
    <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, background: danger ? '#f97316' : color }}
      />
    </div>
  )
}

// ── Divisor ────────────────────────────────────────────────────────────────────
export function Divider() {
  return <hr className="border-navy-50 my-3" />
}

// ── Botón con icono ────────────────────────────────────────────────────────────
export function IconBtn({ 
  onClick, 
  children, 
  className = '' 
}: { 
  onClick?: () => void; 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-300 hover:bg-navy-100 active:scale-95 transition-all",
        className
      )}
    >
      {children}
    </button>
  )
}
