import { Button } from "@/components/ui/button";
import {
    FileTextIcon,
    BookOpenIcon,
    PlusIcon,
    ClockIcon,
    SearchIcon,
    MoreVerticalIcon,
    DownloadIcon,
    EyeIcon,
    Trash2Icon
} from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/lib/db/profiles";
import { getDocuments, deleteDocument } from "@/lib/db/documents";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { DashboardHeader } from "@/components/dashboard-header";
import { PurchaseTracker } from "@/components/purchase-tracker";

export default async function DashboardPage() {
    const profile = await getProfile();
    const documents = await getDocuments();

    // FB Purchase Tracking Logic
    let triggerPurchase = false;
    if (profile?.is_premium && !profile?.purchase_tracked) {
        triggerPurchase = true;
    }

    const handleSignOut = async () => {
        'use server'
        const { createClient } = await import("@/utils/supabase/server");
        const { redirect } = await import("next/navigation");
        const supabase = await createClient();
        await supabase.auth.signOut();
        return redirect("/login");
    };

    return (
        <div className="min-h-screen bg-bg-primary flex">
            {triggerPurchase && <PurchaseTracker userId={profile.id} />}
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-warm-200 flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-warm-100 flex items-center gap-2">
                    <BookOpenIcon className="w-8 h-8 text-coral-500" />
                    <span className="text-xl font-bold text-warm-900">GuruKit</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-coral-50 text-coral-600 rounded-xl font-semibold">
                        <FileTextIcon className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/documents" className="flex items-center gap-3 p-3 text-warm-600 hover:bg-warm-50 rounded-xl transition">
                        <BookOpenIcon className="w-5 h-5" />
                        Dokumen Saya
                    </Link>
                    <Link href="/generate/soal" className="flex items-center gap-3 p-3 text-warm-600 hover:bg-warm-50 rounded-xl transition">
                        <PlusIcon className="w-5 h-5" />
                        Bikin Soal
                    </Link>
                    <Link href="/generate/modul" className="flex items-center gap-3 p-3 text-warm-600 hover:bg-warm-50 rounded-xl transition">
                        <PlusIcon className="w-5 h-5" />
                        Bikin Modul
                    </Link>
                </nav>

                <div className="p-4 border-t border-warm-100">
                    <form action={handleSignOut}>
                        <Button type="submit" variant="ghost" className="w-full justify-start text-error hover:bg-error/5">
                            <PlusIcon className="w-4 h-4 mr-2 rotate-45" />
                            Keluar
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader profileName={profile?.full_name || ''} onSignOut={handleSignOut} />

                {/* Scrollable Area */}
                <div className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">

                        {/* Quick Actions */}
                        <section>
                            <h3 className="text-lg font-bold text-warm-800 mb-6">Mulai Sesuatu yang Baru</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                <Link href="/generate/soal" className="group p-6 md:p-8 bg-white rounded-3xl border border-warm-200 hover:border-coral-300 hover:shadow-xl transition-all duration-300">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-coral-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                        <FileTextIcon className="w-6 h-6 md:w-8 md:h-8 text-coral-500" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold text-warm-900 mb-2">Bikin Soal Pintar</h4>
                                    <p className="text-warm-600 text-sm mb-4 md:mb-6">Buat soal PH, PTS, PAS lengkap dengan kisi-kisi otomatis.</p>
                                    <div className="mt-auto flex items-center text-coral-600 font-semibold text-sm">
                                        Mulai Sekarang <PlusIcon className="w-4 h-4 ml-2" />
                                    </div>
                                </Link>

                                <Link href="/generate/modul" className="group p-6 md:p-8 bg-white rounded-3xl border border-warm-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                        <BookOpenIcon className="w-6 h-6 md:w-8 md:h-8 text-teal-500" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold text-warm-900 mb-2">Bikin Modul Ajar</h4>
                                    <p className="text-warm-600 text-sm mb-4 md:mb-6">Generate RPP Plus / Modul Ajar Kurikulum Merdeka 13 komponen.</p>
                                    <div className="mt-auto flex items-center text-teal-600 font-semibold text-sm">
                                        Mulai Sekarang <PlusIcon className="w-4 h-4 ml-2" />
                                    </div>
                                </Link>

                                <Link href="/documents?type=soal" className="group p-6 md:p-8 bg-white rounded-3xl border border-warm-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                        <ClockIcon className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-bold text-warm-900 mb-2">Kuis Interaktif</h4>
                                    <p className="text-warm-600 text-sm mb-4 md:mb-6">Mainkan kuis di kelas dengan leaderboard & analisis siswa.</p>
                                    <div className="mt-auto flex items-center text-amber-600 font-semibold text-sm">
                                        Pilih Dokumen <PlusIcon className="w-4 h-4 ml-2" />
                                    </div>
                                </Link>
                            </div>
                        </section>

                        {/* Recent Documents */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-warm-800">Dokumen Terbaru</h3>
                                <Link href="/documents" className="text-sm font-semibold text-coral-500 hover:underline">Lihat Semua</Link>
                            </div>

                            {documents.length === 0 ? (
                                <div className="bg-white rounded-3xl border border-dashed border-warm-300 p-8 md:p-12 text-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-warm-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <SearchIcon className="w-8 h-8 md:w-10 md:h-10 text-warm-300" />
                                    </div>
                                    <p className="text-warm-600 text-sm md:text-base">Belum ada dokumen. Yuk, mulai bikin soal atau modul!</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden md:block bg-white rounded-3xl border border-warm-200 overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-warm-50 border-b border-warm-100">
                                                <tr>
                                                    <th className="p-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Nama Dokumen</th>
                                                    <th className="p-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Tipe</th>
                                                    <th className="p-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Tanggal</th>
                                                    <th className="p-4 text-xs font-bold text-warm-500 uppercase tracking-wider">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-warm-100">
                                                {documents.map((item) => (
                                                    <tr key={item.id} className="hover:bg-warm-50 transition">
                                                        <td className="p-4 flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'soal' ? 'bg-coral-50 text-coral-500' : 'bg-teal-50 text-teal-500'}`}>
                                                                {item.type === 'soal' ? <FileTextIcon className="w-4 h-4" /> : <BookOpenIcon className="w-4 h-4" />}
                                                            </div>
                                                            <span className="font-medium text-warm-900">{item.title}</span>
                                                        </td>
                                                        <td className="p-4 text-sm text-warm-600 capitalize">{item.type}</td>
                                                        <td className="p-4 text-sm text-warm-600">
                                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: id })}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <Link href={`/documents/${item.id}`} className="p-2 hover:bg-warm-100 rounded-lg text-warm-400 transition" title="Lihat">
                                                                    <EyeIcon className="w-4 h-4" />
                                                                </Link>
                                                                <button className="p-2 hover:bg-warm-100 rounded-lg text-warm-400 transition" title="Download">
                                                                    <DownloadIcon className="w-4 h-4" />
                                                                </button>
                                                                <form action={async () => {
                                                                    'use server'
                                                                    await deleteDocument(item.id)
                                                                }}>
                                                                    <button type="submit" className="p-2 hover:bg-error/10 rounded-lg text-error/60 transition">
                                                                        <Trash2Icon className="w-4 h-4" />
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card List */}
                                    <div className="grid grid-cols-1 gap-4 md:hidden">
                                        {documents.map((item) => (
                                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-warm-200 shadow-sm relative">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'soal' ? 'bg-coral-50 text-coral-500' : 'bg-teal-50 text-teal-500'}`}>
                                                        {item.type === 'soal' ? <FileTextIcon className="w-5 h-5" /> : <BookOpenIcon className="w-5 h-5" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-warm-900 truncate pr-8">{item.title}</h4>
                                                        <p className="text-xs text-warm-500 flex items-center gap-1 mt-1">
                                                            <ClockIcon className="w-3 h-3" />
                                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: id })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-warm-100">
                                                    <div className="flex gap-2">
                                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-warm-50 text-warm-600 rounded-lg text-xs font-semibold">
                                                            <EyeIcon className="w-3.5 h-3.5" /> Lihat
                                                        </button>
                                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-warm-50 text-warm-600 rounded-lg text-xs font-semibold">
                                                            <DownloadIcon className="w-3.5 h-3.5" /> Docx
                                                        </button>
                                                    </div>
                                                    <form action={async () => {
                                                        'use server'
                                                        await deleteDocument(item.id)
                                                    }}>
                                                        <button type="submit" className="p-2 text-error/60">
                                                            <Trash2Icon className="w-4 h-4" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}
