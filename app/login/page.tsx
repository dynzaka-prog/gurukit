'use client'

import { Button } from "@/components/ui/button";
import { BookOpenIcon, ChromeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { signInWithGoogle, signInWithEmail } from "./actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = await signInWithEmail(formData);

        if (result && 'error' in result) {
            setError(result.error as string);
            setLoading(false);
        } else if (result && 'success' in result) {
            // Success! Redirect immediately
            router.push('/dashboard');
            router.refresh();
        } else {
            // Fallback for unexpected results
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-warm-200">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-coral-50 rounded-2xl flex items-center justify-center">
                            <BookOpenIcon className="w-10 h-10 text-coral-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-warm-900 mb-2">Selamat Datang!</h1>
                    <p className="text-warm-600">
                        Masuk ke GuruKit untuk mulai membuat soal & modul ajar pintar.
                    </p>
                </div>

                <div className="space-y-6">
                    <form action={signInWithGoogle}>
                        <Button
                            type="submit"
                            className="w-full h-12 flex items-center gap-3 bg-white border-2 border-warm-200 text-warm-700 hover:bg-warm-50 rounded-2xl shadow-sm transition-all font-semibold"
                            variant="ghost"
                        >
                            <ChromeIcon className="w-5 h-5 text-coral-500" />
                            Lanjutkan dengan Google
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-warm-100"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-warm-400 font-medium">Atau masuk dengan email</span>
                        </div>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center animate-shake">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-warm-700 ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="nama@sekolah.sch.id"
                                required
                                className="w-full h-12 px-4 bg-warm-50 border border-warm-200 rounded-2xl outline-none focus:border-coral-400 focus:ring-4 focus:ring-coral-400/10 transition-all text-warm-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-warm-700 ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full h-12 px-4 bg-warm-50 border border-warm-200 rounded-2xl outline-none focus:border-coral-400 focus:ring-4 focus:ring-coral-400/10 transition-all text-warm-900"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-coral-500 hover:bg-coral-600 text-white rounded-2xl shadow-lg shadow-coral-500/20 transition-all font-bold text-lg disabled:bg-coral-300"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Mohon Tunggu...
                                </>
                            ) : (
                                "Masuk Sekarang"
                            )}
                        </Button>
                    </form>

                    <div className="text-center mt-6 p-4 bg-coral-50 rounded-2xl border border-coral-100">
                        <p className="text-coral-600 text-sm font-bold">
                            Lisensi Seumur Hidup
                        </p>
                        <p className="text-warm-700 font-bold text-lg">
                            Rp 99.000
                        </p>
                        <p className="text-warm-500 text-[10px] mt-1">
                            Akses Penuh Selamanya • Update Gratis
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-warm-100 text-center">
                        <Link href="/" className="text-sm font-medium text-coral-500 hover:text-coral-600 transition">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-sm text-warm-400 text-center">
                    Dibuat dengan ❤️ untuk guru Indonesia.
                </p>
            </div>
        </div>
    );
}
