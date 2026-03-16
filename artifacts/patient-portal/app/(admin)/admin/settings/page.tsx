import { Card, CardContent } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Settings</h1>
      <Card className="text-center py-16">
        <CardContent>
          <Settings className="h-12 w-12 text-cream-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Admin settings coming soon</h3>
          <p className="text-sm text-cream-700">Clinic settings and configuration will be available here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
