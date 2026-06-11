import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['sv', 'en', 'no', 'da', 'fi', 'de', 'fr', 'es', 'nl', 'pl', 'pt', 'it'],
  defaultLocale: 'sv',
  localePrefix: 'as-needed',
})
