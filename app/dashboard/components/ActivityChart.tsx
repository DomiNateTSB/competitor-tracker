'use client'

interface DayBar {
  date: string      // "DD MMM"
  count: number
  fullDate: string  // ISO date string
}

export default function ActivityChart({ data, label }: { data: DayBar[]; label: string }) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4 mb-8">
      <p className="text-[11px] font-medium text-[#364f6e] uppercase tracking-wider mb-4">{label}</p>
      <div className="flex items-end gap-[3px] h-16">
        {data.map((d, i) => {
          const heightPct = d.count === 0 ? 0 : Math.max((d.count / max) * 100, 10)
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
              <div
                className={`w-full rounded-sm transition-colors ${
                  d.count > 0 ? 'bg-[#4f74ff] group-hover:bg-[#7a96ff]' : 'bg-[#182b45]'
                }`}
                style={{ height: d.count === 0 ? '4px' : `${heightPct}%` }}
              />
              {d.count > 0 && (
                <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-[#071018] border border-[#182b45] text-[#dce8ff] text-[11px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {d.date}: {d.count} change{d.count !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-[#364f6e]">{data[0]?.date}</span>
        <span className="text-[10px] text-[#364f6e]">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}
