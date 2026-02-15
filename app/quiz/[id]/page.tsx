'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDocuments } from '@/lib/db/documents'
import { Button } from '@/components/ui/button'
import {
    ArrowLeftIcon,
    CheckCircle2Icon,
    XCircleIcon,
    TrophyIcon,
    RotateCcwIcon,
    AlertCircleIcon,
    RefreshCwIcon,
    HomeIcon,
    Loader2Icon,
    BrainIcon,
    ChevronRightIcon,
    ClockIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuizPlayerPage() {
    const { id } = useParams()
    const router = useRouter()
    const [doc, setDoc] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Quiz State
    const [currentIdx, setCurrentIdx] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [showFeedback, setShowFeedback] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [startTime] = useState(Date.now())
    const [answers, setAnswers] = useState<any[]>([])
    const [cheatWarning, setCheatWarning] = useState(false)
    const [cheatCount, setCheatCount] = useState(0)

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !isFinished) {
                setCheatWarning(true)
                setCheatCount(prev => prev + 1)
            }
        }

        const preventCheating = (e: MouseEvent) => {
            e.preventDefault()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        document.addEventListener('contextmenu', preventCheating)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            document.removeEventListener('contextmenu', preventCheating)
        }
    }, [isFinished])
    useEffect(() => {
        const loadDoc = async () => {
            try {
                const docs = await getDocuments()
                const found = docs.find(d => d.id === id)
                if (found && found.type === 'soal') {
                    setDoc(found)
                }
            } catch (error) {
                console.error('Error loading quiz:', error)
            } finally {
                setLoading(false)
            }
        }
        loadDoc()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary">
                <Loader2Icon className="w-12 h-12 text-coral-500 animate-spin mb-4" />
                <p className="text-warm-500 font-bold animate-pulse">Menyiapkan Arena Kuis...</p>
            </div>
        )
    }

    if (!doc) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-8 text-center">
                <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mb-6">
                    <BrainIcon className="w-10 h-10 text-warm-300" />
                </div>
                <h2 className="text-2xl font-bold text-warm-900">Kuis Tidak Ditemukan</h2>
                <p className="text-warm-500 mb-8 max-w-xs">Pastikan dokumen ini adalah tipe "Soal" dan masih ada di dashboard Anda.</p>
                <Button onClick={() => router.push('/dashboard')}>Kembali ke Dashboard</Button>
            </div>
        )
    }

    const questions = doc.content.soal
    const currentQuestion = questions[currentIdx]

    const handleOptionSelect = (optionKey: string) => {
        if (showFeedback) return
        setSelectedOption(optionKey)
        setShowFeedback(true)

        const isCorrect = optionKey === currentQuestion.kunci_jawaban
        if (isCorrect) setScore(s => s + 1)

        setAnswers(prev => [...prev, {
            no: currentQuestion.nomor,
            selected: optionKey,
            correct: currentQuestion.kunci_jawaban,
            isCorrect
        }])

        // AUTO NEXT after 1.5s
        setTimeout(() => {
            if (currentIdx < questions.length - 1) {
                setCurrentIdx(prev => prev + 1)
                setSelectedOption(null)
                setShowFeedback(false)
            } else {
                setIsFinished(true)
            }
        }, 1500)
    }

    if (isFinished) {
        const totalQuestions = questions.length
        const percentage = Math.round((score / totalQuestions) * 100)

        return (
            <div className="min-h-screen bg-bg-primary p-4 md:p-8 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl border border-warm-200 p-10 text-center space-y-8"
                >
                    <div className="relative">
                        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrophyIcon className="w-16 h-16 text-amber-500" />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="absolute -top-2 -right-2 bg-coral-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-black shadow-lg"
                        >
                            {percentage}%
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-warm-900">Kuis Selesai!</h2>
                        <p className="text-warm-500 font-medium">Luar biasa! Bapak/Ibu atau siswa Anda telah menyelesaikan kuis ini.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-warm-50 rounded-2xl border border-warm-100">
                            <p className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">Benar</p>
                            <p className="text-2xl font-black text-success">{score}</p>
                        </div>
                        <div className="p-4 bg-warm-50 rounded-2xl border border-warm-100">
                            <p className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">Salah</p>
                            <p className="text-2xl font-black text-error">{totalQuestions - score}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button variant="primary" size="lg" className="w-full rounded-2xl h-14 text-lg font-bold" onClick={() => window.location.reload()}>
                            <RotateCcwIcon className="w-5 h-5 mr-2" />
                            Main Lagi
                        </Button>
                        <Button variant="ghost" size="lg" className="w-full rounded-2xl text-warm-500" onClick={() => router.push('/dashboard')}>
                            Ke Dashboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col select-none">
            {/* Cheat Warning Modal */}
            <AnimatePresence>
                {cheatWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-warm-900/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl space-y-6"
                        >
                            <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                                <AlertCircleIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-warm-900 mb-2">Peringatan!</h3>
                                <p className="text-warm-600 font-medium">Bapak/Ibu terdeteksi pindah tab. Kejujuran adalah kunci utama dalam belajar! ✨</p>
                            </div>
                            <div className="p-4 bg-error/5 rounded-2xl border border-error/10">
                                <p className="text-xs font-bold text-error uppercase">Pelanggaran Terdeteksi</p>
                                <p className="text-2xl font-black text-error">{cheatCount}</p>
                            </div>
                            <Button
                                className="w-full h-14 rounded-2xl text-lg font-bold bg-error hover:bg-error/90 border-none shadow-error/20"
                                variant="primary"
                                onClick={() => setCheatWarning(false)}
                            >
                                Saya Mengerti & Jujur
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav Header */}
            <header className="h-20 bg-white border-b border-warm-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Keluar
                    </Button>
                    <div className="hidden md:block h-8 w-px bg-warm-100 mx-2" />
                    <div>
                        <h1 className="text-sm font-black text-warm-800 line-clamp-1 uppercase tracking-tight">{doc.title}</h1>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">Soal {currentIdx + 1} dari {questions.length}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-coral-50 text-coral-600 rounded-full font-bold text-sm shadow-sm flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        {Math.floor((Date.now() - startTime) / 1000)}s
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-warm-100 relative overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                    className="absolute top-0 left-0 h-full bg-coral-500 shadow-[0_0_10px_rgba(255,107,107,0.5)]"
                />
            </div>

            <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <div className="max-w-3xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-12"
                        >
                            {/* Question Card */}
                            <div className="bg-white rounded-[3rem] shadow-xl border border-warm-200 p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-coral-500" />
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <span className="w-12 h-12 rounded-2xl bg-warm-100 flex items-center justify-center text-xl font-black text-warm-400">
                                            {currentQuestion.nomor}
                                        </span>
                                        <span className="px-3 py-1 bg-warm-50 text-warm-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-warm-100">
                                            {currentQuestion.level_kognitif}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-warm-900 leading-tight">
                                        {currentQuestion.soal}
                                    </h2>
                                </div>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.opsi ? (
                                    Object.entries(currentQuestion.opsi).map(([key, val]: any) => {
                                        const isSelected = selectedOption === key
                                        const isCorrect = key === currentQuestion.kunci_jawaban
                                        const isWrong = isSelected && !isCorrect

                                        let stateClasses = "bg-white border-warm-200 text-warm-700 hover:border-coral-300 hover:shadow-md"
                                        if (showFeedback) {
                                            if (isCorrect) stateClasses = "bg-success/10 border-success text-success scale-[1.02] shadow-lg"
                                            else if (isWrong) stateClasses = "bg-error/10 border-error text-error scale-[0.98] grayscale-[0.5]"
                                            else stateClasses = "bg-white border-warm-100 text-warm-300 opacity-50"
                                        }

                                        return (
                                            <motion.button
                                                key={key}
                                                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                                                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                                onClick={() => handleOptionSelect(key)}
                                                className={`p-6 rounded-3xl border-2 flex gap-5 text-left transition-all duration-300 ${stateClasses}`}
                                            >
                                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-lg transition-colors ${isSelected ? 'bg-current text-white' : 'bg-warm-100'}`}>
                                                    {key.toUpperCase()}
                                                </span>
                                                <span className="font-bold flex-1 pt-1">{val}</span>

                                                {showFeedback && isCorrect && <CheckCircle2Icon className="w-6 h-6 shrink-0 text-success self-center" />}
                                                {showFeedback && isWrong && <XCircleIcon className="w-6 h-6 shrink-0 text-error self-center" />}
                                            </motion.button>
                                        )
                                    })
                                ) : (
                                    <div className="md:col-span-2 space-y-4">
                                        <p className="text-center text-warm-500 font-medium italic">Tipe soal ini adalah Essay/Isian. Silakan jawab di kertas lalu cek kunci jawaban.</p>
                                        <Button
                                            variant="primary"
                                            className="w-full h-16 rounded-3xl text-lg font-bold"
                                            onClick={() => handleOptionSelect('essay')}
                                        >
                                            Lihat Kunci Jawaban
                                            <ChevronRightIcon className="w-5 h-5 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Feedback Footer Bar */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className={`fixed bottom-0 left-0 right-0 p-6 md:px-12 flex items-center justify-between border-t transition-colors duration-500 ${selectedOption === currentQuestion.kunci_jawaban ? 'bg-success text-white border-success' : 'bg-error text-white border-error'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                {selectedOption === currentQuestion.kunci_jawaban ? <CheckCircle2Icon className="w-7 h-7" /> : <XCircleIcon className="w-7 h-7" />}
                            </div>
                            <div>
                                <p className="font-black text-xl uppercase tracking-widest">{selectedOption === currentQuestion.kunci_jawaban ? 'Mantap!' : 'Ups, Kurang Tepat'}</p>
                                <p className="text-sm font-medium opacity-90">{currentQuestion.pembahasan}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
