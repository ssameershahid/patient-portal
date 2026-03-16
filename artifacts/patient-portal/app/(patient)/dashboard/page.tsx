import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { APPOINTMENT_TYPES, MEMBERSHIP_TIERS } from '@/lib/utils/constants'
import { formatDate, formatTime } from '@/lib/utils/helpers'
import Link from 'next/link'
import { Calendar, ClipboardList, MessageSquare, FileText, Crown } from 'lucide-react'
import type { AppointmentTypeKey, MembershipTierKey } from '@/lib/utils/constants'
import NotificationBanner from '@/components/notifications/NotificationBanner'

export default async function PatientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const admin = createAdminClient()
  const today = new Date().toISOString().split('T')[0]

  const [appointmentRes, intakeRes, diaryRes, membershipRes, documentsRes, conversationRes] = await Promise.all([
    admin
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .gte('date', today)
      .eq('status', 'confirmed')
      .order('date', { ascending: true })
      .limit(1),
    admin
      .from('intake_forms')
      .select('id')
      .eq('patient_id', user.id)
      .limit(1),
    admin
      .from('food_diaries')
      .select('id')
      .eq('patient_id', user.id)
      .eq('status', 'in_progress')
      .limit(1),
    admin
      .from('memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1),
    admin
      .from('documents')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    admin
      .from('conversations')
      .select('id, last_message_at, unread_count_patient')
      .eq('patient_id', user.id)
      .eq('status', 'active')
      .limit(1),
  ])

  const nextAppointment = appointmentRes.data?.[0]
  const hasIntake = (intakeRes.data?.length ?? 0) > 0
  const hasActiveDiary = (diaryRes.data?.length ?? 0) > 0
  const membership = membershipRes.data?.[0]
  const recentDocs = documentsRes.data ?? []
  const conversation = conversationRes.data?.[0]

  const pendingTasks: { label: string; href: string }[] = []
  if (!hasIntake) pendingTasks.push({ label: 'Complete your intake form', href: '/intake' })
  if (hasActiveDiary) pendingTasks.push({ label: 'Continue your food diary', href: '/food-diary' })

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Dashboard</h1>

      <NotificationBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Appointment */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="p-2 rounded-xl bg-forest-50">
              <Calendar className="h-5 w-5 text-forest-500" />
            </div>
            <CardTitle className="text-base">Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div>
                <p className="font-semibold text-cream-900">
                  {APPOINTMENT_TYPES[nextAppointment.appointment_type as AppointmentTypeKey]?.name}
                </p>
                <p className="text-sm text-cream-700 mt-1">
                  {formatDate(nextAppointment.date)} at {formatTime(nextAppointment.start_time)}
                </p>
                <Badge variant="default" className="mt-2">
                  {nextAppointment.format === 'video' ? 'Video Call' : 'In-Person'}
                </Badge>
              </div>
            ) : (
              <div>
                <p className="text-sm text-cream-700 mb-3">You have no upcoming appointments.</p>
                <Link href="/appointments/book">
                  <Button size="sm">Book a Consultation</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="p-2 rounded-xl bg-warm-100">
              <ClipboardList className="h-5 w-5 text-warm-500" />
            </div>
            <CardTitle className="text-base">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <ul className="space-y-2">
                {pendingTasks.map((task) => (
                  <li key={task.href}>
                    <Link href={task.href} className="flex items-center gap-2 text-sm text-forest-500 hover:underline">
                      <span className="w-1.5 h-1.5 rounded-full bg-warm-500" />
                      {task.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-cream-700">All caught up! No pending tasks.</p>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="p-2 rounded-xl bg-forest-50">
              <MessageSquare className="h-5 w-5 text-forest-500" />
            </div>
            <CardTitle className="text-base">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {membership ? (
              conversation ? (
                <div>
                  <p className="text-sm text-cream-700">
                    {conversation.unread_count_patient > 0
                      ? `You have ${conversation.unread_count_patient} unread message${conversation.unread_count_patient > 1 ? 's' : ''}`
                      : 'No new messages'}
                  </p>
                  <Link href="/messages" className="inline-block mt-3">
                    <Button size="sm" variant="secondary">Open Messages</Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-cream-700 mb-3">Start a conversation with Dr Sarah.</p>
                  <Link href="/messages">
                    <Button size="sm">Send a Message</Button>
                  </Link>
                </div>
              )
            ) : (
              <div className="bg-warm-50 rounded-xl p-4 border border-warm-200">
                <p className="text-sm font-medium text-warm-700">Members Only</p>
                <p className="text-sm text-cream-700 mt-1">Direct messaging with Dr Sarah is available to members.</p>
                <Link href="/account" className="inline-block mt-3">
                  <Button size="sm" variant="accent">Explore Membership Plans →</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="p-2 rounded-xl bg-forest-50">
              <FileText className="h-5 w-5 text-forest-500" />
            </div>
            <CardTitle className="text-base">Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDocs.length > 0 ? (
              <ul className="space-y-2">
                {recentDocs.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between text-sm">
                    <span className="text-cream-900 truncate">{doc.file_name}</span>
                    <Badge variant="neutral" className="text-[10px] ml-2 shrink-0">{doc.type.replace('_', ' ')}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-cream-700">No documents yet.</p>
            )}
            <Link href="/documents" className="inline-block mt-3">
              <Button size="sm" variant="ghost">View All →</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Membership Status */}
        {membership && (
          <Card className="md:col-span-2 border-forest-400 bg-forest-50/30">
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="p-2 rounded-xl bg-warm-100">
                <Crown className="h-5 w-5 text-warm-500" />
              </div>
              <CardTitle className="text-base">Membership</CardTitle>
              <Badge variant="warm" className="ml-auto">
                {MEMBERSHIP_TIERS[membership.tier as MembershipTierKey]?.name}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-cream-700">Credits Used</p>
                  <p className="font-semibold text-lg text-cream-900">{membership.credits_used} / {membership.credits_total}</p>
                </div>
                {membership.current_period_end && (
                  <div>
                    <p className="text-cream-700">Next Billing</p>
                    <p className="font-semibold text-cream-900">{formatDate(membership.current_period_end)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
