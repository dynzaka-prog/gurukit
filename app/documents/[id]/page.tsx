'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDocuments, updateDocument } from '@/lib/db/documents'
import { Button } from '@/components/ui/button'
import {
    ArrowLeftIcon,
    DownloadIcon,
    Trash2Icon,
    CheckCircle2Icon,
    AlertCircleIcon,
    Loader2Icon,
    BrainIcon,
    ZapIcon
} from 'lucide-react'
import { exportSoalToDocx, exportModulToDocx } from '@/lib/export/docx'
import { motion } from 'framer-motion'

export default function DocumentDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [doc, setDoc] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'soal' | 'kunci' | 'kisi'>('soal')
    const [isSaving, setIsSaving] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [docContent, setDocContent] = useState<any>(null)
    const [docTitle, setDocTitle] = useState('')

    useEffect(() => {
        const loadDoc = async () => {
            try {
                const docs = await getDocuments()
                const found = docs.find(d => d.id === id)
                if (found) {
                    setDoc(found)
                    setDocContent(found.content)
                    setDocTitle(found.title)
                }
            } catch (error) {
                console.error('Error loading document:', error)
            } finally {
                setLoading(false)
            }
        }
        loadDoc()
    }, [id])

    const handleSave = async () => {
        if (!id) return
        setIsSaving(true)
        try {
            await updateDocument(id as string, { title: docTitle, content: docContent })
            setHasUnsavedChanges(false)
        } catch (err) {
            console.error('Save error:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const updateSoalContent = (idx: number, field: string, value: any) => {
        setHasUnsavedChanges(true)
        const newSoal = [...docContent.soal]
        if (field.startsWith('opsi.')) {
            const key = field.split('.')[1]
            newSoal[idx].opsi = { ...newSoal[idx].opsi, [key]: value }
        } else {
            newSoal[idx][field] = value
        }
        setDocContent({ ...docContent, soal: newSoal })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary">
                <Loader2Icon className="w-10 h-10 text-coral-500 animate-spin mb-4" />
                <p className="text-warm-500 font-medium">Membuka dokumen...</p>
            </div>
        )
    }

    if (!doc) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-8">
                <AlertCircleIcon className="w-16 h-16 text-error mb-4" />
                <h2 className="text-2xl font-bold text-warm-900">Dokumen tidak ditemukan</h2>
                <p className="text-warm-500 mb-8 text-center text-sm max-w-xs">Sepertinya dokumen ini sudah dihapus atau link-nya salah.</p>
                <Button onClick={() => router.push('/documents')}>Kembali ke Dokumen</Button>
            </div>
        )
    }

    const { content, type, metadata } = doc

    return (
        <div className="min-h-screen bg-bg-primary p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back Button & Actions */}
                <div className="flex items-center justify-between gap-4">
                    <Button variant="ghost" className="text-warm-500" onClick={() => router.push('/documents')}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <div className="flex gap-2">
                        {type === 'soal' && (
                            <Button size="sm" variant="primary" className="bg-coral-500 hover:bg-coral-600 shadow-md" onClick={() => router.push(`/quiz/${id}`)}>
                                <BrainIcon className="w-4 h-4 mr-2" />
                                Mainkan Kuis
                            </Button>
                        )}
                        <Button size="sm" variant="ghost" className="border border-warm-200" onClick={() => type === 'soal' ? exportSoalToDocx(content) : exportModulToDocx(content.text || content)}>
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Download Word
                        </Button>
                    </div>
                </div>

                {/* Document Header */}
                <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 inline-block ${type === 'soal' ? 'bg-coral-100 text-coral-600' : 'bg-teal-100 text-teal-600'}`}>
                                {type === 'soal' ? 'Generator Soal' : 'Modul Ajar'}
                            </div>
                            <input
                                type="text"
                                value={docTitle}
                                onChange={(e) => { setDocTitle(e.target.value); setHasUnsavedChanges(true) }}
                                className="w-full text-2xl md:text-3xl font-black text-warm-900 leading-tight bg-transparent border-b-2 border-transparent focus:border-coral-300 outline-none transition-all py-1"
                            />
                        </div>
                        {hasUnsavedChanges && (
                            <Button
                                disabled={isSaving}
                                onClick={handleSave}
                                className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg animate-bounce-subtle shrink-0 ml-4"
                            >
                                {isSaving ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <ZapIcon className="w-4 h-4 mr-2" />}
                                Simpan Perubahan
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-warm-50 rounded-2xl border border-warm-100">
                        <div>
                            <p className="text-[10px] text-warm-400 font-bold uppercase">Jenjang</p>
                            <p className="font-bold text-warm-700">{metadata?.jenjang || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-warm-400 font-bold uppercase">Kelas</p>
                            <p className="font-bold text-warm-700">{metadata?.kelas || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-warm-400 font-bold uppercase">Fase</p>
                            <p className="font-bold text-warm-700">{metadata?.fase || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-warm-400 font-bold uppercase">Mapel</p>
                            <p className="font-bold text-warm-700">{metadata?.mapel || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Content View */}
                <div className="bg-white rounded-3xl border border-warm-200 shadow-xl overflow-hidden min-h-[600px]">
                    {type === 'soal' ? (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 p-4 border-b border-warm-100 bg-warm-50/50">
                                <button onClick={() => setActiveTab('soal')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'soal' ? 'bg-coral-500 text-white shadow-md' : 'text-warm-500 hover:bg-warm-100'}`}>
                                    Soal
                                </button>
                                <button onClick={() => setActiveTab('kunci')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'kunci' ? 'bg-coral-500 text-white shadow-md' : 'text-warm-500 hover:bg-warm-100'}`}>
                                    Kunci Jawaban
                                </button>
                                <button onClick={() => setActiveTab('kisi')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'kisi' ? 'bg-coral-500 text-white shadow-md' : 'text-warm-500 hover:bg-warm-100'}`}>
                                    Kisi-kisi
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                {activeTab === 'soal' && (
                                    <div className="space-y-8">
                                        {docContent.soal.map((s: any, idx: number) => (
                                            <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-warm-200 shadow-sm hover:shadow-md transition-all group">
                                                <p className="text-[10px] font-black text-warm-300 uppercase mb-4 tracking-widest">Soal #{s.nomor} — {s.level_kognitif}</p>
                                                <textarea
                                                    value={s.soal}
                                                    onChange={(e) => updateSoalContent(idx, 'soal', e.target.value)}
                                                    className="w-full bg-transparent text-warm-900 font-bold mb-6 text-xl tracking-tight leading-relaxed outline-none focus:ring-2 focus:ring-coral-100 rounded-xl p-2 -ml-2 resize-none"
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
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            {docContent.soal.map((s: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-warm-50 border border-warm-100 rounded-xl text-center">
                                                    <span className="text-xs text-warm-400 font-bold block mb-1">NO. {s.nomor}</span>
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
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead className="bg-warm-50 text-[10px] font-bold text-warm-400 uppercase tracking-widest">
                                                <tr>
                                                    <th className="p-4 border-b">No</th>
                                                    <th className="p-4 border-b">CP / KD</th>
                                                    <th className="p-4 border-b">Indikator</th>
                                                    <th className="p-4 border-b text-center">Level</th>
                                                    <th className="p-4 border-b text-center">Bentuk</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-warm-100">
                                                {content.kisi_kisi.map((k: any, idx: number) => (
                                                    <tr key={idx} className="text-xs text-warm-700 hover:bg-warm-50/50">
                                                        <td className="p-4 font-bold">{k.no}</td>
                                                        <td className="p-4 max-w-[200px] leading-relaxed">{k.cp_kd}</td>
                                                        <td className="p-4 leading-relaxed">{k.indikator}</td>
                                                        <td className="p-4 text-center font-bold text-coral-500">{k.level_kognitif}</td>
                                                        <td className="p-4 text-center">{k.bentuk_soal}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 md:p-12 overflow-y-auto flex flex-col h-full bg-warm-50/30">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[10px] font-black text-warm-400 uppercase tracking-widest">Edit Konten Modul:</p>
                            </div>
                            <textarea
                                value={docContent.text || docContent}
                                onChange={(e) => {
                                    setDocContent(type === 'modul' ? { text: e.target.value } : e.target.value)
                                    setHasUnsavedChanges(true)
                                }}
                                className="w-full flex-1 min-h-[500px] bg-white p-8 rounded-3xl border border-warm-100 font-sans text-sm md:text-base whitespace-pre-wrap leading-relaxed outline-none focus:border-teal-300 transition-all resize-none shadow-sm text-warm-800"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
