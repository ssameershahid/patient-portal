import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pill } from 'lucide-react'

export default async function SupplementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: supplements } = await admin
    .from('patient_supplements')
    .select('*, supplement_catalogue(*)')
    .eq('patient_id', user.id)
    .eq('is_active', true)

  const supps = supplements ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">My Supplements</h1>

      {supps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supps.map((s) => {
            const cat = s.supplement_catalogue as { name: string; brand: string | null; default_dosage: string | null } | null
            return (
              <Card key={s.id}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-cream-900">{cat?.name}</p>
                      {cat?.brand && <p className="text-xs text-cream-700">{cat.brand}</p>}
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-sm text-cream-700 mt-2">{s.custom_dosage || cat?.default_dosage || 'As directed'}</p>
                  {s.custom_notes && <p className="text-xs text-cream-600 mt-1">{s.custom_notes}</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <Pill className="h-12 w-12 text-cream-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No supplements prescribed yet</h3>
            <p className="text-sm text-cream-700">Supplement recommendations from Dr Sarah will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
