import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AddCompetitorModal from '@/app/dashboard/components/AddCompetitorModal'
import CompetitorCard from '@/app/dashboard/components/CompetitorCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const competitorIds = competitors?.map(c => c.id) ?? []
  const { data: events } = competitorIds.length > 0
    ? await supabase
        .from('change_events')
        .select('*')
        .in('competitor_id', competitorIds)
        .order('detected_at', { ascending: false })
        .limit(100)
    : { data: [] }

  const eventsByCompetitor = (events ?? []).reduce((acc, e) => {
    acc[e.competitor_id] = acc[e.competitor_id] ?? []
    acc[e.competitor_id].push(e)
    return acc
  }, {} as Record<string, typeof events>)

  const totalChanges = (events ?? []).length
  const checkedCount = competitors?.filter(c => c.last_checked_at).length ?? 0

  return (
    <div className="px-8 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#dce8ff]">Competitors</h1>
          <p className="text-sm text-[#4d6a8a] mt-0.5">Monitor website changes and updates</p>
        </div>
        <AddCompetitorModal />
      </div>

      {(competitors?.length ?? 0) > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Tracked" value={competitors?.length ?? 0} />
          <StatCard label="Checked" value={checkedCount} />
          <StatCard label="Changes detected" value={totalChanges} highlight={totalChanges > 0} />
        </div>
      )}

      {!competitors || competitors.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {competitors.map((c) => (
            <CompetitorCard
              key={c.id}
              competitor={c}
              events={eventsByCompetitor[c.id] ?? []}
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

function EmptyState() {
  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] p-14 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#071018] border border-[#182b45] flex items-center justify-center mx-auto mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#364f6e" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="6" stroke="#364f6e" strokeWidth="1.5"/>
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[#dce8ff] mb-1">No competitors yet</h3>
      <p className="text-sm text-[#4d6a8a] mb-6 max-w-xs mx-auto">
        Add a competitor to start monitoring their website for changes.
      </p>
      <AddCompetitorModal />
    </div>
  )
}
