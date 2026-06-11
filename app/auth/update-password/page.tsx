import { updatePassword } from '@/app/auth/actions'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const t = await getTranslations('auth')
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-[#07101f] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        <div className="flex items-center justify-center mb-8">
          <Link href="/">
            <div className="bg-white rounded-xl px-4 py-2">
              <img src="/rivalkollen-logo.png" alt="Rivalkollen" className="h-10 w-auto object-contain" />
            </div>
          </Link>
        </div>

        <div className="bg-[#0b1628] rounded-2xl border border-[#182b45] p-8">
          <h1 className="text-[18px] font-semibold text-[#dce8ff] mb-1">{t('updatePassword.title')}</h1>
          <p className="text-[13px] text-[#4d6a8a] mb-6">{t('updatePassword.subtitle')}</p>

          {error && (
            <div className="mb-5 px-3 py-2.5 bg-red-950/50 border border-red-800/50 rounded-lg text-red-400 text-[13px]">{error}</div>
          )}

          <form action={updatePassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-[12px] font-medium text-[#6b85aa] mb-1.5">{t('updatePassword.newPassword')}</label>
              <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-[#182b45] rounded-lg text-[13px] text-[#dce8ff] bg-[#071018] placeholder-[#2d4a68] focus:outline-none focus:ring-2 focus:ring-[#4f74ff]/30 focus:border-[#4f74ff] transition-colors" />
              <p className="text-[11px] text-[#364f6e] mt-1.5">{t('updatePassword.passwordHint')}</p>
            </div>
            <button type="submit" className="w-full bg-[#4f74ff] hover:bg-[#3d63ee] text-white py-2.5 rounded-lg text-[13px] font-medium transition-colors">
              {t('updatePassword.submit')}
            </button>
          </form>
        </div>

        <div className="flex justify-center mt-4">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </div>
  )
}
