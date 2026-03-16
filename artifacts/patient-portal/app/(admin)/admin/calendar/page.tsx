import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function AdminCalendarPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Calendar</h1>
      <Card className="text-center py-16">
        <CardContent>
          <Calendar className="h-12 w-12 text-cream-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Calendar view coming soon</h3>
          <p className="text-sm text-cream-700">A full calendar view of all appointments will be available in the next update.</p>
        </CardContent>
      </Card>
    </div>
  )
}
