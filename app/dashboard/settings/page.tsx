import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const t = await getTranslations('dashboard.settings')

  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    accountSection: t('accountSection'),
    emailLabel: t('emailLabel'),
    emailDesc: t('emailDesc'),
    newEmail: t('newEmail'),
    updateEmail: t('updateEmail'),
    updatingEmail: t('updatingEmail'),
    passwordSection: t('passwordSection'),
    passwordDesc: t('passwordDesc'),
    currentPassword: t('currentPassword'),
    newPassword: t('newPassword'),
    passwordHint: t('passwordHint'),
    updatePassword: t('updatePassword'),
    updatingPassword: t('updatingPassword'),
    dangerSection: t('dangerSection'),
    dangerDesc: t('dangerDesc'),
    deleteAccount: t('deleteAccount'),
    deleteConfirmTitle: t('deleteConfirmTitle'),
    deleteConfirmDesc: t('deleteConfirmDesc'),
    deleteConfirmButton: t('deleteConfirmButton'),
    cancel: t('cancel'),
    successEmail: t('successEmail'),
    successPassword: t('successPassword'),
  }

  return <SettingsClient email={user.email ?? ''} labels={labels} />
}
