'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

export async function updateProfile(profile: {
    jenjang?: string
    mata_pelajaran?: string
    full_name?: string
    onboarded?: boolean
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            ...profile,
            updated_at: new Date().toISOString(),
        })

    if (error) {
        console.error('Error updating profile:', error)
        throw new Error('Failed to update profile')
    }

    revalidatePath('/dashboard')
    revalidatePath('/onboarding')
}
