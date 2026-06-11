import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function LandingPage() {
  const t = await getTranslations('landing')
  const nt = await getTranslations('nav')
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="5" cy="5" r="3.5" stroke="white" strokeWidth="1.5"/>
                <circle cx="9" cy="9" r="3.5" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="text-[14px] font-semibold">Competitor Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <Link href="/auth/sign-in" className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors">{nt('signIn')}</Link>
            <Link href="/auth/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">{nt('getStartedFree')}</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[12px] font-medium px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
            {t('badge')}
          </div>
          <h1 className="text-[48px] font-semibold leading-[1.1] tracking-tight text-zinc-900 mb-6">
            {t('heroTitle')}<br/><span className="text-indigo-600">{t('heroHighlight')}</span>
          </h1>
          <p className="text-[17px] text-zinc-500 leading-relaxed max-w-xl mx-auto mb-10">{t('heroSubtitle')}</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/auth/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-medium px-6 py-3 rounded-xl transition-colors shadow-sm">{t('startTracking')}</Link>
            <Link href="/auth/sign-in" className="text-[14px] text-zinc-500 hover:text-zinc-900 px-6 py-3 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">{nt('signIn')}</Link>
          </div>
          <p className="text-[12px] text-zinc-400 mt-4">{t('noCard')}</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f7f8fa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[30px] font-semibold text-zinc-900 mb-3">{t('featuresTitle')}</h2>
            <p className="text-[15px] text-zinc-500 max-w-lg mx-auto">{t('featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8" cy="8" r="6" stroke="#4f46e5" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" stroke="#4f46e5" strokeWidth="1.5"/></svg>, title: t('feature1Title'), desc: t('feature1Desc') },
              { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v4M10 14v4M2 10h4M14 10h4" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="10" r="3" stroke="#4f46e5" strokeWidth="1.5"/></svg>, title: t('feature2Title'), desc: t('feature2Desc') },
              { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#4f46e5" strokeWidth="1.5"/><path d="M7 4V2M13 4V2M3 8h14" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: t('feature3Title'), desc: t('feature3Desc') },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-200/80 p-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-[15px] font-semibold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[30px] font-semibold text-zinc-900 mb-3">{t('pricingTitle')}</h2>
            <p className="text-[15px] text-zinc-500">{t('pricingSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: t('freeName'), price: '0', desc: t('freeDesc'), features: [`1 ${t('competitor')}`, t('dailyChecks'), t('changeHistory'), t('emailAlerts')], cta: t('freeCta'), highlight: false },
              { name: t('starterName'), price: '9', desc: t('starterDesc'), features: [`5 ${t('competitors')}`, t('dailyChecks'), t('changeHistory'), t('emailAlerts'), t('prioritySupport')], cta: t('starterCta'), highlight: true },
              { name: t('proName'), price: '29', desc: t('proDesc'), features: [`25 ${t('competitors')}`, t('dailyChecks'), t('changeHistory'), t('emailDigest'), t('prioritySupport'), t('apiAccess')], cta: t('proCta'), highlight: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl border p-6 flex flex-col ${plan.highlight ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-zinc-200/80 text-zinc-900'}`}>
                <p className={`text-[12px] font-semibold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-indigo-200' : 'text-zinc-400'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[36px] font-semibold">${plan.price}</span>
                  <span className={`text-[13px] ${plan.highlight ? 'text-indigo-200' : 'text-zinc-400'}`}>{t('perMonth')}</span>
                </div>
                <p className={`text-[13px] mb-6 ${plan.highlight ? 'text-indigo-200' : 'text-zinc-400'}`}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-[13px]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke={plan.highlight ? 'white' : '#4f46e5'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/sign-up" className={`text-center py-2.5 rounded-xl text-[13px] font-medium transition-colors ${plan.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#f7f8fa]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[30px] font-semibold text-zinc-900 mb-4">{t('ctaTitle')}</h2>
          <p className="text-[15px] text-zinc-500 mb-8">{t('ctaSubtitle')}</p>
          <Link href="/auth/sign-up" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-medium px-8 py-3 rounded-xl transition-colors shadow-sm">{t('ctaButton')}</Link>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="4" cy="4" r="3" stroke="white" strokeWidth="1.3"/><circle cx="8" cy="8" r="3" stroke="white" strokeWidth="1.3"/></svg>
            </div>
            <span className="text-[13px] font-medium text-zinc-600">Competitor Tracker</span>
          </div>
          <p className="text-[12px] text-zinc-400">© {new Date().getFullYear()} {t('copyright')}</p>
        </div>
      </footer>
    </div>
  )
}
