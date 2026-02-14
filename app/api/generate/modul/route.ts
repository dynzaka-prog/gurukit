import { NextResponse } from 'next/server'
import { generateContent } from '@/lib/ai/gemini'
import { MODUL_AJAR_SYSTEM_PROMPT, generateModulAjarPrompt, ModulAjarConfig } from '@/lib/ai/prompts/modul-ajar'

export async function POST(req: Request) {
    try {
        const config: ModulAjarConfig = await req.json()

        const prompt = generateModulAjarPrompt(config)
        const result = await generateContent(prompt, MODUL_AJAR_SYSTEM_PROMPT)

        return NextResponse.json({ content: result })
    } catch (error: any) {
        console.error('Generation error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate module' },
            { status: 500 }
        )
    }
}
