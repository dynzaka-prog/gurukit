'use client'

import { useEffect, useState } from 'react'
import { getDocuments, deleteDocument } from '@/lib/db/documents'
import { Button } from '@/components/ui/button'
import {
    FileTextIcon,
    BookOpenIcon,
    SearchIcon,
    Trash2Icon,
    DownloadIcon,
    ExternalLinkIcon,
    AlertCircleIcon,
    Loader2Icon,
    ChevronRightIcon,
    BrainIcon
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { exportSoalToDocx, exportModulToDocx } from '@/lib/export/docx'
import { motion, AnimatePresence } from 'framer-motion'
import { Suspense } from 'react'

export default function DocumentsPage() {
    return (
        <Suspense fallback={null}>
            <DocumentsContent />
        </Suspense>
    )
}

function DocumentsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialFilter = (searchParams.get('type') as 'all' | 'soal' | 'modul') || 'all'

    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'soal' | 'modul'>(initialFilter)

    useEffect(() => {
        loadDocuments()
    }, [])

    const loadDocuments = async () => {
        setLoading(true)
        try {
            const docs = await getDocuments()
            setDocuments(docs || [])
        } catch (error) {
            console.error('Error fetching documents:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Yakin ingin menghapus dokumen ini?')) {
            try {
                await deleteDocument(id)
                setDocuments(docs => docs.filter(d => d.id !== id))
            } catch (error) {
                alert('Gagal menghapus dokumen.')
            }
        }
    }

    const handleDownload = (doc: any) => {
        if (doc.type === 'soal') {
            exportSoalToDocx(doc.content)
        } else {
            exportModulToDocx(doc.content.text || doc.content)
        }
    }

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.metadata?.mapel?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'all' || doc.type === filterType
        return matchesSearch && matchesType
    })

    return (
        <div className="min-h-screen bg-bg-primary p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-warm-900 tracking-tight">Dokumen Saya</h1>
                        <p className="text-warm-500">Semua hasil generate Soal & Modul Ajar Anda.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="primary" onClick={() => router.push('/generate/soal')}>
                            Buat Baru
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                        <input
                            type="text"
                            placeholder="Cari judul atau mata pelajaran..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-warm-200 rounded-xl outline-none focus:border-coral-400 transition shadow-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white p-1 rounded-xl border border-warm-200 shadow-sm">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'all' ? 'bg-warm-100 text-warm-900' : 'text-warm-500 hover:text-warm-700'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilterType('soal')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'soal' ? 'bg-coral-50 text-coral-600' : 'text-warm-500 hover:text-warm-700'}`}
                        >
                            Soal
                        </button>
                        <button
                            onClick={() => setFilterType('modul')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'modul' ? 'bg-teal-50 text-teal-600' : 'text-warm-500 hover:text-warm-700'}`}
                        >
                            Modul
                        </button>
                    </div>
                </div>

                {/* Documents Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2Icon className="w-10 h-10 text-coral-400 animate-spin mb-4" />
                        <p className="text-warm-500 font-medium">Memuat dokumen...</p>
                    </div>
                ) : filteredDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredDocs.map((doc, idx) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-white rounded-2xl border border-warm-200 overflow-hidden hover:shadow-xl hover:border-coral-200 transition-all duration-300"
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className={`p-3 rounded-xl ${doc.type === 'soal' ? 'bg-coral-100' : 'bg-teal-100'}`}>
                                                {doc.type === 'soal' ?
                                                    <FileTextIcon className="w-6 h-6 text-coral-500" /> :
                                                    <BookOpenIcon className="w-6 h-6 text-teal-500" />
                                                }
                                            </div>
                                            <div className="flex gap-1">
                                                {doc.type === 'soal' && (
                                                    <button
                                                        onClick={() => router.push(`/quiz/${doc.id}`)}
                                                        className="p-2 text-coral-400 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition"
                                                        title="Mainkan Kuis"
                                                    >
                                                        <BrainIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDownload(doc)}
                                                    className="p-2 text-warm-400 hover:text-coral-500 hover:bg-coral-50 rounded-lg transition"
                                                    title="Download Word"
                                                >
                                                    <DownloadIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 text-warm-400 hover:text-error hover:bg-error/10 rounded-lg transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2Icon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-warm-900 group-hover:text-coral-600 transition line-clamp-2 min-h-[3rem]">
                                                {doc.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-warm-100 text-warm-600 rounded-full">
                                                    {doc.metadata?.jenjang || 'N/A'}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-warm-100 text-warm-600 rounded-full">
                                                    Kelas {doc.metadata?.kelas || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-warm-100 flex items-center justify-between">
                                            <span className="text-xs text-warm-400">
                                                {new Date(doc.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {doc.type === 'soal' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-xs font-bold text-amber-600 hover:bg-amber-50 px-2 h-8"
                                                        onClick={() => router.push(`/quiz/${doc.id}`)}
                                                    >
                                                        <BrainIcon className="w-4 h-4 mr-1" />
                                                        Main Kuis
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs font-bold text-coral-500 hover:bg-coral-50 px-2 h-8"
                                                    onClick={() => router.push(`/documents/${doc.id}`)}
                                                >
                                                    Buka
                                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-warm-200 p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-warm-50 rounded-full flex items-center justify-center mb-6">
                            <AlertCircleIcon className="w-10 h-10 text-warm-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-warm-900 mb-2">Belum ada dokumen</h2>
                        <p className="text-warm-500 max-w-sm mb-8">Dokumen hasil generate Anda akan muncul di sini secara otomatis.</p>
                        <Button onClick={() => router.push('/generate/soal')}>
                            Buat Dokumen Sekarang
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
