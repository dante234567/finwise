'use client'

import React from 'react'
import { Badge } from '@/components/ui/FlowUI'
import { BookOpen, GraduationCap, TrendingUp, DollarSign, PieChart, ShieldCheck } from 'lucide-react'

export default function LearnPage() {
  const modulos = [
    {
      id: 1,
      titulo: "¿Qué es el punto de equilibrio?",
      desc: "Aprendé cuánto necesitás facturar exactamente para cubrir todos tus costos antes de empezar a ganar.",
      icon: "⚖️",
      status: "disponible",
      contenido: "Ejemplo: Si tenés $200.000 de costos fijos y ganás un 40% por producto, tu punto de equilibrio son $500.000."
    },
    {
      id: 2,
      titulo: "Costos fijos vs variables",
      desc: "Diferenciá el alquiler y luz (fijos) de la materia prima y comisiones (variables) en la economía argentina.",
      icon: "📊",
      status: "disponible",
      contenido: "Estrategia: En meses de baja venta, tratá de reducir al máximo tus costos fijos para no entrar en pérdida."
    },
    {
      id: 3,
      titulo: "¿Cómo calcular mi precio de venta?",
      desc: "Usá la fórmula matemática correcta: Costo / (1 - Margen deseado) para no perder plata sin darte cuenta.",
      icon: "🏷️",
      status: "disponible",
      contenido: "Fórmula Pro: No multipliques el costo por 1.40, dividilo por 0.60 para ganar un 40% REAL sobre el precio final."
    },
    {
      id: 4,
      titulo: "Inflación y tu negocio",
      desc: "Cómo ajustar tus precios siguiendo el IPC sin espantar a tus clientes y manteniendo tu rentabilidad.",
      icon: "📈",
      status: "próximamente",
      contenido: null
    },
    {
      id: 5,
      titulo: "Bolsillo vs Reinversión",
      desc: "¿Cuánto te podés llevar a casa? Definí un sueldo fijo y cuánto dejar en la caja para que el negocio crezca.",
      icon: "💰",
      status: "próximamente",
      contenido: null
    }
  ]

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="text-navy-100" size={24} />
          <h1 className="text-white text-lg font-semibold">Educación Financiera</h1>
        </div>
        <p className="text-navy-200 text-xs">Aprender a gestionar es el primer paso para crecer.</p>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-20">
        <div className="card bg-navy-50 border-none flex items-start gap-3">
          <BookOpen className="text-navy-400 shrink-0" size={18} />
          <p className="text-[11px] text-navy-400 leading-relaxed">
            Explorá los módulos interactivos diseñados para emprendedores argentinos. 
            Hacé click en cada uno para ver tips rápidos.
          </p>
        </div>

        <div className="space-y-3">
          {modulos.map((m) => (
            <div key={m.id} className="card group active:scale-[0.98] transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="pr-4">
                    <h3 className="text-sm font-bold text-navy-500">{m.titulo}</h3>
                    <p className="text-[11px] text-navy-300 leading-snug mt-1">{m.desc}</p>
                  </div>
                </div>
                <Badge estado={m.status === 'disponible' ? 'aprobado' : 'pendiente'} />
              </div>

              {m.contenido && (
                <div className="mt-4 p-3 bg-navy-50 rounded-xl border-l-4 border-navy-500">
                  <p className="text-[10px] text-navy-600 font-medium italic">{m.contenido}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
            <p className="text-[10px] text-navy-200">Nuevos módulos disponibles cada semana</p>
        </div>
      </div>
    </div>
  )
}
