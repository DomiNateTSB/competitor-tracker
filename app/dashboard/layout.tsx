import Sidebar from '@/app/dashboard/components/Sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const t = await getTranslations('dashboard.nav')
  const locale = await getLocale()

  return (
    <div className="flex h-screen bg-[#07101f] overflow-hidden">
      <Sidebar
        email={user.email ?? ''}
        currentLocale={locale}
        navLabels={{ competitors: t('competitors'), activity: t('activity'), settings: t('settings') }}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
