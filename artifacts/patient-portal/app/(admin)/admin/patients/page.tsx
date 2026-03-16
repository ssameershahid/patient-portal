import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, formatDate } from '@/lib/utils/helpers'
import { Users } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPatientsPage() {
  const supabase = createAdminClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, memberships(tier, status)')
    .eq('role', 'patient')
    .order('created_at', { ascending: false })

  const patients = profiles ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Patients</h1>
        <Badge variant="neutral">{patients.length} patients</Badge>
      </div>

      {patients.length > 0 ? (
        <div className="space-y-3">
          {patients.map((patient) => {
            const membership = Array.isArray(patient.memberships) ? patient.memberships[0] : null
            return (
              <Link key={patient.id} href={`/admin/patients/${patient.id}`}>
                <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-forest-100 text-forest-700 text-sm">
                        {getInitials(patient.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-cream-900">{patient.full_name || 'Unnamed'}</p>
                      <p className="text-xs text-cream-700">Joined {formatDate(patient.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {membership && membership.status === 'active' && (
                        <Badge variant="warm">
                          {membership.tier === 'tier_1' ? 'Essential' : 'Premium'}
                        </Badge>
                      )}
                      <Badge variant="outline">{patient.phone || 'No phone'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <Users className="h-12 w-12 text-cream-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No patients yet</h3>
            <p className="text-sm text-cream-700">Patients will appear here once they register.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
