'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createDocument, updateDocument } from '@/lib/db/documents'
import { extractTextFromFile } from '@/lib/utils/ocr'
import { ModulAjarConfig } from '@/lib/ai/prompts/modul-ajar'
import { exportModulToDocx } from '@/lib/export/docx'
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
    CopyIcon,
    UploadCloudIcon,
    Trash2Icon
} from 'lucide-react'

export default function GenerateModulPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<string | null>(null)
    const [loadingOCR, setLoadingOCR] = useState(false)
    const [ocrFile, setOcrFile] = useState<File | null>(null)
    const [currentDocId, setCurrentDocId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setOcrFile(file)
        setLoadingOCR(true)
        setError(null)

        try {
            const text = await extractTextFromFile(file)
            setConfig(prev => ({ ...prev, materiPokok: text }))
        } catch (err: any) {
            setError('Gagal membaca file. Pastikan formatnya PDF atau Gambar.')
            setOcrFile(null)
        } finally {
            setLoadingOCR(false)
        }
    }

    const handleUpdateDocument = async () => {
        if (!currentDocId || !result) return
        setIsSaving(true)
        try {
            await updateDocument(currentDocId, { content: { text: result } })
            setHasUnsavedChanges(false)
        } catch (err: any) {
            setError('Gagal menyimpan perubahan.')
        } finally {
            setIsSaving(false)
        }
    }

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

    const jenjangFaseMap: Record<string, { fase: string; kelas: string[] }> = {
        'SD': { fase: 'A/B/C', kelas: ['1', '2', '3', '4', '5', '6'] },
        'SMP': { fase: 'D', kelas: ['7', '8', '9'] },
        'SMA': { fase: 'E/F', kelas: ['10', '11', '12'] },
        'SMK': { fase: 'E/F', kelas: ['10', '11', '12'] },
    }

    const [loadingTasks, setLoadingTasks] = useState<string[]>([])
    const loadingSteps = [
        "Menganalisis Capaian Pembelajaran (CP)...",
        "Menyusun Tujuan Pembelajaran (TP)...",
        "Merancang langkah-langkah pembelajaran...",
        "Menyiapkan asesmen & instrumen...",
        "Menyusun lampiran & bahan ajar..."
    ]

    const runLoadingSimulation = async () => {
        setLoadingTasks([])
        for (const task of loadingSteps) {
            setLoadingTasks(prev => [...prev, task])
            await new Promise(resolve => setTimeout(resolve, 3000))
        }
    }

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleJenjangChange = (val: string) => {
        const map = jenjangFaseMap[val]
        setConfig({
            ...config,
            jenjang: val,
            fase: map.fase.split('/')[0],
            kelas: map.kelas[0]
        })
    }

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        setStep(3)
        runLoadingSimulation()

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
                const savedDoc = await createDocument({
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
                setCurrentDocId(savedDoc.id)
            } catch (saveError) {
                console.error('Auto-save failed:', saveError)
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
                                        <label className="text-sm font-semibold text-warm-700">Alokasi Waktu</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            value={config.alokasiWaktu}
                                            onChange={e => setConfig({ ...config, alokasiWaktu: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* OCR Upload Area for Modul */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-warm-700">Scan Buku / Materi (PDF/Gambar) - <span className="text-teal-500 font-bold italic">Opsi</span></label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept=".pdf,image/*"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            disabled={loadingOCR}
                                        />
                                        <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${loadingOCR ? 'bg-warm-50 border-warm-200' : ocrFile ? 'bg-success/5 border-success/30' : 'bg-warm-50 border-warm-200 group-hover:border-teal-400 group-hover:bg-teal-50/30'}`}>
                                            {loadingOCR ? (
                                                <>
                                                    <Loader2Icon className="w-8 h-8 text-teal-500 animate-spin mb-2" />
                                                    <p className="text-xs font-bold text-teal-600 animate-pulse">Sedang membaca materi...</p>
                                                </>
                                            ) : ocrFile ? (
                                                <>
                                                    <div className="w-10 h-10 bg-success/20 text-success rounded-full flex items-center justify-center mb-2">
                                                        <CheckCircle2Icon className="w-5 h-5" />
                                                    </div>
                                                    <p className="text-xs font-bold text-success truncate max-w-[200px]">{ocrFile.name}</p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setOcrFile(null); setConfig({ ...config, materiPokok: '' }) }}
                                                        className="mt-1 text-[9px] font-black text-warm-400 uppercase tracking-widest hover:text-error transition"
                                                    >
                                                        Ganti File
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloudIcon className="w-8 h-8 text-warm-300 mb-2 group-hover:text-teal-500 transition-colors" />
                                                    <p className="text-sm font-bold text-warm-700">Upload Referensi Materi (Opsional)</p>
                                                    <p className="text-[10px] text-warm-400">PDF atau Foto Buku (Max 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-warm-700">Materi Pokok / Deskripsi</label>
                                    <textarea
                                        className="w-full p-4 bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-teal-400 min-h-[100px]"
                                        placeholder="Tuliskan topik atau salin materi di sini..."
                                        value={config.materiPokok}
                                        onChange={e => setConfig({ ...config, materiPokok: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Jenjang</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            value={config.jenjang}
                                            onChange={e => handleJenjangChange(e.target.value)}
                                        >
                                            <option>SD</option>
                                            <option>SMP</option>
                                            <option>SMA</option>
                                            <option>SMK</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Kelas</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-teal-400"
                                            value={config.kelas}
                                            onChange={e => {
                                                const k = e.target.value;
                                                let f = config.fase;
                                                if (config.jenjang === 'SD') {
                                                    if (['1', '2'].includes(k)) f = 'A'
                                                    else if (['3', '4'].includes(k)) f = 'B'
                                                    else f = 'C'
                                                }
                                                setConfig({ ...config, kelas: k, fase: f })
                                            }}
                                        >
                                            {jenjangFaseMap[config.jenjang].kelas.map(k => (
                                                <option key={k} value={k}>Kelas {k}</option>
                                            ))}
                                        </select>
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
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin mx-auto" />
                                            <BookOpenIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-teal-500" />
                                        </div>
                                        <div className="w-full max-w-sm space-y-4">
                                            <h2 className="text-2xl font-bold text-warm-900 text-center">AI sedang merancang modul...</h2>
                                            <div className="space-y-3">
                                                {loadingSteps.map((task, i) => (
                                                    <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${loadingTasks.includes(task) ? 'text-success font-medium' : 'text-warm-400'}`}>
                                                        {loadingTasks.includes(task) ? <CheckCircle2Icon className="w-5 h-5 text-success" /> : <Loader2Icon className="w-5 h-5 animate-spin" />}
                                                        {task}
                                                    </div>
                                                ))}
                                            </div>
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
                                    <div className="w-full space-y-6">
                                        <div className="flex items-center justify-between border-b border-warm-100 pb-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-warm-900">Modul Ajar Siap! 🎉</h2>
                                                <p className="text-warm-500 text-sm">Terdiri dari 13 komponen lengkap Kurikulum Merdeka.</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setStep(1)} className="text-xs">
                                                    Buat Baru
                                                </Button>
                                                <Button size="sm" onClick={() => exportModulToDocx(result || '')} className="text-xs">
                                                    Download Word
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[2rem] border border-warm-200 p-8 shadow-inner overflow-hidden flex flex-col group">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[10px] font-black text-warm-400 uppercase tracking-widest">Konten Modul Ajar (Dapat Diubah):</p>
                                                {hasUnsavedChanges && <span className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1 animate-pulse"><ZapIcon className="w-3 h-3" /> Ada Perubahan</span>}
                                            </div>
                                            <textarea
                                                value={result || ''}
                                                onChange={(e) => {
                                                    setResult(e.target.value)
                                                    setHasUnsavedChanges(true)
                                                }}
                                                className="w-full flex-1 min-h-[400px] bg-warm-50/50 p-6 rounded-2xl border border-warm-100 font-sans text-sm whitespace-pre-wrap leading-relaxed outline-none focus:bg-white focus:border-teal-300 transition-all resize-none shadow-inner"
                                            />
                                        </div>

                                        <div className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-500 ${hasUnsavedChanges ? 'bg-amber-50 border-amber-200' : 'bg-teal-50 border-teal-100'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 ${hasUnsavedChanges ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-teal-500'}`}>
                                                    {hasUnsavedChanges ? <AlertCircleIcon className="w-6 h-6" /> : <CheckCircle2Icon className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-black tracking-tight ${hasUnsavedChanges ? 'text-amber-900' : 'text-teal-900'}`}>{hasUnsavedChanges ? 'Perubahan Belum Disimpan' : 'Semua Aman!'}</p>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${hasUnsavedChanges ? 'text-amber-600' : 'text-teal-600'}`}>{hasUnsavedChanges ? 'Ketuk simpan untuk memperbarui database' : 'Dokumen tersimpan otomatis'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {hasUnsavedChanges ? (
                                                    <Button
                                                        disabled={isSaving}
                                                        onClick={handleUpdateDocument}
                                                        className="bg-amber-500 hover:bg-amber-600 shadow-lg text-white"
                                                    >
                                                        {isSaving ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <ZapIcon className="w-4 h-4 mr-2" />}
                                                        Simpan Perubahan
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" className="text-xs text-teal-700 hover:bg-teal-100" onClick={() => router.push('/dashboard')}>
                                                        Dashboard
                                                    </Button>
                                                )}
                                            </div>
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
