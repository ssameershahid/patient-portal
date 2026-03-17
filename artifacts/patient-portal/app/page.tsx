'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthProvider'

export default function RootPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
      return
    }
    router.replace(isAdmin ? '/admin' : '/dashboard')
  }, [user, isAdmin, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-200">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-cream-700">Loading...</p>
      </div>
    </div>
  )
}
