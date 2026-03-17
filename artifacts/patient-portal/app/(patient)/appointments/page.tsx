'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APPOINTMENT_TYPES } from '@/lib/utils/constants'
import { formatDate, formatTime } from '@/lib/utils/helpers'
import Link from 'next/link'
import { Calendar, Plus } from 'lucide-react'
import type { AppointmentTypeKey } from '@/lib/utils/constants'

const MOCK_UPCOMING = [
  {
    id: '1',
    appointment_type: 'initial_consultation' as AppointmentTypeKey,
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:00',
    format: 'video',
    status: 'confirmed',
    used_membership_credit: false,
  },
]

const MOCK_PAST = [
  {
    id: '2',
    appointment_type: 'follow_up' as AppointmentTypeKey,
    date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    start_time: '14:00',
    end_time: '14:30',
    format: 'in_person',
    status: 'completed',
    used_membership_credit: true,
  },
]

export default function AppointmentsPage() {
  const upcoming = MOCK_UPCOMING
  const past = MOCK_PAST

  function AppointmentCard({ appt, showCancel }: { appt: typeof upcoming[0]; showCancel: boolean }) {
    const typeInfo = APPOINTMENT_TYPES[appt.appointment_type]
    return (
      <Card key={appt.id} className="hover:shadow-sm transition-shadow">
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-forest-50 shrink-0">
              <Calendar className="h-5 w-5 text-forest-500" />
            </div>
            <div>
              <p className="font-semibold text-cream-900">{typeInfo?.name}</p>
              <p className="text-sm text-cream-700 mt-0.5">
                {formatDate(appt.date)} · {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant={appt.format === 'video' ? 'warm' : 'default'}>
                  {appt.format === 'video' ? 'Video Call' : 'In-Person'}
                </Badge>
                <Badge variant={
                  appt.status === 'confirmed' ? 'success' :
                  appt.status === 'completed' ? 'neutral' :
                  appt.status === 'cancelled' ? 'error' : 'outline'
                }>
                  {appt.status}
                </Badge>
                {appt.used_membership_credit && (
                  <Badge variant="warm">Credit Used</Badge>
                )}
              </div>
            </div>
          </div>
          {showCancel && appt.status === 'confirmed' && (
            <Button size="sm" variant="destructive">Cancel</Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Appointments</h1>
        <Link href="/appointments/book">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Book Appointment
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} showCancel={true} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-cream-500 mx-auto mb-4" />
                <h3 className="font-semibold text-cream-900 mb-1">No upcoming appointments</h3>
                <p className="text-sm text-cream-700 mb-4">Book your first consultation with Dr Sarah</p>
                <Link href="/appointments/book">
                  <Button>Book a Consultation</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length > 0 ? (
            <div className="space-y-4">
              {past.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} showCancel={false} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-sm text-cream-700">No past appointments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
