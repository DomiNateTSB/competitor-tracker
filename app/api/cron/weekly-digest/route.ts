import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { buildWeeklyDigestHtml, sendEmail } from '@/lib/emails'

export const maxDuration = 60

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // List all auth users
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const weekStart = sevenDaysAgo.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })
  const weekEnd   = new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })

  const results: { email: string; status: string; changes?: number }[] = []

  for (const user of users) {
    if (!user.email) continue

    // Get this user's competitors
    const { data: competitors } = await supabase
      .from('competitors')
      .select('id, name')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (!competitors?.length) continue

    const competitorIds = competitors.map(c => c.id)

    // Get last 7 days of change events
    const { data: events } = await supabase
      .from('change_events')
      .select('competitor_id, summary, severity, detected_at')
      .in('competitor_id', competitorIds)
      .gte('detected_at', sevenDaysAgo.toISOString())
      .order('detected_at', { ascending: false })

    type EventRow = NonNullable<typeof events>[number]
    const eventsByCompetitor = (events ?? []).reduce((acc, e) => {
      acc[e.competitor_id] = acc[e.competitor_id] ?? []
      acc[e.competitor_id].push(e)
      return acc
    }, {} as Record<string, EventRow[]>)

    const digestCompetitors = competitors.map(c => ({
      name: c.name,
      events: eventsByCompetitor[c.id] ?? [],
    }))

    const totalChanges = (events ?? []).length

    try {
      await sendEmail({
        to: user.email,
        subject: totalChanges > 0
          ? `${totalChanges} competitor change${totalChanges !== 1 ? 's' : ''} this week — Rivalkollen`
          : 'Your weekly competitor update — Rivalkollen',
        html: buildWeeklyDigestHtml({ competitors: digestCompetitors, weekStart, weekEnd }),
      })
      results.push({ email: user.email, status: 'sent', changes: totalChanges })
    } catch (err) {
      results.push({ email: user.email, status: 'failed' })
      console.error(`Failed to send digest to ${user.email}:`, err)
    }
  }

  return NextResponse.json({ sent: results.filter(r => r.status === 'sent').length, results })
}
