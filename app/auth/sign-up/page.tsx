import { signUp } from '@/app/auth/actions'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams
  const t = await getTranslations('auth')
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="4" stroke="white" strokeWidth="1.5"/><circle cx="10" cy="10" r="4" stroke="white" strokeWidth="1.5"/></svg>
          </div>
          <span className="text-[15px] font-semibold text-zinc-900">{t('appName')}</span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-8">
          <h1 className="text-[18px] font-semibold text-zinc-900 mb-1">{t('signUp.title')}</h1>
          <p className="text-[13px] text-zinc-400 mb-6">{t('signUp.subtitle')}</p>

          {error && <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[13px]">{error}</div>}
          {success && <div className="mb-5 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-[13px]">{success}</div>}

          <form action={signUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[12px] font-medium text-zinc-700 mb-1.5">{t('signUp.email')}</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors" />
            </div>
            <div>
              <label htmlFor="password" className="block text-[12px] font-medium text-zinc-700 mb-1.5">{t('signUp.password')}</label>
              <input id="password" name="password" type="password" required autoComplete="new-password" minLength={6} placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors" />
              <p className="text-[11px] text-zinc-400 mt-1.5">{t('signUp.passwordHint')}</p>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-[13px] font-medium transition-colors shadow-sm mt-2">
              {t('signUp.submit')}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-zinc-400 mt-5">
          {t('signUp.hasAccount')}{' '}
          <Link href="/auth/sign-in" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">{t('signUp.signInLink')}</Link>
        </p>
        <div className="flex justify-center mt-4">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </div>
  )
}
