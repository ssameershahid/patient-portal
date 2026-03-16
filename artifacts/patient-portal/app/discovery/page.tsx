'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CLINIC_INFO } from '@/lib/utils/constants'
import Link from 'next/link'
import { Check, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const TRUST_POINTS = [
  'GMC-registered medical doctor',
  'Specialist in nutritional medicine',
  '30 years of clinical experience',
]

const TIME_SLOTS = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30',
]

function getWeekDays(weekOffset: number) {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7)
  const days = []
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  return days
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatFullDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function DiscoveryPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [weekOffset, setWeekOffset] = useState(1)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)

  const weekDays = getWeekDays(weekOffset)

  function handleBook() {
    if (!name.trim() || !email.trim() || !selectedDay || !selectedTime) return
    setBooked(true)
  }

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-cream-300 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="https://pulseandfunction.com" className="text-xl font-bold font-heading text-forest-800">
            {CLINIC_INFO.name}
          </a>
          <Link href="/login" className="text-sm text-forest-600 hover:text-forest-800 font-medium transition-colors">
            Already a patient? Log in &rarr;
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold font-heading text-forest-900 leading-tight">
                Not sure if functional medicine is right for you?
              </h1>
              <p className="text-lg text-cream-700 leading-relaxed">
                Book a free 15-minute discovery call with Dr Sarah. No commitment, no pressure — just an honest conversation about your health goals and whether Pulse &amp; Function can help.
              </p>
            </div>

            <div className="space-y-3">
              {TRUST_POINTS.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-forest-700" />
                  </div>
                  <span className="text-cream-800 font-medium">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-cream-300">
              <p className="text-sm text-cream-600">
                Or if you&apos;re ready to book:{' '}
                <Link href="/register" className="text-forest-600 font-medium underline hover:text-forest-800">
                  Book a consultation &rarr;
                </Link>
              </p>
            </div>
          </div>

          <div>
            {booked ? (
              <Card className="border-forest-200 shadow-lg">
                <CardContent className="py-12 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-forest-600" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-forest-900">You&apos;re booked!</h2>
                  <p className="text-cream-700" suppressHydrationWarning>
                    Dr Sarah will call you on <strong>{selectedDay ? formatFullDate(selectedDay) : ''}</strong> at <strong>{selectedTime}</strong>.
                  </p>
                  <p className="text-sm text-cream-600">
                    You&apos;ll receive a confirmation email with a calendar invite shortly.
                  </p>
                  <div className="pt-4">
                    <a
                      href="https://pulseandfunction.com/how-it-works"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest-600 font-medium text-sm hover:underline"
                    >
                      In the meantime, learn more about how Pulse &amp; Function works &rarr;
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <h2 className="text-xl font-bold font-heading text-forest-900">Book your free discovery call</h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full name <span className="text-error">*</span></Label>
                      <Input placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email address <span className="text-error">*</span></Label>
                      <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone number <Badge variant="outline" className="ml-2 text-[10px]">Optional</Badge></Label>
                      <Input type="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Select a date &amp; time</Label>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setWeekOffset(w => Math.max(0, w - 1))} disabled={weekOffset === 0} aria-label="Previous week">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setWeekOffset(w => w + 1)} aria-label="Next week">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {weekDays.map((day) => {
                        const isSelected = selectedDay?.toDateString() === day.toDateString()
                        return (
                          <button
                            key={day.toISOString()}
                            onClick={() => { setSelectedDay(day); setSelectedTime(null) }}
                            className={`flex-1 min-w-[72px] rounded-xl py-2 px-2 text-center text-xs font-medium border transition-colors ${
                              isSelected
                                ? 'bg-forest-700 text-cream-100 border-forest-700'
                                : 'bg-cream-100 text-cream-800 border-cream-300 hover:border-forest-300'
                            }`}
                            suppressHydrationWarning
                          >
                            <div suppressHydrationWarning>{day.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                            <div className="text-sm font-bold mt-0.5" suppressHydrationWarning>{day.getDate()}</div>
                            <div className="text-[10px] opacity-70" suppressHydrationWarning>{day.toLocaleDateString('en-GB', { month: 'short' })}</div>
                          </button>
                        )
                      })}
                    </div>

                    {selectedDay && (
                      <div className="space-y-2">
                        <p className="text-xs text-cream-600 font-medium" suppressHydrationWarning>
                          Available times for {formatShortDate(selectedDay)}:
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`rounded-lg py-1.5 text-xs font-medium border transition-colors ${
                                selectedTime === slot
                                  ? 'bg-forest-700 text-cream-100 border-forest-700'
                                  : 'bg-cream-100 text-cream-800 border-cream-300 hover:border-forest-300'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full rounded-full"
                    onClick={handleBook}
                    disabled={!name.trim() || !email.trim() || !selectedDay || !selectedTime}
                  >
                    Book Call
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-cream-300 bg-cream-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-cream-600">
            <div className="text-center sm:text-left">
              <p>{CLINIC_INFO.address}</p>
              <p className="mt-1">{CLINIC_INFO.email}</p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://pulseandfunction.webflow.io/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-forest-700 transition-colors"
              >
                Privacy Policy
              </a>
              <Link href="/terms" className="hover:text-forest-700 transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
