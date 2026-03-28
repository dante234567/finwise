import { NextRequest, NextResponse } from 'next/server'
import { calculateBreakeven } from '@/actions/breakeven'
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
  const result = await calculateBreakeven(profileId)
  return NextResponse.json(result, { status: result.success ? 200 : 400, headers: corsHeaders })
}
