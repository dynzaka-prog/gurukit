export const MODUL_AJAR_SYSTEM_PROMPT = `Anda adalah Ahli Desain Instruksional & Kurikulum Merdeka Kemendikbudristek.
Tujuan Anda adalah membantu guru membuat Modul Ajar (RPP Plus) yang inspiratif, berpusat pada siswa, dan lengkap sesuai standar Kurikulum Merdeka terbaru.

PRINSIP MODUL AJAR:
1. Esensial: Pemahaman bermakna melalui konsep kunci.
2. Menarik, Bermakna, dan Menantang: Menumbuhkan minat belajar.
3. Relevan dan Kontekstual: Sesuai dengan lingkungan dan budaya siswa.
4. Berkesinambungan: Alur kegiatan belajar yang logis.

KOMPONEN WAJIB (13 KOMPONEN):
1. Informasi Umum (Identitas, Kompetensi Awal, Profil Pelajar Pancasila, Sarpras, Target Peserta Didik, Model Pembelajaran)
2. Komponen Inti (Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran, Asesmen, Pengayaan & Remedial, Refleksi)
3. Lampiran (LKPD, Bahan Bacaan, Glosarium, Daftar Pustaka)

FORMAT OUTPUT: Gunakan Markdown yang rapi dan terstruktur.`;

export interface ModulAjarConfig {
    jenjang: string;
    fase: string;
    kelas: string;
    mataPelajaran: string;
    materiPokok: string;
    alokasiWaktu: string;
    modelPembelajaran: string;
    profilPelajarPancasila: string[];
    targetSiswa: string;
}

export const generateModulAjarPrompt = (config: ModulAjarConfig) => {
    const {
        jenjang,
        fase,
        kelas,
        mataPelajaran,
        materiPokok,
        alokasiWaktu,
        modelPembelajaran,
        profilPelajarPancasila,
        targetSiswa
    } = config;

    return `TUGAS: Buat Modul Ajar (RPP Plus) lengkap Kurikulum Merdeka.

IDENTITAS MODUL:
- Mata Pelajaran: ${mataPelajaran}
- Materi Pokok: ${materiPokok}
- Fase/Kelas: ${fase} / ${kelas}
- Jenjang: ${jenjang}
- Alokasi Waktu: ${alokasiWaktu}
- Target Siswa: ${targetSiswa}
- Model Pembelajaran: ${modelPembelajaran}
- Profil Pelajar Pancasila: ${profilPelajarPancasila.join(', ')}

STRUKTUR MODUL:
I. INFORMASI UMUM
II. KOMPONEN INTI
III. LAMPIRAN

PANDUAN KHUSUS:
- Gunakan bahasa yang humanis dan instruksi yang jelas bagi guru.
- Kegiatan pembelajaran harus terdiri dari Pembukaan, Inti (langkah-langkah eksplisit), dan Penutup.
- Tambahkan 3-5 Pertanyaan Pemantik yang provokatif.
- Sertakan instrumen asesmen sederhana (rubrik atau checklist).

OUTPUT: Berikan konten dalam format Markdown yang siap copy-paste ke MS Word.`;
};
