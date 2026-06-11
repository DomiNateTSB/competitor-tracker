'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLocale } from '@/app/actions/setLocale'

const locales = ['sv', 'en', 'no', 'da', 'fi', 'de', 'fr', 'es', 'nl', 'pl', 'pt', 'it']

const localeNames: Record<string, string> = {
  sv: 'Svenska', en: 'English', no: 'Norsk', da: 'Dansk',
  fi: 'Suomi', de: 'Deutsch', fr: 'Français', es: 'Español',
  nl: 'Nederlands', pl: 'Polski', pt: 'Português', it: 'Italiano',
}

const localeFlags: Record<string, string> = {
  sv: '🇸🇪', en: '🇬🇧', no: '🇳🇴', da: '🇩🇰',
  fi: '🇫🇮', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸',
  nl: '🇳🇱', pl: '🇵🇱', pt: '🇵🇹', it: '🇮🇹',
}

export default function LanguageSwitcher({
  currentLocale,
  variant = 'default',
}: {
  currentLocale: string
  variant?: 'default' | 'subtle'
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function change(newLocale: string) {
    startTransition(async () => {
      await setLocale(newLocale)
      router.refresh()
    })
  }

  if (variant === 'subtle') {
    return (
      <div className="relative group">
        <button
          disabled={pending}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] hover:bg-[#182b45] transition-colors disabled:opacity-50"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 text-[#364f6e]">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M6.5 1C6.5 1 4.5 3.5 4.5 6.5s2 5.5 2 5.5M6.5 1C6.5 1 8.5 3.5 8.5 6.5S6.5 12 6.5 12M1 6.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className="flex-1 text-left">{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-40 shrink-0">
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="absolute left-0 bottom-full mb-1 w-48 bg-[#0b1628] border border-[#182b45] rounded-xl shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-64 overflow-y-auto">
          {locales.map(l => (
            <button
              key={l}
              onClick={() => change(l)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-[#182b45] transition-colors text-left ${l === currentLocale ? 'text-[#4f74ff] font-medium' : 'text-[#6b85aa]'}`}
            >
              <span>{localeFlags[l]}</span>
              {localeNames[l]}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <button
        disabled={pending}
        className="flex items-center gap-1.5 text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] transition-colors px-2 py-1 rounded-lg hover:bg-[#182b45] disabled:opacity-50"
      >
        <span>{localeFlags[currentLocale]}</span>
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50">
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="absolute right-0 top-full mt-1 w-44 bg-[#0b1628] border border-[#182b45] rounded-xl shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {locales.map(l => (
          <button
            key={l}
            onClick={() => change(l)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-[#182b45] transition-colors text-left ${l === currentLocale ? 'text-[#4f74ff] font-medium' : 'text-[#6b85aa]'}`}
          >
            <span>{localeFlags[l]}</span>
            {localeNames[l]}
          </button>
        ))}
      </div>
    </div>
  )
}
