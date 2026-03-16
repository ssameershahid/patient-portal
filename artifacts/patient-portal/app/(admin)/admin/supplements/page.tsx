import { Card, CardContent } from '@/components/ui/card'
import { Pill } from 'lucide-react'

export default function AdminSupplementsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Supplement Catalogue</h1>
      <Card className="text-center py-16">
        <CardContent>
          <Pill className="h-12 w-12 text-cream-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Supplement management coming soon</h3>
          <p className="text-sm text-cream-700">Manage the supplement catalogue and patient prescriptions here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
