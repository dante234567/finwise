'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Inicia sesión con email y contraseña
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: 'Email o contraseña incorrectos' }
  }

  redirect('/')
}

/**
 * Registra un nuevo usuario con nombre, email y contraseña
 * Redirige inmediatamente tras el registro exitoso (Modo Hackathon)
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { nombre } 
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirección inmediata asumiendo que "Email confirmation" está desactivado en Supabase
  redirect('/')
}

/**
 * Cierra la sesión del usuario
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
