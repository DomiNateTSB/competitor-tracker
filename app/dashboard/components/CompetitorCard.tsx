'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCompetitor } from '@/app/dashboard/actions'

interface ChangeEvent {
  id: string
  event_type: string
  severity: string
  summary: string
  detected_at: string
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

const categoryLabels: Record<string, string> = {
  restaurant: 'Restaurant / Café',
  salon: 'Hair salon',
  dentist: 'Dentist',
  car_repair: 'Car repair',
  gym: 'Gym',
  real_estate: 'Real estate',
  retail: 'Retail',
  construction: 'Construction',
  electrician: 'Electrician',
  plumber: 'Plumber',
  other: 'Other',
}

const severityConfig: Record<string, { dot: string; badge: string; label: string }> = {
  high: {
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-100',
    label: 'High',
  },
  medium: {
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    label: 'Medium',
  },
  low: {
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    label: 'Low',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

export default function CompetitorCard({
  competitor,
  events,
}: {
  competitor: Competitor
  events: ChangeEvent[]
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

  return (
    <div className={`bg-white rounded-xl border transition-shadow ${hasChanges ? 'border-zinc-200/80 shadow-sm' : 'border-zinc-200/80'}`}>
      <div className="px-5 py-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-sm shrink-0 border border-indigo-100/60">
          {competitor.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-zinc-900 truncate">{competitor.name}</p>
            {hasChanges && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-medium text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                {events.length} change{events.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {competitor.category && (
              <span className="text-[12px] text-zinc-400">{categoryLabels[competitor.category] ?? competitor.category}</span>
            )}
            {competitor.website_url && (
              <a
                href={competitor.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-indigo-500 hover:text-indigo-700 hover:underline transition-colors"
              >
                {getDomain(competitor.website_url)}
              </a>
            )}
            {competitor.last_checked_at && (
              <span className="text-[12px] text-zinc-300">
                Checked {formatDate(competitor.last_checked_at)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {hasChanges && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-[12px] text-zinc-400 hover:text-zinc-600 px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              {expanded ? 'Hide' : 'View changes'}
            </button>
          )}
          {competitor.website_url && (
            <button
              onClick={handleCheck}
              disabled={checking}
              className="text-[12px] bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 font-medium"
            >
              {checking ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></span>
                  Checking
                </span>
              ) : 'Check now'}
            </button>
          )}
          <form action={deleteCompetitor.bind(null, competitor.id)}>
            <button
              type="submit"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-300 hover:text-red-400 hover:bg-red-50 transition-colors"
              title="Remove competitor"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3h9M5 3V2h3v1M4 3l.5 7.5h4L9 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Inline result */}
      {result && (
        <div className={`mx-5 mb-3 px-3 py-2 rounded-lg border text-[12px] font-medium ${
          result.status === 'changed' ? 'bg-amber-50 border-amber-100 text-amber-700' :
          result.status === 'error' ? 'bg-red-50 border-red-100 text-red-600' :
          'bg-emerald-50 border-emerald-100 text-emerald-700'
        }`}>
          {result.message}
        </div>
      )}

      {/* Change events */}
      {expanded && recentEvents.length > 0 && (
        <div className="border-t border-zinc-100 px-5 py-3 space-y-2">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Change history</p>
          {recentEvents.map(event => {
            const cfg = severityConfig[event.severity] ?? severityConfig.low
            return (
              <div key={event.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border ${cfg.badge}`}>
                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${cfg.dot}`}></span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px]">{event.summary}</p>
                  <p className="text-[11px] opacity-60 mt-0.5">{formatDate(event.detected_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
