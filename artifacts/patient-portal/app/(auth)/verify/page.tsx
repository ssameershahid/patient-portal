import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CLINIC_INFO } from '@/lib/utils/constants'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-200 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-forest-700">{CLINIC_INFO.name}</h1>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold font-heading mb-2">Verify your email</h2>
            <p className="text-cream-700 text-sm">
              Please check your email and click the verification link to activate your account.
            </p>
            <Link href="/login" className="inline-block mt-6">
              <Button variant="secondary">Back to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
