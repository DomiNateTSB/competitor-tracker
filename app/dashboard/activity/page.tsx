import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const severityConfig: Record<string, { dot: string; badge: string; label: string }> = {
  high: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-100', label: 'High' },
  medium: { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Medium' },
  low: { dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Low' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: competitors } = await supabase
    .from('competitors')
    .select('id, name')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const competitorIds = competitors?.map(c => c.id) ?? []
  const competitorMap = Object.fromEntries((competitors ?? []).map(c => [c.id, c.name]))

  const { data: events } = competitorIds.length > 0
    ? await supabase
        .from('change_events')
        .select('*')
        .in('competitor_id', competitorIds)
        .order('detected_at', { ascending: false })
        .limit(200)
    : { data: [] }

  const grouped = (events ?? []).reduce((acc, e) => {
    const day = new Date(e.detected_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })
    acc[day] = acc[day] ?? []
    acc[day].push(e)
    return acc
  }, {} as Record<string, typeof events>)

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900">Activity</h1>
        <p className="text-sm text-zinc-400 mt-0.5">All detected changes across your competitors</p>
      </div>

      {!events || events.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200/80 p-14 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="2,10 5,6 9,12 13,5 17,9" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">No activity yet</h3>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto">
            Changes will appear here once you start checking your competitors.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([day, dayEvents]) => (
            <div key={day}>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">{day}</p>
              <div className="space-y-2">
                {(dayEvents ?? []).map(event => {
                  const cfg = severityConfig[event.severity] ?? severityConfig.low
                  const competitorName = competitorMap[event.competitor_id] ?? 'Unknown'
                  return (
                    <div key={event.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border bg-white ${cfg.badge}`}>
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-medium">{competitorName}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[13px] mt-0.5 opacity-80">{event.summary}</p>
                        <p className="text-[11px] opacity-50 mt-1">{formatDate(event.detected_at)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
