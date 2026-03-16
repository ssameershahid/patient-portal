'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/helpers'
import { CLINIC_INFO } from '@/lib/utils/constants'
import {
  LayoutDashboard, Calendar, MessageSquare, FileText, UtensilsCrossed,
  Pill, Settings, LogOut, Menu, X
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

export default function MobileHeader({ userName }: { userName: string | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, close])

  useEffect(() => { close() }, [pathname, close])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="lg:hidden sticky top-0 z-50 bg-forest-800 text-cream-100">
        <div className="flex items-center justify-between h-14 px-4">
          <span className="text-base font-bold font-heading">{CLINIC_INFO.name}</span>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/40 z-[60]" onClick={close} aria-hidden="true" />
          <nav
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="lg:hidden fixed top-14 right-0 bottom-0 w-72 bg-forest-800 z-[70] overflow-y-auto"
          >
            <div className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
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
            </div>

            <div className="p-4 border-t border-white/10 mt-2">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-forest-700 text-forest-200 text-xs">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-cream-100 truncate">{userName || 'Patient'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-sm text-forest-300 hover:bg-white/[0.04] hover:text-cream-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
