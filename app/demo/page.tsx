import Link from 'next/link'

const MOCK_COMPETITORS = [
  {
    id: '1',
    name: 'Bella Pizza',
    domain: 'bellapizza.se',
    category: 'Restaurant',
    lastChecked: '11 jun 2026',
    events: [
      { id: 'e1', severity: 'high',   summary: 'Possible pricing update detected',   date: '10 jun 2026', diff: { removed: 'Margherita 119 kr Pepperoni 129 kr', added: 'Margherita 139 kr Pepperoni 149 kr' } },
      { id: 'e2', severity: 'medium', summary: 'Menu or offer content changed',       date: '28 maj 2026', diff: { removed: 'Lunch 89 kr måndag–fredag', added: 'Lunch 99 kr måndag–fredag Ny: Pasta Carbonara' } },
      { id: 'e3', severity: 'low',    summary: 'Website content updated',             date: '3 maj 2026',  diff: null },
    ],
  },
  {
    id: '2',
    name: 'FitZone Gym',
    domain: 'fitzone.se',
    category: 'Gym',
    lastChecked: '11 jun 2026',
    events: [
      { id: 'e4', severity: 'high',   summary: 'Significant new content added',      date: '9 jun 2026',  diff: { removed: '', added: 'Sommarkampanj! 3 månader för priset av 2. Gäller till 30 juni.' } },
      { id: 'e5', severity: 'low',    summary: 'Opening hours may have changed',     date: '15 maj 2026', diff: { removed: 'Lördag 09:00–17:00', added: 'Lördag 08:00–18:00' } },
    ],
  },
  {
    id: '3',
    name: 'Nordic Dental',
    domain: 'nordicdental.se',
    category: 'Dentist',
    lastChecked: '10 jun 2026',
    events: [
      { id: 'e6', severity: 'medium', summary: 'Contact information may have changed', date: '7 jun 2026', diff: { removed: 'Telefon: 08-123 45 67', added: 'Telefon: 08-987 65 43 Ny mottagning i Solna öppnar 1 juli' } },
    ],
  },
]

const severityConfig = {
  high:   { dot: 'bg-red-500',   bg: 'bg-red-950/40',   border: 'border-red-800/40',   text: 'text-red-400',   badge: 'High' },
  medium: { dot: 'bg-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-700/40', text: 'text-amber-400', badge: 'Medium' },
  low:    { dot: 'bg-blue-400',  bg: 'bg-blue-950/40',  border: 'border-blue-800/40',  text: 'text-blue-400',  badge: 'Low' },
}

import DemoInteractive from './DemoInteractive'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#07101f] text-[#dce8ff] flex">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 flex flex-col bg-[#0b1628] border-r border-[#182b45] h-screen sticky top-0">
        <div className="px-4 py-4 border-b border-[#182b45] flex items-center justify-center">
          <Link href="/">
            <img src="/rivalkollen-logo.png?v=2" alt="Rivalkollen" className="h-16 w-auto object-contain" />
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { label: 'Competitors', active: true },
            { label: 'Activity',    active: false },
            { label: 'Settings',    active: false },
          ].map(item => (
            <div key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium cursor-default ${
                item.active ? 'bg-[#4f74ff]/15 text-[#7a96ff]' : 'text-[#4d6a8a]'
              }`}>
              {item.label}
            </div>
          ))}
        </nav>
        <div className="px-3 pb-4 border-t border-[#182b45] pt-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-[#182b45] flex items-center justify-center text-[11px] font-semibold text-[#6b85aa] shrink-0">
              DE
            </div>
            <p className="text-[11px] text-[#4d6a8a] truncate">demo@example.com</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Demo banner */}
        <div className="bg-[#4f74ff]/10 border-b border-[#4f74ff]/20 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#4f74ff] inline-block animate-pulse" />
            <p className="text-[13px] text-[#7a96ff] font-medium">
              Demo mode — this is sample data showing what Rivalkollen looks like in action
            </p>
          </div>
          <Link href="/auth/sign-up"
            className="bg-[#4f74ff] hover:bg-[#3d63ee] text-white text-[12px] font-medium px-4 py-1.5 rounded-lg transition-colors shrink-0">
            Create free account
          </Link>
        </div>

        <div className="px-8 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#dce8ff]">Competitors</h1>
              <p className="text-sm text-[#4d6a8a] mt-0.5">Monitor your competitors — changes detected automatically</p>
            </div>
            <button disabled
              className="flex items-center gap-2 bg-[#4f74ff]/40 text-white/50 text-[13px] font-medium px-4 py-2 rounded-xl cursor-default">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add Competitor
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Tracked',          value: '3' },
              { label: 'Checked today',    value: '3' },
              { label: 'Changes detected', value: '6', highlight: true },
            ].map(s => (
              <div key={s.label} className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4">
                <p className="text-[11px] font-medium text-[#364f6e] uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.highlight ? 'text-[#4f74ff]' : 'text-[#dce8ff]'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Competitor cards — interactive client component */}
          <DemoInteractive competitors={MOCK_COMPETITORS} severityConfig={severityConfig} />
        </div>
      </div>
    </div>
  )
}
