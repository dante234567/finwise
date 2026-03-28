import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { getOrCreateProfile } from '@/actions/user'
import { corsHeaders } from '../cors'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

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
