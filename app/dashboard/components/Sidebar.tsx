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
  {
    label: 'Settings',
    labelKey: 'settings',
    href: '/dashboard/settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Sidebar({
  email,
  currentLocale,
  navLabels,
}: {
  email: string
  currentLocale: string
  navLabels?: { competitors: string; activity: string; settings: string }
}) {
  const pathname = usePathname()
  const initials = email.split('@')[0].slice(0, 2).toUpperCase()

  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-[#0b1628] border-r border-[#182b45] h-full">
      <div className="px-5 py-5 border-b border-[#182b45]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#4f74ff] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="white" strokeWidth="1.5"/>
              <circle cx="9" cy="9" r="3.5" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[#dce8ff] leading-tight">Competitor<br/>Tracker</span>
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
                active
                  ? 'bg-[#4f74ff]/15 text-[#7a96ff]'
                  : 'text-[#4d6a8a] hover:text-[#dce8ff] hover:bg-[#182b45]'
              }`}
            >
              <span className={active ? 'text-[#4f74ff]' : 'text-[#364f6e]'}>{item.icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-3 space-y-2">
        <div className="px-2">
          <LanguageSwitcher currentLocale={currentLocale} variant="subtle" />
        </div>
        <div className="border-t border-[#182b45] pt-3 flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-[#182b45] flex items-center justify-center text-[11px] font-semibold text-[#6b85aa] shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#4d6a8a] truncate">{email}</p>
          </div>
          <form action={signOut}>
            <button type="submit" title="Sign out" className="text-[#364f6e] hover:text-[#6b85aa] transition-colors">
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
