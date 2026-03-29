// Middleware de Next.js — protección de rutas y refresh de sesión Supabase
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Bypass total de sesión para la demo
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Aplica a todas las rutas excepto las estáticas y assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
