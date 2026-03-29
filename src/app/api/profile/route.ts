import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateProfile } from '@/actions/user'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { serializeProfile } from '@/lib/serializers'
import { corsHeaders } from '../cors'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

// POST — obtener o crear perfil
export async function POST(request: NextRequest) {
  try {
    const { authUserId } = await request.json()
    const result = await getOrCreateProfile(authUserId)
    return NextResponse.json(result, { status: result.success ? 200 : 400, headers: corsHeaders })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al parsear el body', code: 'VALIDATION_ERROR' },
      { status: 400, headers: corsHeaders }
    )
  }
}

// PATCH — actualizar targetMargin (porcentaje bolsillo)
export async function PATCH(request: NextRequest) {
  try {
    const { profileId, targetMargin } = await request.json()

    if (!profileId || targetMargin === undefined) {
      return NextResponse.json(
        { success: false, error: 'profileId y targetMargin son requeridos', code: 'VALIDATION_ERROR' },
        { status: 400, headers: corsHeaders }
      )
    }

    const pct = Number(targetMargin)
    if (isNaN(pct) || pct < 0 || pct > 0.99) {
      return NextResponse.json(
        { success: false, error: 'targetMargin debe estar entre 0 y 0.99', code: 'VALIDATION_ERROR' },
        { status: 400, headers: corsHeaders }
      )
    }

    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: { targetMargin: new Prisma.Decimal(pct.toFixed(4)) },
    })

    return NextResponse.json(
      { success: true, data: serializeProfile(profile) },
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
