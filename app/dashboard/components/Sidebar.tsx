'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const nav = [
  {
    label: 'Competitors',
    labelKey: 'competitors',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="10" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Activity',
    labelKey: 'activity',
    href: '/dashboard/activity',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <polyline points="1,8 4,5 7,9 10,4 13,7 15,5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Sidebar({ email, navLabels }: { email: string; navLabels?: { competitors: string; activity: string } }) {
  const pathname = usePathname()

  const initials = email.split('@')[0].slice(0, 2).toUpperCase()

  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-white border-r border-zinc-200/80 h-full">
      <div className="px-5 py-5 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="white" strokeWidth="1.5"/>
              <circle cx="9" cy="9" r="3.5" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-zinc-900 leading-tight">Competitor<br/>Tracker</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const label = navLabels?.[item.labelKey as keyof typeof navLabels] ?? item.label
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                active ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <span className={active ? 'text-indigo-600' : 'text-zinc-400'}>{item.icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-3 space-y-2">
        <div className="px-2">
          <LanguageSwitcher variant="subtle" />
        </div>
        <div className="border-t border-zinc-100 pt-3 flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-[11px] font-semibold text-zinc-600 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-400 truncate">{email}</p>
          </div>
          <form action={signOut}>
            <button type="submit" title="Sign out" className="text-zinc-300 hover:text-zinc-500 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H2.5C2.22 2 2 2.22 2 2.5v9c0 .28.22.5.5.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M9.5 9.5L12 7l-2.5-2.5M12 7H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
