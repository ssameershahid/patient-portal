import { Card, CardContent } from '@/components/ui/card'
import { ClipboardList } from 'lucide-react'

export default function IntakePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Intake Form</h1>
      <Card className="text-center py-16">
        <CardContent>
          <ClipboardList className="h-12 w-12 text-cream-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Intake form coming soon</h3>
          <p className="text-sm text-cream-700">The new patient intake form will be available in the next update.</p>
        </CardContent>
      </Card>
    </div>
  )
}
