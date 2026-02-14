'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpenIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircle2Icon,
    ZapIcon,
    ClockIcon,
    UsersIcon,
    SparklesIcon,
    Loader2Icon,
    AlertCircleIcon,
    CopyIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ModulAjarConfig } from '@/lib/ai/prompts/modul-ajar'
import { exportModulToDocx } from '@/lib/export/docx'
import { createDocument } from '@/lib/db/documents'

export default function GenerateModulPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<string | null>(null)

    const [config, setConfig] = useState<ModulAjarConfig>({
        jenjang: 'SD',
        fase: 'C',
        kelas: '5',
        mataPelajaran: '',
        materiPokok: '',
        alokasiWaktu: '2 x 35 Menit',
        modelPembelajaran: 'Problem Based Learning (PBL)',
        profilPelajarPancasila: ['Bernalar Kritis', 'Kreatif'],
        targetSiswa: 'Siswa Reguler'
    })

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        setStep(3)

        try {
            const response = await fetch('/api/generate/modul', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })

            if (!response.ok) throw new Error('Gagal membuat modul. Coba lagi ya!')

            const data = await response.json()
            setResult(data.content)

            // Auto-save to Supabase
            try {
                await createDocument({
                    title: `Modul ${config.mataPelajaran} - ${config.materiPokok.substring(0, 30)}...`,
                    content: { text: data.content },
                    type: 'modul',
                    metadata: {
                        jenjang: config.jenjang,
                        fase: config.fase,
                        kelas: config.kelas,
                        mapel: config.mataPelajaran,
                        materi: config.materiPokok,
                        alokasi: config.alokasiWaktu,
                        model: config.modelPembelajaran
                    }
                })
            } catch (saveErr) {
                console.error('Failed to auto-save document:', saveErr)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result)
            alert('Berhasil disalin!')
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <BookOpenIcon className="w-7 h-7 text-teal-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-warm-900">Bikin Modul Ajar</h1>
                        <p className="text-warm-600">Terstruktur lengkap sesuai Kurikulum Merdeka.</p>
                    </div>
                </div>

                {/* Wizard Steps */}
                <div className="flex items-center justify-between mb-12 px-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center flex-1 last:flex-none">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                ${step >= i ? 'bg-teal-500 text-white shadow-md' : 'bg-warm-200 text-warm-500'}
              `}>
                                {i}
                            </div>
                            {i < 2 && (
                                <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${step > i ? 'bg-teal-500' : 'bg-warm-200'}`} />
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
                                        <label className="text-sm font-semibold text-warm-700">Mata Pelajaran</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            placeholder="Contoh: IPA"
                                            value={config.mataPelajaran}
                                            onChange={e => setConfig({ ...config, mataPelajaran: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Materi Pokok / Topik</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            placeholder="Contoh: Rantai Makanan"
                                            value={config.materiPokok}
                                            onChange={e => setConfig({ ...config, materiPokok: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Jenjang</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            value={config.jenjang}
                                            onChange={e => setConfig({ ...config, jenjang: e.target.value })}
                                        >
                                            <option>SD</option>
                                            <option>SMP</option>
                                            <option>SMA</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Alokasi Waktu</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            value={config.alokasiWaktu}
                                            onChange={e => setConfig({ ...config, alokasiWaktu: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex justify-end">
                                    <Button onClick={nextStep} disabled={!config.mataPelajaran || !config.materiPokok}>
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
                                        <label className="text-sm font-semibold text-warm-700">Model Pembelajaran</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            value={config.modelPembelajaran}
                                            onChange={e => setConfig({ ...config, modelPembelajaran: e.target.value })}
                                        >
                                            <option>Problem Based Learning (PBL)</option>
                                            <option>Project Based Learning (PjBL)</option>
                                            <option>Discovery Learning</option>
                                            <option>Inquiry Learning</option>
                                            <option>Ceramah Interaktif</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Target Siswa</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            value={config.targetSiswa}
                                            onChange={e => setConfig({ ...config, targetSiswa: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-semibold text-warm-700">Profil Pelajar Pancasila</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mandiri', 'Bernalar Kritis', 'Kreatif', 'Gotong Royong', 'Berkebinekaan Global', 'Beriman & Bertaqwa'].map(p => (
                                            <button
                                                key={p}
                                                onClick={() => {
                                                    const current = config.profilPelajarPancasila;
                                                    if (current.includes(p)) {
                                                        setConfig({ ...config, profilPelajarPancasila: current.filter(x => x !== p) })
                                                    } else {
                                                        setConfig({ ...config, profilPelajarPancasila: [...current, p] })
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${config.profilPelajarPancasila.includes(p)
                                                    ? 'bg-teal-500 text-white border-teal-600 shadow-md'
                                                    : 'bg-white text-warm-700 border-warm-200 hover:border-teal-300'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex justify-between">
                                    <Button variant="ghost" onClick={prevStep}>
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>
                                    <Button onClick={handleGenerate}>
                                        Mulai Generate
                                        <SparklesIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center p-8"
                            >
                                {loading ? (
                                    <div className="text-center space-y-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin mx-auto" />
                                            <BookOpenIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-teal-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold text-warm-900">Merancang Modul Ajar terbaik...</h2>
                                            <p className="text-warm-600 animate-pulse">Kurikulum Merdeka emang detail, sabar ya Bapak/Ibu ☕</p>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="text-center space-y-6">
                                        <AlertCircleIcon className="w-16 h-16 text-error mx-auto" />
                                        <h2 className="text-2xl font-bold text-warm-900">Waduh, ada masalah!</h2>
                                        <p className="text-warm-600">{error}</p>
                                        <Button onClick={() => setStep(2)}>Coba Lagi</Button>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-8">
                                        <div className="text-center">
                                            <CheckCircle2Icon className="w-16 h-16 text-success mx-auto mb-4" />
                                            <h2 className="text-3xl font-bold text-warm-900">Modul Ajar Siap! 🎉</h2>
                                            <p className="text-warm-600">Terdiri dari 13 komponen lengkap Kurikulum Merdeka.</p>
                                        </div>

                                        <div className="w-full bg-warm-50 rounded-2xl border border-warm-200 p-6 max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                                            {result}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                            <Button className="flex-1" variant="primary">
                                                Download Word (.docx)
                                            </Button>
                                            <Button className="flex-1" variant="secondary" onClick={copyToClipboard}>
                                                <CopyIcon className="w-4 h-4 mr-2" />
                                                Salin Teks
                                            </Button>
                                            <Button className="flex-1" variant="ghost" onClick={() => setStep(1)}>
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
