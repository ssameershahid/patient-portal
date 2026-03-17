'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { APPOINTMENT_TYPES } from '@/lib/utils/constants'
import { formatTime } from '@/lib/utils/helpers'
import { Calendar, MessageSquare, Users, TrendingUp } from 'lucide-react'
import type { AppointmentTypeKey } from '@/lib/utils/constants'

const MOCK_TODAY_APPTS = [
  {
    id: '1',
    start_time: '09:00',
    appointment_type: 'initial_consultation' as AppointmentTypeKey,
    format: 'video',
    status: 'confirmed',
    patient_name: 'Emma Thompson',
  },
  {
    id: '2',
    start_time: '11:30',
    appointment_type: 'follow_up' as AppointmentTypeKey,
    format: 'in_person',
    status: 'confirmed',
    patient_name: 'James Wilson',
  },
  {
    id: '3',
    start_time: '14:00',
    appointment_type: 'lab_review' as AppointmentTypeKey,
    format: 'video',
    status: 'confirmed',
    patient_name: 'Sarah Chen',
  },
]

export default function AdminDashboard() {
  const todayAppts = MOCK_TODAY_APPTS
  const unreadCount = 2
  const activeMembersCount = 12
  const weekApptsCount = 8

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-forest-50">
                <Calendar className="h-5 w-5 text-forest-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-cream-900">{todayAppts.length}</p>
                <p className="text-xs text-cream-700">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warm-100">
                <MessageSquare className="h-5 w-5 text-warm-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-cream-900">{unreadCount}</p>
                <p className="text-xs text-cream-700">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-forest-50">
                <Users className="h-5 w-5 text-forest-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-cream-900">{activeMembersCount}</p>
                <p className="text-xs text-cream-700">Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warm-100">
                <TrendingUp className="h-5 w-5 text-warm-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-cream-900">{weekApptsCount}</p>
                <p className="text-xs text-cream-700">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today&apos;s Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppts.length > 0 ? (
            <div className="space-y-3">
              {todayAppts.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-cream-300">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-cream-900 w-16">
                      {formatTime(appt.start_time)}
                    </div>
                    <div>
                      <p className="font-medium text-cream-900">
                        {appt.patient_name}
                      </p>
                      <p className="text-xs text-cream-700">
                        {APPOINTMENT_TYPES[appt.appointment_type]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={appt.format === 'video' ? 'warm' : 'default'}>
                      {appt.format === 'video' ? 'Video' : 'In-Person'}
                    </Badge>
                    <Badge variant={appt.status === 'confirmed' ? 'success' : 'neutral'}>
                      {appt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cream-700 py-4 text-center">No appointments scheduled for today.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
