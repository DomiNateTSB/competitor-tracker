import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export const dynamic = 'force-dynamic'

interface ChangeEvent {
  id: string
  event_type: string
  severity: string
  summary: string
  detected_at: string
  details: { added: string; removed: string; changeRatio: number } | null
}

const severityConfig = {
  high:   { dot: 'bg-red-500',   bg: 'bg-red-950/40',   border: 'border-red-800/40',   text: 'text-red-400',   badge: 'High' },
  medium: { dot: 'bg-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-700/40', text: 'text-amber-400', badge: 'Medium' },
  low:    { dot: 'bg-blue-400',  bg: 'bg-blue-950/40',  border: 'border-blue-800/40',  text: 'text-blue-400',  badge: 'Low' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const supabase = createAdminClient()
  const { data: competitor } = await supabase
    .from('competitors')
    .select('name')
    .eq('share_token', token)
    .single()
  if (!competitor) return { title: 'Report not found' }
  return { title: `${competitor.name} — Change Report | Rivalkollen` }
}

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: competitor } = await supabase
    .from('competitors')
    .select('id, name, website_url, created_at')
    .eq('share_token', token)
    .single()

  if (!competitor) notFound()

  const { data: events } = await supabase
    .from('change_events')
    .select('*')
    .eq('competitor_id', competitor.id)
    .order('detected_at', { ascending: false })
    .limit(200)

  return (
    <div className="min-h-screen bg-[#07101f] text-[#dce8ff]">
      {/* Header */}
      <header className="border-b border-[#182b45] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Rivalkollen" className="h-7" />
        </div>
        <a
          href="/"
          className="text-[12px] text-[#4f74ff] hover:text-[#7a96ff] transition-colors"
        >
          rivalkollen.se
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Competitor info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#4f74ff]/10 border border-[#4f74ff]/20 flex items-center justify-center text-[#4f74ff] font-semibold text-lg shrink-0">
            {competitor.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#dce8ff]">{competitor.name}</h1>
            <div className="flex items-center gap-3 mt-0.5">
              {competitor.website_url && (
                <a href={competitor.website_url} target="_blank" rel="noopener noreferrer"
                  className="text-[13px] text-[#4f74ff] hover:text-[#7a96ff] transition-colors">
                  {getDomain(competitor.website_url)}
                </a>
              )}
              <span className="text-[12px] text-[#364f6e]">Tracking since {formatDate(competitor.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4">
            <p className="text-[11px] font-medium text-[#364f6e] uppercase tracking-wider mb-1">Total Changes</p>
            <p className={`text-[18px] font-semibold ${(events?.length ?? 0) > 0 ? 'text-[#4f74ff]' : 'text-[#dce8ff]'}`}>{events?.length ?? 0}</p>
          </div>
          <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4">
            <p className="text-[11px] font-medium text-[#364f6e] uppercase tracking-wider mb-1">Last Change</p>
            <p className="text-[18px] font-semibold text-[#dce8ff]">
              {events && events.length > 0 ? formatDate(events[0].detected_at) : '—'}
            </p>
          </div>
        </div>

        {/* Change history */}
        <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest mb-3">
          Change History ({events?.length ?? 0})
        </p>

        {(!events || events.length === 0) ? (
          <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-6 py-12 text-center">
            <p className="text-[14px] text-[#4d6a8a]">No changes detected yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.map((event: ChangeEvent) => {
              const cfg = severityConfig[event.severity as keyof typeof severityConfig] ?? severityConfig.low
              return (
                <div key={event.id} className={`rounded-xl border px-4 py-3.5 ${cfg.bg} ${cfg.border}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-[5px] shrink-0 ${cfg.dot}`} />
                      <div>
                        <p className={`text-[14px] font-medium ${cfg.text}`}>{event.summary}</p>
                        <p className="text-[12px] text-[#364f6e] mt-0.5">{formatDate(event.detected_at)}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider shrink-0 ${cfg.text}`}>{cfg.badge}</span>
                  </div>
                  {event.details && (event.details.added || event.details.removed) && (
                    <div className="mt-3 space-y-2">
                      {event.details.removed && (
                        <div className="bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2.5">
                          <p className="text-[10px] font-semibold text-red-400/60 uppercase tracking-widest mb-1.5">Removed</p>
                          <p className="text-[12px] text-red-300/80 leading-relaxed font-mono break-words">
                            {event.details.removed.slice(0, 500)}{event.details.removed.length > 500 ? '…' : ''}
                          </p>
                        </div>
                      )}
                      {event.details.added && (
                        <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-lg px-3 py-2.5">
                          <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest mb-1.5">Added</p>
                          <p className="text-[12px] text-emerald-300/80 leading-relaxed font-mono break-words">
                            {event.details.added.slice(0, 500)}{event.details.added.length > 500 ? '…' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-center text-[12px] text-[#364f6e]">
          Generated by <a href="/" className="text-[#4f74ff] hover:underline">Rivalkollen</a> — automated competitor monitoring
        </p>
      </main>
    </div>
  )
}
