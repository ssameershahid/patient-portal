import { createClient } from '@/lib/supabase/client'

export async function login(email: string, password: string): Promise<{ error?: string; redirect?: string }> {
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Login failed. Please try again.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role === 'admin') {
    return { redirect: '/admin' }
  }

  return { redirect: '/dashboard' }
}
