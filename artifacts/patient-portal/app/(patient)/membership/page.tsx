'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, Crown, Star } from 'lucide-react'

const TIERS = [
  {
    key: 'tier_1',
    name: 'Essential',
    price: '£420',
    popular: false,
    features: [
      '2 consultations per month',
      'Direct messaging with Dr Sarah',
      'Priority booking',
      'Access to patient portal',
      'Digital food diary & intake forms',
      'Lab results in your portal',
      'Personalised supplement recommendations',
    ],
  },
  {
    key: 'tier_2',
    name: 'Premium',
    price: '£810',
    popular: true,
    features: [
      '4 consultations per month (weekly)',
      'Direct messaging with Dr Sarah',
      'Priority booking',
      'Access to patient portal',
      'Digital food diary & intake forms',
      'Lab results in your portal',
      'Personalised supplement recommendations',
      'Extended consultation time',
    ],
  },
]

const FAQS = [
  {
    q: "What's included in the 3-month minimum?",
    a: 'Your membership runs for a minimum of 3 months. After the initial 3-month period, you can cancel at any time with 30 days\u2019 notice. Unused consultation credits do not roll over between months.',
  },
  {
    q: 'Can I switch between tiers?',
    a: 'Yes, you can upgrade or downgrade your membership tier at any time. Changes take effect at the start of your next billing period.',
  },
  {
    q: 'What if I need more consultations than my plan includes?',
    a: 'You can book additional consultations at the standard follow-up rate of \u00a3195 per session.',
  },
  {
    q: 'How does messaging work?',
    a: 'Both membership tiers include direct messaging with Dr Sarah through the patient portal. Messages are typically responded to within 24\u201348 hours during business hours. Messaging is not for medical emergencies.',
  },
  {
    q: 'Can I cancel within the first 3 months?',
    a: 'The 3-month minimum commitment applies to all memberships. If you need to cancel within this period, your membership will remain active until the end of the 3-month term.',
  },
]

export default function MembershipPage() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold font-heading">Membership Plans</h1>
        <p className="text-cream-700 mt-1">Ongoing support for your health journey. Choose the plan that fits your needs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {TIERS.map((tier) => (
          <Card key={tier.key} className={`relative overflow-hidden ${tier.popular ? 'border-forest-500 border-2 shadow-lg' : ''}`}>
            {tier.popular && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-forest-500" />
            )}
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={tier.popular ? 'default' : 'warm'} className="text-xs">
                  {tier.popular ? <Star className="h-3 w-3 mr-1" /> : <Crown className="h-3 w-3 mr-1" />}
                  {tier.name}
                </Badge>
                {tier.popular && (
                  <Badge variant="warm" className="text-[10px]">Most popular</Badge>
                )}
              </div>

              <div className="mb-1">
                <span className="text-4xl font-bold font-heading text-forest-900">{tier.price}</span>
                <span className="text-cream-600 text-sm ml-1">/month</span>
              </div>
              <p className="text-xs text-cream-600 mb-6">3-month minimum commitment</p>

              <hr className="border-cream-300 mb-6" />

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-forest-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-forest-700" />
                    </div>
                    <span className="text-sm text-cream-800">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full ${tier.popular ? '' : 'bg-transparent border-2 border-forest-700 text-forest-700 hover:bg-forest-50'}`}
                variant={tier.popular ? 'default' : 'outline'}
                onClick={() => router.push(`/membership/checkout?tier=${tier.key}`)}
              >
                Choose {tier.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <h3 className="font-semibold font-heading text-forest-900 mb-2">Not ready for a membership?</h3>
          <p className="text-sm text-cream-700 mb-4">You can also book a single consultation.</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 p-4 bg-cream-100 rounded-xl border border-cream-300">
              <p className="font-medium text-cream-900">New Patient Consultation</p>
              <p className="text-sm text-cream-600">60 minutes &mdash; &pound;220</p>
            </div>
            <div className="flex-1 p-4 bg-cream-100 rounded-xl border border-cream-300">
              <p className="font-medium text-cream-900">Follow-Up Consultation</p>
              <p className="text-sm text-cream-600">30&ndash;45 minutes &mdash; &pound;195</p>
            </div>
          </div>
          <Link href="/appointments/book">
            <Button variant="outline" className="rounded-full">
              Book a Single Consultation &rarr;
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <Card key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="font-medium text-sm text-cream-900 pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-cream-500 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 md:px-5 pb-4 md:pb-5 -mt-1">
                  <p className="text-sm text-cream-700 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
