import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { scrapeWebsite, detectChanges } from '@/lib/scraper'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Fetch competitor (must belong to this user)
  const { data: competitor } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!competitor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!competitor.website_url) {
    return NextResponse.json({ error: 'No website URL set for this competitor' }, { status: 400 })
  }

  // Scrape
  const current = await scrapeWebsite(competitor.website_url)
  if (current.error) {
    return NextResponse.json({ error: current.error }, { status: 422 })
  }

  // Get latest snapshot
  const { data: previousSnapshot } = await supabase
    .from('website_snapshots')
    .select('*')
    .eq('competitor_id', id)
    .order('scraped_at', { ascending: false })
    .limit(1)
    .single()

  // Store new snapshot
  await supabase.from('website_snapshots').insert({
    competitor_id: id,
    content_hash: current.hash,
    text_content: current.textContent,
  })

  // Update last_checked_at
  await supabase
    .from('competitors')
    .update({ last_checked_at: new Date().toISOString() })
    .eq('id', id)

  // No previous snapshot — first check, just establish baseline
  if (!previousSnapshot) {
    return NextResponse.json({ status: 'baseline_set', message: 'First check complete. Baseline established.' })
  }

  // Detect changes
  const change = detectChanges(previousSnapshot, current)

  if (change.hasChanged) {
    await supabase.from('change_events').insert({
      competitor_id: id,
      event_type: 'website_change',
      severity: change.severity,
      summary: change.summary,
      details: change.details,
    })
  }

  return NextResponse.json({
    status: change.hasChanged ? 'changed' : 'no_change',
    message: change.summary,
    severity: change.severity,
  })
}
