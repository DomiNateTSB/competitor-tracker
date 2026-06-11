'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { randomBytes } from 'crypto'

export async function updateNotes(id: string, notes: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('competitors')
    .update({ notes })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath(`/dashboard/competitors/${id}`)
}

export async function updateAlertPrefs(
  id: string,
  alertEnabled: boolean,
  alertMinSeverity: string
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('competitors')
    .update({ alert_enabled: alertEnabled, alert_min_severity: alertMinSeverity })
    .eq('id', id)
    .eq('user_id', user.id)
}

export async function generateShareToken(id: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Return existing token if already generated
  const { data: existing } = await supabase
    .from('competitors')
    .select('share_token')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (existing?.share_token) return existing.share_token

  const token = randomBytes(16).toString('hex')

  await supabase
    .from('competitors')
    .update({ share_token: token })
    .eq('id', id)
    .eq('user_id', user.id)

  return token
}

export async function revokeShareToken(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('competitors')
    .update({ share_token: null })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath(`/dashboard/competitors/${id}`)
}
