'use client'

import { useState } from 'react'

interface DiscoverLabels {
  title: string
  subtitle: string
  locationLabel: string
  locationPlaceholder: string
  categoryLabel: string
  allCategories: string
  searchBtn: string
  trackedLabel: string
  suggestedLabel: string
  openMaps: string
  addCompetitor: string
  relatedLabel: string
  tipTitle: string
  tip1: string
  tip2: string
  tip3: string
  noLocation: string
  mapsQueryNote: string
}

// English search terms for Google Maps — always English for best results
const categorySearchTerms: Record<string, string> = {
  restaurant:   'restaurant',
  salon:        'hair salon',
  dentist:      'dentist',
  car_repair:   'car repair garage',
  gym:          'gym fitness',
  real_estate:  'real estate agency',
  retail:       'retail store',
  construction: 'construction company',
  electrician:  'electrician',
  plumber:      'plumber',
  other:        'local business',
}

// Related categories to suggest alongside each tracked one
const relatedCategories: Record<string, string[]> = {
  restaurant:   ['salon', 'retail'],
  salon:        ['dentist', 'gym'],
  dentist:      ['salon', 'gym'],
  car_repair:   ['electrician', 'plumber'],
  gym:          ['salon', 'restaurant'],
  real_estate:  ['construction', 'electrician'],
  retail:       ['restaurant', 'salon'],
  construction: ['electrician', 'plumber'],
  electrician:  ['plumber', 'construction'],
  plumber:      ['electrician', 'construction'],
  other:        [],
}

function mapsUrl(category: string, location: string) {
  const term = categorySearchTerms[category] ?? category
  const q    = `${term} in ${location}`
  return `https://www.google.com/maps/search/${encodeURIComponent(q)}`
}

interface SearchCard {
  category: string
  label: string
  isTracked: boolean
}

export default function DiscoverModal({
  labels,
  categoryLabels,
  trackedCategories,
  onAddCompetitor,
}: {
  labels: DiscoverLabels
  categoryLabels: Record<string, string>
  trackedCategories: string[]   // categories user already monitors
  onAddCompetitor: (prefill: { category: string }) => void
}) {
  const [open,     setOpen]     = useState(false)
  const [location, setLocation] = useState('')
  const [filter,   setFilter]   = useState('all')

  // Build the full list: tracked first, then untracked suggestions
  const allCategoryKeys = Object.keys(categorySearchTerms)
  const untrackedSet    = new Set(allCategoryKeys.filter(c => !trackedCategories.includes(c)))

  // Related to tracked (exclude already tracked)
  const relatedSet = new Set<string>()
  for (const cat of trackedCategories) {
    for (const rel of (relatedCategories[cat] ?? [])) {
      if (untrackedSet.has(rel)) relatedSet.add(rel)
    }
  }

  const cards: SearchCard[] = [
    ...trackedCategories.map(c => ({ category: c, label: categoryLabels[c] ?? c, isTracked: true })),
    ...[...relatedSet].map(c  => ({ category: c, label: categoryLabels[c] ?? c, isTracked: false })),
  ]

  const filtered = filter === 'all'
    ? cards
    : cards.filter(c => c.category === filter)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[13px] text-[#4d6a8a] hover:text-[#dce8ff] border border-[#182b45] hover:border-[#243d5c] px-4 py-2 rounded-lg transition-colors font-medium"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M5.5 3.5v4M3.5 5.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        {labels.title}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-[#0b1628] rounded-2xl w-full max-w-[560px] border border-[#182b45] max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#182b45] shrink-0">
              <div>
                <h2 className="text-[15px] font-semibold text-[#dce8ff]">{labels.title}</h2>
                <p className="text-[12px] text-[#4d6a8a] mt-0.5">{labels.subtitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4d6a8a] hover:text-[#dce8ff] hover:bg-[#182b45] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 border-b border-[#182b45] space-y-3 shrink-0">
              <div>
                <label className="block text-[12px] font-medium text-[#6b85aa] mb-1.5">{labels.locationLabel}</label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder={labels.locationPlaceholder}
                  className="w-full px-3 py-2.5 border border-[#182b45] rounded-lg text-[13px] text-[#dce8ff] bg-[#071018] placeholder-[#2d4a68] focus:outline-none focus:ring-2 focus:ring-[#4f74ff]/30 focus:border-[#4f74ff] transition-colors"
                />
              </div>

              {cards.length > 1 && (
                <div>
                  <label className="block text-[12px] font-medium text-[#6b85aa] mb-1.5">{labels.categoryLabel}</label>
                  <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#182b45] rounded-lg text-[13px] text-[#dce8ff] bg-[#071018] focus:outline-none focus:ring-2 focus:ring-[#4f74ff]/30 focus:border-[#4f74ff] transition-colors"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all">{labels.allCategories}</option>
                    {cards.map(c => (
                      <option key={c.category} value={c.category}>{c.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {!location.trim() ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#071018] border border-[#182b45] flex items-center justify-center mx-auto mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="7.5" r="3" stroke="#4f74ff" strokeWidth="1.4"/>
                      <path d="M9 1.5C5.96 1.5 3.5 3.96 3.5 7c0 4.5 5.5 9.5 5.5 9.5S14.5 11.5 14.5 7c0-3.04-2.46-5.5-5.5-5.5z" stroke="#4f74ff" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[13px] text-[#4d6a8a]">{labels.noLocation}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-[13px] text-[#4d6a8a]">No suggestions for this filter.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* Section: already tracking */}
                  {filtered.some(c => c.isTracked) && (
                    <>
                      <p className="text-[10px] font-semibold text-[#364f6e] uppercase tracking-widest mb-2 mt-1">
                        {labels.trackedLabel}
                      </p>
                      {filtered.filter(c => c.isTracked).map(card => (
                        <SearchCard
                          key={card.category}
                          card={card}
                          location={location}
                          labels={labels}
                          onAdd={() => { onAddCompetitor({ category: card.category }); setOpen(false) }}
                        />
                      ))}
                    </>
                  )}

                  {/* Section: suggested */}
                  {filtered.some(c => !c.isTracked) && (
                    <>
                      <p className="text-[10px] font-semibold text-[#364f6e] uppercase tracking-widest mb-2 mt-4">
                        {labels.suggestedLabel}
                      </p>
                      {filtered.filter(c => !c.isTracked).map(card => (
                        <SearchCard
                          key={card.category}
                          card={card}
                          location={location}
                          labels={labels}
                          onAdd={() => { onAddCompetitor({ category: card.category }); setOpen(false) }}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* How-to tip */}
              <div className="mt-6 bg-[#071018] rounded-xl border border-[#182b45] px-4 py-4">
                <p className="text-[11px] font-semibold text-[#4d6a8a] uppercase tracking-widest mb-3">{labels.tipTitle}</p>
                <ol className="space-y-2">
                  {[labels.tip1, labels.tip2, labels.tip3].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[12px] text-[#4d6a8a]">
                      <span className="w-4 h-4 rounded-full bg-[#182b45] text-[#4f74ff] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

function SearchCard({
  card, location, labels, onAdd,
}: {
  card: SearchCard
  location: string
  labels: DiscoverLabels
  onAdd: () => void
}) {
  const url = mapsUrl(card.category, location)

  return (
    <div className="bg-[#07101f] border border-[#182b45] hover:border-[#243d5c] rounded-xl px-4 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#4f74ff]/10 border border-[#4f74ff]/20 flex items-center justify-center shrink-0">
            <CategoryIcon category={card.category} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#dce8ff]">{card.label}</p>
            <p className="text-[11px] text-[#364f6e] truncate">{categorySearchTerms[card.category]} in {location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-[#4f74ff] hover:text-[#7a96ff] border border-[#4f74ff]/30 hover:border-[#4f74ff]/60 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M4.5 1.5H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M7 1h3v3M10 1L5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {labels.openMaps}
          </a>
          <button
            onClick={onAdd}
            className="text-[12px] bg-[#4f74ff] hover:bg-[#3d63ee] text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            + {labels.addCompetitor}
          </button>
        </div>
      </div>
    </div>
  )
}

function CategoryIcon({ category }: { category: string }) {
  const cls = "text-[#4f74ff]"
  switch (category) {
    case 'restaurant':   return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 1v5a2 2 0 0 0 4 0V1M6 1v12M11 1c0 3-1.5 4.5-1.5 6V13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
    case 'salon':        return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L7 7l4 4M7 7V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="2" r="1.2" fill="currentColor"/></svg>
    case 'dentist':      return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2C3.5 2 2 3 2 5c0 3 2 7 3 7s1.5-2 2-2 1 2 2 2 3-4 3-7c0-2-1.5-3-3-3-1 0-1.5.5-2 .5S6 2 5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
    case 'car_repair':   return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9h10M3 6l1-3h6l1 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="4" cy="10.5" r="1.2" fill="currentColor"/><circle cx="10" cy="10.5" r="1.2" fill="currentColor"/></svg>
    case 'gym':          return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h2M11 7h2M3 7h8M3 5v4M11 5v4M5 4v6M9 4v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
    case 'real_estate':  return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 13V6.5L7 2l5 4.5V13H9v-3H5v3H2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    case 'retail':       return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10l-1 5H3L2 3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/></svg>
    case 'construction': return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12h10M3 12V7l4-4 4 4v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="5.5" y="8.5" width="3" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/></svg>
    case 'electrician':  return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 1L4 8h5l-3 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    case 'plumber':      return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 2v5a3 3 0 0 0 6 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M10 2h2M10 4h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M7 10v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
    default:             return <svg className={cls} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  }
}
