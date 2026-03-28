import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeTransaction } from '@/lib/serializers'
import { createTransaction } from '@/actions/transactions'
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
    const transactions = await prisma.transaction.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json(
      { success: true, data: transactions.map(serializeTransaction) },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, ...input } = body
    if (!profileId) {
      return NextResponse.json(
        { success: false, error: 'profileId requerido', code: 'VALIDATION_ERROR' },
        { status: 400, headers: corsHeaders }
      )
    }
    const result = await createTransaction(profileId, input)
    return NextResponse.json(result, { status: result.success ? 201 : 400, headers: corsHeaders })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al parsear el body', code: 'VALIDATION_ERROR' },
      { status: 400, headers: corsHeaders }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json(
      { success: false, error: 'id requerido', code: 'VALIDATION_ERROR' },
      { status: 400, headers: corsHeaders }
    )
  }
  try {
    await prisma.transaction.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { id } }, { headers: corsHeaders })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { success: false, error: message, code: 'DB_ERROR' },
      { status: 500, headers: corsHeaders }
    )
  }
}
