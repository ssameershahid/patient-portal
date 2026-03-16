import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Messages</h1>
      <Card className="text-center py-16">
        <CardContent>
          <MessageSquare className="h-12 w-12 text-cream-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Admin messaging coming soon</h3>
          <p className="text-sm text-cream-700">Patient messaging inbox will be available in the next update.</p>
        </CardContent>
      </Card>
    </div>
  )
}
