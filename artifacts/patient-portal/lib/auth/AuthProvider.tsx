'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, SupabaseClient } from '@supabase/supabase-js'

type Profile = {
  role: 'patient' | 'admin'
  full_name: string | null
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

let _supabase: SupabaseClient | null = null
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient()
  }
  return _supabase
}

function getRoleFromUser(user: User): 'patient' | 'admin' {
  const metaRole = user.app_metadata?.role || user.user_metadata?.role
  if (metaRole === 'admin') return 'admin'
  return 'patient'
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ])
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef(getSupabase())
  const supabase = supabaseRef.current

  const fetchProfile = useCallback(async (currentUser: User) => {
    try {
      const result = await withTimeout(
        supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', currentUser.id)
          .single(),
        5000,
        { data: null, error: { message: 'Profile fetch timed out' } as any }
      )

      if (result.error || !result.data) {
        console.warn('[AuthProvider] Profile fetch issue:', result.error?.message, '— using metadata fallback')
        const fallbackRole = getRoleFromUser(currentUser)
        setProfile({ role: fallbackRole, full_name: currentUser.user_metadata?.full_name ?? null })
        return
      }

      setProfile({ role: result.data.role ?? 'patient', full_name: result.data.full_name })
    } catch (err) {
      console.error('[AuthProvider] Profile fetch exception:', err)
      const fallbackRole = getRoleFromUser(currentUser)
      setProfile({ role: fallbackRole, full_name: currentUser.user_metadata?.full_name ?? null })
    }
  }, [supabase])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const sessionResult = await withTimeout(
          supabase.auth.getSession(),
          5000,
          { data: { session: null }, error: null }
        )

        if (cancelled) return

        const currentUser = sessionResult.data.session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          await fetchProfile(currentUser)
        }
      } catch (err) {
        console.error('[AuthProvider] Auth init error:', err)
      }

      if (!cancelled) setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (cancelled) return
        const newUser = session?.user ?? null
        setUser(newUser)
        if (newUser) {
          await fetchProfile(newUser)
        } else {
          setProfile(null)
        }
        if (!cancelled) setLoading(false)
      }
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [supabase])

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function RequireAuth({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, profile, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (adminOnly && !isAdmin) {
      router.replace('/dashboard')
      return
    }
    if (!adminOnly && isAdmin && !pathname.startsWith('/admin')) {
      router.replace('/admin')
      return
    }
  }, [user, profile, loading, isAdmin, adminOnly, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cream-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null
  if (adminOnly && !isAdmin) return null

  return <>{children}</>
}
