'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ActivityChart from '@/app/dashboard/components/ActivityChart'

interface ChangeEvent {
  id: string
  event_type: string
  severity: string
  summary: string
  detected_at: string
  details: { added: string; removed: string; changeRatio: number } | null
}

interface Competitor {
  id: string
  name: string
  website_url: string | null
  google_maps_url: string | null
  category: string | null
  created_at: string
  last_checked_at: string | null
}

const severityConfig = {
  high:   { dot: 'bg-red-500',   bg: 'bg-red-950/40',    border: 'border-red-800/40',    text: 'text-red-400',   badge: 'High' },
  medium: { dot: 'bg-amber-400', bg: 'bg-amber-950/40',  border: 'border-amber-700/40',  text: 'text-amber-400', badge: 'Medium' },
  low:    { dot: 'bg-blue-400',  bg: 'bg-blue-950/40',   border: 'border-blue-800/40',   text: 'text-blue-400',  badge: 'Low' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

function DiffView({ details }: { details: { added: string; removed: string; changeRatio: number } }) {
  const removed = details.removed?.slice(0, 500)
  const added   = details.added?.slice(0, 500)
  return (
    <div className="mt-3 space-y-2">
      {removed && (
        <div className="bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-red-400/60 uppercase tracking-widest mb-1.5">Removed</p>
          <p className="text-[12px] text-red-300/80 leading-relaxed font-mono">
            {removed}{details.removed.length > 500 ? '…' : ''}
          </p>
        </div>
      )}
      {added && (
        <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest mb-1.5">Added</p>
          <p className="text-[12px] text-emerald-300/80 leading-relaxed font-mono">
            {added}{details.added.length > 500 ? '…' : ''}
          </p>
        </div>
      )}
      <p className="text-[11px] text-[#364f6e]">
        Change ratio: {(details.changeRatio * 100).toFixed(1)}%
      </p>
    </div>
  )
}

function EventRow({ event }: { event: ChangeEvent }) {
  const [showDiff, setShowDiff] = useState(false)
  const cfg = severityConfig[event.severity as keyof typeof severityConfig] ?? severityConfig.low
  const hasDiff = event.details && (event.details.added || event.details.removed)

  return (
    <div className={`rounded-xl border px-4 py-3.5 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`w-2 h-2 rounded-full mt-[5px] shrink-0 ${cfg.dot}`} />
          <div>
            <p className={`text-[14px] font-medium ${cfg.text}`}>{event.summary}</p>
            <p className="text-[12px] text-[#364f6e] mt-0.5">{formatDate(event.detected_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.text}`}>{cfg.badge}</span>
          {hasDiff && (
            <button
              onClick={() => setShowDiff(v => !v)}
              className="text-[11px] text-[#4d6a8a] hover:text-[#dce8ff] border border-[#182b45] hover:border-[#243d5c] px-2 py-1 rounded-md transition-colors"
            >
              {showDiff ? 'Hide diff' : 'Show diff'}
            </button>
          )}
        </div>
      </div>
      {showDiff && event.details && <DiffView details={event.details} />}
    </div>
  )
}

function StatBlock({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4">
      <p className="text-[11px] font-medium text-[#364f6e] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-semibold truncate ${highlight ? 'text-[#4f74ff]' : 'text-[#dce8ff]'}`}>{value}</p>
    </div>
  )
}

export default function CompetitorDetailView({
  competitor,
  events,
  chartData,
}: {
  competitor: Competitor
  events: ChangeEvent[]
  chartData: { date: string; count: number; fullDate: string }[]
}) {
  const [checking, setChecking] = useState(false)
  const [result, setResult]     = useState<{ status: string; message: string } | null>(null)
  const router = useRouter()

  async function handleCheck() {
    setChecking(true)
    setResult(null)
    try {
      const res  = await fetch(`/api/scrape/${competitor.id}`, { method: 'POST' })
      const data = await res.json()
      setResult({ status: res.ok ? data.status : 'error', message: data.message || data.error })
      router.refresh()
    } catch {
      setResult({ status: 'error', message: 'Something went wrong' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] transition-colors mb-5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#4f74ff]/10 border border-[#4f74ff]/20 flex items-center justify-center text-[#4f74ff] font-semibold text-base shrink-0">
            {competitor.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#dce8ff]">{competitor.name}</h1>
            {competitor.website_url && (
              <a href={competitor.website_url} target="_blank" rel="noopener noreferrer"
                className="text-[13px] text-[#4f74ff] hover:text-[#7a96ff] transition-colors">
                {getDomain(competitor.website_url)}
              </a>
            )}
          </div>
        </div>

        {competitor.website_url && (
          <button onClick={handleCheck} disabled={checking}
            className="flex items-center gap-2 text-[13px] bg-[#071018] hover:bg-[#182b45] border border-[#182b45] text-[#6b85aa] px-4 py-2 rounded-lg transition-colors disabled:opacity-40 font-medium shrink-0">
            {checking ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#182b45] border-t-[#4f74ff] rounded-full animate-spin" />
                Checking…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M11 6.5A4.5 4.5 0 1 1 6.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M9 2h2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Check now
              </>
            )}
          </button>
        )}
      </div>

      {result && (
        <div className={`mb-5 px-3 py-2.5 rounded-lg border text-[13px] font-medium ${
          result.status === 'changed'      ? 'bg-amber-950/40 border-amber-700/40 text-amber-400' :
          result.status === 'error'        ? 'bg-red-950/40 border-red-800/40 text-red-400' :
                                             'bg-emerald-950/40 border-emerald-700/40 text-emerald-400'
        }`}>
          {result.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatBlock label="Total changes" value={events.length} highlight={events.length > 0} />
        <StatBlock label="Last checked"   value={competitor.last_checked_at ? formatDate(competitor.last_checked_at) : 'Never'} />
        <StatBlock label="Tracking since" value={formatDate(competitor.created_at)} />
      </div>

      {/* Chart */}
      {events.length > 0 && (
        <ActivityChart data={chartData} label="Changes — last 30 days" />
      )}

      {/* History */}
      <div className="mt-6">
        <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest mb-3">
          Change history ({events.length})
        </p>
        {events.length === 0 ? (
          <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-6 py-12 text-center">
            <p className="text-[14px] text-[#4d6a8a]">No changes detected yet.</p>
            <p className="text-[12px] text-[#364f6e] mt-1">Click "Check now" to run the first scan.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.map(event => <EventRow key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  )
}
