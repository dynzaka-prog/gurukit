'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDocuments() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching documents:', error)
        return []
    }

    return data
}

export async function createDocument(doc: {
    title: string
    content: any
    type: 'soal' | 'modul' | 'kuis'
    metadata?: any
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('documents')
        .insert({
            user_id: user.id,
            ...doc,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating document:', error)
        throw new Error('Failed to save document')
    }

    revalidatePath('/dashboard')
    return data
}

export async function deleteDocument(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting document:', error)
        throw new Error('Failed to delete document')
    }

    revalidatePath('/dashboard')
}
