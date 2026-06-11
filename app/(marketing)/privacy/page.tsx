import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07101f] text-[#dce8ff]">
      <nav className="border-b border-[#182b45] px-6 h-14 flex items-center">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4f74ff] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="4" cy="4" r="3" stroke="white" strokeWidth="1.3"/><circle cx="8" cy="8" r="3" stroke="white" strokeWidth="1.3"/></svg>
            </div>
            <span className="text-[13px] font-semibold text-[#dce8ff]">Competitor Tracker</span>
          </Link>
          <Link href="/" className="text-[13px] text-[#4d6a8a] hover:text-[#dce8ff] transition-colors">← Back</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-[32px] font-semibold text-[#dce8ff] mb-2">Privacy Policy</h1>
        <p className="text-[13px] text-[#364f6e] mb-12">Last updated: June 11, 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-[#6b85aa]">
          <Section title="1. What We Collect">
            <p>We collect the following information:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#4d6a8a]">
              <li><strong className="text-[#6b85aa]">Account data:</strong> Your email address and encrypted password</li>
              <li><strong className="text-[#6b85aa]">Competitor data:</strong> Business names, website URLs, and Google Maps URLs you enter</li>
              <li><strong className="text-[#6b85aa]">Scraped content:</strong> Text extracted from the public websites you choose to monitor</li>
              <li><strong className="text-[#6b85aa]">Usage data:</strong> When you last checked a competitor, detected changes, severity levels</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Data">
            <p>We use your data solely to provide the Service:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#4d6a8a]">
              <li>To authenticate you and keep your account secure</li>
              <li>To monitor the websites you add and detect changes</li>
              <li>To store change history so you can review it</li>
              <li>To send email notifications about detected changes (when enabled)</li>
            </ul>
            <p className="mt-3">We do not sell your data, use it for advertising, or share it with third parties except as described below.</p>
          </Section>

          <Section title="3. Third-Party Services">
            <p>We use the following sub-processors:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#4d6a8a]">
              <li><strong className="text-[#6b85aa]">Supabase</strong> — database and authentication (EU region)</li>
              <li><strong className="text-[#6b85aa]">Vercel</strong> — hosting and serverless functions</li>
              <li><strong className="text-[#6b85aa]">Upstash</strong> — rate limiting (no personal data stored)</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            Your account data is retained until you delete your account. Website snapshots and change history are retained for as long as your account is active. Deleting your account removes all data associated with it permanently.
          </Section>

          <Section title="5. Your Rights (GDPR)">
            If you are in the EU/EEA, you have the right to:
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#4d6a8a]">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data (via Settings → Delete account)</li>
              <li>Object to processing or request restriction</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at the email listed on the site.</p>
          </Section>

          <Section title="6. Cookies">
            We use a single session cookie to keep you logged in. We do not use tracking cookies or third-party advertising cookies.
          </Section>

          <Section title="7. Security">
            Passwords are hashed and never stored in plain text. All data is transmitted over HTTPS. Database access is restricted via row-level security policies.
          </Section>

          <Section title="8. Children">
            The Service is not directed at children under 16. We do not knowingly collect data from children.
          </Section>

          <Section title="9. Changes to This Policy">
            We may update this policy from time to time. We will notify you of significant changes via email or a notice in the dashboard.
          </Section>

          <Section title="10. Contact">
            Questions about your privacy? Contact us at the email address listed on the site.
          </Section>
        </div>
      </div>

      <footer className="border-t border-[#182b45] py-8 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-[12px] text-[#364f6e]">© {new Date().getFullYear()} Competitor Tracker</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] transition-colors">Terms</Link>
            <Link href="/privacy" className="text-[12px] text-[#4f74ff]">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[17px] font-semibold text-[#dce8ff] mb-3">{title}</h2>
      <div>{children}</div>
    </div>
  )
}
