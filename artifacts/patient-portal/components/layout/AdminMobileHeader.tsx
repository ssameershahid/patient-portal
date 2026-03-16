'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CLINIC_INFO } from '@/lib/utils/constants'
import {
  LayoutDashboard, Users, Calendar, MessageSquare, Bell, Pill, Settings, LogOut, Menu, X
} from 'lucide-react'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/patients', label: 'Patients', icon: Users },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/supplements', label: 'Supplements', icon: Pill },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminMobileHeader() {
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
          <div>
            <span className="text-base font-bold font-heading">{CLINIC_INFO.name}</span>
            <span className="text-[10px] text-forest-300 ml-2">Admin</span>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="admin-mobile-nav-drawer"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/40 z-[60]" onClick={close} aria-hidden="true" />
          <nav
            id="admin-mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation menu"
            className="lg:hidden fixed top-14 right-0 bottom-0 w-72 bg-forest-800 z-[70] overflow-y-auto"
          >
            <div className="px-3 py-4 space-y-1">
              {adminNavItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + '/')
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
                  <AvatarFallback className="bg-forest-700 text-forest-200 text-xs">SA</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cream-100 truncate">{CLINIC_INFO.doctorName}</p>
                  <Badge variant="warm" className="mt-0.5 text-[10px] py-0 px-2">Admin</Badge>
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
          </nav>
        </>
      )}
    </>
  )
}
