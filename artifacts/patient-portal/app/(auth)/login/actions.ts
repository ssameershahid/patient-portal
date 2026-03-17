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

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profileError) {
    console.warn('[Login] Profile fetch failed:', profileError.message, '— checking user metadata')
  }

  const role = profile?.role
    || data.user.app_metadata?.role
    || data.user.user_metadata?.role

  if (role === 'admin') {
    return { redirect: '/admin' }
  }

  return { redirect: '/dashboard' }
}
