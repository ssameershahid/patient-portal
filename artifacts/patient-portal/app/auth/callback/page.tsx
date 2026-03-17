'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function CallbackContent() {
  const [error, setError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const rawNext = searchParams.get('next') ?? '/dashboard'
    const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'

    if (code) {
      const supabase = createClient()
      supabase.auth.exchangeCodeForSession(code).then(({ error: err }) => {
        if (!err) {
          router.replace(next)
        } else {
          setError(true)
        }
      })
    } else {
      setError(true)
    }
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-200">
        <div className="text-center">
          <p className="text-cream-700 mb-4">Authentication failed. Please try again.</p>
          <a href="/login" className="text-forest-500 hover:underline">Back to Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-200">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-cream-700">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cream-700">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
