'use client'

import { useState } from 'react'

const steps = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Add a competitor',
    desc: 'Click "Add competitor" and enter a business name or website URL.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Run your first check',
    desc: 'Hit "Check now" on a competitor card to scrape their site and set the baseline.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Changes detected automatically',
    desc: 'Every day at midnight we re-check all your competitors and log what changed.',
  },
]

export default function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-[#0b1628] rounded-xl border border-[#4f74ff]/25 p-6 mb-8 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-md text-[#364f6e] hover:text-[#6b85aa] hover:bg-[#182b45] transition-colors"
        title="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-[#4f74ff] flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v4l2 2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-[13px] font-semibold text-[#dce8ff]">Get started in 3 steps</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4f74ff]/10 border border-[#4f74ff]/20 text-[#4f74ff] flex items-center justify-center shrink-0 mt-0.5">
              {step.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-[#4f74ff] bg-[#4f74ff]/10 px-1.5 py-0.5 rounded-full">{i + 1}</span>
                <p className="text-[13px] font-medium text-[#dce8ff]">{step.title}</p>
              </div>
              <p className="text-[12px] text-[#4d6a8a] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
