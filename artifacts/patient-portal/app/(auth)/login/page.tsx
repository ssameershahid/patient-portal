'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await login(email, password)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
      return
    }

    if (result.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <div className="min-h-screen flex bg-cream-200">
      <div className="hidden lg:flex lg:w-1/2 bg-forest-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 via-forest-600 to-forest-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-warm-300 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-forest-400 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-cream-300 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-heading font-semibold tracking-wide text-white/90 text-[30px]">Pulse & Function</span>
          </div>
          <h2 className="text-4xl font-heading font-bold leading-tight mb-4">
            Your health journey,<br />all in one place.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed max-w-md">
            Access your appointments, lab results, treatment plans, and communicate with your care team — anytime, anywhere.
          </p>
          <div className="mt-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="/login-feature.webp"
              alt="Pulse & Function clinic"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="mt-10 flex gap-8">
            <div>
              <div className="text-2xl font-heading font-bold text-warm-300">Secure</div>
              <div className="text-sm text-white/50 mt-1">End-to-end encrypted</div>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-warm-300">24/7</div>
              <div className="text-sm text-white/50 mt-1">Always accessible</div>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-warm-300">Private</div>
              <div className="text-sm text-white/50 mt-1">Your data, your control</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <span className="font-heading font-bold text-forest-700 text-[30px] text-center">Pulse & Function</span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-heading font-bold text-cream-900">Welcome back</h1>
            <p className="text-cream-600 mt-1">Sign in to continue to your portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-error-light border border-error/20 p-3 text-sm text-error">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-cream-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-11"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-cream-700">Password</Label>
                <Link href="/forgot-password" className="text-xs text-forest-500 hover:text-forest-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="h-11"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-cream-600 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-forest-600 font-medium hover:text-forest-700 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
