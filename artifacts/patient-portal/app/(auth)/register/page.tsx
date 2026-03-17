'use client'

import { useState } from 'react'
import Link from 'next/link'
import { register } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CLINIC_INFO } from '@/lib/utils/constants'

export default function RegisterPage() {
  const [consentTerms, setConsentTerms] = useState(false)
  const [consentData, setConsentData] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [successEmail, setSuccessEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!consentTerms || !consentData) {
      setError('Please accept both consent checkboxes to continue')
      return
    }

    setLoading(true)

    const result = await register({
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccessEmail(formData.get('email') as string)
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-200 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading text-forest-700">{CLINIC_INFO.name}</h1>
          </div>
          <Card>
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold font-heading mb-2">Check your email</h2>
              <p className="text-cream-700 text-sm">
                We&apos;ve sent a verification link to <strong>{successEmail}</strong>. Please click the link to verify your account.
              </p>
              <Link href="/login" className="inline-block mt-6">
                <Button variant="secondary">Back to Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-200 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-forest-700">{CLINIC_INFO.name}</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join to manage your consultations and health journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-error-light border border-error/20 p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="Dr Jane Smith" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+44 7XXX XXXXXX" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consentTerms} onChange={(e) => setConsentTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded border-cream-400 text-forest-500 focus:ring-forest-500" />
                  <span className="text-sm text-cream-700">I agree to the Terms &amp; Conditions</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consentData} onChange={(e) => setConsentData(e.target.checked)} className="mt-1 h-4 w-4 rounded border-cream-400 text-forest-500 focus:ring-forest-500" />
                  <span className="text-sm text-cream-700">I consent to the processing of my personal data in accordance with the Privacy Policy</span>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-cream-700">
                Already have an account?{' '}
                <Link href="/login" className="text-forest-500 hover:underline">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
