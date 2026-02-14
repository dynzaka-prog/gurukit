import { NextResponse } from 'next/server'
import { generateJSON } from '@/lib/ai/gemini'
import { SOAL_SYSTEM_PROMPT, generateSoalPrompt, SoalConfig } from '@/lib/ai/prompts/soal'

export async function POST(req: Request) {
    try {
        const config: SoalConfig = await req.json()

        const prompt = generateSoalPrompt(config)
        const result = await generateJSON(prompt, SOAL_SYSTEM_PROMPT)

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Generation error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate questions' },
            { status: 500 }
        )
    }
}
