'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, Save } from 'lucide-react'

export default function IntakePage() {
  const [submitted, setSubmitted] = useState(false)
  const [savedField, setSavedField] = useState<string | null>(null)
  const [consent1, setConsent1] = useState(false)
  const [consent2, setConsent2] = useState(false)
  const [consent3, setConsent3] = useState(false)

  const [fields, setFields] = useState({
    fullName: '', dob: '', address: '', email: '', phone: '',
    ecName: '', ecPhone: '', ecRelationship: '',
    gpName: '', gpPractice: '',
    concerns: '',
  })

  function updateField(key: keyof typeof fields, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  const section1Done = !!(fields.fullName && fields.dob && fields.address && fields.email && fields.phone)
  const section2Done = !!(fields.ecName && fields.ecPhone && fields.ecRelationship)
  const section3Done = true
  const section4Done = !!fields.concerns
  const section5Done = consent1 && consent2 && consent3
  const completedSections = [section1Done, section2Done, section3Done, section4Done, section5Done].filter(Boolean).length
  const progressPercent = Math.round((completedSections / 5) * 100)
  const canSubmit = section1Done && section2Done && section4Done && section5Done

  function handleFieldBlur(fieldName: string) {
    setSavedField(fieldName)
    setTimeout(() => setSavedField(null), 2000)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-heading mb-6">Pre-Appointment Intake Form</h1>
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-forest-500" />
            </div>
            <h3 className="text-lg font-semibold font-heading mb-2">Thank you!</h3>
            <p className="text-cream-700 text-sm max-w-md mx-auto mb-6">
              Your intake form has been submitted. Dr Sarah will review it before your appointment.
            </p>
            <Button variant="secondary" onClick={() => setSubmitted(false)}>
              Edit Form
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-2">Pre-Appointment Intake Form</h1>
      <p className="text-sm text-cream-700 mb-6">
        Please complete this form before your first consultation. It helps Dr Sarah prepare for your appointment.
      </p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-cream-700">Completion</span>
          <span className="text-xs font-medium text-cream-900">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-cream-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {savedField && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <Save className="h-3.5 w-3.5" /> Saved
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold font-heading mb-1">Personal Details</h2>
            <p className="text-xs text-cream-600 mb-5">Basic information about you</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name <span className="text-error">*</span></Label>
                <Input placeholder="Your full name" value={fields.fullName} onChange={(e) => updateField('fullName', e.target.value)} onBlur={() => handleFieldBlur('name')} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth <span className="text-error">*</span></Label>
                <Input type="date" value={fields.dob} onChange={(e) => updateField('dob', e.target.value)} onBlur={() => handleFieldBlur('dob')} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Address <span className="text-error">*</span></Label>
                <Textarea placeholder="Your full address" rows={2} value={fields.address} onChange={(e) => updateField('address', e.target.value)} onBlur={() => handleFieldBlur('address')} />
              </div>
              <div className="space-y-2">
                <Label>Email <span className="text-error">*</span></Label>
                <Input type="email" placeholder="your@email.com" value={fields.email} onChange={(e) => updateField('email', e.target.value)} onBlur={() => handleFieldBlur('email')} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number <span className="text-error">*</span></Label>
                <Input type="tel" placeholder="+44 7XXX XXXXXX" value={fields.phone} onChange={(e) => updateField('phone', e.target.value)} onBlur={() => handleFieldBlur('phone')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold font-heading mb-1">Emergency Contact</h2>
            <p className="text-xs text-cream-600 mb-5">Someone we can contact in case of emergency</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Name <span className="text-error">*</span></Label>
                <Input placeholder="Emergency contact name" value={fields.ecName} onChange={(e) => updateField('ecName', e.target.value)} onBlur={() => handleFieldBlur('ec_name')} />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone <span className="text-error">*</span></Label>
                <Input type="tel" placeholder="+44 7XXX XXXXXX" value={fields.ecPhone} onChange={(e) => updateField('ecPhone', e.target.value)} onBlur={() => handleFieldBlur('ec_phone')} />
              </div>
              <div className="space-y-2">
                <Label>Relationship <span className="text-error">*</span></Label>
                <Select value={fields.ecRelationship} onValueChange={(v) => updateField('ecRelationship', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold font-heading mb-1">GP Information</h2>
            <p className="text-xs text-cream-600 mb-5">Details about your regular GP</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GP Name</Label>
                <Input placeholder="Your GP's name" onBlur={() => handleFieldBlur('gp_name')} />
              </div>
              <div className="space-y-2">
                <Label>GP Practice Name</Label>
                <Input placeholder="Practice name" onBlur={() => handleFieldBlur('gp_practice')} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>GP Practice Address <Badge variant="outline" className="ml-2 text-[10px]">Optional</Badge></Label>
                <Input placeholder="Practice address" onBlur={() => handleFieldBlur('gp_address')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold font-heading mb-1">Medical Information</h2>
            <p className="text-xs text-cream-600 mb-5">Help Dr Sarah understand your health history</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Medications</Label>
                <Textarea
                  placeholder="List any medications you are currently taking, including dosage if known"
                  rows={3}
                  onBlur={() => handleFieldBlur('medications')}
                />
              </div>
              <div className="space-y-2">
                <Label>Known Allergies</Label>
                <Textarea
                  placeholder="List any known allergies — food, medication, environmental"
                  rows={3}
                  onBlur={() => handleFieldBlur('allergies')}
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Health Concerns <span className="text-error">*</span></Label>
                <Textarea
                  placeholder="What are your main health concerns or reasons for booking this consultation? Please share as much detail as you're comfortable with — this helps Dr Sarah prepare for your appointment."
                  rows={5}
                  value={fields.concerns}
                  onChange={(e) => updateField('concerns', e.target.value)}
                  onBlur={() => handleFieldBlur('concerns')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold font-heading mb-1">Consent</h2>
            <p className="text-xs text-cream-600 mb-5">Please read and agree to the following</p>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent1}
                  onChange={(e) => setConsent1(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-cream-400 text-forest-500 focus:ring-forest-500"
                />
                <span className="text-sm text-cream-800">
                  I agree to the{' '}
                  <a href="#" className="text-forest-500 underline">Terms & Conditions</a>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent2}
                  onChange={(e) => setConsent2(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-cream-400 text-forest-500 focus:ring-forest-500"
                />
                <span className="text-sm text-cream-800">
                  I consent to the processing of my personal data in accordance with the{' '}
                  <a href="#" className="text-forest-500 underline">Privacy Policy</a>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent3}
                  onChange={(e) => setConsent3(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-cream-400 text-forest-500 focus:ring-forest-500"
                />
                <span className="text-sm text-cream-800">
                  I understand that Dr Sarah Al-Temimi is not acting as a replacement for my regular GP and will not be prescribing medication during nutritional consultations
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-cream-200/80 backdrop-blur-sm border-t border-cream-300 -mx-4 px-4 py-4 md:-mx-8 md:px-8">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={!canSubmit}
          >
            Save & Submit
          </Button>
          {!canSubmit && (
            <p className="text-xs text-cream-600 mt-2">
              {!section5Done ? 'Please agree to all consent items.' : 'Please complete all required fields.'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
