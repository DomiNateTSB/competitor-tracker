import { resetPassword } from '@/app/auth/actions'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams
  const t = await getTranslations('auth')
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-[#07101f] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#4f74ff] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="4" stroke="white" strokeWidth="1.5"/><circle cx="10" cy="10" r="4" stroke="white" strokeWidth="1.5"/></svg>
          </div>
          <span className="text-[15px] font-semibold text-[#dce8ff]">{t('appName')}</span>
        </div>

        <div className="bg-[#0b1628] rounded-2xl border border-[#182b45] p-8">
          <h1 className="text-[18px] font-semibold text-[#dce8ff] mb-1">{t('forgotPassword.title')}</h1>
          <p className="text-[13px] text-[#4d6a8a] mb-6">{t('forgotPassword.subtitle')}</p>

          {error && <div className="mb-5 px-3 py-2.5 bg-red-950/50 border border-red-800/50 rounded-lg text-red-400 text-[13px]">{error}</div>}

          {success ? (
            <div className="px-3 py-2.5 bg-emerald-950/50 border border-emerald-700/50 rounded-lg text-emerald-400 text-[13px]">{success}</div>
          ) : (
            <form action={resetPassword} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[12px] font-medium text-[#6b85aa] mb-1.5">{t('forgotPassword.email')}</label>
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"
                  className="w-full px-3 py-2.5 border border-[#182b45] rounded-lg text-[13px] text-[#dce8ff] bg-[#071018] placeholder-[#2d4a68] focus:outline-none focus:ring-2 focus:ring-[#4f74ff]/30 focus:border-[#4f74ff] transition-colors" />
              </div>
              <button type="submit" className="w-full bg-[#4f74ff] hover:bg-[#3d63ee] text-white py-2.5 rounded-lg text-[13px] font-medium transition-colors">
                {t('forgotPassword.submit')}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[12px] text-[#4d6a8a] mt-5">
          {t('forgotPassword.rememberPassword')}{' '}
          <Link href="/auth/sign-in" className="text-[#4f74ff] hover:text-[#7a96ff] font-medium transition-colors">{t('forgotPassword.signInLink')}</Link>
        </p>
        <div className="flex justify-center mt-4">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </div>
  )
}
