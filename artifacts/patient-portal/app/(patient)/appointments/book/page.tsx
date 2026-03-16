'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { APPOINTMENT_TYPES, CLINIC_INFO } from '@/lib/utils/constants'
import { getDayName, getWeekDates, formatDate } from '@/lib/utils/helpers'
import { ArrowLeft, ArrowRight, Check, MapPin, Video } from 'lucide-react'
import type { AppointmentTypeKey } from '@/lib/utils/constants'

type Step = 'type' | 'format' | 'datetime' | 'confirm'

interface BookingState {
  appointmentType: AppointmentTypeKey | null
  format: 'in_person' | 'video' | null
  date: string | null
  startTime: string | null
  endTime: string | null
  useMembershipCredit: boolean
}

export default function BookingPage() {
  const [step, setStep] = useState<Step>('type')
  const [booking, setBooking] = useState<BookingState>({
    appointmentType: null,
    format: null,
    date: null,
    startTime: null,
    endTime: null,
    useMembershipCredit: false,
  })
  const [membership, setMembership] = useState<{ credits_total: number; credits_used: number; id: string } | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [existingSlots, setExistingSlots] = useState<{ date: string; start_time: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadMembership() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('memberships')
        .select('id, credits_total, credits_used')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single()
      if (data) setMembership(data)
    }
    loadMembership()
  }, [supabase])

  const loadExistingAppointments = useCallback(async () => {
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + weekOffset * 7)
    const weekDates = getWeekDates(baseDate)
    const startDate = weekDates[0].toISOString().split('T')[0]
    const endDate = weekDates[4].toISOString().split('T')[0]

    const { data } = await supabase
      .from('appointments')
      .select('date, start_time')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('status', 'confirmed')

    setExistingSlots(data ?? [])
  }, [supabase, weekOffset])

  useEffect(() => {
    if (step === 'datetime') {
      loadExistingAppointments()
    }
  }, [step, weekOffset, loadExistingAppointments])

  function generateTimeSlots(duration: number): string[] {
    const slots: string[] = []
    for (let h = 9; h < 17; h++) {
      for (let m = 0; m < 60; m += duration) {
        const endH = h + Math.floor((m + duration) / 60)
        const endM = (m + duration) % 60
        if (endH > 17 || (endH === 17 && endM > 0)) break
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      }
    }
    return slots
  }

  function isSlotTaken(date: string, time: string): boolean {
    return existingSlots.some((s) => s.date === date && s.start_time === time + ':00')
  }

  async function handleConfirm() {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !booking.appointmentType || !booking.date || !booking.startTime || !booking.format) {
      setLoading(false)
      return
    }

    const duration = APPOINTMENT_TYPES[booking.appointmentType].duration
    const [h, m] = booking.startTime.split(':').map(Number)
    const endH = h + Math.floor((m + duration) / 60)
    const endM = (m + duration) % 60
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`

    // TODO: Replace with Stripe checkout session for paid appointments
    const { error } = await supabase.from('appointments').insert({
      patient_id: user.id,
      appointment_type: booking.appointmentType,
      date: booking.date,
      start_time: booking.startTime + ':00',
      end_time: endTime,
      format: booking.format,
      status: 'confirmed',
      used_membership_credit: booking.useMembershipCredit,
    })

    if (!error && booking.useMembershipCredit && membership) {
      await supabase
        .from('memberships')
        .update({ credits_used: membership.credits_used + 1 })
        .eq('id', membership.id)
    }

    setLoading(false)

    if (!error) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-forest-500" />
        </div>
        <h2 className="text-2xl font-bold font-heading mb-2">Appointment Booked!</h2>
        <p className="text-cream-700 mb-6">Your appointment has been confirmed. You&apos;ll receive a confirmation email shortly.</p>
        <Button onClick={() => router.push('/appointments')}>View My Appointments</Button>
      </div>
    )
  }

  const typeInfo = booking.appointmentType ? APPOINTMENT_TYPES[booking.appointmentType] : null

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.push('/appointments')} className="flex items-center gap-1 text-sm text-forest-500 hover:underline mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Appointments
      </button>
      <h1 className="text-2xl font-bold font-heading mb-6">Book an Appointment</h1>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-8">
        {(['type', 'format', 'datetime', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === s ? 'bg-forest-700 text-white' :
              (['type', 'format', 'datetime', 'confirm'].indexOf(step) > i) ? 'bg-forest-50 text-forest-700' :
              'bg-cream-300 text-cream-600'
            }`}>{i + 1}</div>
            {i < 3 && <div className="w-8 h-px bg-cream-400" />}
          </div>
        ))}
      </div>

      {/* Step 1: Type */}
      {step === 'type' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose consultation type</h2>
          {(Object.entries(APPOINTMENT_TYPES) as [AppointmentTypeKey, typeof APPOINTMENT_TYPES[AppointmentTypeKey]][])
            .filter(([key]) => key !== 'discovery')
            .map(([key, info]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  booking.appointmentType === key ? 'border-forest-500 ring-2 ring-forest-500/20' : 'hover:border-cream-500'
                }`}
                onClick={() => {
                  setBooking({ ...booking, appointmentType: key, useMembershipCredit: false })
                }}
              >
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-cream-900">{info.name}</p>
                    <p className="text-sm text-cream-700 mt-1">{info.description}</p>
                    <p className="text-sm text-cream-600 mt-1">{info.duration} minutes</p>
                  </div>
                  <p className="text-lg font-bold text-warm-500">{info.priceDisplay}</p>
                </CardContent>
              </Card>
            ))}

          {membership && membership.credits_used < membership.credits_total && booking.appointmentType && (
            <Card
              className={`cursor-pointer transition-all ${
                booking.useMembershipCredit ? 'border-warm-500 ring-2 ring-warm-500/20' : 'hover:border-cream-500'
              }`}
              onClick={() => setBooking({ ...booking, useMembershipCredit: !booking.useMembershipCredit })}
            >
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-cream-900">Use Membership Credit</p>
                  <p className="text-sm text-cream-700 mt-1">
                    {membership.credits_total - membership.credits_used} credit{membership.credits_total - membership.credits_used !== 1 ? 's' : ''} remaining this month
                  </p>
                </div>
                <Badge variant="warm">Free</Badge>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={() => setStep('format')}
            disabled={!booking.appointmentType}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Format */}
      {step === 'format' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose format</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all text-center ${
                booking.format === 'in_person' ? 'border-forest-500 ring-2 ring-forest-500/20' : 'hover:border-cream-500'
              }`}
              onClick={() => setBooking({ ...booking, format: 'in_person' })}
            >
              <CardContent className="py-8">
                <MapPin className="h-8 w-8 text-forest-500 mx-auto mb-3" />
                <p className="font-semibold text-cream-900">In-Person</p>
                <p className="text-xs text-cream-700 mt-2">{CLINIC_INFO.address}</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all text-center ${
                booking.format === 'video' ? 'border-forest-500 ring-2 ring-forest-500/20' : 'hover:border-cream-500'
              }`}
              onClick={() => setBooking({ ...booking, format: 'video' })}
            >
              <CardContent className="py-8">
                <Video className="h-8 w-8 text-forest-500 mx-auto mb-3" />
                <p className="font-semibold text-cream-900">Video Call</p>
                <p className="text-xs text-cream-700 mt-2">Link sent before appointment</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('type')} className="flex-1">Back</Button>
            <Button onClick={() => setStep('datetime')} disabled={!booking.format} className="flex-1">Continue</Button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 'datetime' && typeInfo && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select date &amp; time</h2>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset((w) => w - 1)} disabled={weekOffset <= 0}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-cream-700">
              {(() => {
                const baseDate = new Date()
                baseDate.setDate(baseDate.getDate() + weekOffset * 7)
                const dates = getWeekDates(baseDate)
                return `${formatDate(dates[0].toISOString())} – ${formatDate(dates[4].toISOString())}`
              })()}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset((w) => w + 1)}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {(() => {
              const baseDate = new Date()
              baseDate.setDate(baseDate.getDate() + weekOffset * 7)
              const weekDates = getWeekDates(baseDate)
              const slots = generateTimeSlots(typeInfo.duration)
              const today = new Date().toISOString().split('T')[0]

              return weekDates.map((date) => {
                const dateStr = date.toISOString().split('T')[0]
                const isPast = dateStr < today
                return (
                  <div key={dateStr} className="space-y-1">
                    <div className="text-center text-xs font-medium text-cream-700 pb-1 border-b border-cream-300">
                      {getDayName(date)}<br />
                      <span className="text-cream-600">{date.getDate()}</span>
                    </div>
                    {slots.map((time) => {
                      const taken = isSlotTaken(dateStr, time)
                      const selected = booking.date === dateStr && booking.startTime === time
                      const disabled = isPast || taken
                      return (
                        <button
                          key={time}
                          onClick={() => !disabled && setBooking({ ...booking, date: dateStr, startTime: time })}
                          disabled={disabled}
                          className={`w-full text-xs py-1.5 rounded-lg transition-colors ${
                            selected ? 'bg-forest-700 text-white' :
                            disabled ? 'bg-cream-200 text-cream-500 cursor-not-allowed' :
                            'bg-cream-50 text-cream-900 hover:bg-forest-50 hover:text-forest-700'
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                )
              })
            })()}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('format')} className="flex-1">Back</Button>
            <Button onClick={() => setStep('confirm')} disabled={!booking.date || !booking.startTime} className="flex-1">Continue</Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 'confirm' && typeInfo && booking.date && booking.startTime && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirm your booking</h2>

          <Card>
            <CardHeader>
              <CardTitle>{typeInfo.name}</CardTitle>
              <CardDescription>{typeInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-cream-700">Date</span>
                <span className="font-medium">{formatDate(booking.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-700">Time</span>
                <span className="font-medium">{booking.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-700">Format</span>
                <span className="font-medium">{booking.format === 'video' ? 'Video Call' : 'In-Person'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-700">Duration</span>
                <span className="font-medium">{typeInfo.duration} minutes</span>
              </div>
              <div className="border-t border-cream-300 pt-3 flex justify-between">
                <span className="font-semibold text-cream-900">Total</span>
                <span className="font-bold text-lg text-warm-500">
                  {booking.useMembershipCredit ? 'Free (membership credit)' : typeInfo.priceDisplay}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep('datetime')} className="flex-1">Back</Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1"
              variant={booking.useMembershipCredit || typeInfo.pricePence === 0 ? 'default' : 'accent'}
            >
              {loading ? 'Booking...' :
                booking.useMembershipCredit ? 'Confirm Booking' :
                typeInfo.pricePence === 0 ? 'Confirm Booking' :
                `Pay ${typeInfo.priceDisplay}`
              }
            </Button>
          </div>

          {!booking.useMembershipCredit && typeInfo.pricePence > 0 && (
            <p className="text-xs text-cream-600 text-center">
              {/* TODO: Replace with Stripe checkout session */}
              Payment will be collected when Stripe is configured. For now, bookings are confirmed directly.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
