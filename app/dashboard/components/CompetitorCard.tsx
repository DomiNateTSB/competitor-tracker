'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteCompetitor } from '@/app/dashboard/actions'

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
  last_scrape_error: string | null
}

interface Labels {
  checkNow: string
  checking: string
  viewChanges: string
  hide: string
  changeHistory: string
  checkedOn: string
  change: string
  changes: string
  diff: string
  removed: string
  added: string
  statusOk: string
  statusError: string
  statusNever: string
}

const severityConfig: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  high: { dot: 'bg-red-500', bg: 'bg-red-950/40', border: 'border-red-800/40', text: 'text-red-400' },
  medium: { dot: 'bg-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-700/40', text: 'text-amber-400' },
  low: { dot: 'bg-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-800/40', text: 'text-blue-400' },
}

const categoryKeys = ['restaurant','salon','dentist','car_repair','gym','real_estate','retail','construction','electrician','plumber','other']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

function EventRow({ event, labels }: { event: ChangeEvent; labels: Pick<Labels, 'hide' | 'diff' | 'removed' | 'added'> }) {
  const [showDiff, setShowDiff] = useState(false)
  const cfg = severityConfig[event.severity] ?? severityConfig.low
  const hasDiff = event.details && (event.details.added || event.details.removed)

  return (
    <div className={`rounded-lg border px-3 py-2.5 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className={`w-2 h-2 rounded-full mt-[4px] shrink-0 ${cfg.dot}`} />
          <div>
            <p className={`text-[13px] ${cfg.text}`}>{event.summary}</p>
            <p className="text-[11px] text-[#364f6e] mt-0.5">{formatDate(event.detected_at)}</p>
          </div>
        </div>
        {hasDiff && (
          <button onClick={() => setShowDiff(v => !v)}
            className="text-[11px] text-[#4d6a8a] hover:text-[#dce8ff] border border-[#182b45] hover:border-[#243d5c] px-2 py-0.5 rounded transition-colors shrink-0">
            {showDiff ? labels.hide : labels.diff}
          </button>
        )}
      </div>
      {showDiff && event.details && (
        <div className="mt-2 space-y-1.5">
          {event.details.removed && (
            <div className="bg-red-950/30 border border-red-900/40 rounded px-2.5 py-2">
              <p className="text-[9px] font-semibold text-red-400/60 uppercase tracking-widest mb-1">{labels.removed}</p>
              <p className="text-[11px] text-red-300/80 font-mono leading-relaxed break-words">
                {event.details.removed.slice(0, 300)}{event.details.removed.length > 300 ? '…' : ''}
              </p>
            </div>
          )}
          {event.details.added && (
            <div className="bg-emerald-950/30 border border-emerald-900/40 rounded px-2.5 py-2">
              <p className="text-[9px] font-semibold text-emerald-400/60 uppercase tracking-widest mb-1">{labels.added}</p>
              <p className="text-[11px] text-emerald-300/80 font-mono leading-relaxed break-words">
                {event.details.added.slice(0, 300)}{event.details.added.length > 300 ? '…' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CompetitorCard({
  competitor,
  events,
  labels,
  categoryLabels,
}: {
  competitor: Competitor
  events: ChangeEvent[]
  labels: Labels
  categoryLabels?: Record<string, string>
}) {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<{ status: string; message: string } | null>(null)
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  async function handleCheck() {
    setChecking(true)
    setResult(null)
    try {
      const res = await fetch(`/api/scrape/${competitor.id}`, { method: 'POST' })
      const data = await res.json()
      setResult({ status: res.ok ? data.status : 'error', message: data.message || data.error })
      router.refresh()
    } catch {
      setResult({ status: 'error', message: 'Something went wrong' })
    } finally {
      setChecking(false)
    }
  }

  const recentEvents = events.slice(0, 5)
  const hasChanges = events.length > 0
  const catLabel = competitor.category
    ? (categoryLabels?.[competitor.category] ?? competitor.category)
    : null

  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] transition-colors hover:border-[#243d5c]">
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-[#4f74ff]/10 border border-[#4f74ff]/20 flex items-center justify-center text-[#4f74ff] font-semibold text-sm shrink-0">
          {competitor.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/competitors/${competitor.id}`} className="text-[14px] font-medium text-[#dce8ff] hover:text-[#7a96ff] truncate transition-colors">{competitor.name}</Link>
            {/* Status indicator */}
            {competitor.website_url && (() => {
              const hasError = !!competitor.last_scrape_error
              const neverChecked = !competitor.last_checked_at && !hasError
              const dotClass = neverChecked ? 'bg-[#364f6e]' : hasError ? 'bg-red-500' : 'bg-emerald-500'
              const tipText  = neverChecked ? labels.statusNever : hasError ? labels.statusError : labels.statusOk
              return (
                <span title={tipText} className="inline-flex items-center gap-1 text-[11px] text-[#4d6a8a]">
                  <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                </span>
              )
            })()}
            {hasChanges && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-950/50 border border-amber-700/40 text-[10px] font-medium text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                {events.length} {events.length !== 1 ? labels.changes : labels.change}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {catLabel && <span className="text-[12px] text-[#4d6a8a]">{catLabel}</span>}
            {competitor.website_url && (
              <a href={competitor.website_url} target="_blank" rel="noopener noreferrer"
                className="text-[12px] text-[#4f74ff] hover:text-[#7a96ff] hover:underline transition-colors">
                {getDomain(competitor.website_url)}
              </a>
            )}
            {competitor.last_checked_at && (
              <span className="text-[12px] text-[#364f6e]">{labels.checkedOn} {formatDate(competitor.last_checked_at)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasChanges && (
            <button onClick={() => setExpanded(v => !v)}
              className="text-[12px] text-[#4d6a8a] hover:text-[#6b85aa] px-2.5 py-1.5 rounded-lg hover:bg-[#182b45] transition-colors">
              {expanded ? labels.hide : labels.viewChanges}
            </button>
          )}
          {competitor.website_url && (
            <button onClick={handleCheck} disabled={checking}
              className="text-[12px] bg-[#071018] hover:bg-[#182b45] border border-[#182b45] text-[#6b85aa] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 font-medium">
              {checking ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-[#182b45] border-t-[#4f74ff] rounded-full animate-spin"></span>
                  {labels.checking}
                </span>
              ) : labels.checkNow}
            </button>
          )}
          <form action={deleteCompetitor.bind(null, competitor.id)}>
            <button type="submit" title="Remove"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#364f6e] hover:text-red-400 hover:bg-red-950/30 transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M5 3V2h3v1M4 3l.5 7.5h4L9 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {result && (
        <div className={`mx-5 mb-3 px-3 py-2 rounded-lg border text-[12px] font-medium ${
          result.status === 'changed' ? 'bg-amber-950/40 border-amber-700/40 text-amber-400' :
          result.status === 'error' ? 'bg-red-950/40 border-red-800/40 text-red-400' :
          'bg-emerald-950/40 border-emerald-700/40 text-emerald-400'
        }`}>
          {result.message}
        </div>
      )}

      {expanded && recentEvents.length > 0 && (
        <div className="border-t border-[#182b45] px-5 py-3 space-y-2">
          <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest mb-2">{labels.changeHistory}</p>
          {recentEvents.map(event => (
            <EventRow key={event.id} event={event} labels={labels} />
          ))}
        </div>
      )}
    </div>
  )
}

export { categoryKeys }
