'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CLINIC_INFO } from '@/lib/utils/constants'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Lock, Shield } from 'lucide-react'
import { Suspense } from 'react'

const TIER_INFO: Record<string, { name: string; price: string; interval: string }> = {
  tier_1: { name: 'Essential', price: '£420', interval: '/month' },
  tier_2: { name: 'Premium', price: '£810', interval: '/month' },
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const tierKey = searchParams.get('tier') || 'tier_1'
  const tier = TIER_INFO[tierKey] || TIER_INFO.tier_1

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link href="/membership" className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-800 font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to plans
      </Link>

      <div>
        <h1 className="text-2xl font-bold font-heading">Checkout</h1>
        <p className="text-cream-700 mt-1">Complete your membership enrollment.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between p-4 bg-cream-100 rounded-xl border border-cream-300">
            <div>
              <Badge variant="warm">{tier.name} Membership</Badge>
              <p className="text-sm text-cream-600 mt-1">3-month minimum commitment</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-heading text-forest-900">{tier.price}</span>
              <span className="text-cream-600 text-sm">{tier.interval}</span>
            </div>
          </div>

          <div className="text-center py-10 space-y-4">
            <div className="h-14 w-14 rounded-full bg-cream-300 flex items-center justify-center mx-auto">
              <CreditCard className="h-7 w-7 text-cream-500" />
            </div>
            <div>
              <h3 className="font-semibold text-forest-900">Payment integration coming soon</h3>
              <p className="text-sm text-cream-600 mt-1 max-w-sm mx-auto">
                Stripe checkout will be integrated here. You&apos;ll be able to enter your card details and start your membership securely.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-cream-500 border-t border-cream-300 pt-4">
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Powered by Stripe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-cream-500 text-center">
        By enrolling, you agree to our{' '}
        <Link href="/terms" className="text-forest-600 underline">Terms &amp; Conditions</Link>.
        Contact <a href={`mailto:${CLINIC_INFO.email}`} className="text-forest-600 underline">{CLINIC_INFO.email}</a> for questions.
      </p>
    </div>
  )
}

export default function MembershipCheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-cream-600">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
