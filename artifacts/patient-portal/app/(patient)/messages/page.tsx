import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Lock } from 'lucide-react'
import Link from 'next/link'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: membership } = await admin
    .from('memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .single()

  if (!membership) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-heading mb-6">Messages</h1>
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-warm-500" />
            </div>
            <h3 className="text-lg font-semibold font-heading mb-2">Members Only Feature</h3>
            <p className="text-cream-700 text-sm max-w-md mx-auto mb-6">
              Direct messaging with Dr Sarah is available exclusively to membership holders. Upgrade to get priority support and ongoing communication.
            </p>
            <Link href="/account">
              <Button variant="accent">Explore Membership Plans →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Messages</h1>
      <Card className="text-center py-16">
        <CardContent>
          <MessageSquare className="h-12 w-12 text-cream-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Messaging coming soon</h3>
          <p className="text-sm text-cream-700">Real-time messaging with Dr Sarah will be available in the next update.</p>
        </CardContent>
      </Card>
    </div>
  )
}
