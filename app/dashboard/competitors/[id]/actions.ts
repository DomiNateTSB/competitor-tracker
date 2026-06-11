'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

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
