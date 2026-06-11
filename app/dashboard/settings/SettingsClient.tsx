'use client'

import { useState } from 'react'
import { updateEmail, updatePasswordFromSettings, deleteAccount } from './actions'

interface Labels {
  title: string
  subtitle: string
  accountSection: string
  emailLabel: string
  emailDesc: string
  newEmail: string
  updateEmail: string
  updatingEmail: string
  passwordSection: string
  passwordDesc: string
  currentPassword: string
  newPassword: string
  passwordHint: string
  updatePassword: string
  updatingPassword: string
  dangerSection: string
  dangerDesc: string
  deleteAccount: string
  deleteConfirmTitle: string
  deleteConfirmDesc: string
  deleteConfirmButton: string
  cancel: string
  successEmail: string
  successPassword: string
}

export default function SettingsClient({ email, labels }: { email: string; labels: Labels }) {
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEmailLoading(true)
    setEmailMsg(null)
    const formData = new FormData(e.currentTarget)
    const result = await updateEmail(formData)
    setEmailLoading(false)
    if (result?.error) setEmailMsg({ type: 'error', text: result.error })
    else { setEmailMsg({ type: 'success', text: labels.successEmail }); (e.target as HTMLFormElement).reset() }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordMsg(null)
    const formData = new FormData(e.currentTarget)
    const result = await updatePasswordFromSettings(formData)
    setPasswordLoading(false)
    if (result?.error) setPasswordMsg({ type: 'error', text: result.error })
    else { setPasswordMsg({ type: 'success', text: labels.successPassword }); (e.target as HTMLFormElement).reset() }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    await deleteAccount()
  }

  const inputClass = "w-full px-3 py-2.5 border border-[#182b45] rounded-lg text-[13px] text-[#dce8ff] bg-[#071018] placeholder-[#2d4a68] focus:outline-none focus:ring-2 focus:ring-[#4f74ff]/30 focus:border-[#4f74ff] transition-colors"
  const labelClass = "block text-[12px] font-medium text-[#6b85aa] mb-1.5"

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#dce8ff]">{labels.title}</h1>
        <p className="text-sm text-[#4d6a8a] mt-0.5">{labels.subtitle}</p>
      </div>

      <div className="space-y-5">
        {/* Email */}
        <div className="bg-[#0b1628] rounded-xl border border-[#182b45] p-6">
          <h2 className="text-[14px] font-semibold text-[#dce8ff] mb-1">{labels.accountSection}</h2>
          <p className="text-[12px] text-[#4d6a8a] mb-5">{labels.emailDesc}</p>

          <div className="mb-5 px-3 py-2.5 bg-[#071018] border border-[#182b45] rounded-lg">
            <p className="text-[11px] text-[#364f6e] mb-0.5">{labels.emailLabel}</p>
            <p className="text-[13px] text-[#6b85aa]">{email}</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {emailMsg && (
              <div className={`px-3 py-2.5 rounded-lg border text-[13px] ${
                emailMsg.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-700/50 text-emerald-400'
                  : 'bg-red-950/50 border-red-800/50 text-red-400'
              }`}>{emailMsg.text}</div>
            )}
            <div>
              <label className={labelClass}>{labels.newEmail}</label>
              <input name="email" type="email" required placeholder="new@example.com" className={inputClass} />
            </div>
            <button type="submit" disabled={emailLoading}
              className="bg-[#4f74ff] hover:bg-[#3d63ee] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50">
              {emailLoading ? labels.updatingEmail : labels.updateEmail}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-[#0b1628] rounded-xl border border-[#182b45] p-6">
          <h2 className="text-[14px] font-semibold text-[#dce8ff] mb-1">{labels.passwordSection}</h2>
          <p className="text-[12px] text-[#4d6a8a] mb-5">{labels.passwordDesc}</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordMsg && (
              <div className={`px-3 py-2.5 rounded-lg border text-[13px] ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-700/50 text-emerald-400'
                  : 'bg-red-950/50 border-red-800/50 text-red-400'
              }`}>{passwordMsg.text}</div>
            )}
            <div>
              <label className={labelClass}>{labels.newPassword}</label>
              <input name="password" type="password" required minLength={6} placeholder="••••••••" className={inputClass} />
              <p className="text-[11px] text-[#364f6e] mt-1.5">{labels.passwordHint}</p>
            </div>
            <button type="submit" disabled={passwordLoading}
              className="bg-[#4f74ff] hover:bg-[#3d63ee] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50">
              {passwordLoading ? labels.updatingPassword : labels.updatePassword}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="bg-[#0b1628] rounded-xl border border-red-900/40 p-6">
          <h2 className="text-[14px] font-semibold text-red-400 mb-1">{labels.dangerSection}</h2>
          <p className="text-[12px] text-[#4d6a8a] mb-5">{labels.dangerDesc}</p>

          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-800/50 text-red-400 hover:bg-red-950/40 rounded-lg text-[13px] font-medium transition-colors">
              {labels.deleteAccount}
            </button>
          ) : (
            <div className="bg-red-950/30 border border-red-800/40 rounded-lg p-4 space-y-3">
              <p className="text-[13px] font-medium text-red-400">{labels.deleteConfirmTitle}</p>
              <p className="text-[12px] text-[#4d6a8a]">{labels.deleteConfirmDesc}</p>
              <div className="flex gap-2.5">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-[#182b45] rounded-lg text-[13px] text-[#6b85aa] hover:bg-[#182b45] transition-colors">
                  {labels.cancel}
                </button>
                <button onClick={handleDelete} disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50">
                  {deleteLoading ? '...' : labels.deleteConfirmButton}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
