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
    SmileIcon,
    UploadCloudIcon,
    Trash2Icon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SoalConfig } from '@/lib/ai/prompts/soal'
import { exportSoalToDocx } from '@/lib/export/docx'
import { createDocument, updateDocument } from '@/lib/db/documents'
import { extractTextFromFile } from '@/lib/utils/ocr'

export default function GenerateSoalPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<any>(null)
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
            setConfig(prev => ({ ...prev, materi: text }))
        } catch (err: any) {
            setError('Gagal membaca file. Pastikan formatnya PDF atau Gambar.')
            setOcrFile(null)
        } finally {
            setLoadingOCR(false)
        }
    }

    const updateSoalContent = (idx: number, field: string, value: any) => {
        setHasUnsavedChanges(true)
        setResult((prev: any) => {
            const newSoal = [...prev.soal]
            if (field.startsWith('opsi.')) {
                const key = field.split('.')[1]
                newSoal[idx].opsi = { ...newSoal[idx].opsi, [key]: value }
            } else {
                newSoal[idx][field] = value
            }
            return { ...prev, soal: newSoal }
        })
    }

    const handleUpdateDocument = async () => {
        if (!currentDocId) return
        setIsSaving(true)
        try {
            await updateDocument(currentDocId, { content: result })
            setHasUnsavedChanges(false)
        } catch (err: any) {
            setError('Gagal menyimpan perubahan.')
        } finally {
            setIsSaving(false)
        }
    }

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

    const jenjangFaseMap: Record<string, { fase: string; kelas: string[] }> = {
        'SD': { fase: 'A/B/C', kelas: ['1', '2', '3', '4', '5', '6'] },
        'SMP': { fase: 'D', kelas: ['7', '8', '9'] },
        'SMA': { fase: 'E/F', kelas: ['10', '11', '12'] },
        'SMK': { fase: 'E/F', kelas: ['10', '11', '12'] },
    }

    const [activeTab, setActiveTab] = useState<'soal' | 'kunci' | 'kisi'>('soal')
    const [loadingTasks, setLoadingTasks] = useState<string[]>([])

    const loadingSteps = [
        "Membaca materi...",
        "Menyusun butir soal...",
        "Membuat kunci jawaban...",
        "Menyusun kisi-kisi standar Kemendikbud...",
        "Finishing & Perapihan..."
    ]

    // Simulate loading checklist during handleGenerate
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
            fase: map.fase.split('/')[0], // Default to first fase
            kelas: map.kelas[0]
        })
    }

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        setStep(4)
        runLoadingSimulation()

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
                const savedDoc = await createDocument({
                    title: `Soal ${config.mataPelajaran} - ${config.materi.substring(0, 30)}...`,
                    content: data,
                    type: 'soal',
                    metadata: {
                        kurikulum: config.kurikulum,
                        jenjang: config.jenjang,
                        fase: config.fase,
                        kelas: config.kelas,
                        mapel: config.mataPelajaran,
                        tipe: config.tipeSoal,
                        jumlah: config.jumlahSoal,
                        kesulitan: config.tingkatKesulitan
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
                                            <option>K13 Revisi</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Jenjang</label>
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
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
                                        <select
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
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
                                            min="1"
                                            max="50"
                                            className="w-full p-3 bg-warm-50 border border-warm-200 rounded-lg outline-none focus:border-coral-400"
                                            value={config.jumlahSoal}
                                            onChange={e => setConfig({ ...config, jumlahSoal: parseInt(e.target.value) || 1 })}
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
                                            <option>Campuran</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-sm font-semibold text-warm-700">Jenis Soal</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Pilihan Ganda', 'Essay', 'Isian Singkat', 'Benar/Salah'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => {
                                                        const current = config.jenisSoal;
                                                        if (current.includes(type)) {
                                                            if (current.length > 1) {
                                                                setConfig({ ...config, jenisSoal: current.filter(x => x !== type) })
                                                            }
                                                        } else {
                                                            setConfig({ ...config, jenisSoal: [...current, type] })
                                                        }
                                                    }}
                                                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${config.jenisSoal.includes(type)
                                                        ? 'bg-coral-500 text-white border-coral-600 shadow-md'
                                                        : 'bg-white text-warm-700 border-warm-200 hover:border-coral-300'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
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
                                <div className="space-y-6">
                                    {/* Upload Area */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Upload Materi (PDF/Gambar) - <span className="text-coral-500 font-bold italic">Opsi Populer</span></label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".pdf,image/*"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                disabled={loadingOCR}
                                            />
                                            <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${loadingOCR ? 'bg-warm-50 border-warm-200' : ocrFile ? 'bg-success/5 border-success/30' : 'bg-warm-50 border-warm-200 group-hover:border-coral-400 group-hover:bg-coral-50/30'}`}>
                                                {loadingOCR ? (
                                                    <>
                                                        <Loader2Icon className="w-10 h-10 text-coral-500 animate-spin mb-3" />
                                                        <p className="text-sm font-bold text-coral-600 animate-pulse">Sedang membaca materi...</p>
                                                    </>
                                                ) : ocrFile ? (
                                                    <>
                                                        <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center mb-3">
                                                            <CheckCircle2Icon className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-sm font-bold text-success truncate max-w-[250px]">{ocrFile.name}</p>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setOcrFile(null); setConfig({ ...config, materi: '' }) }}
                                                            className="mt-2 text-[10px] font-black text-warm-400 uppercase tracking-widest hover:text-error transition"
                                                        >
                                                            Ganti File
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UploadCloudIcon className="w-10 h-10 text-warm-300 mb-3 group-hover:text-coral-500 transition-colors" />
                                                        <p className="font-bold text-warm-700">Klik atau seret file ke sini</p>
                                                        <p className="text-xs text-warm-400">PDF atau Foto Buku (Max 10MB)</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-warm-100"></div></div>
                                        <div className="relative flex justify-center text-xs uppercase font-black text-warm-300"><span className="bg-white px-2">Atau Tempel Teks</span></div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-warm-700">Input Materi Manual</label>
                                        <textarea
                                            className="w-full p-4 bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-coral-400 min-h-[150px]"
                                            placeholder="Atau Bapak/Ibu bisa ketik/tempel materi di sini..."
                                            value={config.materi}
                                            onChange={e => setConfig({ ...config, materi: e.target.value })}
                                        />
                                        <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex gap-3 text-teal-700 text-sm">
                                            <ZapIcon className="w-5 h-5 flex-shrink-0" />
                                            <p>Tips: Semakin lengkap materinya, semakin mantap soal yang dihasilkan GuruKit.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex justify-between">
                                    <Button variant="ghost" onClick={prevStep}>
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>
                                    <Button onClick={handleGenerate} disabled={!config.materi || loadingOCR}>
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
                                className="flex-1 flex flex-col"
                            >
                                {loading ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-coral-100 border-t-coral-500 rounded-full animate-spin mx-auto" />
                                            <BrainIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-coral-500" />
                                        </div>
                                        <div className="w-full max-w-sm space-y-4">
                                            <h2 className="text-2xl font-bold text-warm-900 text-center">AI sedang meracik soal...</h2>
                                            <div className="space-y-3">
                                                {loadingSteps.map((task, i) => (
                                                    <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${loadingTasks.includes(task) ? 'text-success font-medium' : 'text-warm-400'}`}>
                                                        {loadingTasks.includes(task) ? <CheckCircle2Icon className="w-5 h-5" /> : <Loader2Icon className="w-5 h-5 animate-spin" />}
                                                        {task}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                        <AlertCircleIcon className="w-16 h-16 text-error mx-auto" />
                                        <h2 className="text-2xl font-bold text-warm-900">Waduh, ada masalah!</h2>
                                        <p className="text-warm-600">{error}</p>
                                        <Button onClick={() => setStep(3)}>Coba Lagi</Button>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-6">
                                        <div className="flex items-center justify-between border-b border-warm-100 pb-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setActiveTab('soal')}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'soal' ? 'bg-coral-500 text-white shadow-md' : 'text-warm-500 hover:bg-warm-50'}`}
                                                >
                                                    Soal
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('kunci')}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'kunci' ? 'bg-coral-500 text-white shadow-md' : 'text-warm-500 hover:bg-warm-50'}`}
                                                >
                                                    Kunci Jawaban
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('kisi')}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'kisi' ? 'bg-coral-500 text-white shadow-md' : 'text-warm-500 hover:bg-warm-50'}`}
                                                >
                                                    Kisi-kisi
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setStep(1)} className="text-xs">
                                                    Buat Baru
                                                </Button>
                                                <Button size="sm" onClick={() => exportSoalToDocx(result)} className="text-xs">
                                                    Download Word
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="max-h-[600px] overflow-y-auto pr-2">
                                            {activeTab === 'soal' && (
                                                <div className="space-y-8">
                                                    {result?.soal.map((s: any, idx: number) => (
                                                        <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-warm-200 shadow-sm hover:shadow-md transition-all group">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <span className="px-3 py-1 bg-warm-100 text-warm-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-warm-200">
                                                                    Soal #{s.nomor} — {s.level_kognitif}
                                                                </span>
                                                            </div>
                                                            <textarea
                                                                value={s.soal}
                                                                onChange={(e) => updateSoalContent(idx, 'soal', e.target.value)}
                                                                className="w-full bg-transparent text-warm-900 font-bold mb-8 text-xl tracking-tight leading-relaxed outline-none focus:ring-2 focus:ring-coral-100 rounded-xl p-2 -ml-2 resize-none"
                                                                rows={3}
                                                            />
                                                            {s.opsi ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {Object.entries(s.opsi).map(([key, val]: any) => (
                                                                        <div key={key} className={`p-4 rounded-2xl border-2 flex gap-4 transition-all ${s.kunci_jawaban === key ? 'bg-success/5 border-success/30 text-success' : 'bg-warm-50/50 border-warm-100 text-warm-700 focus-within:border-coral-300'}`}>
                                                                            <span className="font-black uppercase w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">{key}</span>
                                                                            <input
                                                                                type="text"
                                                                                value={val}
                                                                                onChange={(e) => updateSoalContent(idx, `opsi.${key}`, e.target.value)}
                                                                                className="bg-transparent font-medium outline-none w-full"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="p-6 bg-warm-50 border border-warm-200 rounded-2xl">
                                                                    <p className="text-[10px] font-black text-warm-400 uppercase mb-3 tracking-widest">Kunci Jawaban Essay:</p>
                                                                    <textarea
                                                                        value={s.kunci_jawaban}
                                                                        onChange={(e) => updateSoalContent(idx, 'kunci_jawaban', e.target.value)}
                                                                        className="w-full bg-transparent text-warm-700 font-medium outline-none resize-none"
                                                                        rows={2}
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="mt-6 pt-6 border-t border-warm-100">
                                                                <p className="text-[10px] font-black text-warm-300 uppercase mb-2 tracking-widest">Pembahasan:</p>
                                                                <textarea
                                                                    value={s.pembahasan}
                                                                    onChange={(e) => updateSoalContent(idx, 'pembahasan', e.target.value)}
                                                                    className="w-full bg-transparent text-sm text-warm-500 leading-relaxed outline-none resize-none italic"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {activeTab === 'kunci' && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                        {result?.soal.map((s: any, idx: number) => (
                                                            <div key={idx} className="p-4 bg-white border border-warm-200 rounded-xl flex flex-col items-center">
                                                                <span className="text-xs text-warm-400 font-bold uppercase mb-1">No. {s.nomor}</span>
                                                                <select
                                                                    value={s.kunci_jawaban}
                                                                    onChange={(e) => updateSoalContent(idx, 'kunci_jawaban', e.target.value)}
                                                                    className="text-2xl font-black text-coral-600 uppercase bg-transparent outline-none cursor-pointer"
                                                                >
                                                                    {s.opsi ? Object.keys(s.opsi).map(k => (
                                                                        <option key={k} value={k}>{k.toUpperCase()}</option>
                                                                    )) : <option value={s.kunci_jawaban}>Custom</option>}
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'kisi' && (
                                                <div className="overflow-x-auto border border-warm-200 rounded-2xl">
                                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                                        <thead>
                                                            <tr className="bg-warm-100 text-warm-600 text-[10px] font-bold uppercase tracking-wider">
                                                                <th className="p-4 border-b border-warm-200">No</th>
                                                                <th className="p-4 border-b border-warm-200">KD / Capaian Pembelajaran</th>
                                                                <th className="p-4 border-b border-warm-200">Materi</th>
                                                                <th className="p-4 border-b border-warm-200">Indikator Soal</th>
                                                                <th className="p-4 border-b border-warm-200">Level</th>
                                                                <th className="p-4 border-b border-warm-200">Bentuk</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-warm-100 bg-white">
                                                            {result?.kisi_kisi.map((k: any, idx: number) => (
                                                                <tr key={idx} className="text-xs text-warm-700 hover:bg-warm-50/50 transition">
                                                                    <td className="p-4 font-bold">{k.no}</td>
                                                                    <td className="p-4 max-w-[200px] leading-relaxed">{k.cp_kd}</td>
                                                                    <td className="p-4 font-medium">{k.materi}</td>
                                                                    <td className="p-4 leading-relaxed">{k.indikator}</td>
                                                                    <td className="p-4 text-center">{k.level_kognitif}</td>
                                                                    <td className="p-4 text-center">{k.bentuk_soal}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>

                                        <div className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-500 ${hasUnsavedChanges ? 'bg-amber-50 border-amber-200' : 'bg-teal-50 border-teal-100'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${hasUnsavedChanges ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-teal-500'}`}>
                                                    {hasUnsavedChanges ? <AlertCircleIcon className="w-6 h-6" /> : <CheckCircle2Icon className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-black tracking-tight ${hasUnsavedChanges ? 'text-amber-900' : 'text-teal-900'}`}>{hasUnsavedChanges ? 'Ada Perubahan Belum Disimpan' : 'Semua Perubahan Tersimpan!'}</p>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${hasUnsavedChanges ? 'text-amber-600' : 'text-teal-600'}`}>{hasUnsavedChanges ? 'Jangan lupa simpan sebelum keluar' : 'Dokumen Anda aman di dashboard'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {hasUnsavedChanges ? (
                                                    <Button
                                                        disabled={isSaving}
                                                        onClick={handleUpdateDocument}
                                                        className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg animate-bounce-subtle"
                                                    >
                                                        {isSaving ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <ZapIcon className="w-4 h-4 mr-2" />}
                                                        Simpan Perbaikan
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" className="text-xs text-teal-700 hover:bg-teal-100" onClick={() => router.push('/dashboard')}>
                                                        Ke Dashboard
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
