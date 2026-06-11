'use client'

import { useState } from 'react'

interface DiffData { removed: string; added: string }
interface MockEvent {
  id: string
  severity: string
  summary: string
  date: string
  diff: DiffData | null
}
interface MockCompetitor {
  id: string
  name: string
  domain: string
  category: string
  lastChecked: string
  events: MockEvent[]
}
interface SeverityCfg {
  dot: string; bg: string; border: string; text: string; badge: string
}

function DiffView({ diff }: { diff: DiffData }) {
  return (
    <div className="mt-3 space-y-2">
      {diff.removed && (
        <div className="bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-red-400/60 uppercase tracking-widest mb-1.5">Removed</p>
          <p className="text-[12px] text-red-300/80 leading-relaxed font-mono">{diff.removed}</p>
        </div>
      )}
      {diff.added && (
        <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest mb-1.5">Added</p>
          <p className="text-[12px] text-emerald-300/80 leading-relaxed font-mono">{diff.added}</p>
        </div>
      )}
    </div>
  )
}

function EventRow({ event, cfg }: { event: MockEvent; cfg: SeverityCfg }) {
  const [showDiff, setShowDiff] = useState(false)
  return (
    <div className={`rounded-xl border px-4 py-3 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`w-2 h-2 rounded-full mt-[5px] shrink-0 ${cfg.dot}`} />
          <div>
            <p className={`text-[13px] font-medium ${cfg.text}`}>{event.summary}</p>
            <p className="text-[11px] text-[#364f6e] mt-0.5">{event.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.text}`}>{cfg.badge}</span>
          {event.diff && (
            <button onClick={() => setShowDiff(v => !v)}
              className="text-[11px] text-[#4d6a8a] hover:text-[#dce8ff] border border-[#182b45] hover:border-[#243d5c] px-2 py-1 rounded-md transition-colors">
              {showDiff ? 'Hide diff' : 'Show diff'}
            </button>
          )}
        </div>
      </div>
      {showDiff && event.diff && <DiffView diff={event.diff} />}
    </div>
  )
}

function CompetitorCard({
  competitor,
  severityConfig,
}: {
  competitor: MockCompetitor
  severityConfig: Record<string, SeverityCfg>
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] transition-colors hover:border-[#243d5c]">
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-[#4f74ff]/10 border border-[#4f74ff]/20 flex items-center justify-center text-[#4f74ff] font-semibold text-sm shrink-0">
          {competitor.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-[#dce8ff]">{competitor.name}</p>
            {competitor.events.length > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-950/50 border border-amber-700/40 text-[10px] font-medium text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                {competitor.events.length} changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[12px] text-[#4d6a8a]">{competitor.category}</span>
            <span className="text-[12px] text-[#4f74ff]">{competitor.domain}</span>
            <span className="text-[12px] text-[#364f6e]">Checked {competitor.lastChecked}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {competitor.events.length > 0 && (
            <button onClick={() => setExpanded(v => !v)}
              className="text-[12px] text-[#4d6a8a] hover:text-[#6b85aa] px-2.5 py-1.5 rounded-lg hover:bg-[#182b45] transition-colors">
              {expanded ? 'Hide' : 'View changes'}
            </button>
          )}
          <button disabled
            className="text-[12px] bg-[#071018] border border-[#182b45] text-[#6b85aa]/50 px-3 py-1.5 rounded-lg font-medium cursor-default">
            Check now
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#182b45] px-5 py-3 space-y-2">
          <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest mb-2">Change history</p>
          {competitor.events.map(event => (
            <EventRow
              key={event.id}
              event={event}
              cfg={severityConfig[event.severity] ?? severityConfig.low}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DemoInteractive({
  competitors,
  severityConfig,
}: {
  competitors: MockCompetitor[]
  severityConfig: Record<string, SeverityCfg>
}) {
  return (
    <div className="space-y-3">
      {competitors.map(c => (
        <CompetitorCard key={c.id} competitor={c} severityConfig={severityConfig} />
      ))}
    </div>
  )
}
