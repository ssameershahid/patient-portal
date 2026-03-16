import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { APPOINTMENT_TYPES, MEMBERSHIP_TIERS } from '@/lib/utils/constants'
import { getInitials, formatDate, formatTime, formatDateTime } from '@/lib/utils/helpers'
import { ArrowLeft, Calendar, FileText, Pill, Crown, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { AppointmentTypeKey, MembershipTierKey } from '@/lib/utils/constants'

export default async function AdminPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [profileRes, appointmentsRes, membershipRes, documentsRes, supplementsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('appointments').select('*').eq('patient_id', id).order('date', { ascending: false }).limit(20),
    supabase.from('memberships').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(1),
    supabase.from('documents').select('*').eq('patient_id', id).order('created_at', { ascending: false }).limit(10),
    supabase.from('patient_supplements').select('*, supplement_catalogue(*)').eq('patient_id', id),
  ])

  if (!profileRes.data) notFound()

  const profile = profileRes.data
  const appointments = appointmentsRes.data ?? []
  const membership = membershipRes.data?.[0]
  const documents = documentsRes.data ?? []
  const supplements = supplementsRes.data ?? []

  return (
    <div>
      <Link href="/admin/patients" className="flex items-center gap-1 text-sm text-forest-500 hover:underline mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Link>

      {/* Patient Header */}
      <Card className="mb-6">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-forest-100 text-forest-700 text-lg">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-heading">{profile.full_name || 'Unnamed Patient'}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-cream-700">
              {profile.phone && (
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>
              )}
              {profile.date_of_birth && (
                <span>DOB: {formatDate(profile.date_of_birth)}</span>
              )}
              <span>Joined {formatDate(profile.created_at)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {membership && membership.status === 'active' && (
              <Badge variant="warm">
                <Crown className="h-3 w-3 mr-1" />
                {MEMBERSHIP_TIERS[membership.tier as MembershipTierKey]?.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="supplements">Supplements ({supplements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <Card key={appt.id}>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-forest-50">
                        <Calendar className="h-4 w-4 text-forest-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {APPOINTMENT_TYPES[appt.appointment_type as AppointmentTypeKey]?.name}
                        </p>
                        <p className="text-xs text-cream-700">
                          {formatDate(appt.date)} · {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={appt.format === 'video' ? 'warm' : 'default'}>
                        {appt.format === 'video' ? 'Video' : 'In-Person'}
                      </Badge>
                      <Badge variant={
                        appt.status === 'confirmed' ? 'success' :
                        appt.status === 'completed' ? 'neutral' :
                        appt.status === 'cancelled' ? 'error' : 'outline'
                      }>
                        {appt.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-sm text-cream-700">No appointments found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-forest-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.file_name}</p>
                      <p className="text-xs text-cream-700">{formatDateTime(doc.created_at)}</p>
                    </div>
                    <Badge variant="neutral">{doc.type.replace('_', ' ')}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-sm text-cream-700">No documents found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="supplements">
          {supplements.length > 0 ? (
            <div className="space-y-3">
              {supplements.map((s) => {
                const cat = s.supplement_catalogue as { name: string; brand: string | null; default_dosage: string | null } | null
                return (
                  <Card key={s.id}>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Pill className="h-5 w-5 text-forest-500" />
                        <div>
                          <p className="text-sm font-medium">{cat?.name}</p>
                          <p className="text-xs text-cream-700">{s.custom_dosage || cat?.default_dosage}</p>
                        </div>
                      </div>
                      <Badge variant={s.is_active ? 'success' : 'outline'}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-sm text-cream-700">No supplements prescribed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
