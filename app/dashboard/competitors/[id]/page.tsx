import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import CompetitorDetailView from './CompetitorDetailView'

export default async function CompetitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const t = await getTranslations('dashboard.detail')
  const tc = await getTranslations('dashboard.competitors')

  const { data: competitor } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!competitor) notFound()

  const { data: events } = await supabase
    .from('change_events')
    .select('*')
    .eq('competitor_id', id)
    .order('detected_at', { ascending: false })
    .limit(200)

  // Build 30-day chart data
  const countByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    countByDay[d.toISOString().slice(0, 10)] = 0
  }
  for (const e of events ?? []) {
    const day = e.detected_at.slice(0, 10)
    if (day in countByDay) countByDay[day]++
  }
  const chartData = Object.entries(countByDay).map(([fullDate, count]) => {
    const d = new Date(fullDate)
    return {
      date: d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }),
      count,
      fullDate,
    }
  })

  const labels = {
    back: t('back'), exportCsv: t('exportCsv'), totalChanges: t('totalChanges'),
    lastChecked: t('lastChecked'), trackingSince: t('trackingSince'),
    historyTitle: t('historyTitle'), showDiff: t('showDiff'), hideDiff: t('hideDiff'),
    removed: t('removed'), added: t('added'), changeRatio: t('changeRatio'),
    never: t('never'), noChangesTitle: t('noChangesTitle'), noChangesDesc: t('noChangesDesc'),
    firstCheckTitle: t('firstCheckTitle'), firstCheckDesc: t('firstCheckDesc'),
    step1: t('step1'), step2: t('step2'), step3: t('step3'),
    notes: t('notes'), notesSaving: t('notesSaving'), notesSaved: t('notesSaved'),
    notesPlaceholder: t('notesPlaceholder'),
    checkNow: tc('checkNow'), checking: tc('checking'),
    alertsTitle: t('alertsTitle'), alertsEnabled: t('alertsEnabled'),
    alertsSeverity: t('alertsSeverity'), alertsAll: t('alertsAll'),
    alertsMediumHigh: t('alertsMediumHigh'), alertsHighOnly: t('alertsHighOnly'),
    share: t('share'), shareCopied: t('shareCopied'), shareRevoke: t('shareRevoke'),
    markReviewed: tc('markReviewed'), reviewed: tc('reviewed'), loadMore: tc('loadMore'),
  }

  return (
    <CompetitorDetailView
      competitor={competitor}
      events={events ?? []}
      chartData={chartData}
      labels={labels}
    />
  )
}
