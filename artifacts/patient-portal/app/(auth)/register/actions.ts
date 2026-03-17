import { createClient } from '@/lib/supabase/client'

export async function register(data: {
  fullName: string
  email: string
  phone: string
  password: string
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
