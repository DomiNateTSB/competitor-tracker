import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LandingPage from '@/app/(marketing)/page'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return <LandingPage />
}
