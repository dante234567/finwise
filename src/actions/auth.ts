'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Inicia sesión con email y contraseña
 */
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email o contraseña incorrectos' }
  }

  redirect('/')
}

/**
 * Registra un nuevo usuario con nombre, email y contraseña
 */
export async function signUp(formData: FormData) {
  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Si la sesión es inmediata (ej: confirmación deshabilitada), redirigimos
  if (data.session) {
    redirect('/')
  }

  // Si requiere confirmación de email
  return { success: true, requiresConfirmation: true }
}

/**
 * Cierra la sesión del usuario
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
