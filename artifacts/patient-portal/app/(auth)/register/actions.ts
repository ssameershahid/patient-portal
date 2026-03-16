'use server'

import { createClient } from '@/lib/supabase/server'

export async function register(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
