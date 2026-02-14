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
    LayoutDashboardIcon,
    SettingsIcon,
    LogOutIcon,
    Trash2Icon
} from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/lib/db/profiles";
import { getDocuments, deleteDocument } from "@/lib/db/documents";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default async function DashboardPage() {
    const profile = await getProfile();
    const documents = await getDocuments();

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
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-warm-200 flex-col">
                <div className="p-6 border-b border-warm-100 flex items-center gap-2">
                    <BookOpenIcon className="w-8 h-8 text-coral-500" />
                    <span className="text-xl font-bold text-warm-900">GuruKit</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-coral-50 text-coral-600 rounded-xl font-semibold">
                        <LayoutDashboardIcon className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/generate/soal" className="flex items-center gap-3 p-3 text-warm-600 hover:bg-warm-50 rounded-xl transition">
                        <FileTextIcon className="w-5 h-5" />
                        Bikin Soal
                    </Link>
                    <Link href="/generate/modul" className="flex items-center gap-3 p-3 text-warm-600 hover:bg-warm-50 rounded-xl transition">
                        <BookOpenIcon className="w-5 h-5" />
                        Bikin Modul
                    </Link>
                </nav>

                <div className="p-4 border-t border-warm-100">
                    <Button variant="ghost" className="w-full justify-start text-warm-500">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Pengaturan
                    </Button>
                    <form action={handleSignOut}>
                        <Button type="submit" variant="ghost" className="w-full justify-start text-error hover:bg-error/5">
                            <LogOutIcon className="w-4 h-4 mr-2" />
                            Keluar
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-warm-200 px-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-warm-900">
                        Selamat Pagi, {profile?.full_name || 'Bapak/Ibu'}! 👋
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                            <input
                                type="text"
                                placeholder="Cari dokumen..."
                                className="pl-10 pr-4 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm outline-none focus:border-coral-400"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-400 to-coral-500 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-white font-bold">
                            {profile?.full_name?.[0] || 'G'}
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Quick Actions */}
                        <section>
                            <h3 className="text-lg font-bold text-warm-800 mb-6">Mulai Sesuatu yang Baru</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Link href="/generate/soal" className="group p-8 bg-white rounded-3xl border border-warm-200 hover:border-coral-300 hover:shadow-xl transition-all duration-300">
                                    <div className="w-14 h-14 bg-coral-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <FileTextIcon className="w-8 h-8 text-coral-500" />
                                    </div>
                                    <h4 className="text-xl font-bold text-warm-900 mb-2">Bikin Soal Pintar</h4>
                                    <p className="text-warm-600 text-sm mb-6">Buat soal PH, PTS, PAS lengkap dengan kisi-kisi otomatis.</p>
                                    <div className="mt-auto flex items-center text-coral-600 font-semibold text-sm">
                                        Mulai Sekarang <PlusIcon className="w-4 h-4 ml-2" />
                                    </div>
                                </Link>

                                <Link href="/generate/modul" className="group p-8 bg-white rounded-3xl border border-warm-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300">
                                    <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <BookOpenIcon className="w-8 h-8 text-teal-500" />
                                    </div>
                                    <h4 className="text-xl font-bold text-warm-900 mb-2">Bikin Modul Ajar</h4>
                                    <p className="text-warm-600 text-sm mb-6">Generate RPP Plus / Modul Ajar Kurikulum Merdeka 13 komponen.</p>
                                    <div className="mt-auto flex items-center text-teal-600 font-semibold text-sm">
                                        Mulai Sekarang <PlusIcon className="w-4 h-4 ml-2" />
                                    </div>
                                </Link>

                                <div className="relative group p-8 bg-warm-50 rounded-3xl border border-dashed border-warm-300 opacity-70">
                                    <div className="w-14 h-14 bg-warm-100 rounded-2xl flex items-center justify-center mb-6">
                                        <LayoutDashboardIcon className="w-8 h-8 text-warm-400" />
                                    </div>
                                    <div className="absolute top-4 right-4 px-2 py-1 bg-warm-200 text-warm-600 text-[10px] font-bold rounded uppercase">Segera Hadir</div>
                                    <h4 className="text-xl font-bold text-warm-400 mb-2">Kuis Interaktif</h4>
                                    <p className="text-warm-400 text-sm">Mainkan kuis di kelas dengan leaderboard & analisis siswa.</p>
                                </div>
                            </div>
                        </section>

                        {/* Recent Documents */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-warm-800">Dokumen Terbaru</h3>
                                <Link href="#" className="text-sm font-semibold text-coral-500 hover:underline">Lihat Semua</Link>
                            </div>

                            {documents.length === 0 ? (
                                <div className="bg-white rounded-3xl border border-dashed border-warm-300 p-12 text-center">
                                    <div className="w-20 h-20 bg-warm-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <SearchIcon className="w-10 h-10 text-warm-300" />
                                    </div>
                                    <p className="text-warm-600">Belum ada dokumen. Yuk, mulai bikin soal atau modul!</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl border border-warm-200 overflow-hidden shadow-sm">
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
                                                            {/* TODO: Implement real view/download on dashboard list */}
                                                            <button className="p-2 hover:bg-warm-100 rounded-lg text-warm-400 transition">
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 hover:bg-warm-100 rounded-lg text-warm-400 transition">
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
                            )}
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}
