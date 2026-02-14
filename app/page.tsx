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
  BookIcon
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
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

            <div className="hidden md:flex items-center gap-8">
              <Link href="#fitur" className="text-warm-700 hover:text-coral-500 font-medium transition">
                Fitur
              </Link>
              <Link href="#cara-kerja" className="text-warm-700 hover:text-coral-500 font-medium transition">
                Cara Kerja
              </Link>
              <Link href="#testimoni" className="text-warm-700 hover:text-coral-500 font-medium transition">
                Testimoni
              </Link>
              <Button asChild variant="primary" className="group">
                <Link href="/login" className="flex items-center">
                  Mulai Gratis
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-coral-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-medium">
                <SparklesIcon className="w-4 h-4" />
                100% Gratis Selamanya
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-warm-900 leading-tight">
                Bikin Soal & Modul Ajar dalam
                <span className="block bg-gradient-to-r from-coral-500 via-coral-400 to-teal-500 bg-clip-text text-transparent">
                  3 Menit
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-warm-600 leading-relaxed">
                Asisten AI untuk guru Indonesia. Generate soal lengkap dengan kisi-kisi,
                modul ajar sesuai Kurikulum Merdeka, dan kuis interaktif.
                <strong className="text-coral-600"> Tanpa bayar sepeser pun.</strong>
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="primary"
                  className="group shadow-xl hover:shadow-2xl"
                  asChild
                >
                  <Link href="/login" className="flex items-center">
                    Mulai Sekarang — Gratis
                    <RocketIcon className="w-5 h-5 ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition" />
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
                  <th className="text-left p-4 text-warm-700 font-semibold">Fitur</th>
                  <th className="p-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral-500 to-coral-400 text-white rounded-lg font-bold shadow-md">
                      <SparklesIcon className="w-5 h-5" />
                      GuruKit
                    </div>
                  </th>
                  <th className="p-4 text-warm-600 font-medium">APAL</th>
                  <th className="p-4 text-warm-600 font-medium">Manual</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Harga', gurukit: 'GRATIS', apal: 'Rp 97.000', manual: 'Gratis (tapi lama)' },
                  { feature: 'Generate Soal + Kisi-kisi', gurukit: true, apal: true, manual: false },
                  { feature: 'Upload Materi (PDF/Foto)', gurukit: true, apal: false, manual: false },
                  { feature: 'Edit di Browser', gurukit: true, apal: false, manual: true },
                  { feature: 'Preview Sebelum Download', gurukit: true, apal: false, manual: true },
                  { feature: 'Kuis Interaktif + Analytics', gurukit: true, apal: false, manual: false },
                  { feature: 'History & Cloud Save', gurukit: true, apal: false, manual: false },
                  { feature: 'AI Remedial Generator', gurukit: true, apal: false, manual: false },
                  { feature: 'Google Classroom Integration', gurukit: 'Soon', apal: false, manual: false },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-warm-100 hover:bg-warm-50 transition">
                    <td className="p-4 font-medium text-warm-900">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.gurukit === 'boolean' ? (
                        row.gurukit ? (
                          <CheckCircleIcon className="w-6 h-6 text-success mx-auto" />
                        ) : (
                          <XCircleIcon className="w-6 h-6 text-warm-300 mx-auto" />
                        )
                      ) : (
                        <span className={`font-semibold ${row.gurukit === 'GRATIS' || row.gurukit === 'Soon' ? 'text-coral-600' : 'text-warm-900'}`}>
                          {row.gurukit}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.apal === 'boolean' ? (
                        row.apal ? (
                          <CheckCircleIcon className="w-6 h-6 text-warm-400 mx-auto" />
                        ) : (
                          <XCircleIcon className="w-6 h-6 text-warm-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-warm-600">{row.apal}</span>
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

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Tingkatkan Produktivitas Mengajar?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bergabung dengan 1,247+ guru Indonesia yang sudah beralih ke GuruKit
          </p>

          <Button
            size="xl"
            className="bg-white text-coral-600 hover:bg-warm-50 shadow-2xl group"
            asChild
          >
            <Link href="/login" className="flex items-center">
              Mulai Gratis Sekarang
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition" />
            </Link>
          </Button>

          <p className="mt-6 text-white/80">
            Tidak perlu kartu kredit • Gratis selamanya • 2 menit setup
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
