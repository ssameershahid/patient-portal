'use client'

import Sidebar from '@/components/layout/Sidebar'
import MobileHeader from '@/components/layout/MobileHeader'
import { RequireAuth, useAuth } from '@/lib/auth/AuthProvider'

function PatientLayoutInner({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()
  const userName = profile?.full_name ?? null

  return (
    <div className="min-h-screen bg-cream-200">
      <Sidebar userName={userName} />
      <MobileHeader userName={userName} />
      <main className="lg:pl-60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <PatientLayoutInner>{children}</PatientLayoutInner>
    </RequireAuth>
  )
}
