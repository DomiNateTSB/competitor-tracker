import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { scrapeWebsite, detectChanges } from '@/lib/scraper'

export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: competitors, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('is_active', true)
    .not('website_url', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results = []
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

  for (const competitor of competitors ?? []) {
    try {
      const current = await scrapeWebsite(competitor.website_url!)
      if (current.error) {
        await supabase.from('competitors').update({ last_scrape_error: current.error }).eq('id', competitor.id)
        results.push({ id: competitor.id, status: 'scrape_error', error: current.error })
        continue
      }

      const { data: previousSnapshot } = await supabase
        .from('website_snapshots')
        .select('*')
        .eq('competitor_id', competitor.id)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single()

      await supabase.from('website_snapshots').insert({
        competitor_id: competitor.id,
        content_hash: current.hash,
        text_content: current.textContent,
      })

      await supabase
        .from('competitors')
        .update({ last_checked_at: new Date().toISOString(), last_scrape_error: null })
        .eq('id', competitor.id)

      if (!previousSnapshot) {
        results.push({ id: competitor.id, status: 'baseline_set' })
        continue
      }

      const change = detectChanges(previousSnapshot, current)

      if (change.hasChanged) {
        await supabase.from('change_events').insert({
          competitor_id: competitor.id,
          event_type: 'website_change',
          severity: change.severity,
          summary: change.summary,
          details: change.details,
        })
        results.push({ id: competitor.id, status: 'changed', severity: change.severity })
      } else {
        results.push({ id: competitor.id, status: 'no_change' })
      }
    } catch (err) {
      results.push({ id: competitor.id, status: 'error', error: String(err) })
    }
    // Small delay between requests to avoid hammering target sites
    await delay(500)
  }

  return NextResponse.json({ checked: results.length, results })
}
