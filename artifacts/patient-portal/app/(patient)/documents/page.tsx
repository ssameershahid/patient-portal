import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/helpers'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: documents } = await admin
    .from('documents')
    .select('*')
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false })

  const docs = documents ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Documents</h1>

      {docs.length > 0 ? (
        <div className="space-y-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-forest-50 shrink-0">
                  <FileText className="h-5 w-5 text-forest-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-cream-900 truncate">{doc.file_name}</p>
                  <p className="text-xs text-cream-700 mt-0.5">{formatDateTime(doc.created_at)}</p>
                </div>
                <Badge variant="neutral">{doc.type.replace('_', ' ')}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="h-12 w-12 text-cream-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-1">No documents yet</h3>
            <p className="text-sm text-cream-700">Lab results, uploads and other documents will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
