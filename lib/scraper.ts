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

// Patterns that change every page load but carry no meaning
const NOISE_PATTERNS = [
  /\b\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?Z?)?\b/g,   // ISO dates
  /\b\d{1,2}[:/]\d{2}(:\d{2})?\s*(am|pm)?\b/gi,            // times
  /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2},?\s+\d{4}\b/gi, // textual dates
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  /\b(today|yesterday|just now|\d+\s+(minutes?|hours?|days?)\s+ago)\b/gi,
  /nonce="[^"]+"/g,
  /csrf[_-]?token[^\s]*/gi,
  /__cf_bm=[^\s;]+/g,                                        // Cloudflare cookies in text
  /gtm\.[a-z0-9_]+/gi,                                      // GTM identifiers
  /ga\d+\.[a-z0-9.]+/gi,                                    // GA identifiers
  /\b[a-f0-9]{32,}\b/g,                                     // long hex strings (cache busters)
  /v=\d+\.\d+[\d.]+/g,                                      // version strings
]

// Selectors for pure noise elements
const NOISE_SELECTORS = [
  'script', 'style', 'noscript', 'iframe', 'svg', 'canvas',
  'head', 'meta', 'link',
  '[class*="cookie"]', '[id*="cookie"]', '[class*="consent"]', '[id*="consent"]',
  '[class*="gdpr"]', '[id*="gdpr"]',
  '[class*="chat"]', '[id*="chat"]', '[class*="widget"]', '[id*="widget"]',
  '[class*="popup"]', '[id*="popup"]', '[class*="modal"]',
  '[class*="banner"]', '[id*="banner"]',
  '[class*="ad-"]', '[id*="ad-"]', '[class*="-ad"]', '[class*="advert"]',
  '[data-ad]', '[class*="sponsor"]',
  '[aria-hidden="true"]',
  '.skip-link', '[class*="skip-"]',
  'aside',
]

// Elements with navigation/boilerplate that rarely signal real changes
const BOILERPLATE_SELECTORS = ['nav', 'footer', 'header']

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sv,en;q=0.9',
      },
    })

    clearTimeout(timeout)

    if (!res.ok) {
      return { hash: '', textContent: '', error: `HTTP ${res.status}` }
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    // Remove noise selectors
    $(NOISE_SELECTORS.join(', ')).remove()

    // Remove boilerplate — keep content, strip nav chrome
    $(BOILERPLATE_SELECTORS.join(', ')).remove()

    // Extract the richest content block available
    const contentEl =
      $('main').length ? $('main') :
      $('[role="main"]').length ? $('[role="main"]') :
      $('article').length ? $('article').first() :
      $('#content, .content, #main, .main, .entry-content, .post-content').length
        ? $('#content, .content, #main, .main, .entry-content, .post-content').first()
        : $('body')

    let text = contentEl.text()

    // Strip all noise patterns
    for (const pattern of NOISE_PATTERNS) {
      text = text.replace(pattern, ' ')
    }

    // Normalise whitespace
    const normalized = text.replace(/\s+/g, ' ').trim()

    // Ignore pages with almost no extractable text (JS-heavy SPAs, paywalls etc.)
    if (normalized.length < 50) {
      return { hash: '', textContent: '', error: 'Could not extract meaningful content from page' }
    }

    const hash = createHash('sha256').update(normalized).digest('hex')
    return { hash, textContent: normalized }
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string }
    if (e.name === 'AbortError') return { hash: '', textContent: '', error: 'Request timed out' }
    return { hash: '', textContent: '', error: e.message ?? 'Failed to fetch' }
  }
}

export function detectChanges(
  previous: { content_hash: string; text_content: string },
  current: ScrapeResult
): ChangeResult {
  if (previous.content_hash === current.hash) {
    return { hasChanged: false, summary: 'No changes detected', severity: 'low', details: { added: '', removed: '', changeRatio: 0 } }
  }

  const diff = diffWords(previous.text_content ?? '', current.textContent ?? '')
  const added = diff.filter(d => d.added).map(d => d.value).join(' ').trim()
  const removed = diff.filter(d => d.removed).map(d => d.value).join(' ').trim()

  const totalLength = Math.max(previous.text_content?.length ?? 1, 1)
  const changeRatio = (added.length + removed.length) / totalLength

  // Ignore micro-changes — likely residual noise
  if (changeRatio < 0.015) {
    return { hasChanged: false, summary: 'Insignificant change ignored', severity: 'low', details: { added, removed, changeRatio } }
  }

  const severity: 'low' | 'medium' | 'high' =
    changeRatio > 0.35 ? 'high' : changeRatio > 0.08 ? 'medium' : 'low'

  const summary = classifyChange(added, removed, changeRatio)

  return { hasChanged: true, summary, severity, details: { added, removed, changeRatio } }
}

function classifyChange(added: string, removed: string, ratio: number): string {
  const combined = (added + ' ' + removed).toLowerCase()

  // Price signals — Swedish + generic
  if (/\d+[\s]?kr|\d+[,\.]\d+\s?(kr|sek|:-|eur|usd|gbp|\$|€|£)/.test(combined)) {
    return 'Possible pricing update detected'
  }
  // Menu / offering signals
  if (/\b(menu|meny|lunch|middag|frukost|breakfast|dinner|special|erbjudande|offer|deal|kampanj)\b/.test(combined)) {
    return 'Menu or offer content changed'
  }
  // Opening hours
  if (/\b(öppet|öppettider|stängt|open|closed|hours|monday|tuesday|måndag|tisdag)\b/.test(combined)) {
    return 'Opening hours may have changed'
  }
  // Contact / address
  if (/\b(telefon|phone|adress|address|email|e-post|kontakt|contact)\b/.test(combined)) {
    return 'Contact information may have changed'
  }
  // Staff / team
  if (/\b(team|staff|personal|anställd|employee|styrelse|ledning)\b/.test(combined)) {
    return 'Staff or team information updated'
  }

  if (ratio > 0.5) return 'Major website update detected'
  if (added.length > removed.length * 3) return 'Significant new content added'
  if (removed.length > added.length * 3) return 'Content removed from website'
  return 'Website content updated'
}
