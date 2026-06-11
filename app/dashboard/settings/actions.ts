'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updateEmail(formData: FormData): Promise<{ error: string } | void> {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.updateUser({ email })
  if (error) return { error: error.message }
}

export async function updatePasswordFromSettings(formData: FormData): Promise<{ error: string } | void> {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
}

export async function deleteAccount(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Delete all competitor data (change_events cascade via FK)
  await supabase.from('competitors').delete().eq('user_id', user.id)

  // Delete the auth user — requires admin client
  const adminClient = createAdminClient()
  await adminClient.auth.admin.deleteUser(user.id)

  redirect('/auth/sign-in')
}

function createAdminClient() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
