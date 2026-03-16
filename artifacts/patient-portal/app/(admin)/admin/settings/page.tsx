'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Building2, Calendar, MessageSquare, Link2, Settings, Plus,
  Edit, Trash2, CreditCard, Mail, ExternalLink
} from 'lucide-react'

const INITIAL_TEMPLATES = [
  {
    id: '1',
    title: 'Food Diary Reminder',
    body: 'Hi [name], just a gentle reminder to complete your 7-day food diary before our next appointment. You can fill it in directly in your portal. Let me know if you have any questions!',
  },
  {
    id: '2',
    title: 'Lab Results Ready',
    body: 'Hi [name], your lab results are now available in your portal under Documents. We\'ll discuss them in detail at your next consultation.',
  },
  {
    id: '3',
    title: 'Supplement Guidance',
    body: 'Hi [name], I\'ve updated your supplement recommendations in your portal. You can view the details and purchase links under the Supplements section.',
  },
]

const INITIAL_APPOINTMENT_TYPES = [
  { id: '1', name: 'New Patient Consultation', duration: 60, price: '£220' },
  { id: '2', name: 'Follow-Up Consultation', duration: 45, price: '£195' },
  { id: '3', name: 'Free Discovery Call', duration: 15, price: 'Free' },
]

const INTEGRATIONS = [
  { name: 'Stripe', icon: CreditCard, description: 'Payment processing', status: 'Not connected' },
  { name: 'Cal.com', icon: Calendar, description: 'Appointment scheduling', status: 'Not connected' },
  { name: 'Resend', icon: Mail, description: 'Email notifications', status: 'Not connected' },
]

export default function AdminSettingsPage() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [addTemplateOpen, setAddTemplateOpen] = useState(false)
  const [editTemplate, setEditTemplate] = useState<typeof INITIAL_TEMPLATES[0] | null>(null)
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-forest-500" /> Practice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Clinic Name</Label>
                <Input defaultValue="Pulse & Function" />
              </div>
              <div className="space-y-2">
                <Label>Doctor Name</Label>
                <Input defaultValue="Dr Sarah Al-Temimi" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Address</Label>
                <Input defaultValue="52 Queen Anne Street, SameDay Doctor, London, W1G 8HL" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="hello@pulseandfunction.com" />
              </div>
              <div className="space-y-2">
                <Label>Credentials</Label>
                <Input defaultValue="MBBS BSc MSc(SEM) DipNutr(CNM) AFMCP" />
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
              <Calendar className="h-5 w-5 text-forest-500" /> Appointment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-300">
                    <th className="text-left py-2 text-xs text-cream-600 font-medium">Type</th>
                    <th className="text-left py-2 text-xs text-cream-600 font-medium">Duration</th>
                    <th className="text-left py-2 text-xs text-cream-600 font-medium">Price</th>
                    <th className="text-right py-2 text-xs text-cream-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_APPOINTMENT_TYPES.map((type) => (
                    <tr key={type.id} className="border-b border-cream-200">
                      <td className="py-3 font-medium text-cream-900">{type.name}</td>
                      <td className="py-3 text-cream-700">{type.duration} min</td>
                      <td className="py-3 text-cream-900">{type.price}</td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4 text-cream-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-forest-500" /> Quick-Reply Templates
              </CardTitle>
              <Dialog open={addTemplateOpen} onOpenChange={setAddTemplateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Quick-Reply Template</DialogTitle>
                  </DialogHeader>
                  <TemplateForm onClose={() => setAddTemplateOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-cream-900">{template.title}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        setEditTemplate(template)
                      }}
                    >
                      <Edit className="h-3.5 w-3.5 text-cream-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setTemplates(prev => prev.filter(t => t.id !== template.id))}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-cream-600" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-cream-700 leading-relaxed">{template.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={!!editTemplate} onOpenChange={(open) => !open && setEditTemplate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
            </DialogHeader>
            {editTemplate && (
              <TemplateForm template={editTemplate} onClose={() => setEditTemplate(null)} />
            )}
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-forest-500" /> Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {INTEGRATIONS.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-cream-50 border border-cream-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cream-200">
                    <integration.icon className="h-5 w-5 text-cream-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cream-900">{integration.name}</p>
                    <p className="text-xs text-cream-600">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{integration.status}</Badge>
                  <Button variant="secondary" size="sm" disabled>
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TemplateForm({ template, onClose }: { template?: { title: string; body: string }; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Template Title</Label>
        <Input defaultValue={template?.title} placeholder="e.g. Appointment Reminder" />
        <p className="text-xs text-cream-600">For your reference only — not shown to patients.</p>
      </div>
      <div className="space-y-2">
        <Label>Message Body</Label>
        <Textarea defaultValue={template?.body} placeholder="Type your template message..." rows={4} />
        <p className="text-xs text-cream-600">Use [name] as a placeholder for the patient&apos;s name.</p>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>{template ? 'Save Changes' : 'Create Template'}</Button>
      </div>
    </div>
  )
}
