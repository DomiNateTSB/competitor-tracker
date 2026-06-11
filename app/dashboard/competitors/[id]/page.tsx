import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CompetitorDetailView from './CompetitorDetailView'

export default async function CompetitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: competitor } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!competitor) notFound()

  const { data: events } = await supabase
    .from('change_events')
    .select('*')
    .eq('competitor_id', id)
    .order('detected_at', { ascending: false })
    .limit(200)

  // Build 30-day chart data
  const countByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    countByDay[d.toISOString().slice(0, 10)] = 0
  }
  for (const e of events ?? []) {
    const day = e.detected_at.slice(0, 10)
    if (day in countByDay) countByDay[day]++
  }
  const chartData = Object.entries(countByDay).map(([fullDate, count]) => {
    const d = new Date(fullDate)
    return {
      date: d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }),
      count,
      fullDate,
    }
  })

  return (
    <CompetitorDetailView
      competitor={competitor}
      events={events ?? []}
      chartData={chartData}
    />
  )
}
