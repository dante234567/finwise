import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { corsHeaders } from '../cors'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await request.json()
    if (!profileId) {
      return NextResponse.json(
        { success: false, error: 'profileId requerido' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Eliminar movimientos anteriores del perfil para demo limpia
    await prisma.transaction.deleteMany({ where: { profileId } })

    // Dataset completo — La Pizzería de Marcos
    const TRANSACCIONES = [
      // === INGRESOS ===
      { concept: "Ventas mostrador — semana 1", amount: "185000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Delivery app — semana 1", amount: "67000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Catering cumpleaños empresa", amount: "95000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Ventas mostrador — semana 2", amount: "210000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Delivery app — semana 2", amount: "78000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Ventas mostrador — semana 3", amount: "198000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Delivery app — semana 3", amount: "71000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Evento privado — pizza party", amount: "120000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Ventas mostrador — semana 4", amount: "225000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Delivery app — semana 4", amount: "82000", type: "INCOME", isFixed: false, isBusiness: true },
      { concept: "Sueldo trabajo part-time", amount: "150000", type: "INCOME", isFixed: true, isBusiness: false },
      // === EGRESOS ===
      { concept: "Alquiler local Palermo", amount: "280000", type: "EXPENSE", isFixed: true, isBusiness: true },
      { concept: "Harina x 50kg — La Morenita", amount: "45000", type: "EXPENSE", isFixed: false, isBusiness: true },
      { concept: "Mozzarella x 10kg", amount: "38000", type: "EXPENSE", isFixed: false, isBusiness: true },
      { concept: "Tomates y vegetales", amount: "22000", type: "EXPENSE", isFixed: false, isBusiness: true },
      { concept: "Gas industrial", amount: "18000", type: "EXPENSE", isFixed: true, isBusiness: true },
      { concept: "Luz y servicios", amount: "35000", type: "EXPENSE", isFixed: true, isBusiness: true },
      { concept: "Sueldo empleado mostrador", amount: "180000", type: "EXPENSE", isFixed: true, isBusiness: true },
      { concept: "Insumos packaging delivery", amount: "12000", type: "EXPENSE", isFixed: false, isBusiness: true },
      { concept: "Publicidad Instagram", amount: "15000", type: "EXPENSE", isFixed: false, isBusiness: true },
      { concept: "Monotributo cuota mensual", amount: "28000", type: "EXPENSE", isFixed: true, isBusiness: true },
      { concept: "Ingresos Brutos", amount: "42000", type: "EXPENSE", isFixed: true, isBusiness: true },
      { concept: "Harina x 50kg — semana 3", amount: "45000", type: "EXPENSE", isFixed: false, isBusiness: true },
      { concept: "Mozzarella reposición", amount: "28000", type: "EXPENSE", isFixed: false, isBusiness: true },
      { concept: "Supermercado personal", amount: "45000", type: "EXPENSE", isFixed: false, isBusiness: false },
      { concept: "Nafta y transporte", amount: "18000", type: "EXPENSE", isFixed: false, isBusiness: false },
      { concept: "Netflix / Spotify", amount: "8000", type: "EXPENSE", isFixed: true, isBusiness: false },
    ]

    await prisma.transaction.createMany({
      data: TRANSACCIONES.map((t) => ({
        profileId,
        amount: new Prisma.Decimal(t.amount),
        type: t.type as any,
        concept: t.concept,
        quantity: 1,
        isFixed: t.isFixed,
        isBusiness: t.isBusiness,
      })),
    })

    return NextResponse.json(
      { success: true, data: { count: TRANSACCIONES.length } },
      { headers: corsHeaders }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { success: false, error: message, code: 'DB_ERROR' },
      { status: 500, headers: corsHeaders }
    )
  }
}
