'use client'

import React from 'react'
import { Badge, Divider } from '@/components/ui/FlowUI'
import { BookOpen, HelpCircle, DollarSign, Calculator, Percent, TrendingUp } from 'lucide-react'

const MODULOS = [
  {
    icon: <Calculator className="text-navy-400" size={24} />,
    title: "¿Qué es el punto de equilibrio?",
    description: "Es el nivel de ventas que cubre todos tus costos (fijos y variables). En Argentina, con inflación, recalculalo mes a mes.",
    estado: 'aprobado',
    label: 'Disponible'
  },
  {
    icon: <DollarSign className="text-navy-400" size={24} />,
    title: "Costos fijos vs variables",
    description: "Alquiler y monotributo son fijos. Harina y packaging son variables. Entender esto es clave para tus márgenes.",
    estado: 'aprobado',
    label: 'Disponible'
  },
  {
    icon: <Percent className="text-navy-400" size={24} />,
    title: "¿Cómo calcular mi precio?",
    description: "No solo es costo + margen. Considerá impuestos, comisiones de apps y tu propio sueldo (el 'bolsillo').",
    estado: 'aprobado',
    label: 'Disponible'
  },
  {
    icon: <TrendingUp className="text-navy-400" size={24} />,
    title: "Inflación y tu negocio",
    description: "Estrategias para ajustar precios sin espantar clientes y mantener el poder de compra de tu ganancia.",
    estado: 'pendiente',
    label: 'Próximamente'
  },
  {
    icon: <BookOpen className="text-navy-400" size={24} />,
    title: "La regla del porcentaje",
    description: "Separar las finanzas personales de las del negocio es vital. Define un % de ganancia para vos y no toques el resto.",
    estado: 'pendiente',
    label: 'Próximamente'
  }
]

export default function LearnPage() {
  return (
    <div className="page-enter pb-24">
      <div className="bg-navy-500 px-5 pt-12 pb-6 rounded-b-[28px]">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-navy-200" />
          <h1 className="text-white text-lg font-semibold">Aprendé con FinWise</h1>
        </div>
        <p className="text-navy-200 text-xs">Conceptos clave para potenciar tu emprendimiento</p>
      </div>

      <div className="px-4 pt-4 space-y-4 text-left">
        {MODULOS.map((modulo, i) => (
          <div key={i} className="card group active:scale-[0.98] transition-all">
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center shrink-0 group-hover:bg-navy-100 transition-colors">
                  {modulo.icon}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                     <h3 className="text-sm font-bold text-navy-500 leading-snug">{modulo.title}</h3>
                     <Badge estado={modulo.estado} />
                  </div>
                  <p className="text-xs text-navy-200 leading-relaxed font-medium">
                    {modulo.description}
                  </p>
                  
                  {modulo.estado === 'aprobado' && (
                    <button 
                      onClick={() => alert(`Próximamente: Contenido detallado de "${modulo.title}" 🚀`)}
                      className="mt-3 text-[10px] font-bold text-navy-400 uppercase tracking-wider flex items-center gap-1"
                    >
                      Leer más <span className="text-xs">→</span>
                    </button>
                  )}
               </div>
            </div>
          </div>
        ))}

        <div className="bg-navy-50 border border-navy-100 p-6 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
             <HelpCircle className="text-navy-300" size={24} />
          </div>
          <p className="text-xs font-bold text-navy-500">¿Tenés dudas financieras?</p>
          <p className="text-[10px] text-navy-300">Sumate a nuestra comunidad de emprendedores en Discord.</p>
          <button className="btn-secondary w-full py-3 text-[10px]">Unirse al Discord</button>
        </div>
      </div>
    </div>
  )
}
