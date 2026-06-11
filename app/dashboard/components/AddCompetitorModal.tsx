'use client'

import { useState, useRef, useEffect } from 'react'
import { addCompetitor } from '@/app/dashboard/actions'

interface PlaceResult {
  name: string
  display: string
  website: string
}

export default function AddCompetitorModal() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [nameInput, setNameInput] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState('')

  const formRef = useRef<HTMLFormElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (nameInput.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(nameInput)}`)
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 350)
  }, [nameInput])

  function selectSuggestion(place: PlaceResult) {
    setNameInput(place.name)
    setWebsiteUrl(place.website || '')
    setShowSuggestions(false)
    setSuggestions([])
  }

  function handleClose() {
    setOpen(false)
    setError(null)
    setNameInput('')
    setWebsiteUrl('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await addCompetitor(formData)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      formRef.current?.reset()
      handleClose()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors shadow-sm"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Add competitor
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] border border-zinc-200/60">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">Add competitor</h2>
                <p className="text-[12px] text-zinc-400 mt-0.5">Track a business and monitor their website</p>
              </div>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[13px]">
                  {error}
                </div>
              )}

              {/* Name with autocomplete */}
              <div className="relative">
                <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">
                  Business name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="off"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="e.g. Restaurang Björnen"
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                  />
                  {searching && (
                    <div className="absolute right-3 top-3">
                      <div className="w-3.5 h-3.5 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {showSuggestions && (
                  <ul className="absolute z-10 mt-1.5 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                    {suggestions.map((place, i) => (
                      <li
                        key={i}
                        onMouseDown={() => selectSuggestion(place)}
                        className="px-4 py-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100 last:border-0 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <p className="text-[13px] font-medium text-zinc-900">{place.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">{place.display}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">
                  Website URL
                </label>
                <input
                  name="website_url"
                  type="url"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.se"
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">
                  Google Maps URL
                </label>
                <input
                  name="google_maps_url"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                />
                <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                  Used to track reviews. Copy the URL from Google Maps after searching the business.
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                >
                  <option value="">Select a category</option>
                  <option value="restaurant">Restaurant / Café</option>
                  <option value="salon">Hair salon</option>
                  <option value="dentist">Dentist</option>
                  <option value="car_repair">Car repair</option>
                  <option value="gym">Gym</option>
                  <option value="real_estate">Real estate</option>
                  <option value="retail">Retail</option>
                  <option value="construction">Construction</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-lg text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading ? 'Adding...' : 'Add competitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
