'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Bell, Send, Eye, ChevronDown, ChevronUp, CheckCircle, Search, Users, Crown, User
} from 'lucide-react'

type Audience = 'all' | 'members' | 'specific'

const MOCK_PATIENTS = [
  { id: '1', name: 'Test Patient' },
  { id: '2', name: 'Emma Richardson' },
  { id: '3', name: 'James Chen' },
  { id: '4', name: 'Sarah Williams' },
]

const MOCK_HISTORY = [
  {
    id: '1',
    date: '14 Mar 2026',
    subject: 'Easter clinic hours',
    audience: 'All patients',
    method: 'Portal + Email',
    status: 'Sent' as const,
    message: 'Please note the clinic will be closed on Good Friday (18 April) and Easter Monday (21 April). Normal hours resume Tuesday 22 April. If you have an appointment on these dates, we will contact you to reschedule.',
  },
  {
    id: '2',
    date: '1 Mar 2026',
    subject: 'New supplement range available',
    audience: 'Members only',
    method: 'Portal',
    status: 'Sent' as const,
    message: "I'm pleased to share that I've added Bare Biology and Ancient and Brave supplements to my recommendations. Check your Supplements page for personalised suggestions.",
  },
]

export default function AdminNotificationsPage() {
  const [audience, setAudience] = useState<Audience>('all')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [portalNotif, setPortalNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [sentHistory, setSentHistory] = useState(MOCK_HISTORY)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleSend() {
    if (!subject.trim() || !message.trim()) return

    const audienceLabel = audience === 'all' ? 'All patients' : audience === 'members' ? 'Members only' : MOCK_PATIENTS.find(p => p.id === selectedPatient)?.name || 'Specific patient'
    const method = portalNotif && emailNotif ? 'Portal + Email' : portalNotif ? 'Portal' : 'Email'

    const newNotif = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      subject: subject.trim(),
      audience: audienceLabel,
      method,
      status: 'Sent' as const,
      message: message.trim(),
    }

    setSentHistory(prev => [newNotif, ...prev])
    setSent(true)

    setTimeout(() => {
      setSubject('')
      setMessage('')
      setAudience('all')
      setSelectedPatient('')
      setEmailNotif(false)
      setShowPreview(false)
      setSent(false)
    }, 3000)
  }

  const canSend = subject.trim() && message.trim() && (portalNotif || emailNotif) && (audience !== 'specific' || selectedPatient)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading">Notifications &amp; Broadcasts</h1>
        <p className="text-cream-700 mt-1">Send announcements to your patients.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compose Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {sent ? (
            <div className="text-center py-8 space-y-3">
              <div className="h-12 w-12 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-forest-600" />
              </div>
              <p className="font-semibold text-forest-900">Notification sent!</p>
              <p className="text-sm text-cream-600">Your notification has been delivered.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Label className="font-semibold">Send to</Label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: 'all', label: 'All patients', icon: Users },
                    { key: 'members', label: 'Members only', icon: Crown },
                    { key: 'specific', label: 'Specific patient', icon: User },
                  ] as const).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setAudience(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        audience === key
                          ? 'bg-forest-700 text-cream-100 border-forest-700'
                          : 'bg-cream-100 text-cream-800 border-cream-300 hover:border-forest-300'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {audience === 'specific' && (
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Select a patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PATIENTS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="e.g. Clinic closure notice"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Write your announcement here..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">Delivery method</Label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-cream-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={portalNotif}
                      onChange={(e) => setPortalNotif(e.target.checked)}
                      className="h-4 w-4 rounded border-cream-400 text-forest-600 focus:ring-forest-500"
                    />
                    Portal notification
                  </label>
                  <label className="flex items-center gap-2 text-sm text-cream-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotif}
                      onChange={(e) => setEmailNotif(e.target.checked)}
                      className="h-4 w-4 rounded border-cream-400 text-forest-600 focus:ring-forest-500"
                    />
                    Email notification
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button className="rounded-full gap-2" onClick={handleSend} disabled={!canSend}>
                  <Send className="h-4 w-4" />
                  Send Notification
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!subject.trim() && !message.trim()}
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? 'Hide Preview' : 'Preview'}
                </Button>
              </div>

              {showPreview && (subject.trim() || message.trim()) && (
                <Card className="bg-cream-100 border-cream-300">
                  <CardContent className="p-4">
                    <p className="text-xs text-cream-500 uppercase tracking-wider font-medium mb-2">Preview — as seen by patients</p>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-cream-300">
                      <div className="h-8 w-8 rounded-full bg-forest-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Bell className="h-4 w-4 text-forest-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-cream-500">Dr Sarah posted &middot; Just now</p>
                        <p className="font-medium text-sm text-cream-900 mt-0.5">{subject || 'Untitled notification'}</p>
                        <p className="text-sm text-cream-700 mt-1 leading-relaxed">{message || 'No message content yet.'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading">Sent History</h2>

        {sentHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-cream-300 flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-cream-500" />
              </div>
              <p className="text-cream-700 text-sm">No notifications sent yet.</p>
              <p className="text-cream-600 text-xs mt-1">Use the form above to send announcements to your patients about clinic updates, closures, or important health information.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sentHistory.map((notif) => (
              <Card key={notif.id}>
                <button
                  onClick={() => setExpandedId(expandedId === notif.id ? null : notif.id)}
                  className="w-full text-left p-4 md:p-5"
                  aria-expanded={expandedId === notif.id}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-xs text-cream-500 shrink-0 w-24" suppressHydrationWarning>{notif.date}</span>
                    <span className="font-medium text-sm text-cream-900 flex-1 truncate">{notif.subject}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px]">{notif.audience}</Badge>
                      <Badge variant="neutral" className="text-[10px]">{notif.method}</Badge>
                      <Badge variant="success" className="text-[10px]">{notif.status}</Badge>
                      {expandedId === notif.id ? (
                        <ChevronUp className="h-4 w-4 text-cream-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-cream-400" />
                      )}
                    </div>
                  </div>
                </button>
                {expandedId === notif.id && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 -mt-1">
                    <p className="text-sm text-cream-700 leading-relaxed bg-cream-100 rounded-xl p-4 border border-cream-300">
                      {notif.message}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
