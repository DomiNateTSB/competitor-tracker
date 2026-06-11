import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import AddCompetitorModal from '@/app/dashboard/components/AddCompetitorModal'
import CompetitorCard from '@/app/dashboard/components/CompetitorCard'
import OnboardingBanner from '@/app/dashboard/components/OnboardingBanner'
import ActivityChart from '@/app/dashboard/components/ActivityChart'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const t = await getTranslations('dashboard.competitors')
  const tm = await getTranslations('dashboard.modal')
  const tc = await getTranslations('dashboard.categories')

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
        .limit(100)
    : { data: [] }

  const eventsByCompetitor = (allEvents ?? []).reduce((acc, e) => {
    acc[e.competitor_id] = acc[e.competitor_id] ?? []
    acc[e.competitor_id].push(e)
    return acc
  }, {} as Record<string, typeof allEvents>)

  const totalChanges = (allEvents ?? []).length
  const checkedCount = competitors?.filter(c => c.last_checked_at).length ?? 0

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
    const date = d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
    return { date, count, fullDate }
  })

  const cardLabels = {
    checkNow: t('checkNow'),
    checking: t('checking'),
    viewChanges: t('viewChanges'),
    hide: t('hide'),
    changeHistory: t('changeHistory'),
    checkedOn: t('checkedOn'),
    change: t('change'),
    changes: t('changes'),
    diff: t('diff'),
    removed: t('removed'),
    added: t('added'),
  }

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

  const hasCompetitors = (competitors?.length ?? 0) > 0

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#dce8ff]">{t('title')}</h1>
          <p className="text-sm text-[#4d6a8a] mt-0.5">{t('subtitle')}</p>
        </div>
        <AddCompetitorModal labels={modalLabels} categoryLabels={categoryLabels} />
      </div>

      {!hasCompetitors && <OnboardingBanner />}

      {hasCompetitors && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <StatCard label={t('tracked')} value={competitors?.length ?? 0} />
            <StatCard label={t('checked')} value={checkedCount} />
            <StatCard label={t('changesDetected')} value={totalChanges} highlight={totalChanges > 0} />
          </div>
          <ActivityChart data={chartData} label={t('last30Days')} />
        </>
      )}

      {!hasCompetitors ? (
        <EmptyState
          title={t('emptyTitle')}
          subtitle={t('emptySubtitle')}
          modalLabels={modalLabels}
          categoryLabels={categoryLabels}
        />
      ) : (
        <div className="space-y-3">
          {competitors!.map((c) => (
            <CompetitorCard
              key={c.id}
              competitor={c}
              events={eventsByCompetitor[c.id] ?? []}
              labels={cardLabels}
              categoryLabels={categoryLabels}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4">
      <p className="text-[11px] font-medium text-[#364f6e] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${highlight ? 'text-[#4f74ff]' : 'text-[#dce8ff]'}`}>{value}</p>
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
