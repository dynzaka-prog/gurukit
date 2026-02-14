export const SOAL_SYSTEM_PROMPT = `Anda adalah Tim Penyusun Soal Expert dari Kemendikbudristek Indonesia yang terdiri dari:
1. Ahli Kurikulum Merdeka 2025
2. Psikolog Pendidikan (memahami perkembangan kognitif siswa per jenjang)
3. Ahli Asesmen (Taksonomi Bloom Revisi Anderson & Krathwohl)
4. Guru Senior berpengalaman 15+ tahun

KOMPETENSI ANDA:
- Menguasai Capaian Pembelajaran (CP) semua fase (A-F) dan mata pelajaran
- Memahami karakteristik soal HOTS, AKM Literasi/Numerasi, dan soal berbasis konteks
- Mampu membuat pengecoh (distractor) yang masuk akal berdasarkan miskonsepsi siswa
- Menggunakan bahasa sesuai tingkat perkembangan kognitif siswa

PRINSIP PENYUSUNAN SOAL:
1. Validitas Konten: Soal HARUS sesuai dengan CP fase yang diminta
2. Reliabilitas: Kunci jawaban tidak ambigu, ada pembahasan jelas
3. Daya Pembeda: Soal dapat membedakan siswa yang paham vs tidak paham
4. Tingkat Kesukaran: Sesuai permintaan (mudah/sedang/sulit)
5. Bahasa: Jelas, tidak bermakna ganda, sesuai EYD

FORMAT OUTPUT: Gunakan JSON terstruktur.`;

export interface SoalConfig {
    kurikulum: string;
    jenjang: string;
    fase: string;
    kelas: string;
    mataPelajaran: string;
    materi: string;
    jumlahSoal: number;
    jenisSoal: string[];
    tingkatKesulitan: string;
    levelKognitif: 'otomatis' | string[];
    tipeSoal: 'Standar' | 'Soal HOTS' | 'Soal AKM';
    sumberMateri?: string;
}

export const generateSoalPrompt = (config: SoalConfig) => {
    const {
        kurikulum,
        jenjang,
        fase,
        kelas,
        mataPelajaran,
        materi,
        jumlahSoal,
        jenisSoal,
        tingkatKesulitan,
        levelKognitif,
        tipeSoal,
        sumberMateri
    } = config;

    let contextualInfo = '';
    if (sumberMateri) {
        contextualInfo = `SUMBER MATERI DARI GURU:\n${sumberMateri}\n\nPENTING: Buat soal BERDASARKAN materi di atas.`;
    }

    const kognitifDistribusi = levelKognitif === 'otomatis'
        ? 'Distribusi otomatis seimbang (C1: 15%, C2: 35%, C3: 25%, C4: 15%, C5: 7%, C6: 3%)'
        : `Fokus pada level: ${levelKognitif.join(', ')}`;

    return `${contextualInfo}

TUGAS: Buat ${jumlahSoal} soal ${jenisSoal.join(' + ')} untuk penilaian harian

KONTEKS PEMBELAJARAN:
- Kurikulum: ${kurikulum}
- Jenjang: ${jenjang}
- Fase: ${fase} (Kelas ${kelas})
- Mata Pelajaran: ${mataPelajaran}
- Materi Pokok: ${materi}

SPESIFIKASI SOAL:
- Tipe: ${tipeSoal}
- Tingkat Kesulitan: ${tingkatKesulitan}
- Level Kognitif: ${kognitifDistribusi}

OUTPUT FORMAT (JSON):
{
  "metadata": {
    "jenjang": "${jenjang}",
    "fase": "${fase}",
    "kelas": ${kelas},
    "mapel": "${mataPelajaran}",
    "materi": "${materi}"
  },
  "kisi_kisi": [
    {
      "no": 1,
      "cp_kd": "CP Fase ${fase}: ...",
      "materi": "${materi}",
      "indikator": "...",
      "level_kognitif": "C2",
      "bentuk_soal": "PG",
      "nomor_soal": 1
    }
  ],
  "soal": [
    {
      "nomor": 1,
      "level_kognitif": "C1-C6",
      "indikator": "...",
      "soal": "...",
      "opsi": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "kunci_jawaban": "a|b|c|d",
      "pembahasan": "..."
    }
  ]
}`;
};
