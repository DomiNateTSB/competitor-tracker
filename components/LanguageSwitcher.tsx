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
      <select
        value={currentLocale}
        onChange={e => change(e.target.value)}
        disabled={pending}
        className="text-[11px] text-zinc-400 bg-transparent border-none outline-none cursor-pointer hover:text-zinc-600 transition-colors w-full"
      >
        {locales.map(l => (
          <option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>
        ))}
      </select>
    )
  }

  return (
    <div className="relative group">
      <button
        disabled={pending}
        className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-800 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-100 disabled:opacity-50"
      >
        <span>{localeFlags[currentLocale]}</span>
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50">
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {locales.map(l => (
          <button
            key={l}
            onClick={() => change(l)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-zinc-50 transition-colors text-left ${l === currentLocale ? 'text-indigo-600 font-medium' : 'text-zinc-700'}`}
          >
            <span>{localeFlags[l]}</span>
            {localeNames[l]}
          </button>
        ))}
      </div>
    </div>
  )
}
