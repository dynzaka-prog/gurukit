"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketIcon,
  PlayIcon,
  FileTextIcon,
  CheckCircleIcon,
  PenToolIcon,
  ZapIcon,
  XCircleIcon,
  UsersIcon,
  UploadCloudIcon,
  EditIcon,
  BarChartIcon,
  BookIcon,
  MenuIcon,
  XIcon
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-coral-50/20">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-8 h-8 text-coral-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent">
                GuruKit
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#fitur" onClick={e => scrollToSection(e, 'fitur')} className="text-warm-700 hover:text-coral-500 font-medium transition">
                Fitur
              </a>
              <a href="#cara-kerja" onClick={e => scrollToSection(e, 'cara-kerja')} className="text-warm-700 hover:text-coral-500 font-medium transition">
                Cara Kerja
              </a>
              <a href="#testimoni" onClick={e => scrollToSection(e, 'testimoni')} className="text-warm-700 hover:text-coral-500 font-medium transition">
                Testimoni
              </a>
              <Button asChild variant="primary" className="group">
                <Link href="/login" className="flex items-center">
                  Mulai Sekarang
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-warm-700 p-2"
              >
                {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Overlay) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-warm-200 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <a
              href="#fitur"
              className="block text-lg font-medium text-warm-700 py-2 border-b border-warm-100"
              onClick={e => scrollToSection(e, 'fitur')}
            >
              Fitur
            </a>
            <a
              href="#cara-kerja"
              className="block text-lg font-medium text-warm-700 py-2 border-b border-warm-100"
              onClick={e => scrollToSection(e, 'cara-kerja')}
            >
              Cara Kerja
            </a>
            <a
              href="#testimoni"
              className="block text-lg font-medium text-warm-700 py-2 border-b border-warm-100"
              onClick={e => scrollToSection(e, 'testimoni')}
            >
              Testimoni
            </a>
            <Button asChild variant="primary" className="w-full">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                Mulai Sekarang
              </Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-coral-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-100 text-coral-600 text-sm font-semibold mb-6">
                <SparklesIcon className="w-4 h-4" />
                <span>Lisensi Seumur Hidup — Rp 99.000</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-5xl font-bold text-warm-900 leading-tight">
                Bikin Soal & Modul Ajar dalam <span className="text-coral-500 italic relative">
                  3 Menit
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-coral-300" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mt-8 text-xl text-warm-600 leading-relaxed">
                Asisten AI untuk guru Indonesia. Generate soal lengkap dengan kisi-kisi, modul ajar sesuai Kurikulum Merdeka, dan kuis interaktif. <span className="text-coral-600 font-bold">Bayar sekali, pakai selamanya.</span>
              </p>

              {/* CTA */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg shadow-coral-200 shadow-lg">
                  <Link href="/login" className="flex items-center">
                    Dapatkan Akses Sekarang
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                >
                  <Link href="#demo" className="flex items-center">
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Lihat Demo
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-300 to-teal-300 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-warm-900">
                    1,247+ Guru Indonesia
                  </p>
                  <p className="text-sm text-warm-600">
                    sudah bikin 10,384 soal dengan GuruKit
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Hero Illustration */}
            <div className="relative">
              {/* Floating card preview */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-warm-200 transform hover:-rotate-1 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-400 to-coral-500 flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div>
                    <p className="font-semibold text-warm-900">Bu Sari Mulyani</p>
                    <p className="text-sm text-warm-600">SD Negeri 1 Bandung</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-coral-50 rounded-lg border border-coral-100">
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="w-5 h-5 text-coral-500" />
                      <span className="font-medium text-warm-900">Soal Matematika Kelas 5</span>
                    </div>
                    <CheckCircleIcon className="w-5 h-5 text-success" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <div className="flex items-center gap-2">
                      <BookIcon className="w-5 h-5 text-teal-500" />
                      <span className="font-medium text-warm-900">Modul Ajar IPA Fase B</span>
                    </div>
                    <CheckCircleIcon className="w-5 h-5 text-success" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-warm-100 rounded-lg border border-warm-200 animate-pulse">
                    <div className="flex items-center gap-2">
                      <PenToolIcon className="w-5 h-5 text-warm-600" />
                      <span className="font-medium text-warm-900">Kuis Interaktif B.Indo...</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-warm-200 animate-bounce-slow">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                    <ZapIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-warm-600">Waktu Generate</p>
                    <p className="text-lg font-bold text-warm-900">2.4 detik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-warm-900 mb-4">
              Mengapa GuruKit?
            </h2>
            <p className="text-xl text-warm-600">
              Bandingkan sendiri dengan kompetitor
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-warm-200">
                  <th className="p-4 text-left text-warm-600 font-medium">Fitur Utama</th>
                  <th className="p-4 text-coral-600 font-bold">GuruKit</th>
                  <th className="p-4 text-warm-600 font-medium text-center italic">Aplikasi Lain</th>
                  <th className="p-4 text-warm-600 font-medium">Cara Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-50">
                {[
                  { feature: 'Biaya', gurukit: 'Rp 99rb (Lifetime)', other: 'Langganan Bulanan', manual: 'Gratis (tapi lama)' },
                  { feature: 'Generate Soal + Kisi-kisi', gurukit: true, other: true, manual: false },
                  { feature: 'Upload Materi (PDF/Foto)', gurukit: true, other: false, manual: false },
                  { feature: 'Edit di Browser', gurukit: true, other: false, manual: true },
                  { feature: 'Preview Sebelum Download', gurukit: true, other: false, manual: true },
                  { feature: 'Kuis Interaktif + Analytics', gurukit: true, other: false, manual: false },
                  { feature: 'History & Cloud Save', gurukit: true, other: false, manual: false },
                  { feature: 'AI Remedial Generator', gurukit: true, other: false, manual: false },
                  { feature: 'Target Kurikulum Merdeka', gurukit: true, other: false, manual: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-warm-50/50 transition">
                    <td className="p-4 text-warm-900 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.gurukit === 'boolean' ? (
                        <CheckCircleIcon className="w-5 h-5 text-teal-500 mx-auto" />
                      ) : (
                        <span className={`font-semibold ${row.gurukit.includes('Rp 99rb') ? 'text-coral-600' : 'text-warm-900'}`}>
                          {row.gurukit}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.other === 'boolean' ? (
                        row.other ? (
                          <CheckCircleIcon className="w-5 h-5 text-warm-300 mx-auto" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-warm-200 mx-auto" />
                        )
                      ) : (
                        <span className="text-warm-400 text-sm italic">{row.other}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.manual === 'boolean' ? (
                        row.manual ? (
                          <CheckCircleIcon className="w-6 h-6 text-warm-400 mx-auto" />
                        ) : (
                          <XCircleIcon className="w-6 h-6 text-warm-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-warm-600 text-sm">{row.manual}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" className="py-24 bg-gradient-to-br from-bg-secondary to-coral-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-warm-900 mb-4">
              Fitur Lengkap untuk Guru
            </h2>
            <p className="text-xl text-warm-600">
              Semua yang Anda butuhkan dalam satu platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileTextIcon className="w-8 h-8" />,
                title: 'Generator Soal Pintar',
                description: 'Buat soal PG, Essay, HOTS, AKM dengan kisi-kisi lengkap dalam hitungan detik',
                color: 'coral'
              },
              {
                icon: <BookOpenIcon className="w-8 h-8" />,
                title: 'Modul Ajar Otomatis',
                description: 'Generate Modul Ajar sesuai Kurikulum Merdeka dengan 13 komponen lengkap',
                color: 'teal'
              },
              {
                icon: <UploadCloudIcon className="w-8 h-8" />,
                title: 'Upload Materi Sendiri',
                description: 'Upload PDF/foto buku, AI bikin soal DARI materi Anda (bukan generic)',
                color: 'coral'
              },
              {
                icon: <EditIcon className="w-8 h-8" />,
                title: 'Edit Langsung di Browser',
                description: 'Ga perlu download dulu. Edit soal/modul langsung, auto-save',
                color: 'teal'
              },
              {
                icon: <UsersIcon className="w-8 h-8" />,
                title: 'Kuis Interaktif',
                description: 'Share link ke siswa, auto-koreksi, analytics per soal, leaderboard',
                color: 'coral'
              },
              {
                icon: <BarChartIcon className="w-8 h-8" />,
                title: 'AI Remedial Generator',
                description: 'AI analisis kesalahan siswa, auto-generate soal remedial yang lebih mudah',
                color: 'teal'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 border border-warm-200 hover:border-coral-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-coral-400 to-coral-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-warm-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-warm-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-coral-500 via-coral-400 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Menjadi Guru yang Lebih Produktif?
          </h2>
          <p className="text-coral-100 text-xl mb-10 max-w-2xl mx-auto">
            Dapatkan akses penuh ke seluruh fitur GuruKit hanya dengan sekali bayar. Investasi terbaik untuk karier Anda.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg">
            <Link href="/login">
              Dapatkan Akses Sekarang — Rp 99.000
            </Link>
          </Button>
          <p className="mt-6 text-coral-200 text-sm">
            Lisensi Seumur Hidup • Update Selamanya • 2 Menit Setup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-900 text-warm-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpenIcon className="w-6 h-6 text-coral-400" />
                <span className="text-xl font-bold text-white">GuruKit</span>
              </div>
              <p className="text-sm">
                Asisten AI untuk guru Indonesia. Dari guru, untuk guru.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-coral-400 transition">Generator Soal</Link></li>
                <li><Link href="#" className="hover:text-coral-400 transition">Modul Ajar</Link></li>
                <li><Link href="#" className="hover:text-coral-400 transition">Kuis Interaktif</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Sumber Daya</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-coral-400 transition">Tutorial</Link></li>
                <li><Link href="#" className="hover:text-coral-400 transition">FAQ</Link></li>
                <li><Link href="#" className="hover:text-coral-400 transition">Kontak</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-coral-400 transition">Privasi</Link></li>
                <li><Link href="#" className="hover:text-coral-400 transition">Syarat & Ketentuan</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-warm-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 GuruKit. Dibuat dengan ❤️ untuk guru Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
