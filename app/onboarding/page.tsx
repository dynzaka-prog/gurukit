'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
    GraduationCapIcon,
    SearchIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircle2Icon,
    BookOpenIcon,
    UsersIcon,
    SmileIcon,
    FileTextIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/lib/db/profiles'

type Step = 1 | 2 | 3 | 4

export default function OnboardingPage() {
    const [step, setStep] = useState<Step>(1)
    const [jenjang, setJenjang] = useState<string | null>(null)
    const [mapel, setMapel] = useState<string>('')
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const nextStep = () => setStep((s) => (s + 1) as Step)
    const prevStep = () => setStep((s) => (s - 1) as Step)

    const jenjangOptions = [
        { id: 'sd', label: 'SD / MI', icon: '🎒' },
        { id: 'smp', label: 'SMP / MTs', icon: '📚' },
        { id: 'sma', label: 'SMA / MA', icon: '🎓' },
    ]

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const [direction, setDirection] = useState(0)

    const handleNext = () => {
        setDirection(1)
        nextStep()
    }

    const handlePrev = () => {
        setDirection(-1)
        prevStep()
    }

    const handleFinish = async () => {
        setIsSaving(true)
        try {
            await updateProfile({
                jenjang: jenjang || '',
                mata_pelajaran: mapel,
                onboarded: true
            })
            setDirection(1)
            nextStep()
        } catch (error) {
            console.error('Failed to save profile:', error)
            alert('Gagal menyimpan profil. Silakan coba lagi.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-coral-50/20 flex flex-col items-center justify-center p-4">
            {/* Progress Bar */}
            <div className="w-full max-w-md mb-8 flex items-center justify-between gap-2 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-coral-500' : 'bg-warm-200'}`}
                    />
                ))}
            </div>

            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-warm-200 relative overflow-hidden min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait" custom={direction}>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex-1 flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-coral-50 rounded-2xl flex items-center justify-center mb-6">
                                <SmileIcon className="w-12 h-12 text-coral-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-warm-900 mb-4">Halo! Senang bertemu Anda 👋</h1>
                            <p className="text-lg text-warm-600 mb-8 max-w-sm">
                                Saya GuruKit, asisten AI yang siap bantu Bapak/Ibu bikin soal dan modul ajar dalam hitungan menit.
                            </p>
                            <p className="text-warm-500 mb-8 italic">
                                Supaya bisa bantu lebih baik, boleh kenalan dulu?
                            </p>
                            <div className="mt-auto w-full flex flex-col gap-3">
                                <Button size="lg" className="w-full" onClick={handleNext}>
                                    Yuk, Kenalan!
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard')}>
                                    Nanti Aja
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-2xl font-bold text-warm-900 mb-2">Jenjang Pendidikan</h2>
                            <p className="text-warm-600 mb-8">Bapak/Ibu mengajar di jenjang apa?</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                {jenjangOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setJenjang(opt.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${jenjang === opt.id
                                            ? 'border-coral-500 bg-coral-50 shadow-md ring-4 ring-coral-100'
                                            : 'border-warm-100 bg-white hover:border-warm-200 hover:bg-warm-50'
                                            }`}
                                    >
                                        <span className="text-4xl">{opt.icon}</span>
                                        <span className={`font-semibold ${jenjang === opt.id ? 'text-coral-700' : 'text-warm-700'}`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-warm-500 bg-warm-50 p-3 rounded-xl border border-warm-100">
                                <span>PAUD / TK</span>
                                <span className="text-warm-200">|</span>
                                <span>SMK</span>
                                <span className="text-warm-200">|</span>
                                <span>SLB</span>
                            </div>

                            <div className="mt-auto pt-8 flex gap-4">
                                <Button variant="ghost" onClick={handlePrev} className="flex-1">
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                                <Button
                                    disabled={!jenjang}
                                    onClick={handleNext}
                                    className="flex-[2]"
                                >
                                    Lanjut
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-2xl font-bold text-warm-900 mb-2">Mata Pelajaran</h2>
                            <p className="text-warm-600 mb-8">Keren! Biasanya Bapak/Ibu ngajar mata pelajaran apa?</p>

                            <div className="relative mb-6">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                                <input
                                    type="text"
                                    placeholder="Ketik untuk cari..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-warm-200 rounded-xl outline-none focus:border-coral-400 focus:ring-4 focus:ring-coral-100 transition-all text-warm-900"
                                    value={mapel}
                                    onChange={(e) => setMapel(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-warm-500 uppercase tracking-wider">Mata Pelajaran Populer:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'Pendidikan Agama', 'Bahasa Inggris'].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMapel(m)}
                                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${mapel === m
                                                ? 'bg-teal-500 text-white border-teal-600 shadow-md'
                                                : 'bg-white text-warm-700 border-warm-200 hover:border-teal-300'
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-8 flex gap-4">
                                <Button variant="ghost" onClick={handlePrev} className="flex-1">
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                                <Button
                                    disabled={!mapel}
                                    onClick={handleNext}
                                    className="flex-[2]"
                                >
                                    Selesai
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex-1 flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6 text-teal-500">
                                <CheckCircle2Icon className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-bold text-warm-900 mb-4">Siap Beraksi! 🚀</h2>
                            <p className="text-lg text-warm-600 mb-8">
                                Sekarang Bapak/Ibu bisa langsung mulai mempermudah pekerjaan mengajar Anda.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                                <Button
                                    onClick={() => router.push('/generate/soal')}
                                    variant="primary"
                                    className="h-auto py-6 flex flex-col gap-2 rounded-2xl"
                                >
                                    <FileTextIcon className="w-8 h-8" />
                                    <span className="text-lg">Bikin Soal</span>
                                </Button>
                                <Button
                                    onClick={() => router.push('/generate/modul')}
                                    variant="secondary"
                                    className="h-auto py-6 flex flex-col gap-2 rounded-2xl"
                                >
                                    <BookOpenIcon className="w-8 h-8" />
                                    <span className="text-lg">Bikin Modul</span>
                                </Button>
                            </div>

                            <div className="mt-auto w-full">
                                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-full">
                                    Lihat Dashboard Saya
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="mt-8 text-sm text-warm-400">
                Tips: Bapak/Ibu bisa mengubah profil di pengaturan nanti.
            </p>
        </div>
    )
}
