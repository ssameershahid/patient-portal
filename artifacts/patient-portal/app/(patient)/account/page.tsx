'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MEMBERSHIP_TIERS } from '@/lib/utils/constants'
import type { MembershipTierKey } from '@/lib/utils/constants'
import {
  Crown, Check, User, Bell, CreditCard, AlertTriangle,
  Download, Trash2
} from 'lucide-react'

const IS_MEMBER = false

const MOCK_BILLING = [
  { id: '1', date: '2026-03-01', description: 'Follow-Up Consultation', amount: '£195.00', status: 'Paid' },
  { id: '2', date: '2026-02-15', description: 'New Patient Consultation', amount: '£220.00', status: 'Paid' },
  { id: '3', date: '2026-02-01', description: 'Lab Tests — Blood Panel (TDL)', amount: '£385.00', status: 'Paid' },
]

export default function AccountPage() {
  const [fullName, setFullName] = useState('Test Patient')
  const [email] = useState('test@pulseandfunction.com')
  const [phone, setPhone] = useState('+44 7700 900000')
  const [address, setAddress] = useState('')
  const [dob, setDob] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [notifications, setNotifications] = useState({
    appointments: true,
    messages: true,
    labResults: true,
    foodDiary: false,
    marketing: false,
  })

  function handleSave() {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Account</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-forest-500" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 text-lg font-bold">
                TP
              </div>
              <div>
                <Button variant="secondary" size="sm">Change Photo</Button>
                <p className="text-xs text-cream-600 mt-1">JPG, PNG. Max 5MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} disabled className="bg-cream-200" />
                <p className="text-xs text-cream-600">Contact us to change your email address.</p>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your full address" />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-warm-500" />
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent>
            {IS_MEMBER ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="warm" className="text-sm px-4 py-1.5">Essential — Active</Badge>
                  <span className="text-xs text-cream-600">Member since January 2026</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-cream-50 rounded-xl p-3">
                    <p className="text-xs text-cream-600">Tier</p>
                    <p className="font-semibold text-cream-900">Essential</p>
                    <p className="text-xs text-cream-600">£420/month</p>
                  </div>
                  <div className="bg-cream-50 rounded-xl p-3">
                    <p className="text-xs text-cream-600">Status</p>
                    <p className="font-semibold text-forest-500">Active</p>
                  </div>
                  <div className="bg-cream-50 rounded-xl p-3">
                    <p className="text-xs text-cream-600">Next Billing</p>
                    <p className="font-semibold text-cream-900">1 Apr 2026</p>
                  </div>
                  <div className="bg-cream-50 rounded-xl p-3">
                    <p className="text-xs text-cream-600">Credits</p>
                    <p className="font-semibold text-cream-900">1 of 2 used</p>
                    <div className="h-1.5 bg-cream-300 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-forest-500 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" size="sm">Change Plan</Button>
                  <Button variant="ghost" size="sm" className="text-error hover:text-error">Cancel Membership</Button>
                </div>
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
                        <ul className="space-y-2 mb-4">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-cream-700">
                              <Check className="h-4 w-4 text-forest-500 mt-0.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button variant="accent" className="w-full" disabled>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-forest-500" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {MOCK_BILLING.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-300">
                      <th className="text-left py-2 text-xs text-cream-600 font-medium">Date</th>
                      <th className="text-left py-2 text-xs text-cream-600 font-medium">Description</th>
                      <th className="text-left py-2 text-xs text-cream-600 font-medium">Amount</th>
                      <th className="text-left py-2 text-xs text-cream-600 font-medium">Status</th>
                      <th className="text-right py-2 text-xs text-cream-600 font-medium">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_BILLING.map((item) => (
                      <tr key={item.id} className="border-b border-cream-200">
                        <td className="py-3 text-cream-800">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="py-3 text-cream-900 font-medium">{item.description}</td>
                        <td className="py-3 text-cream-900">{item.amount}</td>
                        <td className="py-3">
                          <Badge variant="success">{item.status}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-cream-600 mt-3">Invoices are generated by Stripe.</p>
              </div>
            ) : (
              <p className="text-sm text-cream-700 py-4 text-center">No billing history yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-forest-500" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'appointments', label: 'Appointment reminders' },
              { key: 'messages', label: 'New message notifications' },
              { key: 'labResults', label: 'Lab results notifications' },
              { key: 'foodDiary', label: 'Food diary reminders' },
              { key: 'marketing', label: 'Marketing & newsletter' },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between">
                <span className="text-sm text-cream-800">{pref.label}</span>
                <button
                  role="switch"
                  aria-checked={notifications[pref.key as keyof typeof notifications]}
                  aria-label={pref.label}
                  onClick={() => setNotifications(prev => ({ ...prev, [pref.key]: !prev[pref.key as keyof typeof prev] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[pref.key as keyof typeof notifications] ? 'bg-forest-500' : 'bg-cream-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[pref.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
            <Button variant="secondary" size="sm">Save Preferences</Button>
          </CardContent>
        </Card>

        <Card className="border-error/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-error">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cream-700 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-error hover:text-error hover:bg-error-light">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-cream-700">
                    Are you sure you want to delete your account? This will permanently remove all your data, including appointments, documents, and messages.
                  </p>
                  <p className="text-xs text-cream-600">
                    Note: We are required to retain certain medical records for a minimum period as mandated by UK regulations.
                  </p>
                  <Separator />
                  <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button variant="ghost" className="text-error hover:text-error hover:bg-error-light">
                      Yes, Delete My Account
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
