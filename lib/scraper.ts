import * as cheerio from 'cheerio'
import { diffWords } from 'diff'
import { createHash } from 'crypto'

export interface ScrapeResult {
  hash: string
  textContent: string
  error?: string
}

export interface ChangeResult {
  hasChanged: boolean
  summary: string
  severity: 'low' | 'medium' | 'high'
  details: {
    added: string
    removed: string
    changeRatio: number
  }
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LocalCompetitorTracker/1.0)',
      },
    })

    clearTimeout(timeout)

    if (!res.ok) {
      return { hash: '', textContent: '', error: `HTTP ${res.status}` }
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    // Remove noise
    $('script, style, noscript, iframe, svg').remove()
    $('[class*="cookie"], [id*="cookie"]').remove()
    $('[class*="chat"], [id*="chat"], [id*="widget"]').remove()
    $('nav, footer, header').remove()

    // Extract main content
    const main =
      $('main').text() ||
      $('[role="main"]').text() ||
      $('article').text() ||
      $('.content, #content, .main, #main').text() ||
      $('body').text()

    // Normalize
    const normalized = main
      .replace(/\s+/g, ' ')
      .replace(/\d{4}-\d{2}-\d{2}/g, '')   // strip dates
      .replace(/\d{2}:\d{2}/g, '')           // strip times
      .trim()

    const hash = createHash('sha256').update(normalized).digest('hex')

    return { hash, textContent: normalized }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { hash: '', textContent: '', error: 'Request timed out' }
    }
    return { hash: '', textContent: '', error: err.message ?? 'Failed to fetch' }
  }
}

export function detectChanges(
  previous: { content_hash: string; text_content: string },
  current: ScrapeResult
): ChangeResult {
  if (previous.content_hash === current.hash) {
    return {
      hasChanged: false,
      summary: 'No changes detected',
      severity: 'low',
      details: { added: '', removed: '', changeRatio: 0 },
    }
  }

  const diff = diffWords(previous.text_content ?? '', current.textContent ?? '')
  const added = diff.filter(d => d.added).map(d => d.value).join(' ').trim()
  const removed = diff.filter(d => d.removed).map(d => d.value).join(' ').trim()

  const totalLength = previous.text_content?.length || 1
  const changeRatio = (added.length + removed.length) / totalLength

  // Ignore tiny changes (less than 2%)
  if (changeRatio < 0.02) {
    return {
      hasChanged: false,
      summary: 'Minor change ignored',
      severity: 'low',
      details: { added, removed, changeRatio },
    }
  }

  // Classify
  const summary = classifyChange(added, removed, changeRatio)
  const severity: 'low' | 'medium' | 'high' =
    changeRatio > 0.3 ? 'high' : changeRatio > 0.1 ? 'medium' : 'low'

  return {
    hasChanged: true,
    summary,
    severity,
    details: { added, removed, changeRatio },
  }
}

function classifyChange(added: string, removed: string, ratio: number): string {
  const pricePattern = /\d+[\s]?kr|\d+[,\.]\d+\s?(kr|sek|:-)/i
  const combined = added + ' ' + removed

  if (pricePattern.test(combined)) return 'Possible pricing update detected'
  if (ratio > 0.5) return 'Major website update detected'
  if (added.length > removed.length * 3) return 'Significant new content added'
  if (removed.length > added.length * 3) return 'Content removed from website'
  return 'Website content updated'
}
