'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileTextIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircle2Icon,
    ZapIcon,
    BookIcon,
    BrainIcon,
    Loader2Icon,
    AlertCircleIcon,
    SmileIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SoalConfig } from '@/lib/ai/prompts/soal'
import { exportSoalToDocx } from '@/lib/export/docx'
import { createDocument } from '@/lib/db/documents'

export default function GenerateSoalPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<any>(null)

    const [config, setConfig] = useState<SoalConfig>({
        kurikulum: 'Kurikulum Merdeka',
        jenjang: 'SD',
        fase: 'C',
        kelas: '5',
        mataPelajaran: '',
        materi: '',
        jumlahSoal: 10,
        jenisSoal: ['Pilihan Ganda'],
        tingkatKesulitan: 'Sedang',
        levelKognitif: 'otomatis',
        tipeSoal: 'Standar'
    })

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        setStep(4)

        try {
            const response = await fetch('/api/generate/soal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })

            if (!response.ok) throw new Error('Gagal membuat soal. Coba lagi ya!')

            const data = await response.json()
            setResult(data)

            // Auto-save to Supabase
            try {
                await createDocument({
                    title: `Soal ${config.mataPelajaran} - ${config.materi.substring(0, 30)}...`,
                    content: data,
                    type: 'soal',
                    metadata: {
                        kurikulum: config.kurikulum,
                        jenjang: config.jenjang,
                        fase: config.fase,
                        kelas: config.kelas,
                        mapel: config.mataPelajaran,
                        materi: config.materi
                    }
                })
            } catch (saveErr) {
                console.error('Failed to auto-save document:', saveErr)
                // We don't block the user if auto-save fails, but we could show a toast
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center">
                        <FileTextIcon className="w-7 h-7 text-coral-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-warm-900">Bikin Soal Pintar</h1>
                        <p className="text-warm-600">Lengkapi data untuk membuat soal otomatis.</p>
                    </div>
                </div>

                {/* Wizard Steps */}
                <div className="flex items-center justify-between mb-12 px-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center flex-1 last:flex-none">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                ${step >= i ? 'bg-coral-500 text-white shadow-md' : 'bg-warm-200 text-warm-500'}
              `}>
                                {i}
                            </div>
                            {i < 3 && (
                                <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${step > i ? 'bg-coral-500' : 'bg-warm-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-warm-200 p-8 min-h-[400px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Kurikulum</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            value={config.kurikulum}
                                            onChange={e => setConfig({ ...config, kurikulum: e.target.value })}
                                        >
                                            <option>Kurikulum Merdeka</option>
                                            <option>K-13</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Jenjang</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            value={config.jenjang}
                                            onChange={e => setConfig({ ...config, jenjang: e.target.value })}
                                        >
                                            <option>SD</option>
                                            <option>SMP</option>
                                            <option>SMA</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Mata Pelajaran</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            placeholder="Contoh: Matematika"
                                            value={config.mataPelajaran}
                                            onChange={e => setConfig({ ...config, mataPelajaran: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Kelas</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            value={config.kelas}
                                            onChange={e => setConfig({ ...config, kelas: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex justify-end">
                                    <Button onClick={nextStep} disabled={!config.mataPelajaran}>
                                        Lanjut
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Jumlah Soal</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            value={config.jumlahSoal}
                                            onChange={e => setConfig({ ...config, jumlahSoal: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Tingkat Kesulitan</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            value={config.tingkatKesulitan}
                                            onChange={e => setConfig({ ...config, tingkatKesulitan: e.target.value })}
                                        >
                                            <option>Mudah</option>
                                            <option>Sedang</option>
                                            <option>Sulit</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Tipe Soal</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            value={config.tipeSoal}
                                            onChange={e => setConfig({ ...config, tipeSoal: e.target.value as any })}
                                        >
                                            <option>Standar</option>
                                            <option>Soal HOTS</option>
                                            <option>Soal AKM</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex justify-between">
                                    <Button variant="ghost" onClick={prevStep}>
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>
                                    <Button onClick={nextStep}>
                                        Lanjut
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1"
                            >
                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-warm-700">Materi Pokok / Topik</label>
                                    <textarea
                                        className="w-full p-4 bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-coral-400 min-h-[150px]"
                                        placeholder="Tuliskan materi atau topik yang ingin dibuatkan soalnya..."
                                        value={config.materi}
                                        onChange={e => setConfig({ ...config, materi: e.target.value })}
                                    />
                                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex gap-3 text-teal-700 text-sm">
                                        <ZapIcon className="w-5 h-5 flex-shrink-0" />
                                        <p>Tips: Semakin detail materi yang Anda tulis, semakin akurat soal yang dihasilkan AI.</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex justify-between">
                                    <Button variant="ghost" onClick={prevStep}>
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>
                                    <Button onClick={handleGenerate} disabled={!config.materi}>
                                        Mulai Generate
                                        <ZapIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center p-8"
                            >
                                {loading ? (
                                    <div className="text-center space-y-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-coral-100 border-t-coral-500 rounded-full animate-spin mx-auto" />
                                            <BrainIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-coral-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold text-warm-900">Sedang meracik soal untuk Anda...</h2>
                                            <p className="text-warm-600 animate-pulse">Tunggu sebentar ya, AI sedang berpikir 🤔</p>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="text-center space-y-6">
                                        <AlertCircleIcon className="w-16 h-16 text-error mx-auto" />
                                        <h2 className="text-2xl font-bold text-warm-900">Waduh, ada masalah!</h2>
                                        <p className="text-warm-600">{error}</p>
                                        <Button onClick={() => setStep(3)}>Coba Lagi</Button>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-8">
                                        <div className="text-center">
                                            <CheckCircle2Icon className="w-16 h-16 text-success mx-auto mb-4" />
                                            <h2 className="text-3xl font-bold text-warm-900">Soal Berhasil Dibuat! 🎉</h2>
                                            <p className="text-warm-600">Silakan tinjau soal Anda di bawah ini.</p>
                                        </div>

                                        <div className="space-y-6 max-h-[500px] overflow-y-auto p-4 border border-warm-100 rounded-2xl">
                                            {result?.soal.map((s: any, idx: number) => (
                                                <div key={idx} className="p-6 bg-warm-50 rounded-xl border border-warm-200">
                                                    <p className="font-bold text-coral-600 mb-2">Soal #{idx + 1} ({s.level_kognitif})</p>
                                                    <p className="text-warm-900 font-medium mb-4">{s.soal}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {Object.entries(s.opsi).map(([key, val]: any) => (
                                                            <div key={key} className={`p-3 rounded-lg border flex gap-3 ${s.kunci_jawaban === key ? 'bg-success/10 border-success text-success' : 'bg-white border-warm-200'}`}>
                                                                <span className="font-bold uppercase">{key}.</span>
                                                                <span>{val}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 p-4 bg-white rounded-lg border border-warm-200 text-sm">
                                                        <p className="font-bold text-warm-700 mb-1">Pembahasan:</p>
                                                        <p className="text-warm-600">{s.pembahasan}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                            <Button
                                                className="flex-1"
                                                variant="primary"
                                                onClick={() => exportSoalToDocx(result)}
                                            >
                                                Download Word (.docx)
                                            </Button>
                                            <Button className="flex-1" variant="secondary" onClick={() => setStep(1)}>
                                                Buat Baru
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
