'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pill, ExternalLink, Tag } from 'lucide-react'

const MOCK_SUPPLEMENTS = [
  {
    id: '1',
    name: 'Omega-3 DHA + EPA',
    brand: 'Bare Biology',
    dosage: '1 teaspoon daily with food',
    notes: 'Essential for reducing inflammation and supporting brain function',
    url: 'https://www.barebiology.com',
    discountCode: null,
  },
  {
    id: '2',
    name: 'Gut Health Shot',
    brand: 'Deeply',
    dosage: '1 shot daily, preferably in the morning',
    notes: 'Prebiotic fibre to support microbiome diversity',
    url: 'https://www.deeply.uk',
    discountCode: 'DRSARAH30',
  },
  {
    id: '3',
    name: 'Magnesium Taurate',
    brand: 'Pure Encapsulations',
    dosage: '2 capsules before bed',
    notes: 'To support sleep quality and muscle recovery',
    url: 'https://www.pureencapsulations.co.uk',
    discountCode: null,
  },
  {
    id: '4',
    name: 'Vitamin D3 + K2',
    brand: 'Wild Nutrition',
    dosage: '1 capsule daily with breakfast',
    notes: 'Your blood test showed low vitamin D — this combination ensures proper calcium absorption',
    url: 'https://www.wildnutrition.com',
    discountCode: null,
  },
]

const HAS_SUPPLEMENTS = true

export default function SupplementsPage() {
  if (!HAS_SUPPLEMENTS) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-heading mb-2">My Supplements</h1>
        <p className="text-sm text-cream-700 mb-6">
          Personalised supplement recommendations from Dr Sarah based on your consultations.
        </p>
        <Card className="text-center py-16">
          <CardContent>
            <Pill className="h-12 w-12 text-cream-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No supplements prescribed yet</h3>
            <p className="text-sm text-cream-700 max-w-md mx-auto">
              Your personalised supplement recommendations will appear here after your consultation with Dr Sarah. She&apos;ll tailor recommendations specifically to your health needs and test results.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-2">My Supplements</h1>
      <p className="text-sm text-cream-700 mb-6">
        Personalised supplement recommendations from Dr Sarah based on your consultations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_SUPPLEMENTS.map((supp) => (
          <Card key={supp.id} className="relative overflow-hidden">
            {supp.discountCode && (
              <div className="absolute top-0 right-0 bg-warm-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <Tag className="h-3 w-3" /> Use code {supp.discountCode} for 30% off
              </div>
            )}
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-xl bg-forest-50 shrink-0">
                  <Pill className="h-5 w-5 text-forest-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-cream-900">{supp.name}</h3>
                  <p className="text-xs text-cream-600">{supp.brand}</p>
                </div>
              </div>

              <div className="bg-cream-50 rounded-xl px-3 py-2 mb-3">
                <p className="text-xs text-cream-700 font-medium">Dosage</p>
                <p className="text-sm text-cream-900">{supp.dosage}</p>
              </div>

              {supp.notes && (
                <p className="text-xs text-cream-700 italic mb-4">
                  &ldquo;{supp.notes}&rdquo; — Dr Sarah
                </p>
              )}

              <a href={supp.url} target="_blank" rel="noopener noreferrer">
                <Button variant="accent" size="sm" className="w-full gap-2">
                  Purchase <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
