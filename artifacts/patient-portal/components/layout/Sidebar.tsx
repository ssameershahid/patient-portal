'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/helpers'
import { CLINIC_INFO } from '@/lib/utils/constants'
import {
  LayoutDashboard, Calendar, MessageSquare, FileText, UtensilsCrossed,
  Pill, Settings, LogOut
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/food-diary', label: 'Food Diary', icon: UtensilsCrossed },
  { href: '/supplements', label: 'Supplements', icon: Pill },
  { href: '/account', label: 'Account', icon: Settings },
]

export default function Sidebar({ userName }: { userName: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-forest-800 text-cream-100">
      <div className="flex flex-col h-full">
        <div className="px-6 py-6">
          <h1 className="text-lg font-bold font-heading text-cream-100">{CLINIC_INFO.name}</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-cream-100'
                    : 'text-forest-300 hover:bg-white/[0.04] hover:text-cream-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-forest-700 text-forest-200 text-xs">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cream-100 truncate">{userName || 'Patient'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm text-forest-300 hover:bg-white/[0.04] hover:text-cream-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
