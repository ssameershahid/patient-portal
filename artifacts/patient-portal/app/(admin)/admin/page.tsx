import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { APPOINTMENT_TYPES } from '@/lib/utils/constants'
import { formatTime } from '@/lib/utils/helpers'
import { Calendar, MessageSquare, Users, TrendingUp } from 'lucide-react'
import type { AppointmentTypeKey } from '@/lib/utils/constants'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const [todayApptsRes, unreadRes, activeMembersRes, weekApptsRes] = await Promise.all([
    supabase
      .from('appointments')
      .select('*, profiles!appointments_patient_id_fkey(full_name)')
      .eq('date', today)
      .neq('status', 'cancelled')
      .order('start_time', { ascending: true }),
    supabase
      .from('conversations')
      .select('id')
      .gt('unread_count_admin', 0),
    supabase
      .from('memberships')
      .select('id')
      .eq('status', 'active'),
    supabase
      .from('appointments')
      .select('id')
      .gte('date', weekStart.toISOString().split('T')[0])
      .lte('date', weekEnd.toISOString().split('T')[0])
      .neq('status', 'cancelled'),
  ])

  const todayAppts = todayApptsRes.data ?? []
  const unreadCount = unreadRes.data?.length ?? 0
  const activeMembersCount = activeMembersRes.data?.length ?? 0
  const weekApptsCount = weekApptsRes.data?.length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Admin Dashboard</h1>

      {/* Quick Stats */}
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

      {/* Today's Appointments */}
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
                        {(appt.profiles as { full_name: string | null })?.full_name || 'Unknown Patient'}
                      </p>
                      <p className="text-xs text-cream-700">
                        {APPOINTMENT_TYPES[appt.appointment_type as AppointmentTypeKey]?.name}
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
