import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { corsHeaders } from '../cors'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get('profileId')
  if (!profileId) {
    return NextResponse.json(
      { success: false, error: 'profileId requerido', code: 'VALIDATION_ERROR' },
      { status: 400, headers: corsHeaders }
    )
  }
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [transactions, profile] = await Promise.all([
      prisma.transaction.findMany({
        where: { profileId, createdAt: { gte: startOfMonth } },
      }),
      prisma.profile.findUnique({ where: { id: profileId } }),
    ])

    const ZERO = new Prisma.Decimal('0')

    const ingresos = transactions
      .filter((t: any) => t.type === 'INCOME')
      .reduce((sum: Prisma.Decimal, t: any) => sum.add(t.amount), ZERO)

    const egresos = transactions
      .filter((t: any) => t.type === 'EXPENSE')
      .reduce((sum: Prisma.Decimal, t: any) => sum.add(t.amount), ZERO)

    const ganancia = ingresos.sub(egresos)
    const porcentajeBolsillo = profile ? Number(profile.targetMargin.toString()) * 100 : 35
    
    const bolsillo = ganancia.lte(ZERO)
      ? ZERO
      : ganancia.mul(new Prisma.Decimal(porcentajeBolsillo / 100))

    return NextResponse.json(
      {
        success: true,
        data: {
          ingresos: ingresos.toFixed(2),
          egresos: egresos.toFixed(2),
          ganancia: ganancia.toFixed(2),
          bolsillo: bolsillo.toFixed(2),
          porcentajeBolsillo,
        },
      },
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
