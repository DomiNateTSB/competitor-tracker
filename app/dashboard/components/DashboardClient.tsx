'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CompetitorCard from './CompetitorCard'
import ActivityChart from './ActivityChart'
import DiscoverModal from './DiscoverModal'
import AddCompetitorModal from './AddCompetitorModal'

interface ChangeEvent {
  id: string
  competitor_id: string
  event_type: string
  severity: string
  summary: string
  detected_at: string
  reviewed_at: string | null
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
  checkNow: string; checking: string; viewChanges: string; hide: string
  changeHistory: string; checkedOn: string; change: string; changes: string
  diff: string; removed: string; added: string
  statusOk: string; statusError: string; statusNever: string
  checkAll: string; checkingAll: string; allChecked: string; checkAllDone: string
  confirmDelete: string; confirmDeleteDesc: string; confirmYes: string; confirmNo: string
  search: string; sortBy: string; sortRecent: string; sortChanged: string
  sortChecked: string; sortName: string; filterAll: string; noResults: string
  markReviewed: string; reviewed: string; loadMore: string
  unreviewedChanges: string; activityLabel: string
  notifTitle: string; notifEmpty: string
  tracked: string; checked: string; changesDetected: string; last30Days: string
}

export default function DashboardClient({
  competitors,
  eventsByCompetitor,
  allEvents,
  chartData,
  categoryLabels,
  cardLabels,
  labels,
  statLabels,
  discoverLabels,
  modalLabels,
}: {
  competitors: Competitor[]
  eventsByCompetitor: Record<string, ChangeEvent[]>
  allEvents: ChangeEvent[]
  chartData: { date: string; count: number; fullDate: string }[]
  categoryLabels: Record<string, string>
  cardLabels: Labels
  labels: Labels
  statLabels: { tracked: string; checked: string; changesDetected: string; last30Days: string }
  discoverLabels: {
    title: string; subtitle: string; locationLabel: string; locationPlaceholder: string
    categoryLabel: string; allCategories: string; searchBtn: string; trackedLabel: string
    suggestedLabel: string; openMaps: string; addCompetitor: string; relatedLabel: string
    tipTitle: string; tip1: string; tip2: string; tip3: string; noLocation: string; mapsQueryNote: string
  }
  modalLabels: {
    button: string; title: string; subtitle: string; businessName: string; websiteUrl: string
    googleMapsUrl: string; googleMapsHint: string; category: string; selectCategory: string
    cancel: string; add: string; adding: string
  }
}) {
  const [search, setSearch]     = useState('')
  const [sort, setSort]         = useState('recent')
  const [category, setCategory] = useState('all')
  const [checkingAll, setCheckingAll] = useState(false)
  const [checkAllDone, setCheckAllDone] = useState<{ ok: number; fail: number } | null>(null)
  const [showNotif, setShowNotif] = useState(false)
  const [seenNotifIds, setSeenNotifIds] = useState<Set<string>>(new Set())
  const [discoverPrefillCategory, setDiscoverPrefillCategory] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const router = useRouter()

  const checkedCount    = competitors.filter(c => c.last_checked_at).length
  const totalChanges    = allEvents.length
  const unreviewedCount = allEvents.filter(e => !e.reviewed_at && !seenNotifIds.has(e.id)).length

  function handleBellClick() {
    if (!showNotif) {
      // Mark all currently unreviewed as seen when opening the panel
      const ids = allEvents.filter(e => !e.reviewed_at).map(e => e.id)
      setSeenNotifIds(prev => new Set([...prev, ...ids]))
    }
    setShowNotif(v => !v)
  }

  // Update tab title with unreviewed badge
  useEffect(() => {
    const base = 'Rivalkollen'
    document.title = unreviewedCount > 0 ? `(${unreviewedCount}) ${base}` : base
    return () => { document.title = base }
  }, [unreviewedCount])

  const categories = useMemo(() => {
    const cats = [...new Set(competitors.map(c => c.category).filter(Boolean))] as string[]
    return cats
  }, [competitors])

  const filtered = useMemo(() => {
    let list = [...competitors]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.website_url?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      )
    }
    if (category !== 'all') list = list.filter(c => c.category === category)
    switch (sort) {
      case 'name':    list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'changed': list.sort((a, b) => (eventsByCompetitor[b.id]?.length ?? 0) - (eventsByCompetitor[a.id]?.length ?? 0)); break
      case 'checked': list.sort((a, b) => {
        if (!a.last_checked_at) return 1
        if (!b.last_checked_at) return -1
        return new Date(b.last_checked_at).getTime() - new Date(a.last_checked_at).getTime()
      }); break
      default: break // recent = DB order
    }
    return list
  }, [competitors, eventsByCompetitor, search, category, sort])

  async function handleCheckAll() {
    const toCheck = competitors.filter(c => c.website_url)
    if (!toCheck.length) return
    setCheckingAll(true)
    setCheckAllDone(null)
    let ok = 0, fail = 0
    for (const c of toCheck) {
      try {
        const res = await fetch(`/api/scrape/${c.id}`, { method: 'POST' })
        res.ok ? ok++ : fail++
      } catch {
        fail++
      }
    }
    setCheckingAll(false)
    setCheckAllDone({ ok, fail })
    router.refresh()
    setTimeout(() => setCheckAllDone(null), 4000)
  }

  // Recent changes for notification feed (last 20 unreviewed across all competitors)
  const recentNotifs = allEvents
    .filter(e => !e.reviewed_at)
    .slice(0, 20)

  const competitorNameById = Object.fromEntries(competitors.map(c => [c.id, c.name]))

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label={statLabels.tracked}          value={competitors.length} />
        <StatCard label={statLabels.checked}          value={checkedCount} />
        <StatCard label={statLabels.changesDetected}  value={totalChanges} highlight={totalChanges > 0} />
      </div>

      <ActivityChart data={chartData} label={statLabels.last30Days} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#364f6e]" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={labels.search}
            className="w-full bg-[#0b1628] border border-[#182b45] focus:border-[#4f74ff] rounded-lg pl-8 pr-3 py-2 text-[13px] text-[#dce8ff] placeholder-[#2d4a68] outline-none transition-colors"
          />
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-[#0b1628] border border-[#182b45] text-[#dce8ff] text-[12px] rounded-lg px-3 py-2 outline-none focus:border-[#4f74ff] shrink-0"
          >
            <option value="all">{labels.filterAll}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{categoryLabels[cat] ?? cat}</option>
            ))}
          </select>
        )}

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-[#0b1628] border border-[#182b45] text-[#dce8ff] text-[12px] rounded-lg px-3 py-2 outline-none focus:border-[#4f74ff] shrink-0"
        >
          <option value="recent">{labels.sortRecent}</option>
          <option value="name">{labels.sortName}</option>
          <option value="changed">{labels.sortChanged}</option>
          <option value="checked">{labels.sortChecked}</option>
        </select>

        {/* Notification bell */}
        <button
          onClick={handleBellClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#0b1628] border border-[#182b45] hover:border-[#243d5c] text-[#4d6a8a] hover:text-[#dce8ff] transition-colors shrink-0"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1.5A4.5 4.5 0 0 0 3 6v3.5L1.5 11h12L12 9.5V6A4.5 4.5 0 0 0 7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M6 11.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          {unreviewedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#4f74ff] text-white text-[9px] font-bold flex items-center justify-center">
              {unreviewedCount > 9 ? '9+' : unreviewedCount}
            </span>
          )}
        </button>

        {/* Discover */}
        <DiscoverModal
          labels={discoverLabels}
          categoryLabels={categoryLabels}
          trackedCategories={[...new Set(competitors.map(c => c.category).filter(Boolean) as string[])]}
          onAddCompetitor={({ category: cat }) => {
            setDiscoverPrefillCategory(cat)
            setShowAddModal(true)
          }}
        />

        {/* Check all */}
        <button
          onClick={handleCheckAll}
          disabled={checkingAll}
          className="flex items-center gap-2 text-[12px] bg-[#4f74ff] hover:bg-[#3d63ee] disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-medium shrink-0"
        >
          {checkingAll ? (
            <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />{labels.checkingAll}</>
          ) : checkAllDone ? (
            checkAllDone.fail === 0
              ? <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>{labels.checkAllDone.replace('{ok}', String(checkAllDone.ok)).replace('{fail}', '0')}</>
              : <span className="text-amber-300">{labels.checkAllDone.replace('{ok}', String(checkAllDone.ok)).replace('{fail}', String(checkAllDone.fail))}</span>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6A4 4 0 1 1 6 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8.5 2h2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>{labels.checkAll}</>
          )}
        </button>
      </div>

      {/* Notification dropdown */}
      {showNotif && (
        <div className="mb-4 bg-[#0b1628] rounded-xl border border-[#182b45] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#182b45] flex items-center justify-between">
            <p className="text-[11px] font-semibold text-[#364f6e] uppercase tracking-widest">{labels.notifTitle}</p>
            <button onClick={() => setShowNotif(false)} className="text-[#364f6e] hover:text-[#dce8ff] transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
          </div>
          {recentNotifs.length === 0 ? (
            <p className="px-4 py-6 text-[13px] text-[#4d6a8a] text-center">{labels.notifEmpty}</p>
          ) : (
            <div className="divide-y divide-[#182b45] max-h-72 overflow-y-auto">
              {recentNotifs.map(e => {
                const dot = e.severity === 'high' ? 'bg-red-500' : e.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                const txt = e.severity === 'high' ? 'text-red-400' : e.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                return (
                  <div key={e.id} className="px-4 py-3 flex items-start gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#4d6a8a] mb-0.5 truncate">{competitorNameById[e.competitor_id] ?? '—'}</p>
                      <p className={`text-[13px] ${txt} truncate`}>{e.summary}</p>
                    </div>
                    <p className="text-[11px] text-[#364f6e] shrink-0">{new Date(e.detected_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Controlled AddCompetitorModal triggered from Discover */}
      {showAddModal && (
        <AddCompetitorModal
          labels={modalLabels}
          categoryLabels={categoryLabels}
          externalOpen={showAddModal}
          defaultCategory={discoverPrefillCategory}
          onExternalClose={() => { setShowAddModal(false); setDiscoverPrefillCategory(null) }}
        />
      )}

      {/* Competitor list */}
      {filtered.length === 0 ? (
        <p className="text-[13px] text-[#4d6a8a] py-8 text-center">{labels.noResults}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
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
