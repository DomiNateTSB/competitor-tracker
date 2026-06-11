'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addCompetitor(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = (formData.get('name') as string)?.trim()
  const website_url = (formData.get('website_url') as string)?.trim() || null
  const google_maps_url = (formData.get('google_maps_url') as string)?.trim() || null
  const category = (formData.get('category') as string) || null

  if (!name) return { error: 'Name is required' }

  // Enforce free plan limit (1 competitor)
  const { count } = await supabase
    .from('competitors')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true)

  const { data: userData } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const limits: Record<string, number> = {
    free: 1, starter: 5, professional: 25, agency: 100,
  }
  const plan = userData?.plan ?? 'free'

  // Owner has unlimited access
  if (plan !== 'owner') {
    const limit = limits[plan] ?? 1
    if ((count ?? 0) >= limit) {
      return { error: `Your ${plan} plan allows ${limit} competitor${limit === 1 ? '' : 's'}. Upgrade to add more.` }
    }
  }

  const { error } = await supabase.from('competitors').insert({
    user_id: user.id,
    name,
    website_url,
    google_maps_url,
    category,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteCompetitor(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('competitors')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
}
