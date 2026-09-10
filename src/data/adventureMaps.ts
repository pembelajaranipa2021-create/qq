export const PRICES = { rice: 15000, gold: 1200000 };
import { Shield, Award, Crown } from 'lucide-react';

export const NAMED_BUILDINGS = {
  RUMAH_PETANI: 'https://lh3.googleusercontent.com/d/1XNrcmRuL4SMc-4XKvAvotwK4euuwH0bd',
  KANTOR_AMIL: 'https://lh3.googleusercontent.com/d/1BWEPJ6f7Lp9XcdCmFwElKMwYe4scnhEF',
  GUDANG_PASAR: 'https://lh3.googleusercontent.com/d/1xzHoQk-UwAVTh7JckbcccJRNoL4k-y9_',
  SEKOLAH_MADRASAH: 'https://lh3.googleusercontent.com/d/152No22gAWeenImVQTIg75k7Avn0H__IH',
  LADANG_PAKAN: 'https://lh3.googleusercontent.com/d/1d1hBOAP_qLx1pmYK7V22TOK0_abkAUch'
};

export const BUILDING_IMAGES = [
  NAMED_BUILDINGS.RUMAH_PETANI,
  NAMED_BUILDINGS.KANTOR_AMIL,
  NAMED_BUILDINGS.GUDANG_PASAR,
  NAMED_BUILDINGS.SEKOLAH_MADRASAH,
  NAMED_BUILDINGS.LADANG_PAKAN,
  'https://lh3.googleusercontent.com/d/16aWAi0vcYxVCt2u4rs5tj5IeQltyrlnS',
  'https://lh3.googleusercontent.com/d/1G0oTCnDvi8UqBZJkTmeXVjslXJPgqw9e',
  'https://lh3.googleusercontent.com/d/1GL57YP-dT7QDcBI1b-q4rKoDu0ltVqyH',
  'https://lh3.googleusercontent.com/d/1MKAHRAEQKTd5NCPxwzCcz1kOPdFWFc3S',
  'https://lh3.googleusercontent.com/d/1SujXLePyPZPBmyUMej6gn4_-8OIVkNRG',
  'https://lh3.googleusercontent.com/d/1TZrdKOKrkWta6JEZ5DLukqojDBaVX6sZ',
  'https://lh3.googleusercontent.com/d/1ZrQtcW2J_nj5TYSFigBXebYc8b34g1vc'
];

export const ANIMAL_IMAGES = {
  KAMBING_DEWASA: 'https://lh3.googleusercontent.com/d/1UyTQXg2-381UHdh8Dax8FuUfer01EuDl',
  KAMBING_MUDA: 'https://lh3.googleusercontent.com/d/1rdlZ9Jh8mf7qF1Ds6UgROKGkUCsFJXD6',
  SAPI_DEWASA: 'https://lh3.googleusercontent.com/d/1NHLvd7_KZ3QJlDPMyCM2ibW7vHxzd4a9'
};

export const FARM_ANIMALS = [
  { id: 'an_1', name: 'Kambing Dewasa', type: 'goat', image: ANIMAL_IMAGES.KAMBING_DEWASA, x: 5, y: 15, sound: 'Mbee~ 🐐' },
  { id: 'an_2', name: 'Kambing Muda', type: 'goat_young', image: ANIMAL_IMAGES.KAMBING_MUDA, x: 6, y: 16, sound: 'Mbee~ 🐐' },
  { id: 'an_3', name: 'Sapi Dewasa', type: 'cow', image: ANIMAL_IMAGES.SAPI_DEWASA, x: 8, y: 15, sound: 'Moo~ 🐄' },
  { id: 'an_4', name: 'Kambing Dewasa', type: 'goat', image: ANIMAL_IMAGES.KAMBING_DEWASA, x: 22, y: 6, sound: 'Mbee~ 🐐' },
  { id: 'an_5', name: 'Kambing Muda', type: 'goat_young', image: ANIMAL_IMAGES.KAMBING_MUDA, x: 23, y: 7, sound: 'Mbee~ 🐐' },
  { id: 'an_6', name: 'Sapi Dewasa', type: 'cow', image: ANIMAL_IMAGES.SAPI_DEWASA, x: 25, y: 5, sound: 'Moo~ 🐄' },
  { id: 'an_7', name: 'Kambing Dewasa', type: 'goat', image: ANIMAL_IMAGES.KAMBING_DEWASA, x: 12, y: 22, sound: 'Mbee~ 🐐' },
  { id: 'an_8', name: 'Kambing Muda', type: 'goat_young', image: ANIMAL_IMAGES.KAMBING_MUDA, x: 14, y: 22, sound: 'Mbee~ 🐐' },
  { id: 'an_9', name: 'Sapi Dewasa', type: 'cow', image: ANIMAL_IMAGES.SAPI_DEWASA, x: 16, y: 23, sound: 'Moo~ 🐄' },
  { id: 'an_10', name: 'Kambing Dewasa', type: 'goat', image: ANIMAL_IMAGES.KAMBING_DEWASA, x: 32, y: 18, sound: 'Mbee~ 🐐' },
  { id: 'an_11', name: 'Kambing Muda', type: 'goat_young', image: ANIMAL_IMAGES.KAMBING_MUDA, x: 33, y: 19, sound: 'Mbee~ 🐐' },
  { id: 'an_12', name: 'Sapi Dewasa', type: 'cow', image: ANIMAL_IMAGES.SAPI_DEWASA, x: 35, y: 20, sound: 'Moo~ 🐄' },
  { id: 'an_13', name: 'Kambing Dewasa', type: 'goat', image: ANIMAL_IMAGES.KAMBING_DEWASA, x: 18, y: 12, sound: 'Mbee~ 🐐' },
  { id: 'an_14', name: 'Kambing Muda', type: 'goat_young', image: ANIMAL_IMAGES.KAMBING_MUDA, x: 19, y: 13, sound: 'Mbee~ 🐐' },
  { id: 'an_15', name: 'Sapi Dewasa', type: 'cow', image: ANIMAL_IMAGES.SAPI_DEWASA, x: 20, y: 14, sound: 'Moo~ 🐄' },
  { id: 'an_16', name: 'Kambing Dewasa', type: 'goat', image: ANIMAL_IMAGES.KAMBING_DEWASA, x: 30, y: 8, sound: 'Mbee~ 🐐' },
  { id: 'an_17', name: 'Kambing Muda', type: 'goat_young', image: ANIMAL_IMAGES.KAMBING_MUDA, x: 31, y: 9, sound: 'Mbee~ 🐐' },
  { id: 'an_18', name: 'Sapi Dewasa', type: 'cow', image: ANIMAL_IMAGES.SAPI_DEWASA, x: 34, y: 10, sound: 'Moo~ 🐄' },
  { id: 'an_19', name: 'Kambing Dewasa', type: 'goat', image: ANIMAL_IMAGES.KAMBING_DEWASA, x: 4, y: 25, sound: 'Mbee~ 🐐' },
  { id: 'an_20', name: 'Sapi Dewasa', type: 'cow', image: ANIMAL_IMAGES.SAPI_DEWASA, x: 6, y: 26, sound: 'Moo~ 🐄' }
];

export const WANDERING_NPCS = [
  {
    id: 'wanderer_ustadz',
    name: 'Ustadz Kasim',
    avatar: 'https://lh3.googleusercontent.com/d/1NHdyVcEPAmZEZmjBQiwI7f5aQ5uGYrYP',
    x: 8,
    y: 5,
    isWandering: true,
    dialogue: "Assalamu'alaikum Petugas Amil! Ingatlah aturan Zakat Tani/Hasil Bumi: Jika irigasi sungai/hujan alami zakatnya 10%. Tapi kalau menggunakan pompa/irigasi berbayar zakatnya 5% dari total panen.",
    formulaHint: "📜 Rumus Zakat Tani: Irigasi Alami = 10% | Irigasi Berbayar/Pompa = 5%"
  },
  {
    id: 'wanderer_saudagar',
    name: 'Saudagar Umar',
    avatar: 'https://lh3.googleusercontent.com/d/17UFPWhUkW4OtXQRUkQ8Vv53QE4j01qMx',
    x: 12,
    y: 8,
    isWandering: true,
    dialogue: "Salam sejahtera Amil! Untuk Zakat Perdagangan, Emas, dan Tabungan: Nisabnya seharga 85 gram emas, dan kadar zakatnya 2.5% setelah tersimpan 1 tahun (haul).",
    formulaHint: "📜 Rumus Zakat Dagang & Emas: 2.5% x Total Harta / Keuntungan Bersih (Nisab 85g Emas)"
  },
  {
    id: 'wanderer_petani',
    name: 'Kakek Hasan',
    avatar: 'https://lh3.googleusercontent.com/d/1NuD_aym1rDpvj_0vz9zP4dHr6nEMKiOq',
    x: 18,
    y: 6,
    isWandering: true,
    dialogue: "Hai Amil Muda! Hasil laut, tangkapan ikan nelayan, dan peternakan niaga dihitung 2.5% dari pendapatan bersih jika melebihi nisab bulanan/tahunan.",
    formulaHint: "📜 Rumus Zakat Nelayan & Ternak: 2.5% x Total Pendapatan Bersih"
  },
  {
    id: 'wanderer_cendekia',
    name: 'Guru Zainab',
    avatar: 'https://lh3.googleusercontent.com/d/12Q8tB0hWMn0Zy1gvLo6v_sH-0yduZKR7',
    x: 24,
    y: 12,
    isWandering: true,
    dialogue: "Ananda Amil! Hasil hutan seperti madu murni alami dan buah-buahan hutan tergolong hasil bumi alami. Kadar zakatnya adalah 10% dari total berat panen.",
    formulaHint: "📜 Rumus Zakat Hasil Hutan/Madu Alami: 10% x Total Berat Panen"
  },
  {
    id: 'wanderer_santri',
    name: 'Santri Ahmad',
    avatar: 'https://lh3.googleusercontent.com/d/1r8vZJoaG755ifkA_qtjomz_pHA_QxW2U',
    x: 6,
    y: 14,
    isWandering: true,
    dialogue: "Tahukah kamu? Zakat barang temuan atau harta karun (Rikaz) adalah 20% tanpa syarat haul! Sedangkan zakat profesi & pendapatan rutin adalah 2.5%.",
    formulaHint: "📜 Rumus Zakat Rikaz/Temuan = 20% | Zakat Profesi = 2.5%"
  },
  {
    id: 'wanderer_pedagang2',
    name: 'Bu Fatimah',
    avatar: 'https://lh3.googleusercontent.com/d/1J4VdU40e53G0GhH1XBbe9jK45WBnJpGt',
    x: 15,
    y: 16,
    isWandering: true,
    dialogue: "Warung saya alhamdulillah rame! Kalau kamu ditanya Muzakki tentang zakat perhiasan emas yang disimpan, bilang saja hitung 2.5% dari total gramnya.",
    formulaHint: "📜 Catatan: Zakat Emas Simpanan = 2.5% x Gram Emas"
  },
  {
    id: 'wanderer_pemuda',
    name: 'Pemuda Budi',
    avatar: 'https://lh3.googleusercontent.com/d/1BELS56vArZHbdCd5V_at9CRNC_mnSIoe',
    x: 28,
    y: 8,
    isWandering: true,
    dialogue: "Pasar dan dusun kita sekarang makin luas dan indah ya! Banyak sungai, danau, dan pohon rimbun. Semangat keliling mencari muzakki dan mustahik!",
    formulaHint: "💡 Tips: Jangan ragu bertanya ke warga lain kalau lupa perhitungan zakat!"
  },
  {
    id: 'wanderer_nelayan2',
    name: 'Bang Jalal',
    avatar: 'https://lh3.googleusercontent.com/d/1VsL8lYNIIs-EWl2iQnELlNbCzsA2kg1k',
    x: 10,
    y: 18,
    isWandering: true,
    dialogue: "Angin laut hari ini tenang. Bagi para nelayan yang kapalnya besar dan pendapatan bersihnya di atas nisab, zakatnya 2.5% dari hasil bersih.",
    formulaHint: "📜 Catatan Nelayan: Zakat = 2.5% dari Keuntungan Bersih Laut"
  },
  {
    id: 'wanderer_guru2',
    name: 'Ustadzah Maryam',
    avatar: 'https://lh3.googleusercontent.com/d/1W1p5juBOk83DTxshzkl6DlgMaroffLbO',
    x: 22,
    y: 4,
    isWandering: true,
    dialogue: "Zakat harus disalurkan dengan tepat kepada 8 asnaf (golongan penerima zakat), termasuk fakir, miskin, amil, mualaf, gharim, fisabilillah, dan ibnu sabil.",
    formulaHint: "📖 Pengetahuan: 8 Golongan Asnaf Penerima Zakat"
  },
  {
    id: 'wanderer_peternak2',
    name: 'Pak Sugeng',
    avatar: 'https://lh3.googleusercontent.com/d/1fjSJlGGv_VgsBVNbTD5Sln11B_pGGgNO',
    x: 5,
    y: 10,
    isWandering: true,
    dialogue: "Sapi dan kambing saya sehat-sehat! Kalau peternakan komersial/diperjualbelikan, zakatnya disamakan dengan zakat perdagangan yaitu 2.5% dari nilai ternak.",
    formulaHint: "📜 Catatan Ternak Komersial: 2.5% dari Total Nilai Penjualan"
  },
  {
    id: 'wanderer_pengusaha',
    name: 'Pak Bram',
    avatar: 'https://lh3.googleusercontent.com/d/19RcdKB--1tcxtDq_NVzYS8zAjC47tsaF',
    x: 20,
    y: 15,
    isWandering: true,
    dialogue: "Bisnis investasi dan hibah usaha negara dihitung zakatnya 2.5% dari total nilai bersih yang diperoleh. Jangan lupa tunaikan!",
    formulaHint: "📜 Catatan Zakat Hibah / Usaha Negara: 2.5% x Total Nilai"
  },
  {
    id: 'wanderer_warga1',
    name: 'Mbah Tarjo',
    avatar: 'https://lh3.googleusercontent.com/d/1NuD_aym1rDpvj_0vz9zP4dHr6nEMKiOq',
    x: 14,
    y: 3,
    isWandering: true,
    dialogue: "Dulu waktu saya muda, hasil panen padi pakai irigasi sungai alami disetor zakatnya 10%. Berasnya disalurkan ke lumbung desa.",
    formulaHint: "📜 Catatan Tani Alami = 10% dari total berat panen"
  },
  {
    id: 'wanderer_warga2',
    name: 'Teh Lilis',
    avatar: 'https://lh3.googleusercontent.com/d/1qS1exDLo81Qnz7u3nNg-e-KCDkvXS7mE',
    x: 30,
    y: 10,
    isWandering: true,
    dialogue: "Kalau jalan-jalan di kota ini, sejuk banget dekat danau dan taman bunga! Petugas amil semangat ya melayani muzakki!",
    formulaHint: "🌸 Salam Semangat Petugas Amil!"
  },
  {
    id: 'wanderer_warga3',
    name: 'Mang Ojak',
    avatar: 'https://lh3.googleusercontent.com/d/1x_T1aLP_KZkXnbXB0_p1ujLhtvlYA11y',
    x: 26,
    y: 18,
    isWandering: true,
    dialogue: "Ingat ya Amil, di kota ini pertanyaan Muzakki tidak kasih tau rumusnya! Kamu harus baca rumus dari petunjuk kami para warga mondar-mandir.",
    formulaHint: "🧠 Kunci: Hafalkan/Ingat rumus zakat dari warga mondar-mandir!"
  },
  {
    id: 'wanderer_warga4',
    name: 'Ibu Rahma',
    avatar: 'https://lh3.googleusercontent.com/d/1JcgTAjDbZuFf_XdbqbpzAZAEitoWi-Xn',
    x: 11,
    y: 12,
    isWandering: true,
    dialogue: "Semoga zakat yang kamu kelola membawa keberkahan bagi para mustahik dan anak yatim di seluruh pelosok negeri.",
    formulaHint: "✨ Keberkahan Zakat Menyucikan Harta"
  },
  {
    id: 'wanderer_warga5',
    name: 'Pak RT Slamet',
    avatar: 'https://lh3.googleusercontent.com/d/1NHdyVcEPAmZEZmjBQiwI7f5aQ5uGYrYP',
    x: 16,
    y: 10,
    isWandering: true,
    dialogue: "Selamat datang di wilayah kami! Setiap sudut kota punya lanskap indah, dari sawah, kebun, sungai hingga danau jernih.",
    formulaHint: "🗺️ Wilayah Luas Open World Zakat Adventure"
  },
  {
    id: 'wanderer_warga6',
    name: 'Dek Farhan',
    avatar: 'https://lh3.googleusercontent.com/d/17UFPWhUkW4OtXQRUkQ8Vv53QE4j01qMx',
    x: 4,
    y: 19,
    isWandering: true,
    dialogue: "Aku mau belajar zakat juga ah! Katanya zakat pertanian kalau siramnya pakai pompa berbayar itu 5%, bener kan Kak Amil?",
    formulaHint: "📜 Catatan: Irigasi Berbayar/Pompa = 5%"
  },
  {
    id: 'wanderer_warga7',
    name: 'Nenek Aminah',
    avatar: 'https://lh3.googleusercontent.com/d/1W1p5juBOk83DTxshzkl6DlgMaroffLbO',
    x: 21,
    y: 20,
    isWandering: true,
    dialogue: "Zakat itu membersihkan jiwa dan harta. Untuk emas simpanan yang mencapai 85 gram, keluarkan 2.5% ya cucuku.",
    formulaHint: "📜 Catatan Emas: 2.5% untuk simpanan ≥ 85 gram"
  },
  {
    id: 'wanderer_warga8',
    name: 'Bang Karto',
    avatar: 'https://lh3.googleusercontent.com/d/1sFpdCNtAA-OfXrKGGzgM2iYX_1fOo8Ng',
    x: 29,
    y: 5,
    isWandering: true,
    dialogue: "Amil jempolan! Kalau butuh panduan, tekan tombol Zoom in / Zoom out atau klik peta langsung untuk teleport berjalan cepat!",
    formulaHint: "🎮 Tips Fitur Kamera & Navigasi Peta"
  },
  {
    id: 'wanderer_warga9',
    name: 'Kang Dudung',
    avatar: 'https://lh3.googleusercontent.com/d/1sKX9Jru7jxxooRAeo333V5BQ5ICS9flX',
    x: 13,
    y: 21,
    isWandering: true,
    dialogue: "Mari jaga kelestarian alam danau dan sungai kita sambil menyebarkan kebaikan zakat di seluruh wilayah!",
    formulaHint: "🌿 Alam Asri Zakat Adventure"
  }
];

export const CITY_BASE_NPCS: Record<string, { muzakki: any[]; mustahikCycle1: any[]; mustahikPaceklik: any[] }> = {
  'Dusun Hijau': {
    muzakki: [
      { id: 'm1_dh', name: 'Haji Sulaiman', quest: 'TANI', avatar: 'https://lh3.googleusercontent.com/d/1r8vZJoaG755ifkA_qtjomz_pHA_QxW2U' },
      { id: 'm2_dh', name: 'Hj. Mariam', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/1NHdyVcEPAmZEZmjBQiwI7f5aQ5uGYrYP' },
      { id: 'm3_dh', name: 'Pak Burhan', quest: 'TERNAK', avatar: 'https://lh3.googleusercontent.com/d/1KmwJ1gGdkB_fV9MvIe5NuMTGgR3mVvYj' },
      { id: 'm4_dh', name: 'Nyonya Sylvia', quest: 'EMAS_MURNI', avatar: 'https://lh3.googleusercontent.com/d/11I64ZIgObcZof0Nlt5Z19-QVciLq_YX-' },
      { id: 'm5_dh', name: 'Kang Bahar', quest: 'MADU', avatar: 'https://lh3.googleusercontent.com/d/1HKwN57J25Ny7DquzSu9ItbLPnTyIGjpE' },
    ],
    mustahikCycle1: [
      { id: 'k1_dh', name: 'Pengurus Yatim', cost: 2500000, avatar: 'https://lh3.googleusercontent.com/d/1BELS56vArZHbdCd5V_at9CRNC_mnSIoe' },
      { id: 'k2_dh', name: 'Pak Darmono (Kuli)', cost: 4000000, avatar: 'https://lh3.googleusercontent.com/d/1JcgTAjDbZuFf_XdbqbpzAZAEitoWi-Xn' },
      { id: 'k3_dh', name: 'Ibu Fatimah (Janda)', cost: 3500000, avatar: 'https://lh3.googleusercontent.com/d/1W1p5juBOk83DTxshzkl6DlgMaroffLbO' },
      { id: 'k4_dh', name: 'Guru Madrasah Desa', cost: 5000000, avatar: 'https://lh3.googleusercontent.com/d/1qS1exDLo81Qnz7u3nNg-e-KCDkvXS7mE' },
      { id: 'k5_dh', name: 'Pak Usman (Petani)', cost: 3000000, avatar: 'https://lh3.googleusercontent.com/d/1OA51Y5W8TUv7xwX3JK0VhlLQy5il2VAU' },
    ],
    mustahikPaceklik: [
      { id: 'k6_dh', name: 'Mang Karsa (Krisis Paceklik)', cost: 4500000, avatar: 'https://lh3.googleusercontent.com/d/12Q8tB0hWMn0Zy1gvLo6v_sH-0yduZKR7' },
    ]
  },
  'Pasar Rakyat': {
    muzakki: [
      { id: 'm1_pr', name: 'Saudagar Malik', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/1J4VdU40e53G0GhH1XBbe9jK45WBnJpGt' },
      { id: 'm2_pr', name: 'Toko Bang Budi', quest: 'TANI', avatar: 'https://lh3.googleusercontent.com/d/17UFPWhUkW4OtXQRUkQ8Vv53QE4j01qMx' },
      { id: 'm3_pr', name: 'Juragan Rempah Pak Karta', quest: 'MADU', avatar: 'https://lh3.googleusercontent.com/d/19RcdKB--1tcxtDq_NVzYS8zAjC47tsaF' },
      { id: 'm4_pr', name: 'Ibu Henny Emas', quest: 'EMAS_MURNI', avatar: 'https://lh3.googleusercontent.com/d/1NuD_aym1rDpvj_0vz9zP4dHr6nEMKiOq' },
      { id: 'm5_pr', name: 'Koperasi Pasar Sejahtera', quest: 'NEGARA', avatar: 'https://lh3.googleusercontent.com/d/1HKwN57J25Ny7DquzSu9ItbLPnTyIGjpE' },
    ],
    mustahikCycle1: [
      { id: 'k1_pr', name: 'Kuli Panggul Pasar', cost: 3500000, avatar: 'https://lh3.googleusercontent.com/d/12Q8tB0hWMn0Zy1gvLo6v_sH-0yduZKR7' },
      { id: 'k2_pr', name: 'Mbah Saodah (Lansia)', cost: 3000000, avatar: 'https://lh3.googleusercontent.com/d/1Zr6jJwXHprZhdtIwK2lEz9Doc2XlaiHa' },
      { id: 'k3_pr', name: 'Pengurus Musala Pasar', cost: 4500000, avatar: 'https://lh3.googleusercontent.com/d/1sbtdj6rxeLAemeEiL8Y70bUBq6XUXYxN' },
      { id: 'k4_pr', name: 'Penjual Sayur Keliling', cost: 2800000, avatar: 'https://lh3.googleusercontent.com/d/1PVexU5IamGUOX64x5hvin5ENCmSTWp_S' },
      { id: 'k5_pr', name: 'Anak Yatim Pasar', cost: 2500000, avatar: 'https://lh3.googleusercontent.com/d/1UnvzdBfbTsgk3aKjWn-G4_sZT3Vj9SBQ' },
    ],
    mustahikPaceklik: [
      { id: 'k6_pr', name: 'Pedagang Bangkrut Paceklik', cost: 5000000, avatar: 'https://lh3.googleusercontent.com/d/1OA51Y5W8TUv7xwX3JK0VhlLQy5il2VAU' },
    ]
  },
  'Pesisir Karang': {
    muzakki: [
      { id: 'm1_pk', name: 'Kapten Idris', quest: 'NELAYAN', avatar: 'https://lh3.googleusercontent.com/d/1VsL8lYNIIs-EWl2iQnELlNbCzsA2kg1k' },
      { id: 'm2_pk', name: 'Juragan Ikan Tohir', quest: 'NELAYAN', avatar: 'https://lh3.googleusercontent.com/d/1UnvzdBfbTsgk3aKjWn-G4_sZT3Vj9SBQ' },
      { id: 'm3_pk', name: 'Saudagar Mutiara Nyonya Lin', quest: 'EMAS_MURNI', avatar: 'https://lh3.googleusercontent.com/d/17UFPWhUkW4OtXQRUkQ8Vv53QE4j01qMx' },
      { id: 'm4_pk', name: 'Pemilik Galangan Kapal', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/1HKwN57J25Ny7DquzSu9ItbLPnTyIGjpE' },
      { id: 'm5_pk', name: 'Pengusaha Tambak Udang', quest: 'TERNAK', avatar: 'https://lh3.googleusercontent.com/d/1fjSJlGGv_VgsBVNbTD5Sln11B_pGGgNO' },
    ],
    mustahikCycle1: [
      { id: 'k1_pk', name: 'Janda Nelayan Fatimah', cost: 3500000, avatar: 'https://lh3.googleusercontent.com/d/1W1p5juBOk83DTxshzkl6DlgMaroffLbO' },
      { id: 'k2_pk', name: 'Nelayan Sampan Kecil', cost: 4000000, avatar: 'https://lh3.googleusercontent.com/d/1x_T1aLP_KZkXnbXB0_p1ujLhtvlYA11y' },
      { id: 'k3_pk', name: 'Anak Yatim Pesisir', cost: 2500000, avatar: 'https://lh3.googleusercontent.com/d/1sbtdj6rxeLAemeEiL8Y70bUBq6XUXYxN' },
      { id: 'k4_pk', name: 'Mbah Djaja (Lansia)', cost: 3000000, avatar: 'https://lh3.googleusercontent.com/d/1PVexU5IamGUOX64x5hvin5ENCmSTWp_S' },
      { id: 'k5_pk', name: 'Penjaga Mercusuar Tua', cost: 3200000, avatar: 'https://lh3.googleusercontent.com/d/1Zr6jJwXHprZhdtIwK2lEz9Doc2XlaiHa' },
    ],
    mustahikPaceklik: [
      { id: 'k6_pk', name: 'Nelayan Badai Paceklik', cost: 4800000, avatar: 'https://lh3.googleusercontent.com/d/1JcgTAjDbZuFf_XdbqbpzAZAEitoWi-Xn' },
    ]
  },
  'Lembah Subur': {
    muzakki: [
      { id: 'm1_ls', name: 'Pak Bejo Peternak', quest: 'TERNAK', avatar: 'https://lh3.googleusercontent.com/d/1fjSJlGGv_VgsBVNbTD5Sln11B_pGGgNO' },
      { id: 'm2_ls', name: 'Haji Dahlan Sawah', quest: 'TANI', avatar: 'https://lh3.googleusercontent.com/d/1r8vZJoaG755ifkA_qtjomz_pHA_QxW2U' },
      { id: 'm3_ls', name: 'Pengusaha Susu Sapi', quest: 'TERNAK', avatar: 'https://lh3.googleusercontent.com/d/1HKwN57J25Ny7DquzSu9ItbLPnTyIGjpE' },
      { id: 'm4_ls', name: 'Toko Pupuk & Benih', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/1KmwJ1gGdkB_fV9MvIe5NuMTGgR3mVvYj' },
      { id: 'm5_ls', name: 'Kolektor Perhiasan Desa', quest: 'EMAS_MURNI', avatar: 'https://lh3.googleusercontent.com/d/1NHdyVcEPAmZEZmjBQiwI7f5aQ5uGYrYP' },
    ],
    mustahikCycle1: [
      { id: 'k1_ls', name: 'Guru Madrasah Subur', cost: 5000000, avatar: 'https://lh3.googleusercontent.com/d/1qS1exDLo81Qnz7u3nNg-e-KCDkvXS7mE' },
      { id: 'k2_ls', name: 'Buruh Cangkul Sawah', cost: 3200000, avatar: 'https://lh3.googleusercontent.com/d/1OA51Y5W8TUv7xwX3JK0VhlLQy5il2VAU' },
      { id: 'k3_ls', name: 'Anak Yatim Lembah', cost: 2500000, avatar: 'https://lh3.googleusercontent.com/d/1sbtdj6rxeLAemeEiL8Y70bUBq6XUXYxN' },
      { id: 'k4_ls', name: 'Nenek Salmah', cost: 2800000, avatar: 'https://lh3.googleusercontent.com/d/1Zr6jJwXHprZhdtIwK2lEz9Doc2XlaiHa' },
      { id: 'k5_ls', name: 'Keluarga Miskin Lembah', cost: 3500000, avatar: 'https://lh3.googleusercontent.com/d/12Q8tB0hWMn0Zy1gvLo6v_sH-0yduZKR7' },
    ],
    mustahikPaceklik: [
      { id: 'k6_ls', name: 'Peternak Wabah Paceklik', cost: 5200000, avatar: 'https://lh3.googleusercontent.com/d/1JcgTAjDbZuFf_XdbqbpzAZAEitoWi-Xn' },
    ]
  },
  'Kota Niaga': {
    muzakki: [
      { id: 'm1_kn', name: 'Nyonya Tan (Toko Emas)', quest: 'EMAS_MURNI', avatar: 'https://lh3.googleusercontent.com/d/19RcdKB--1tcxtDq_NVzYS8zAjC47tsaF' },
      { id: 'm2_kn', name: 'Direktur Bank Syariah', quest: 'NEGARA', avatar: 'https://lh3.googleusercontent.com/d/11I64ZIgObcZof0Nlt5Z19-QVciLq_YX-' },
      { id: 'm3_kn', name: 'Pemilik Supermarket Kota', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/1HKwN57J25Ny7DquzSu9ItbLPnTyIGjpE' },
      { id: 'm4_kn', name: 'Importir Beras Utama', quest: 'TANI', avatar: 'https://lh3.googleusercontent.com/d/1r8vZJoaG755ifkA_qtjomz_pHA_QxW2U' },
      { id: 'm5_kn', name: 'Pengusaha Tekstil Kota', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/1KmwJ1gGdkB_fV9MvIe5NuMTGgR3mVvYj' },
    ],
    mustahikCycle1: [
      { id: 'k1_kn', name: 'Pengurus Lansia Jompo', cost: 6000000, avatar: 'https://lh3.googleusercontent.com/d/1x_T1aLP_KZkXnbXB0_p1ujLhtvlYA11y' },
      { id: 'k2_kn', name: 'Pemulung Sampah Kota', cost: 3000000, avatar: 'https://lh3.googleusercontent.com/d/12Q8tB0hWMn0Zy1gvLo6v_sH-0yduZKR7' },
      { id: 'k3_kn', name: 'Anak Yatim Piatu Kota', cost: 3500000, avatar: 'https://lh3.googleusercontent.com/d/1sbtdj6rxeLAemeEiL8Y70bUBq6XUXYxN' },
      { id: 'k4_kn', name: 'Pengamen Jalanan Kota', cost: 2500000, avatar: 'https://lh3.googleusercontent.com/d/1UnvzdBfbTsgk3aKjWn-G4_sZT3Vj9SBQ' },
      { id: 'k5_kn', name: 'Janda Tua Kota', cost: 3200000, avatar: 'https://lh3.googleusercontent.com/d/1Zr6jJwXHprZhdtIwK2lEz9Doc2XlaiHa' },
    ],
    mustahikPaceklik: [
      { id: 'k6_kn', name: 'Karyawan PHK Paceklik', cost: 4500000, avatar: 'https://lh3.googleusercontent.com/d/1JcgTAjDbZuFf_XdbqbpzAZAEitoWi-Xn' },
    ]
  },
  'Hutan Damai': {
    muzakki: [
      { id: 'm1_hd', name: 'Kang Asep (Pencari Madu)', quest: 'MADU', avatar: 'https://lh3.googleusercontent.com/d/19RcdKB--1tcxtDq_NVzYS8zAjC47tsaF' },
      { id: 'm2_hd', name: 'Pengusaha Kayu Sengon', quest: 'TANI', avatar: 'https://lh3.googleusercontent.com/d/1HKwN57J25Ny7DquzSu9ItbLPnTyIGjpE' },
      { id: 'm3_hd', name: 'Peternak Lebah Kelulut', quest: 'TERNAK', avatar: 'https://lh3.googleusercontent.com/d/1fjSJlGGv_VgsBVNbTD5Sln11B_pGGgNO' },
      { id: 'm4_hd', name: 'Saudagar Herbal Alam', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/17UFPWhUkW4OtXQRUkQ8Vv53QE4j01qMx' },
      { id: 'm5_hd', name: 'Pemilik Kebun Gaharu', quest: 'EMAS_MURNI', avatar: 'https://lh3.googleusercontent.com/d/11I64ZIgObcZof0Nlt5Z19-QVciLq_YX-' },
    ],
    mustahikCycle1: [
      { id: 'k1_hd', name: 'Ketua Kamp Pengungsi', cost: 4500000, avatar: 'https://lh3.googleusercontent.com/d/1BELS56vArZHbdCd5V_at9CRNC_mnSIoe' },
      { id: 'k2_hd', name: 'Masyarakat Adat Kurang Mampu', cost: 3000000, avatar: 'https://lh3.googleusercontent.com/d/12Q8tB0hWMn0Zy1gvLo6v_sH-0yduZKR7' },
      { id: 'k3_hd', name: 'Anak-anak Rimba', cost: 2500000, avatar: 'https://lh3.googleusercontent.com/d/1UnvzdBfbTsgk3aKjWn-G4_sZT3Vj9SBQ' },
      { id: 'k4_hd', name: 'Penjaga Hutan Tua', cost: 3200000, avatar: 'https://lh3.googleusercontent.com/d/1PVexU5IamGUOX64x5hvin5ENCmSTWp_S' },
      { id: 'k5_hd', name: 'Janda Hutan Asri', cost: 2800000, avatar: 'https://lh3.googleusercontent.com/d/1Zr6jJwXHprZhdtIwK2lEz9Doc2XlaiHa' },
    ],
    mustahikPaceklik: [
      { id: 'k6_hd', name: 'Pencari Rotan Paceklik', cost: 4200000, avatar: 'https://lh3.googleusercontent.com/d/1JcgTAjDbZuFf_XdbqbpzAZAEitoWi-Xn' },
    ]
  },
  'Pusat Kerajaan': {
    muzakki: [
      { id: 'm1_pkj', name: 'Patih Kerajaan', quest: 'NEGARA', avatar: 'https://lh3.googleusercontent.com/d/1J4VdU40e53G0GhH1XBbe9jK45WBnJpGt' },
      { id: 'm2_pkj', name: 'Bendahara Istana', quest: 'EMAS_MURNI', avatar: 'https://lh3.googleusercontent.com/d/11I64ZIgObcZof0Nlt5Z19-QVciLq_YX-' },
      { id: 'm3_pkj', name: 'Saudagar Rempah Istana', quest: 'DAGANG', avatar: 'https://lh3.googleusercontent.com/d/1HKwN57J25Ny7DquzSu9ItbLPnTyIGjpE' },
      { id: 'm4_pkj', name: 'Laksamana Armada Kerajaan', quest: 'NELAYAN', avatar: 'https://lh3.googleusercontent.com/d/1VsL8lYNIIs-EWl2iQnELlNbCzsA2kg1k' },
      { id: 'm5_pkj', name: 'Pengusaha Peternakan Kuda', quest: 'TERNAK', avatar: 'https://lh3.googleusercontent.com/d/1fjSJlGGv_VgsBVNbTD5Sln11B_pGGgNO' },
    ],
    mustahikCycle1: [
      { id: 'k1_pkj', name: 'Marbot Masjid Agung', cost: 10000000, avatar: 'https://lh3.googleusercontent.com/d/1JcgTAjDbZuFf_XdbqbpzAZAEitoWi-Xn' },
      { id: 'k2_pkj', name: 'Fakir Miskin Alun-Alun', cost: 4000000, avatar: 'https://lh3.googleusercontent.com/d/12Q8tB0hWMn0Zy1gvLo6v_sH-0yduZKR7' },
      { id: 'k3_pkj', name: 'Prajurit Tua Pensiun', cost: 3500000, avatar: 'https://lh3.googleusercontent.com/d/1PVexU5IamGUOX64x5hvin5ENCmSTWp_S' },
      { id: 'k4_pkj', name: 'Anak Yatim Kerajaan', cost: 3000000, avatar: 'https://lh3.googleusercontent.com/d/1UnvzdBfbTsgk3aKjWn-G4_sZT3Vj9SBQ' },
      { id: 'k5_pkj', name: 'Janda Prajurit Istana', cost: 3200000, avatar: 'https://lh3.googleusercontent.com/d/1Zr6jJwXHprZhdtIwK2lEz9Doc2XlaiHa' },
    ],
    mustahikPaceklik: [
      { id: 'k6_pkj', name: 'Rakyat Korban Paceklik Istana', cost: 5000000, avatar: 'https://lh3.googleusercontent.com/d/1OA51Y5W8TUv7xwX3JK0VhlLQy5il2VAU' },
    ]
  }
};

export function buildAdventureMapStateForCycle(cycle: number = 1, helpedNpcIds: string[] = [], cityCount: number = 4) {
  const MAP_COLS = 40;
  const MAP_ROWS = 30;

  const rawMaps = [
    { name: 'Dusun Hijau', icon: 'leaf', color: 'emerald' },
    { name: 'Pasar Rakyat', icon: 'shopping-bag', color: 'amber' },
    { name: 'Pesisir Karang', icon: 'anchor', color: 'blue' },
    { name: 'Lembah Subur', icon: 'wheat', color: 'lime' },
    { name: 'Kota Niaga', icon: 'globe', color: 'indigo' },
    { name: 'Hutan Damai', icon: 'tree-pine', color: 'emerald' },
    { name: 'Pusat Kerajaan', icon: 'crown', color: 'purple' }
  ].slice(0, cityCount);

  const baseBuildingImages = [
    NAMED_BUILDINGS.RUMAH_PETANI,
    NAMED_BUILDINGS.KANTOR_AMIL,
    NAMED_BUILDINGS.GUDANG_PASAR,
    NAMED_BUILDINGS.SEKOLAH_MADRASAH,
    NAMED_BUILDINGS.LADANG_PAKAN,
    'https://lh3.googleusercontent.com/d/16aWAi0vcYxVCt2u4rs5tj5IeQltyrlnS',
    'https://lh3.googleusercontent.com/d/1G0oTCnDvi8UqBZJkTmeXVjslXJPgqw9e',
    'https://lh3.googleusercontent.com/d/1GL57YP-dT7QDcBI1b-q4rKoDu0ltVqyH',
    'https://lh3.googleusercontent.com/d/1MKAHRAEQKTd5NCPxwzCcz1kOPdFWFc3S',
    'https://lh3.googleusercontent.com/d/1SujXLePyPZPBmyUMej6gn4_-8OIVkNRG',
    'https://lh3.googleusercontent.com/d/1TZrdKOKrkWta6JEZ5DLukqojDBaVX6sZ',
    'https://lh3.googleusercontent.com/d/1ZrQtcW2J_nj5TYSFigBXebYc8b34g1vc'
  ];

  return rawMaps.map((mapInfo, mapIdx) => {
    const cityData = CITY_BASE_NPCS[mapInfo.name] || CITY_BASE_NPCS['Dusun Hijau'];
    const questNpcs: any[] = [];
    let posIdx = 0;

    // Grid positions across 40x30 map for clean spacing
    const getPos = (i: number) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      return {
        x: Math.max(2, Math.min(MAP_COLS - 3, 4 + col * 6)),
        y: Math.max(2, Math.min(MAP_ROWS - 3, 3 + row * 4))
      };
    };

    // 1. Add 5 Base Muzakki (kalkulasi/pengumpulan zakat)
    cityData.muzakki.forEach((m: any) => {
      const p = getPos(posIdx++);
      questNpcs.push({
        ...m,
        id: `qnpc_${m.id}_c${cycle}`,
        type: 'MUZAKKI',
        x: p.x,
        y: p.y,
        isStationary: true
      });
    });

    // 2. Add Mustahik based on Cycle
    // Siklus 1: 5 Mustahik
    // Siklus 2 & 3: 5 Mustahik + 1 Mustahik Paceklik = 6 Mustahik
    const mustahiksToInclude = [...cityData.mustahikCycle1];
    if (cycle >= 2) {
      mustahiksToInclude.push(...cityData.mustahikPaceklik);
    }

    mustahiksToInclude.forEach((k: any) => {
      const p = getPos(posIdx++);
      const isAlreadyHelped = helpedNpcIds.some(id => id.includes(k.id));
      questNpcs.push({
        ...k,
        id: `qnpc_${k.id}_c${cycle}`,
        type: 'MUSTAHIK',
        isHelped: isAlreadyHelped,
        x: p.x,
        y: p.y,
        isStationary: true
      });
    });

    // 3. Add Transformed Muzakki Mandiri (from previous cycle's helped Mustahik)
    // Converted Mustahik from previous cycles become NEW Muzakki Mandiri IN ADDITION to base missions!
    helpedNpcIds.forEach((helpedId: string, idx: number) => {
      const matched = [...cityData.mustahikCycle1, ...cityData.mustahikPaceklik].find(m => helpedId.includes(m.id));
      if (matched) {
        const p = getPos(posIdx++);
        questNpcs.push({
          id: `mandiri_${matched.id}_c${cycle}_${idx}`,
          name: `${matched.name} (Mandiri)`,
          type: 'MUZAKKI',
          isMandiri: true,
          quest: idx % 2 === 0 ? 'TERNAK' : 'DAGANG',
          avatar: matched.avatar,
          x: p.x,
          y: p.y,
          isStationary: true
        });
      }
    });

    // Generate Buildings (12 buildings per city)
    const buildings = Array.from({ length: 12 }).map((_, bIdx) => {
      const col = bIdx % 4;
      const row = Math.floor(bIdx / 4);
      return {
        id: `b_${mapIdx}_${bIdx}`,
        x: 4 + col * 9,
        y: 4 + row * 8,
        image: baseBuildingImages[(bIdx + mapIdx) % baseBuildingImages.length]
      };
    });

    const wanderingNpcs = JSON.parse(JSON.stringify(WANDERING_NPCS));

    return {
      name: mapInfo.name,
      icon: mapInfo.icon,
      color: mapInfo.color,
      npcs: [...questNpcs, ...wanderingNpcs],
      buildings
    };
  });
}

export const ALL_MAPS = buildAdventureMapStateForCycle(1, [], 4);

export const QUESTS = {
  'TANI': { 
    dialog: "Assalamu'alaikum Petugas Amil! Hasil panen padi kami melimpah tahun ini, total 10.000 kg (10 ton) menggunakan irigasi sungai alami. Berapa kg beras zakat pertanian yang wajib kami tunaikan?", 
    target: 1000, 
    unit: 'rice', 
    label: 'Beras', 
    formula: '💡 Rumus tidak diberikan di sini! Cari petunjuk rumus zakat dari warga mondar-mandir di sekitar kota.' 
  },
  'DAGANG': { 
    dialog: "Salam Petugas Amil! Alhamdulillah, keuntungan bersih perdagangan emas kami tahun ini mencapai 200 gram emas. Berapa gram emas zakat perdagangan/mal yang wajib kami bayar?", 
    target: 5, 
    unit: 'gold', 
    label: 'Emas', 
    formula: '💡 Rumus tidak diberikan di sini! Cari petunjuk rumus zakat dari warga mondar-mandir di sekitar kota.' 
  },
  'NELAYAN': { 
    dialog: "Selamat datang Petugas Amil! Hasil tangkapan ikan laut kami melimpah dengan pendapatan bersih Rp 60.000.000. Berapa Rupiah zakat yang wajib disetorkan?", 
    target: 1500000, 
    unit: 'cash', 
    label: 'Rupiah', 
    formula: '💡 Rumus tidak diberikan di sini! Cari petunjuk rumus zakat dari warga mondar-mandir di sekitar kota.' 
  },
  'TERNAK': { 
    dialog: "Assalamu'alaikum Amil! Peternakan komersial kami berkembang pesat dengan total hasil penjualan Rp 80.000.000. Berapa Rupiah zakat yang harus kami tunaikan?", 
    target: 2000000, 
    unit: 'cash', 
    label: 'Rupiah', 
    formula: '💡 Rumus tidak diberikan di sini! Cari petunjuk rumus zakat dari warga mondar-mandir di sekitar kota.' 
  },
  'EMAS_MURNI': { 
    dialog: "Salam Amil Master! Simpanan emas murni milik saya tersimpan genap 1 tahun sebanyak 400 gram. Berapa gram emas zakat simpanan yang wajib disetor?", 
    target: 10, 
    unit: 'gold', 
    label: 'Emas', 
    formula: '💡 Rumus tidak diberikan di sini! Cari petunjuk rumus zakat dari warga mondar-mandir di sekitar kota.' 
  },
  'MADU': { 
    dialog: "Hai Petugas Amil! Hutan perawan memberikan hasil madu murni sebanyak 200 kg secara alami tanpa budidaya buatan. Berapa kg zakat hasil hutan yang wajib disetorkan?", 
    target: 20, 
    unit: 'rice', 
    label: 'Beras/Madu', 
    formula: '💡 Rumus tidak diberikan di sini! Cari petunjuk rumus zakat dari warga mondar-mandir di sekitar kota.' 
  },
  'NEGARA': { 
    dialog: "Assalamu'alaikum Amil! Kerajaan menerima hibah dana pengembangan ekonomi sebesar Rp 400.000.000. Berapa Rupiah zakat/pajak harta yang harus disetorkan?", 
    target: 10000000, 
    unit: 'cash', 
    label: 'Rupiah', 
    formula: '💡 Rumus tidak diberikan di sini! Cari petunjuk rumus zakat dari warga mondar-mandir di sekitar kota.' 
  }
};

export const LEVELS = {
  'JUNIOR': { label: 'Junior', months: 4, icon: Shield, cityCount: 3, assistance: 'FULL', color: 'emerald', desc: 'Krisis: Bulan 3.', crisisMonths: [3] },
  'SENIOR': { label: 'Senior', months: 8, icon: Award, cityCount: 5, assistance: 'HALF', color: 'blue', desc: 'Krisis: Bulan 3, 6.', crisisMonths: [3, 6] },
  'MASTER': { label: 'Master', months: 12, icon: Crown, cityCount: 7, assistance: 'NONE', color: 'amber', desc: 'Krisis: Bulan 3, 6, 9.', crisisMonths: [3, 6, 9] }
};

export const CRISIS_DESC = [
  "Usahanya bangkrut karena inflasi.",
  "Terserang hama paceklik musim kemarau.",
  "Rumahnya terbakar habis tanpa sisa.",
  "Kapal dagangnya tenggelam diterjang badai.",
  "Tabungannya ludes karena tertipu investasi bodong."
];
