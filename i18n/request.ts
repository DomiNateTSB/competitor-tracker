import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const locales = ['sv', 'en', 'no', 'da', 'fi', 'de', 'fr', 'es', 'nl', 'pl', 'pt', 'it']
const defaultLocale = 'sv'

async function detectLocale(): Promise<string> {
  const cookieStore = await cookies()
  const saved = cookieStore.get('locale')?.value
  if (saved && locales.includes(saved)) return saved

  const headerStore = await headers()
  const acceptLanguage = headerStore.get('accept-language') ?? ''
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().includes(locale)) return locale
  }

  return defaultLocale
}

export default getRequestConfig(async () => {
  const locale = await detectLocale()
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
