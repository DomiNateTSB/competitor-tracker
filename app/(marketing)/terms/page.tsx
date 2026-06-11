import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
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
        <h1 className="text-[32px] font-semibold text-[#dce8ff] mb-2">Terms of Service</h1>
        <p className="text-[13px] text-[#364f6e] mb-12">Last updated: June 11, 2026</p>

        <div className="prose-dark space-y-10 text-[15px] leading-relaxed text-[#6b85aa]">
          <Section title="1. Acceptance of Terms">
            By accessing or using Competitor Tracker ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
          </Section>

          <Section title="2. Description of Service">
            Competitor Tracker is a web application that monitors publicly accessible websites on your behalf and notifies you of detected changes. The Service stores snapshots of public web content for comparison purposes only.
          </Section>

          <Section title="3. Your Account">
            You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must provide accurate information when creating your account.
          </Section>

          <Section title="4. Acceptable Use">
            You may only use the Service to monitor publicly accessible websites. You agree not to use the Service to:
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-[#4d6a8a]">
              <li>Monitor content behind authentication or paywalls</li>
              <li>Circumvent any website's technical measures</li>
              <li>Violate any applicable law or regulation</li>
              <li>Collect personal data about individuals</li>
              <li>Resell or redistribute the Service without permission</li>
            </ul>
          </Section>

          <Section title="5. Data and Privacy">
            We store the text content of websites you choose to monitor in order to detect changes. This content belongs to the respective website owners. Our handling of your personal data is described in our <Link href="/privacy" className="text-[#4f74ff] hover:text-[#7a96ff]">Privacy Policy</Link>.
          </Section>

          <Section title="6. Intellectual Property">
            The Service, including its design, code, and branding, is owned by us. You retain ownership of any data you provide. You grant us a limited license to process your data to provide the Service.
          </Section>

          <Section title="7. Disclaimers">
            The Service is provided "as is" without warranties of any kind. We do not guarantee that monitored websites will always be reachable, that all changes will be detected, or that the Service will be uninterrupted.
          </Section>

          <Section title="8. Limitation of Liability">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
          </Section>

          <Section title="9. Termination">
            We reserve the right to suspend or terminate accounts that violate these Terms. You may delete your account at any time from the Settings page.
          </Section>

          <Section title="10. Changes to Terms">
            We may update these Terms at any time. Continued use of the Service after changes are posted constitutes acceptance of the new Terms.
          </Section>

          <Section title="11. Contact">
            Questions about these Terms? Contact us at the email address listed on the site.
          </Section>
        </div>
      </div>

      <footer className="border-t border-[#182b45] py-8 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-[12px] text-[#364f6e]">© {new Date().getFullYear()} Competitor Tracker</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[12px] text-[#4f74ff]">Terms</Link>
            <Link href="/privacy" className="text-[12px] text-[#4d6a8a] hover:text-[#dce8ff] transition-colors">Privacy</Link>
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
