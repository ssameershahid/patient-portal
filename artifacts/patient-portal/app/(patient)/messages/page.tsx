'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Lock, Send, Paperclip, CheckCheck, FileText, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const IS_MEMBER = true

type Message = {
  id: string
  sender: 'admin' | 'patient'
  body: string
  created_at: string
  read_at: string | null
  attachments: { name: string; size: string }[] | null
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'admin',
    body: "Hi! Thank you for completing your intake form. I've reviewed it and have a few follow-up questions we can discuss at your appointment on Thursday.",
    created_at: '2026-03-14T09:30:00Z',
    read_at: '2026-03-14T09:45:00Z',
    attachments: null,
  },
  {
    id: '2',
    sender: 'patient',
    body: 'Thank you Dr Sarah! I wanted to also mention that I have been experiencing more fatigue than usual in the afternoons. Should I note this in my food diary?',
    created_at: '2026-03-14T10:15:00Z',
    read_at: '2026-03-14T11:00:00Z',
    attachments: null,
  },
  {
    id: '3',
    sender: 'admin',
    body: "Yes, absolutely — please note that in the symptoms section of your food diary. It would also help if you could note what you had for lunch on those days, as afternoon fatigue can often be related to blood sugar regulation. I've also uploaded your latest blood panel results to your documents.",
    created_at: '2026-03-14T11:30:00Z',
    read_at: '2026-03-14T12:00:00Z',
    attachments: [
      { name: 'Blood_Panel_March_2026.pdf', size: '245 KB' },
    ],
  },
  {
    id: '4',
    sender: 'patient',
    body: "That makes sense, I'll make sure to track that carefully. I also wanted to ask about the magnesium supplement — should I continue taking it in the evening or switch to morning?",
    created_at: '2026-03-15T08:00:00Z',
    read_at: null,
    attachments: null,
  },
  {
    id: '5',
    sender: 'admin',
    body: "Keep taking the magnesium taurate in the evening before bed — it supports sleep quality and muscle recovery, so evening is ideal. We'll review your full supplement protocol at our next appointment.",
    created_at: '2026-03-15T14:20:00Z',
    read_at: null,
    attachments: null,
  },
]

function formatMessageTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function NonMemberView() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Messages</h1>
      <Card className="text-center py-16">
        <CardContent>
          <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-warm-500" />
          </div>
          <h3 className="text-lg font-semibold font-heading mb-2">Direct Messaging with Dr Sarah</h3>
          <p className="text-cream-700 text-sm max-w-md mx-auto mb-6">
            Messaging is available to membership patients. As a member, you can message Dr Sarah directly for follow-up questions, supplement guidance, and ongoing support between consultations.
          </p>
          <Link href="/account">
            <Button variant="accent">Explore Membership Plans &rarr;</Button>
          </Link>
          <p className="text-xs text-cream-600 mt-4">
            Already have questions?{' '}
            <Link href="/appointments/book" className="text-forest-500 underline">
              Book a follow-up consultation instead &rarr;
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!IS_MEMBER) return <NonMemberView />

  function handleSend() {
    const text = newMessage.trim()
    if (!text) return

    const msg: Message = {
      id: String(Date.now()),
      sender: 'patient',
      body: text,
      created_at: new Date().toISOString(),
      read_at: null,
      attachments: null,
    }
    setMessages(prev => [...prev, msg])
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Messages</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default">Conversation with Dr Sarah</Badge>
            <Badge variant="warm">Essential Member</Badge>
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => {
            const isPatient = msg.sender === 'patient'
            return (
              <div key={msg.id} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${isPatient ? 'order-1' : 'order-2'}`}>
                  {!isPatient && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-forest-100 text-forest-700 text-[10px]">SA</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-cream-700 font-medium">Dr Sarah</span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isPatient
                        ? 'bg-forest-700 text-cream-100 rounded-br-md'
                        : 'bg-cream-100 text-cream-900 rounded-bl-md border border-cream-300'
                    }`}
                  >
                    {msg.body}
                    {msg.attachments && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((att, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer ${
                              isPatient ? 'bg-forest-600' : 'bg-cream-200'
                            }`}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="flex-1 truncate">{att.name}</span>
                            <span className="opacity-60">{att.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isPatient ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-cream-600" suppressHydrationWarning>{formatMessageTime(msg.created_at)}</span>
                    {isPatient && msg.read_at && (
                      <CheckCheck className="h-3 w-3 text-forest-500" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-cream-300 p-4">
          <div className="flex items-center gap-1 mb-2">
            <AlertTriangle className="h-3 w-3 text-warm-500" />
            <p className="text-[10px] text-cream-600">
              Messages are typically responded to within 24–48 hours during business hours. This is not for medical emergencies.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shrink-0" aria-label="Attach file">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              size="sm"
              className="h-10 w-10 p-0 shrink-0"
              disabled={!newMessage.trim()}
              onClick={handleSend}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
