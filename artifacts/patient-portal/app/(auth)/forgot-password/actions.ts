'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('x-forwarded-host') || ''

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin.startsWith('http') ? origin : `https://${origin}`}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
