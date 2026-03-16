'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageSquare, Send, Paperclip, CheckCheck, Search, Clock
} from 'lucide-react'

type ThreadFilter = 'all' | 'unread' | 'needs_followup' | 'resolved'

const MOCK_THREADS = [
  {
    id: '1',
    patientName: 'Test Patient',
    initials: 'TP',
    tier: 'Essential',
    lastMessage: 'Thank you Dr Sarah! I wanted to also mention that I have been experiencing more fatigue...',
    timestamp: '2 hours ago',
    unreadCount: 1,
    status: 'active' as const,
  },
  {
    id: '2',
    patientName: 'Emma Richardson',
    initials: 'ER',
    tier: 'Premium',
    lastMessage: "I've started the new supplement protocol you recommended. So far feeling good!",
    timestamp: 'Yesterday',
    unreadCount: 0,
    status: 'active' as const,
  },
  {
    id: '3',
    patientName: 'James Chen',
    initials: 'JC',
    tier: 'Essential',
    lastMessage: 'Could you clarify the dosage for the magnesium? I want to make sure I have it right.',
    timestamp: '2 days ago',
    unreadCount: 2,
    status: 'needs_followup' as const,
  },
  {
    id: '4',
    patientName: 'Sarah Williams',
    initials: 'SW',
    tier: 'Premium',
    lastMessage: 'Perfect, thank you for the update on my lab results.',
    timestamp: '1 week ago',
    unreadCount: 0,
    status: 'resolved' as const,
  },
]

const MOCK_MESSAGES: { id: string; sender: 'admin' | 'patient'; body: string; created_at: string; read_at: string | null }[] = [
  {
    id: '1',
    sender: 'patient',
    body: "Hi Dr Sarah, I had a question about the magnesium supplement. Should I continue taking it in the evening or switch to morning?",
    created_at: '2026-03-15T08:00:00Z',
    read_at: '2026-03-15T09:00:00Z',
  },
  {
    id: '2',
    sender: 'admin',
    body: "Keep taking the magnesium taurate in the evening before bed — it supports sleep quality and muscle recovery, so evening is ideal. We'll review your full supplement protocol at our next appointment.",
    created_at: '2026-03-15T14:20:00Z',
    read_at: '2026-03-15T15:00:00Z',
  },
  {
    id: '3',
    sender: 'patient',
    body: "Thank you Dr Sarah! I wanted to also mention that I have been experiencing more fatigue than usual in the afternoons. Should I note this in my food diary?",
    created_at: '2026-03-16T10:15:00Z',
    read_at: null,
  },
]

const QUICK_REPLIES = [
  { title: 'Food Diary Reminder', body: 'Hi {name}, just a gentle reminder to complete your 7-day food diary before our next appointment.' },
  { title: 'Lab Results Ready', body: 'Hi {name}, your lab results are now available in your portal under Documents.' },
  { title: 'Supplement Guidance', body: "Hi {name}, I've updated your supplement recommendations in your portal." },
]

const FILTERS: { key: ThreadFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'needs_followup', label: 'Needs Follow-Up' },
  { key: 'resolved', label: 'Resolved' },
]

type AdminMessage = {
  id: string
  sender: 'admin' | 'patient'
  body: string
  created_at: string
  read_at: string | null
}

export default function AdminMessagesPage() {
  const [filter, setFilter] = useState<ThreadFilter>('all')
  const [selectedThread, setSelectedThread] = useState(MOCK_THREADS[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')
  const [conversationStatus, setConversationStatus] = useState('active')
  const [mobileShowConvo, setMobileShowConvo] = useState(false)
  const [messages, setMessages] = useState<AdminMessage[]>(MOCK_MESSAGES)

  const filteredThreads = MOCK_THREADS.filter(t => {
    if (filter === 'unread') return t.unreadCount > 0
    if (filter === 'needs_followup') return t.status === 'needs_followup'
    if (filter === 'resolved') return t.status === 'resolved'
    return true
  }).filter(t =>
    searchQuery ? t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  function handleSelectThread(thread: typeof MOCK_THREADS[0]) {
    setSelectedThread(thread)
    setMobileShowConvo(true)
  }

  function handleSendReply() {
    const text = replyText.trim()
    if (!text) return

    const msg: AdminMessage = {
      id: String(Date.now()),
      sender: 'admin',
      body: text,
      created_at: new Date().toISOString(),
      read_at: null,
    }
    setMessages(prev => [...prev, msg])
    setReplyText('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Messages</h1>

      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        <div className={`w-full md:w-80 shrink-0 flex flex-col ${mobileShowConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-500" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === f.key
                    ? 'bg-forest-700 text-white'
                    : 'bg-cream-300 text-cream-800 hover:bg-cream-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredThreads.length > 0 ? filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleSelectThread(thread)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  selectedThread.id === thread.id
                    ? 'bg-forest-50 border border-forest-200'
                    : 'hover:bg-cream-100 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-forest-100 text-forest-700 text-xs">{thread.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cream-900">{thread.patientName}</span>
                      {thread.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-warm-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="warm" className="text-[9px] px-1.5 py-0">{thread.tier}</Badge>
                      {thread.status === 'needs_followup' && (
                        <Badge variant="error" className="text-[9px] px-1.5 py-0">Follow-up</Badge>
                      )}
                    </div>
                    <p className="text-xs text-cream-600 mt-1 truncate">{thread.lastMessage}</p>
                    <p className="text-[10px] text-cream-500 mt-0.5">{thread.timestamp}</p>
                  </div>
                </div>
              </button>
            )) : (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-cream-400 mx-auto mb-2" />
                <p className="text-sm text-cream-600">No conversations found.</p>
              </div>
            )}
          </div>
        </div>

        <Card className={`flex-1 flex flex-col overflow-hidden ${mobileShowConvo ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex items-center justify-between p-4 border-b border-cream-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileShowConvo(false)}
                className="md:hidden text-forest-500 text-sm"
              >
                &larr; Back
              </button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-forest-100 text-forest-700 text-xs">{selectedThread.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{selectedThread.patientName}</p>
                <Badge variant="warm" className="text-[9px]">{selectedThread.tier}</Badge>
              </div>
            </div>
            <Select value={conversationStatus} onValueChange={setConversationStatus}>
              <SelectTrigger className="w-[150px] h-8 text-xs">
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
            {messages.map((msg) => {
              const isAdmin = msg.sender === 'admin'
              return (
                <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[75%]">
                    {!isAdmin && (
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-forest-100 text-forest-700 text-[8px]">{selectedThread.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-cream-600">{selectedThread.patientName}</span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 text-sm ${
                      isAdmin
                        ? 'bg-forest-700 text-cream-100 rounded-br-md'
                        : 'bg-cream-100 text-cream-900 rounded-bl-md border border-cream-300'
                    }`}>
                      {msg.body}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-[10px] text-cream-600 ${isAdmin ? 'justify-end' : ''}`} suppressHydrationWarning>
                      <Clock className="h-2.5 w-2.5" />
                      <span suppressHydrationWarning>{new Date(msg.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      {isAdmin && msg.read_at && <CheckCheck className="h-3 w-3 text-forest-500 ml-1" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-cream-300 p-3 space-y-2">
            <Select onValueChange={(title) => {
              const template = QUICK_REPLIES.find(q => q.title === title)
              if (template) setReplyText(template.body.replace('{name}', selectedThread.patientName))
            }}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Quick reply templates..." />
              </SelectTrigger>
              <SelectContent>
                {QUICK_REPLIES.map((qr) => (
                  <SelectItem key={qr.title} value={qr.title}>{qr.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                placeholder="Type a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={1}
                className="flex-1 min-h-[40px] max-h-24 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && replyText.trim()) {
                    e.preventDefault()
                    handleSendReply()
                  }
                }}
              />
              <Button size="sm" className="h-10 w-10 p-0 shrink-0" disabled={!replyText.trim()} onClick={handleSendReply} aria-label="Send reply">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
