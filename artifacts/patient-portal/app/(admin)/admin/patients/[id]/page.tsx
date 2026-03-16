'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  ArrowLeft, Calendar, FileText, Pill, Crown, Mail, Phone,
  MessageSquare, StickyNote, ClipboardList, Upload, Send, CheckCheck,
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, Clock, User, Activity
} from 'lucide-react'
import Link from 'next/link'

const MOCK_PATIENT = {
  id: '1',
  full_name: 'Test Patient',
  email: 'test@pulseandfunction.com',
  phone: '+44 7700 900000',
  address: '123 Health Street, London, W1G 4AB',
  date_of_birth: '1990-05-15',
  created_at: '2026-01-10T10:00:00Z',
  role: 'patient',
}

const MOCK_MEMBERSHIP = {
  tier: 'tier_1',
  status: 'active',
  credits_used: 1,
  credits_total: 2,
  current_period_end: '2026-04-01',
}

const MOCK_APPOINTMENTS = [
  { id: '1', date: '2026-03-20', start_time: '10:00', end_time: '11:00', appointment_type: 'follow_up', format: 'video', status: 'confirmed', admin_notes: null },
  { id: '2', date: '2026-02-28', start_time: '14:00', end_time: '15:00', appointment_type: 'new_patient', format: 'in_person', status: 'completed', admin_notes: 'Initial assessment completed. Follow-up blood panel ordered.' },
  { id: '3', date: '2026-01-15', start_time: '11:00', end_time: '11:15', appointment_type: 'discovery', format: 'video', status: 'completed', admin_notes: 'Good fit for functional medicine. Booked new patient consultation.' },
]

const MOCK_DOCUMENTS = [
  { id: '1', file_name: 'Blood Panel Results - March 2026.pdf', type: 'lab_result', lab_provider: 'TDL', created_at: '2026-03-10T14:30:00Z' },
  { id: '2', file_name: 'Gut Microbiome Analysis.pdf', type: 'lab_result', lab_provider: 'GutID', created_at: '2026-02-28T10:15:00Z' },
  { id: '3', file_name: 'Previous GP Records.pdf', type: 'patient_upload', lab_provider: null, created_at: '2026-02-15T09:00:00Z' },
]

const MOCK_MESSAGES = [
  { id: '1', sender: 'patient', body: 'Hi Dr Sarah, I had a question about the magnesium supplement.', created_at: '2026-03-15T08:00:00Z', read_at: '2026-03-15T09:00:00Z' },
  { id: '2', sender: 'admin', body: 'Keep taking it in the evening — it supports sleep quality.', created_at: '2026-03-15T14:20:00Z', read_at: null },
]

const MOCK_SUPPLEMENTS = [
  { id: '1', name: 'Omega-3 DHA + EPA', brand: 'Bare Biology', dosage: '1 tsp daily', notes: 'Anti-inflammatory support', is_active: true },
  { id: '2', name: 'Magnesium Taurate', brand: 'Pure Encapsulations', dosage: '2 caps before bed', notes: 'Sleep & recovery', is_active: true },
  { id: '3', name: 'Vitamin D3 + K2', brand: 'Wild Nutrition', dosage: '1 cap with breakfast', notes: 'Low Vit D on bloods', is_active: true },
  { id: '4', name: 'Probiotics', brand: 'Symprove', dosage: '70ml morning', notes: 'Course completed', is_active: false },
]

const MOCK_NOTES = [
  { id: '1', date: '2026-02-28', content: 'Initial assessment: Patient presents with chronic fatigue, poor sleep quality, and digestive discomfort. BMI normal. Ordered comprehensive blood panel and gut microbiome test. Started on basic supplement protocol — magnesium for sleep, omega-3 for inflammation.' },
  { id: '2', date: '2026-01-15', content: 'Discovery call: Patient interested in functional medicine approach. History of IBS, stress-related symptoms. Currently no supplements. Referred by existing patient.' },
]

const MOCK_ACTIVITY = [
  { id: '1', type: 'appointment', label: 'Follow-up consultation booked', time: '2 days ago' },
  { id: '2', type: 'document', label: 'Blood panel results uploaded', time: '6 days ago' },
  { id: '3', type: 'message', label: 'Sent a message', time: '1 week ago' },
  { id: '4', type: 'form', label: 'Intake form submitted', time: '2 weeks ago' },
  { id: '5', type: 'supplement', label: 'Supplement protocol updated', time: '2 weeks ago' },
  { id: '6', type: 'appointment', label: 'New patient consultation completed', time: '3 weeks ago' },
]

const QUICK_REPLIES = [
  { title: 'Food Diary Reminder', body: 'Hi {name}, just a gentle reminder to complete your 7-day food diary before our next appointment.' },
  { title: 'Lab Results Ready', body: 'Hi {name}, your lab results are now available in your portal under Documents.' },
  { title: 'Supplement Guidance', body: "Hi {name}, I've updated your supplement recommendations in your portal." },
]

const APPT_TYPES: Record<string, string> = {
  new_patient: 'New Patient Consultation',
  follow_up: 'Follow-Up Consultation',
  discovery: 'Discovery Call',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(t: string) {
  const [h, m] = t.split(':')
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m}${hour >= 12 ? 'pm' : 'am'}`
}

export default function AdminPatientDetailPage() {
  const [newNote, setNewNote] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [conversationStatus, setConversationStatus] = useState('active')
  const [addSuppOpen, setAddSuppOpen] = useState(false)

  return (
    <div>
      <Link href="/admin/patients" className="flex items-center gap-1 text-sm text-forest-500 hover:underline mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Link>

      <Card className="mb-6">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-forest-100 text-forest-700 text-lg">TP</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-heading">{MOCK_PATIENT.full_name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-cream-700">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {MOCK_PATIENT.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {MOCK_PATIENT.phone}</span>
              <span>DOB: {formatDate(MOCK_PATIENT.date_of_birth)}</span>
            </div>
            <p className="text-xs text-cream-600 mt-1">Last seen: {formatDate(MOCK_APPOINTMENTS[1].date)} · Joined {formatDate(MOCK_PATIENT.created_at)}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="warm">
              <Crown className="h-3 w-3 mr-1" /> Essential
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments ({MOCK_APPOINTMENTS.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({MOCK_DOCUMENTS.length})</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="supplements">Supplements ({MOCK_SUPPLEMENTS.filter(s => s.is_active).length})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({MOCK_NOTES.length})</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-forest-500" /> Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-cream-600">Name:</span> {MOCK_PATIENT.full_name}</p>
                <p><span className="text-cream-600">Email:</span> {MOCK_PATIENT.email}</p>
                <p><span className="text-cream-600">Phone:</span> {MOCK_PATIENT.phone}</p>
                <p><span className="text-cream-600">Address:</span> {MOCK_PATIENT.address}</p>
                <p><span className="text-cream-600">DOB:</span> {formatDate(MOCK_PATIENT.date_of_birth)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Crown className="h-4 w-4 text-warm-500" /> Membership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="warm">Essential — Active</Badge>
                </div>
                <p><span className="text-cream-600">Credits:</span> {MOCK_MEMBERSHIP.credits_used} of {MOCK_MEMBERSHIP.credits_total} used</p>
                <div className="h-1.5 bg-cream-300 rounded-full overflow-hidden">
                  <div className="h-full bg-forest-500 rounded-full" style={{ width: `${(MOCK_MEMBERSHIP.credits_used / MOCK_MEMBERSHIP.credits_total) * 100}%` }} />
                </div>
                <p><span className="text-cream-600">Next billing:</span> {formatDate(MOCK_MEMBERSHIP.current_period_end)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-forest-500" /> Next Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">{APPT_TYPES[MOCK_APPOINTMENTS[0].appointment_type]}</p>
                <p className="text-cream-600">{formatDate(MOCK_APPOINTMENTS[0].date)} at {formatTime(MOCK_APPOINTMENTS[0].start_time)}</p>
                <Badge variant={MOCK_APPOINTMENTS[0].format === 'video' ? 'warm' : 'default'} className="mt-2">
                  {MOCK_APPOINTMENTS[0].format === 'video' ? 'Video' : 'In-Person'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-forest-500" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_ACTIVITY.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-forest-400 mt-2 shrink-0" />
                      <div>
                        <p className="text-sm text-cream-900">{event.label}</p>
                        <p className="text-xs text-cream-600">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-3 mt-4">
          {MOCK_APPOINTMENTS.map((appt) => (
            <Card key={appt.id}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-forest-50">
                      <Calendar className="h-4 w-4 text-forest-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{APPT_TYPES[appt.appointment_type]}</p>
                      <p className="text-xs text-cream-700">{formatDate(appt.date)} · {formatTime(appt.start_time)} – {formatTime(appt.end_time)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={appt.format === 'video' ? 'warm' : 'default'}>
                      {appt.format === 'video' ? 'Video' : 'In-Person'}
                    </Badge>
                    <Badge variant={appt.status === 'confirmed' ? 'success' : appt.status === 'completed' ? 'neutral' : 'error'}>
                      {appt.status}
                    </Badge>
                  </div>
                </div>
                {appt.admin_notes && (
                  <div className="bg-cream-50 rounded-xl px-3 py-2 text-xs text-cream-700 border border-cream-200">
                    <span className="font-medium text-cream-800">Notes: </span>{appt.admin_notes}
                  </div>
                )}
                {appt.status === 'completed' && !appt.admin_notes && (
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Edit className="h-3 w-3 mr-1" /> Add Notes
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="flex justify-end mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload Lab Results
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Lab Results</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-cream-400 rounded-2xl p-8 text-center bg-cream-50">
                    <Upload className="h-8 w-8 text-cream-500 mx-auto mb-2" />
                    <p className="text-sm text-cream-800">Drop files here or click to browse</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Lab Provider</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tdl">TDL</SelectItem>
                        <SelectItem value="gutid">GutID</SelectItem>
                        <SelectItem value="teamgene">TeamGene</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes for Patient</Label>
                    <Textarea placeholder="Add notes about these results" rows={2} />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Notify patient about new results
                  </label>
                  <Button className="w-full">Upload</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            {MOCK_DOCUMENTS.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-forest-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{doc.file_name}</p>
                    <p className="text-xs text-cream-700">{formatDate(doc.created_at)}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {doc.lab_provider && <Badge variant="outline" className="text-[10px]">{doc.lab_provider}</Badge>}
                    <Badge variant={doc.type === 'lab_result' ? 'default' : 'warm'}>
                      {doc.type === 'lab_result' ? 'Lab Result' : 'Upload'}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4 text-cream-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          <Card className="flex flex-col" style={{ height: '500px' }}>
            <div className="flex items-center justify-between p-4 border-b border-cream-300">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Conversation with {MOCK_PATIENT.full_name}</span>
                <Badge variant="warm">Essential</Badge>
              </div>
              <Select value={conversationStatus} onValueChange={setConversationStatus}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="needs_followup">Needs Follow-Up</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_MESSAGES.map((msg) => {
                const isAdmin = msg.sender === 'admin'
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[75%]">
                      <div className={`rounded-2xl px-4 py-3 text-sm ${
                        isAdmin
                          ? 'bg-forest-700 text-cream-100 rounded-br-md'
                          : 'bg-cream-100 text-cream-900 rounded-bl-md border border-cream-300'
                      }`}>
                        {msg.body}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-[10px] text-cream-600 ${isAdmin ? 'justify-end' : ''}`}>
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(msg.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        {isAdmin && msg.read_at && <CheckCheck className="h-3 w-3 text-forest-500 ml-1" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-cream-300 p-3">
              <Select onValueChange={(title) => {
                const template = QUICK_REPLIES.find(q => q.title === title)
                if (template) setNewMessage(template.body.replace('{name}', MOCK_PATIENT.full_name))
              }}>
                <SelectTrigger className="mb-2 h-8 text-xs">
                  <SelectValue placeholder="Quick reply templates..." />
                </SelectTrigger>
                <SelectContent>
                  {QUICK_REPLIES.map((qr) => (
                    <SelectItem key={qr.title} value={qr.title}>{qr.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" className="h-10 w-10 p-0" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="supplements" className="mt-4">
          <div className="flex justify-end mb-4">
            <Dialog open={addSuppOpen} onOpenChange={setAddSuppOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Recommendation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Supplement Recommendation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Supplement</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select from catalogue" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omega3">Omega-3 DHA + EPA (Bare Biology)</SelectItem>
                        <SelectItem value="gut">Gut Health Shot (Deeply)</SelectItem>
                        <SelectItem value="magnesium">Magnesium Taurate (Pure Encapsulations)</SelectItem>
                        <SelectItem value="vitd">Vitamin D3 + K2 (Wild Nutrition)</SelectItem>
                        <SelectItem value="custom">Custom supplement...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Dosage Instructions</Label>
                    <Input placeholder="e.g. 1 capsule with breakfast" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes for Patient</Label>
                    <Textarea placeholder="Why this supplement is recommended" rows={2} />
                  </div>
                  <Button className="w-full" onClick={() => setAddSuppOpen(false)}>Add Recommendation</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            {MOCK_SUPPLEMENTS.map((s) => (
              <Card key={s.id} className={!s.is_active ? 'opacity-60' : ''}>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-forest-500" />
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-cream-600">{s.brand} · {s.dosage}</p>
                      {s.notes && <p className="text-xs text-cream-500 mt-0.5">{s.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.is_active ? 'success' : 'outline'}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {s.is_active ? <ToggleRight className="h-4 w-4 text-forest-500" /> : <ToggleLeft className="h-4 w-4 text-cream-500" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4 text-cream-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4 text-cream-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card className="mb-4">
            <CardContent className="pt-5">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-warm-500" /> Add Clinical Note
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-48" />
                </div>
                <Textarea
                  placeholder="Write your clinical note here. This is private and NOT visible to the patient."
                  rows={4}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-cream-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Private note — not visible to patient
                  </p>
                  <Button size="sm" disabled={!newNote.trim()}>Save Note</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {MOCK_NOTES.map((note) => (
              <Card key={note.id}>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{formatDate(note.date)}</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5 text-cream-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Trash2 className="h-3.5 w-3.5 text-cream-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-cream-800 leading-relaxed">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forms" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-forest-500" /> Intake Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="success" className="mb-3">Submitted</Badge>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-cream-600">Full Name</p>
                  <p className="text-cream-900">Test Patient</p>
                </div>
                <div>
                  <p className="text-cream-600">Date of Birth</p>
                  <p className="text-cream-900">15 May 1990</p>
                </div>
                <div>
                  <p className="text-cream-600">GP</p>
                  <p className="text-cream-900">Dr Smith, Marylebone Medical Practice</p>
                </div>
                <div>
                  <p className="text-cream-600">Emergency Contact</p>
                  <p className="text-cream-900">Jane Patient (Spouse) — +44 7700 900001</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-cream-600">Primary Health Concerns</p>
                  <p className="text-cream-900">Chronic fatigue, poor sleep quality, recurring digestive discomfort after meals. Interest in functional medicine approach to identify root causes.</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-cream-600">Known Allergies</p>
                  <p className="text-cream-900">Penicillin, shellfish</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-cream-600">Current Medications</p>
                  <p className="text-cream-900">None</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-forest-500" /> Food Diaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-cream-200">
                  <div>
                    <p className="text-sm font-medium">7-Day Food Diary — March 2026</p>
                    <p className="text-xs text-cream-600">Submitted 12 Mar 2026</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success">Completed</Badge>
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
