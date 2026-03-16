'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CLINIC_INFO } from '@/lib/utils/constants'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-200 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-forest-700">{CLINIC_INFO.name}</h1>
          <p className="text-cream-700 mt-2">Patient Portal</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="rounded-xl bg-error-light border border-error/20 p-3 text-sm text-error">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-forest-500 hover:underline">
                  Forgot password?
                </Link>
                <Link href="/register" className="text-forest-500 hover:underline">
                  Create account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-cream-600 mt-6">
          {CLINIC_INFO.doctorName} · {CLINIC_INFO.credentials}
        </p>
      </div>
    </div>
  )
}
