import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import AddCompetitorModal from '@/app/dashboard/components/AddCompetitorModal'
import OnboardingBanner from '@/app/dashboard/components/OnboardingBanner'
import DashboardClient from '@/app/dashboard/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const t  = await getTranslations('dashboard.competitors')
  const tm = await getTranslations('dashboard.modal')
  const tc = await getTranslations('dashboard.categories')
  const td = await getTranslations('dashboard.discover')

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const competitorIds = competitors?.map(c => c.id) ?? []

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

  const { data: events } = competitorIds.length > 0
    ? await supabase
        .from('change_events')
        .select('*')
        .in('competitor_id', competitorIds)
        .gte('detected_at', thirtyDaysAgo.toISOString())
        .order('detected_at', { ascending: false })
        .limit(500)
    : { data: [] }

  const { data: allEvents } = competitorIds.length > 0
    ? await supabase
        .from('change_events')
        .select('*')
        .in('competitor_id', competitorIds)
        .order('detected_at', { ascending: false })
        .limit(200)
    : { data: [] }

  const eventsByCompetitor = (allEvents ?? []).reduce((acc, e) => {
    acc[e.competitor_id] = acc[e.competitor_id] ?? []
    acc[e.competitor_id].push(e)
    return acc
  }, {} as Record<string, typeof allEvents>)

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
    return { date: d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }), count, fullDate }
  })

  const categoryLabels = {
    restaurant: tc('restaurant'), salon: tc('salon'), dentist: tc('dentist'),
    car_repair: tc('car_repair'), gym: tc('gym'), real_estate: tc('real_estate'),
    retail: tc('retail'), construction: tc('construction'), electrician: tc('electrician'),
    plumber: tc('plumber'), other: tc('other'),
  }

  const modalLabels = {
    button: t('addCompetitor'), title: tm('title'), subtitle: tm('subtitle'),
    businessName: tm('businessName'), websiteUrl: tm('websiteUrl'),
    googleMapsUrl: tm('googleMapsUrl'), googleMapsHint: tm('googleMapsHint'),
    category: tm('category'), selectCategory: tm('selectCategory'),
    cancel: tm('cancel'), add: tm('add'), adding: tm('adding'),
  }

  const cardLabels = {
    checkNow: t('checkNow'), checking: t('checking'), viewChanges: t('viewChanges'),
    hide: t('hide'), changeHistory: t('changeHistory'), checkedOn: t('checkedOn'),
    change: t('change'), changes: t('changes'), diff: t('diff'),
    removed: t('removed'), added: t('added'),
    statusOk: t('statusOk'), statusError: t('statusError'), statusNever: t('statusNever'),
    checkAll: t('checkAll'), checkingAll: t('checkingAll'), allChecked: t('allChecked'), checkAllDone: t('checkAllDone'),
    confirmDelete: t('confirmDelete'), confirmDeleteDesc: t('confirmDeleteDesc'), confirmYes: t('confirmYes'), confirmNo: t('confirmNo'),
    search: t('search'), sortBy: t('sortBy'), sortRecent: t('sortRecent'),
    sortChanged: t('sortChanged'), sortChecked: t('sortChecked'), sortName: t('sortName'),
    filterAll: t('filterAll'), noResults: t('noResults'),
    markReviewed: t('markReviewed'), reviewed: t('reviewed'), loadMore: t('loadMore'),
    unreviewedChanges: t('unreviewedChanges'), activityLabel: t('activityLabel'),
    notifTitle: t('notifTitle'), notifEmpty: t('notifEmpty'),
    tracked: t('tracked'), checked: t('checked'), changesDetected: t('changesDetected'),
    last30Days: t('last30Days'),
  }

  const hasCompetitors = (competitors?.length ?? 0) > 0

  return (
    <div className="px-4 sm:px-8 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#dce8ff]">{t('title')}</h1>
          <p className="text-sm text-[#4d6a8a] mt-0.5">{t('subtitle')}</p>
        </div>
        <AddCompetitorModal labels={modalLabels} categoryLabels={categoryLabels} />
      </div>

      {!hasCompetitors && <OnboardingBanner />}

      {!hasCompetitors ? (
        <EmptyState
          title={t('emptyTitle')}
          subtitle={t('emptySubtitle')}
          modalLabels={modalLabels}
          categoryLabels={categoryLabels}
        />
      ) : (
        <DashboardClient
          competitors={competitors ?? []}
          eventsByCompetitor={eventsByCompetitor as Record<string, never>}
          allEvents={allEvents ?? []}
          chartData={chartData}
          categoryLabels={categoryLabels}
          cardLabels={cardLabels}
          labels={cardLabels}
          modalLabels={modalLabels}
          statLabels={{ tracked: t('tracked'), checked: t('checked'), changesDetected: t('changesDetected'), last30Days: t('last30Days') }}
          discoverLabels={{
            title: td('title'), subtitle: td('subtitle'),
            locationLabel: td('locationLabel'), locationPlaceholder: td('locationPlaceholder'),
            categoryLabel: td('categoryLabel'), allCategories: td('allCategories'),
            searchBtn: td('searchBtn'), trackedLabel: td('trackedLabel'),
            suggestedLabel: td('suggestedLabel'), openMaps: td('openMaps'),
            addCompetitor: td('addCompetitor'), relatedLabel: td('relatedLabel'),
            tipTitle: td('tipTitle'), tip1: td('tip1'), tip2: td('tip2'), tip3: td('tip3'),
            noLocation: td('noLocation'), mapsQueryNote: td('mapsQueryNote'),
          }}
        />
      )}
    </div>
  )
}

function EmptyState({
  title, subtitle, modalLabels, categoryLabels,
}: {
  title: string
  subtitle: string
  modalLabels: Parameters<typeof AddCompetitorModal>[0]['labels']
  categoryLabels: Record<string, string>
}) {
  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] p-14 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#071018] border border-[#182b45] flex items-center justify-center mx-auto mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#364f6e" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="6" stroke="#364f6e" strokeWidth="1.5"/>
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[#dce8ff] mb-1">{title}</h3>
      <p className="text-sm text-[#4d6a8a] mb-6 max-w-xs mx-auto">{subtitle}</p>
      <AddCompetitorModal labels={modalLabels} categoryLabels={categoryLabels} />
    </div>
  )
}
