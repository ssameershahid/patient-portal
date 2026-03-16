'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, MessageSquare, FileText, Settings } from 'lucide-react'

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/appointments', label: 'Appts', icon: Calendar },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/documents', label: 'Docs', icon: FileText },
  { href: '/account', label: 'Account', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-forest-800 border-t border-white/10 z-50">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                isActive ? 'text-cream-100' : 'text-forest-300'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
