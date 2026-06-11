'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ActivityChart from '@/app/dashboard/components/ActivityChart'
import { updateNotes, updateAlertPrefs, generateShareToken, revokeShareToken } from './actions'

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
  notes?: string | null
  alert_enabled?: boolean | null
  alert_min_severity?: string | null
  share_token?: string | null
}

interface DetailLabels {
  back: string
  exportCsv: string
  totalChanges: string
  lastChecked: string
  trackingSince: string
  historyTitle: string
  showDiff: string
  hideDiff: string
  removed: string
  added: string
  changeRatio: string
  never: string
  noChangesTitle: string
  noChangesDesc: string
  firstCheckTitle: string
  firstCheckDesc: string
  step1: string
  step2: string
  step3: string
  notes: string
  notesSaving: string
  notesSaved: string
  notesPlaceholder: string
  checkNow: string
  checking: string
  alertsTitle: string
  alertsEnabled: string
  alertsSeverity: string
  alertsAll: string
  alertsMediumHigh: string
  alertsHighOnly: string
  share: string
  shareCopied: string
  shareRevoke: string
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

function DiffView({ details, labels }: { details: { added: string; removed: string; changeRatio: number }; labels: Pick<DetailLabels, 'removed' | 'added' | 'changeRatio'> }) {
  const removed = details.removed?.slice(0, 500)
  const added   = details.added?.slice(0, 500)
  return (
    <div className="mt-3 space-y-2">
      {removed && (
        <div className="bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-red-400/60 uppercase tracking-widest mb-1.5">{labels.removed}</p>
          <p className="text-[12px] text-red-300/80 leading-relaxed font-mono break-words">
            {removed}{details.removed.length > 500 ? '…' : ''}
          </p>
        </div>
      )}
      {added && (
        <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest mb-1.5">{labels.added}</p>
          <p className="text-[12px] text-emerald-300/80 leading-relaxed font-mono break-words">
            {added}{details.added.length > 500 ? '…' : ''}
          </p>
        </div>
      )}
      <p className="text-[11px] text-[#364f6e]">{labels.changeRatio}: {(details.changeRatio * 100).toFixed(1)}%</p>
    </div>
  )
}

function EventRow({ event, labels }: { event: ChangeEvent; labels: Pick<DetailLabels, 'showDiff' | 'hideDiff' | 'removed' | 'added' | 'changeRatio'> }) {
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
              {showDiff ? labels.hideDiff : labels.showDiff}
            </button>
          )}
        </div>
      </div>
      {showDiff && event.details && <DiffView details={event.details} labels={labels} />}
    </div>
  )
}

function StatBlock({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4">
      <p className="text-[11px] font-medium text-[#364f6e] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[18px] font-semibold truncate ${highlight ? 'text-[#4f74ff]' : 'text-[#dce8ff]'}`}>{value}</p>
    </div>
  )
}

function EmptyState({ neverChecked, labels }: { neverChecked: boolean; labels: DetailLabels }) {
  if (neverChecked) {
    return (
      <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-6 py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#071018] border border-[#182b45] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17 10A7 7 0 1 1 10 3" stroke="#4f74ff" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 3h3.5v3.5" stroke="#4f74ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-[15px] font-semibold text-[#dce8ff] mb-2">{labels.firstCheckTitle}</h3>
        <p className="text-[13px] text-[#4d6a8a] max-w-xs mx-auto leading-relaxed">{labels.firstCheckDesc}</p>
        <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-[#364f6e]">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#4f74ff]" />{labels.step1}</span>
          <span className="text-[#182b45]">→</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#4f74ff]" />{labels.step2}</span>
          <span className="text-[#182b45]">→</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#4f74ff]" />{labels.step3}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-6 py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-800/30 flex items-center justify-center mx-auto mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10l4.5 4.5L16 6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="text-[15px] font-semibold text-[#dce8ff] mb-2">{labels.noChangesTitle}</h3>
      <p className="text-[13px] text-[#4d6a8a] max-w-xs mx-auto leading-relaxed">{labels.noChangesDesc}</p>
    </div>
  )
}

function NotesEditor({ competitorId, initialNotes, labels }: { competitorId: string; initialNotes: string; labels: Pick<DetailLabels, 'notes' | 'notesSaving' | 'notesSaved' | 'notesPlaceholder'> }) {
  const [notes, setNotes]   = useState(initialNotes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function save(value: string) {
    setSaving(true)
    setSaved(false)
    await updateNotes(competitorId, value)
    setSaving(false)
    setSaved(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest">{labels.notes}</p>
        {saving && <span className="text-[11px] text-[#4d6a8a]">{labels.notesSaving}</span>}
        {saved && !saving && <span className="text-[11px] text-emerald-500">{labels.notesSaved}</span>}
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        onBlur={e => save(e.target.value)}
        placeholder={labels.notesPlaceholder}
        rows={4}
        className="w-full bg-[#0b1628] border border-[#182b45] focus:border-[#4f74ff] focus:ring-2 focus:ring-[#4f74ff]/20 rounded-xl px-4 py-3 text-[13px] text-[#dce8ff] placeholder-[#2d4a68] resize-none outline-none transition-colors"
      />
    </div>
  )
}

function AlertPrefsSection({
  competitorId,
  initialEnabled,
  initialSeverity,
  labels,
}: {
  competitorId: string
  initialEnabled: boolean
  initialSeverity: string
  labels: Pick<DetailLabels, 'alertsTitle' | 'alertsEnabled' | 'alertsSeverity' | 'alertsAll' | 'alertsMediumHigh' | 'alertsHighOnly'>
}) {
  const [enabled,  setEnabled]  = useState(initialEnabled)
  const [severity, setSeverity] = useState(initialSeverity)

  async function handleToggle(val: boolean) {
    setEnabled(val)
    await updateAlertPrefs(competitorId, val, severity)
  }

  async function handleSeverity(val: string) {
    setSeverity(val)
    await updateAlertPrefs(competitorId, enabled, val)
  }

  return (
    <div className="mt-6 bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4">
      <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest mb-4">{labels.alertsTitle}</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#8ba4c0]">{labels.alertsEnabled}</span>
          <button
            onClick={() => handleToggle(!enabled)}
            className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-[#4f74ff]' : 'bg-[#182b45]'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
        {enabled && (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#8ba4c0]">{labels.alertsSeverity}</span>
            <select
              value={severity}
              onChange={e => handleSeverity(e.target.value)}
              className="bg-[#071018] border border-[#182b45] text-[#dce8ff] text-[12px] rounded-lg px-3 py-1.5 outline-none focus:border-[#4f74ff]"
            >
              <option value="all">{labels.alertsAll}</option>
              <option value="medium_high">{labels.alertsMediumHigh}</option>
              <option value="high">{labels.alertsHighOnly}</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

function ShareSection({
  competitorId,
  initialToken,
  labels,
}: {
  competitorId: string
  initialToken: string | null | undefined
  labels: Pick<DetailLabels, 'share' | 'shareCopied' | 'shareRevoke'>
}) {
  const [token,   setToken]   = useState<string | null>(initialToken ?? null)
  const [copied,  setCopied]  = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleShare() {
    setLoading(true)
    const t = await generateShareToken(competitorId)
    setToken(t)
    if (t) {
      const url = `${window.location.origin}/report/${t}`
      await navigator.clipboard.writeText(url).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
    setLoading(false)
  }

  async function handleRevoke() {
    setLoading(true)
    await revokeShareToken(competitorId)
    setToken(null)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      {token ? (
        <>
          <button
            onClick={handleShare}
            disabled={loading}
            className="flex items-center gap-1.5 text-[12px] text-emerald-400 border border-emerald-800/40 hover:border-emerald-700 bg-emerald-950/30 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5.5 4.8l1 .6M5.5 7.2l1-.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {copied ? labels.shareCopied : labels.share}
          </button>
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="text-[12px] text-[#4d6a8a] hover:text-red-400 border border-[#182b45] hover:border-red-900/40 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {labels.shareRevoke}
          </button>
        </>
      ) : (
        <button
          onClick={handleShare}
          disabled={loading}
          className="flex items-center gap-1.5 text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] border border-[#182b45] hover:border-[#243d5c] px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5.5 4.8l1 .6M5.5 7.2l1-.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {loading ? '…' : labels.share}
        </button>
      )}
    </div>
  )
}

function exportCsv(events: ChangeEvent[], competitorName: string, removedLabel: string, addedLabel: string, changeRatioLabel: string) {
  const rows = [
    ['Date', 'Summary', 'Severity', `${changeRatioLabel} (%)`],
    ...events.map(e => [
      formatDate(e.detected_at),
      e.summary,
      e.severity,
      e.details ? (e.details.changeRatio * 100).toFixed(1) : '',
    ]),
  ]
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${competitorName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-changes.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function CompetitorDetailView({
  competitor,
  events,
  chartData,
  labels,
}: {
  competitor: Competitor
  events: ChangeEvent[]
  chartData: { date: string; count: number; fullDate: string }[]
  labels: DetailLabels
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

  const neverChecked = !competitor.last_checked_at

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] transition-colors mb-5">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {labels.back}
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

        <div className="flex items-center gap-2 shrink-0">
          <ShareSection
            competitorId={competitor.id}
            initialToken={competitor.share_token}
            labels={labels}
          />
          {events.length > 0 && (
            <button
              onClick={() => exportCsv(events, competitor.name, labels.removed, labels.added, labels.changeRatio)}
              className="flex items-center gap-1.5 text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] border border-[#182b45] hover:border-[#243d5c] px-3 py-2 rounded-lg transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 5.5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {labels.exportCsv}
            </button>
          )}
          {competitor.website_url && (
            <button onClick={handleCheck} disabled={checking}
              className="flex items-center gap-2 text-[13px] bg-[#071018] hover:bg-[#182b45] border border-[#182b45] text-[#6b85aa] px-4 py-2 rounded-lg transition-colors disabled:opacity-40 font-medium">
              {checking ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#182b45] border-t-[#4f74ff] rounded-full animate-spin" />
                  {labels.checking}
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M11 6.5A4.5 4.5 0 1 1 6.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M9 2h2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {labels.checkNow}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className={`mb-5 px-3 py-2.5 rounded-lg border text-[13px] font-medium ${
          result.status === 'changed'  ? 'bg-amber-950/40 border-amber-700/40 text-amber-400' :
          result.status === 'error'    ? 'bg-red-950/40 border-red-800/40 text-red-400' :
                                         'bg-emerald-950/40 border-emerald-700/40 text-emerald-400'
        }`}>
          {result.message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatBlock label={labels.totalChanges}  value={events.length} highlight={events.length > 0} />
        <StatBlock label={labels.lastChecked}   value={competitor.last_checked_at ? formatDate(competitor.last_checked_at) : labels.never} />
        <StatBlock label={labels.trackingSince} value={formatDate(competitor.created_at)} />
      </div>

      {events.length > 0 && (
        <ActivityChart data={chartData} label={labels.historyTitle} />
      )}

      {/* History */}
      <div className="mt-6">
        <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest mb-3">
          {labels.historyTitle} ({events.length})
        </p>
        {events.length === 0
          ? <EmptyState neverChecked={neverChecked} labels={labels} />
          : (
            <div className="space-y-2.5">
              {events.map(event => <EventRow key={event.id} event={event} labels={labels} />)}
            </div>
          )
        }
      </div>

      {/* Alert preferences */}
      <AlertPrefsSection
        competitorId={competitor.id}
        initialEnabled={competitor.alert_enabled ?? true}
        initialSeverity={competitor.alert_min_severity ?? 'all'}
        labels={labels}
      />

      {/* Notes */}
      <NotesEditor
        competitorId={competitor.id}
        initialNotes={competitor.notes ?? ''}
        labels={labels}
      />
    </div>
  )
}
