import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { corsHeaders } from '../cors'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

// GET /api/metrics?profileId=xxx
// Devuelve tendencia de los últimos 6 meses con datos reales
export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get('profileId')

  if (!profileId) {
    return NextResponse.json(
      { success: false, error: 'profileId requerido', code: 'VALIDATION_ERROR' },
      { status: 400, headers: corsHeaders }
    )
  }

  try {
    // Últimos 6 meses
    const meses: { label: string; ingresos: string; egresos: string; ganancia: string }[] = []
    const ahora = new Date()

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
      const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
      const fin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59)

      const transacciones = await prisma.transaction.findMany({
        where: {
          profileId,
          createdAt: { gte: inicio, lte: fin },
        },
      })

      const ZERO = new Prisma.Decimal('0')

      const ingresos = transacciones
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum.add(t.amount), ZERO)

      const egresos = transacciones
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum.add(t.amount), ZERO)

      const ganancia = ingresos.sub(egresos)

      const label = fecha.toLocaleDateString('es-AR', { month: 'short' })
        .replace('.', '')
        .slice(0, 3)
        // Capitalizar primera letra
        .replace(/^./, (c) => c.toUpperCase())

      meses.push({
        label,
        ingresos: ingresos.toFixed(2),
        egresos: egresos.toFixed(2),
        ganancia: ganancia.toFixed(2),
      })
    }

    // KPIs del mes actual
    const movsMes = await prisma.transaction.findMany({
      where: {
        profileId,
        createdAt: {
          gte: new Date(ahora.getFullYear(), ahora.getMonth(), 1),
        },
      },
    })

    const ZERO = new Prisma.Decimal('0')
    const ingresosTotal = movsMes.filter(t => t.type === 'INCOME').reduce((s, t) => s.add(t.amount), ZERO)
    const egresosTotal = movsMes.filter(t => t.type === 'EXPENSE').reduce((s, t) => s.add(t.amount), ZERO)
    const cantVentas = movsMes.filter(t => t.type === 'INCOME').length
    const ticketProm = cantVentas > 0 ? ingresosTotal.div(new Prisma.Decimal(cantVentas)) : ZERO
    const gananciaTotal = ingresosTotal.sub(egresosTotal)
    const margenNeto = ingresosTotal.isZero() ? ZERO : gananciaTotal.div(ingresosTotal).mul(new Prisma.Decimal(100))

    // Distribución negocio vs personal (ingresos)
    const ingNegocio = movsMes.filter(t => t.type === 'INCOME' && t.isBusiness).reduce((s, t) => s.add(t.amount), ZERO)
    const ingPersonal = movsMes.filter(t => t.type === 'INCOME' && !t.isBusiness).reduce((s, t) => s.add(t.amount), ZERO)

    return NextResponse.json({
      success: true,
      data: {
        tendencia: meses,
        kpis: {
          cantVentas,
          ticketProm: ticketProm.toFixed(2),
          margenNeto: margenNeto.toFixed(1),
          costoPorVenta: cantVentas > 0 ? egresosTotal.div(new Prisma.Decimal(cantVentas)).toFixed(2) : '0.00',
        },
        distribucion: {
          negocio: ingNegocio.toFixed(2),
          personal: ingPersonal.toFixed(2),
        },
      },
    }, { headers: corsHeaders })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { success: false, error: message, code: 'DB_ERROR' },
      { status: 500, headers: corsHeaders }
    )
  }
}
