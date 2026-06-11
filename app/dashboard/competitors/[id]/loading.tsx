export default function CompetitorDetailLoading() {
  return (
    <div className="px-4 sm:px-8 py-8 max-w-4xl animate-pulse">
      {/* Back */}
      <div className="h-4 w-20 bg-[#182b45] rounded mb-5" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-[#182b45] shrink-0" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-[#182b45] rounded" />
          <div className="h-3 w-28 bg-[#182b45] rounded" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4 space-y-2">
            <div className="h-3 w-20 bg-[#182b45] rounded" />
            <div className="h-6 w-12 bg-[#182b45] rounded" />
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-[#0b1628] rounded-xl border border-[#182b45] px-5 py-4 mb-6">
        <div className="h-3 w-24 bg-[#182b45] rounded mb-4" />
        <div className="flex items-end gap-[3px] h-16">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="flex-1 bg-[#182b45] rounded-sm" style={{ height: `${Math.random() * 80 + 10}%` }} />
          ))}
        </div>
      </div>

      {/* History rows */}
      <div className="h-3 w-32 bg-[#182b45] rounded mb-3" />
      <div className="space-y-2.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0b1628] rounded-xl border border-[#182b45] px-4 py-3.5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#182b45] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-[#182b45] rounded w-3/4" />
              <div className="h-3 bg-[#182b45] rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
