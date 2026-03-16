'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MEMBERSHIP_TIERS } from '@/lib/utils/constants'
import { Crown, Check } from 'lucide-react'
import type { Profile, Membership } from '@/lib/supabase/types'
import type { MembershipTierKey } from '@/lib/utils/constants'

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, membershipRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('memberships').select('*').eq('user_id', user.id).eq('status', 'active').limit(1).single(),
      ])

      if (profileRes.data) {
        setProfile(profileRes.data)
        setFullName(profileRes.data.full_name || '')
        setPhone(profileRes.data.phone || '')
      }
      if (membershipRes.data) setMembership(membershipRes.data)
      setLoading(false)
    }
    load()
  }, [supabase])

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', profile.id)
    setSaving(false)
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-heading mb-6">Account</h1>
        <div className="space-y-4">
          <div className="h-48 bg-cream-300 rounded-2xl animate-pulse" />
          <div className="h-48 bg-cream-300 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Account</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.id ? '' : ''} disabled className="bg-cream-200" />
              <p className="text-xs text-cream-600">Contact us to change your email address.</p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Membership Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-warm-500" />
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent>
            {membership ? (
              <div>
                <Badge variant="warm" className="mb-3">
                  {MEMBERSHIP_TIERS[membership.tier as MembershipTierKey]?.name} — Active
                </Badge>
                <p className="text-sm text-cream-700">
                  Credits: {membership.credits_used} / {membership.credits_total} used this month
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-cream-700 mb-6">
                  Unlock direct messaging with Dr Sarah and priority booking with a membership plan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.entries(MEMBERSHIP_TIERS) as [MembershipTierKey, typeof MEMBERSHIP_TIERS[MembershipTierKey]][]).map(([, tier]) => (
                    <Card key={tier.name} className="border-cream-400">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg">{tier.name}</h3>
                        <p className="text-2xl font-bold text-warm-500 my-2">{tier.priceDisplay}</p>
                        <p className="text-xs text-cream-600 mb-4">{tier.minimumMonths}-month minimum</p>
                        <ul className="space-y-2">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-cream-700">
                              <Check className="h-4 w-4 text-forest-500 mt-0.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {/* TODO: Replace with Stripe subscription checkout */}
                        <Button variant="accent" className="w-full mt-4" disabled>
                          Coming Soon
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
