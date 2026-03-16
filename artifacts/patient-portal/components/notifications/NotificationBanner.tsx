'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, X, ChevronDown, ChevronUp } from 'lucide-react'

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    subject: 'Easter clinic hours',
    message: 'Please note the clinic will be closed on Good Friday (18 April) and Easter Monday (21 April). Normal hours resume Tuesday 22 April. If you have an appointment on these dates, we will contact you to reschedule.',
    date: '14 Mar 2026',
  },
]

export default function NotificationBanner() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  const visible = MOCK_NOTIFICATIONS.filter(n => !dismissed.includes(n.id))
  if (visible.length === 0) return null

  return (
    <div className="space-y-2 mb-6">
      {visible.map((notif) => (
        <Card key={notif.id} className="bg-cream-100 border-cream-300">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-forest-100 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="h-4 w-4 text-forest-600" />
              </div>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setExpanded(expanded === notif.id ? null : notif.id)}
                  className="w-full text-left"
                >
                  <p className="text-xs text-cream-500">Dr Sarah posted &middot; {notif.date}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-cream-900 mt-0.5">{notif.subject}</p>
                    {expanded === notif.id ? (
                      <ChevronUp className="h-3.5 w-3.5 text-cream-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-cream-400 shrink-0" />
                    )}
                  </div>
                </button>
                {expanded === notif.id && (
                  <p className="text-sm text-cream-700 mt-2 leading-relaxed">{notif.message}</p>
                )}
              </div>
              <button
                onClick={() => setDismissed(prev => [...prev, notif.id])}
                className="text-cream-400 hover:text-cream-600 transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
