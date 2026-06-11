import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

interface ChangeEvent {
  id: string
  competitor_id: string
  event_type: string
  severity: string
  summary: string
  detected_at: string
}

const severityConfig: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  high: { dot: 'bg-red-500', bg: 'bg-red-950/40', border: 'border-red-800/40', text: 'text-red-400' },
  medium: { dot: 'bg-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-700/40', text: 'text-amber-400' },
  low: { dot: 'bg-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-800/40', text: 'text-blue-400' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const t = await getTranslations('dashboard.activity')

  const { data: competitors } = await supabase
    .from('competitors')
    .select('id, name')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const competitorIds = competitors?.map((c: { id: string }) => c.id) ?? []
  const competitorMap: Record<string, string> = Object.fromEntries(
    (competitors ?? []).map((c: { id: string; name: string }) => [c.id, c.name])
  )

  let events: ChangeEvent[] = []

  if (competitorIds.length > 0) {
    const { data } = await supabase
      .from('change_events')
      .select('*')
      .in('competitor_id', competitorIds)
      .order('detected_at', { ascending: false })
      .limit(200)
    events = (data ?? []) as ChangeEvent[]
  }

  const grouped: Record<string, ChangeEvent[]> = events.reduce((acc, e) => {
    const day = new Date(e.detected_at).toLocaleDateString('sv-SE', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    if (!acc[day]) acc[day] = []
    acc[day].push(e)
    return acc
  }, {} as Record<string, ChangeEvent[]>)

  const severityLabels: Record<string, string> = {
    high: t('high'),
    medium: t('medium'),
    low: t('low'),
  }

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#dce8ff]">{t('title')}</h1>
        <p className="text-sm text-[#4d6a8a] mt-0.5">{t('subtitle')}</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-[#0b1628] rounded-xl border border-[#182b45] p-14 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#071018] border border-[#182b45] flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polyline points="2,10 5,6 9,12 13,5 17,9" stroke="#364f6e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#dce8ff] mb-1">{t('emptyTitle')}</h3>
          <p className="text-sm text-[#4d6a8a] max-w-xs mx-auto">{t('emptySubtitle')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([day, dayEvents]) => (
            <div key={day}>
              <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest mb-3">{day}</p>
              <div className="space-y-2">
                {dayEvents.map(event => {
                  const cfg = severityConfig[event.severity] ?? severityConfig.low
                  const competitorName = competitorMap[event.competitor_id] ?? 'Unknown'
                  return (
                    <div key={event.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[13px] font-medium ${cfg.text}`}>{competitorName}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                            {severityLabels[event.severity] ?? event.severity}
                          </span>
                        </div>
                        <p className={`text-[13px] mt-0.5 ${cfg.text} opacity-80`}>{event.summary}</p>
                        <p className="text-[11px] text-[#364f6e] mt-1">{formatDate(event.detected_at)}</p>
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
