import { createClient } from '@/lib/supabase/client'

export async function forgotPassword(email: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient()

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
