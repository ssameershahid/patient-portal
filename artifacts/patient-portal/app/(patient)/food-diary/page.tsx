import { Card, CardContent } from '@/components/ui/card'
import { UtensilsCrossed } from 'lucide-react'

export default function FoodDiaryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Food Diary</h1>
      <Card className="text-center py-16">
        <CardContent>
          <UtensilsCrossed className="h-12 w-12 text-cream-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Food diary coming soon</h3>
          <p className="text-sm text-cream-700">The 7-day food diary will be available in the next update.</p>
        </CardContent>
      </Card>
    </div>
  )
}
