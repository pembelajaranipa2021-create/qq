import * as XLSX from 'xlsx';

export interface ScoreExportData {
  playerName: string;
  gameMode: 'Jutawan Zakat' | 'Zakat Adventure' | 'Kuis Zakat Interaktif (AR)' | (string & {});
  timestamp?: string;
  prizeMoney?: number;
  levelReached?: number;
  trustPercent?: number;
  wargaMandiriCount?: number;
  quizRawScore?: number;
  convertedScore: number;
  maxScore: number;
  gradePredikat: string;
}

export function calculateJutawanScore(prizeMoney: number, levelReached: number = 1): number {
  const maxPrize = 1000000000;
  const prizeRatio = Math.min(1, Math.max(0, prizeMoney / maxPrize));
  const levelRatio = Math.min(1, Math.max(0, levelReached / 30));
  const scoreRatio = Math.max(prizeRatio, levelRatio);
  return Math.min(2500, Math.round(scoreRatio * 2500));
}

export function calculateAdventureScore(trust: number, populationSaved: number): number {
  const trustRatio = Math.min(100, Math.max(0, trust)) / 100;
  const mandiriRatio = Math.min(1, Math.max(0, populationSaved / 15));
  const trustPoints = trustRatio * 1750;
  const mandiriPoints = mandiriRatio * 1750;
  return Math.min(3500, Math.round(trustPoints + mandiriPoints));
}

export function calculateQuizScore(rawScore: number): number {
  const ratio = Math.max(0, rawScore) / 1500;
  return Math.min(2000, Math.round(ratio * 2000));
}

export function getPredikatScore(score: number, maxScore: number): string {
  const ratio = score / maxScore;
  if (ratio >= 0.9) return 'MUMTAZ (Cendekia Zakat Utama 👑)';
  if (ratio >= 0.75) return 'JAYYID JIDDAN (Sangat Memuaskan 🌟)';
  if (ratio >= 0.5) return 'JAYYID (Memuaskan & Cerdas Zakat 👍)';
  if (ratio >= 0.25) return 'MAQBUL (Berjuang Baik 💡)';
  return 'RASIB (Tetap Semangat Belajar 📖)';
}

export function downloadScoreReportExcel(data: ScoreExportData | ScoreExportData[], customFilename?: string) {
  const dataArray = Array.isArray(data) ? data : [data];
  const dateNowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  const excelRows = dataArray.map((item, index) => {
    let rincian = '';
    if (item.gameMode === 'Jutawan Zakat') {
      rincian = `Hadiah: Rp ${(item.prizeMoney || 0).toLocaleString('id-ID')} | Level: ${item.levelReached || 1}/30`;
    } else if (item.gameMode === 'Zakat Adventure') {
      rincian = `Kepercayaan: ${item.trustPercent || 0}% | Warga Mandiri: ${item.wargaMandiriCount || 0} orang`;
    } else if (item.gameMode === 'Kuis Zakat Interaktif (AR)') {
      rincian = `Skor Mentah: ${(item.quizRawScore || 0).toLocaleString('id-ID')} Poin`;
    }

    return {
      "No": index + 1,
      "Nama Pemain": item.playerName || 'Pahlawan Zakat',
      "Mode Permainan": item.gameMode,
      "Nilai Akhir (Konversi)": item.convertedScore,
      "Maksimal Poin Mode": item.maxScore,
      "Predikat": item.gradePredikat,
      "Rincian Pencapaian": rincian,
      "Tanggal & Waktu": item.timestamp || dateNowStr
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Nilai Zakat");

  worksheet['!cols'] = [
    { wch: 6 },   // No
    { wch: 22 },  // Nama Pemain
    { wch: 28 },  // Mode Permainan
    { wch: 22 },  // Nilai Akhir
    { wch: 20 },  // Maksimal Poin
    { wch: 36 },  // Predikat
    { wch: 42 },  // Rincian
    { wch: 24 }   // Tanggal
  ];

  const firstPlayerName = (dataArray[0]?.playerName || 'Pemain').replace(/\s+/g, '_');
  const filename = customFilename || `Rekap_Nilai_Zakat_${firstPlayerName}_${Date.now()}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

export function downloadServerLeaderboardExcel(
  leaderboard: Array<{
    rank: number;
    name: string;
    score: number;
    levelReached: number;
    correctCount: number;
    streak: number;
    playerId?: string;
  }>,
  gameModeName: string = 'Server Jutawan Zakat',
  roomCode?: string
) {
  const dateNowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  const excelRows = leaderboard.map((entry) => {
    const maxScore = 2500;
    const convertedScore = calculateJutawanScore(entry.score, entry.levelReached);
    const predikat = getPredikatScore(convertedScore, maxScore);

    return {
      "Peringkat (#)": entry.rank,
      "Nama Pemain": entry.name || 'Pahlawan Zakat',
      "Mode / Server Sesi": gameModeName,
      "Total Skor (Hadiah / Poin)": entry.score.toLocaleString('id-ID'),
      "Nilai Konversi Akhir": convertedScore,
      "Maksimal Poin": maxScore,
      "Predikat": predikat,
      "Level Dicapai": `Level ${entry.levelReached}`,
      "Jawaban Benar": `${entry.correctCount || 0} Soal`,
      "Streak Tertinggi": `${entry.streak || 0}x`,
      "Waktu Ekspor": dateNowStr
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Server Leaderboard");

  worksheet['!cols'] = [
    { wch: 14 }, // Peringkat
    { wch: 24 }, // Nama Pemain
    { wch: 28 }, // Mode / Server Sesi
    { wch: 30 }, // Skor
    { wch: 20 }, // Nilai Konversi
    { wch: 16 }, // Maksimal Poin
    { wch: 36 }, // Predikat
    { wch: 16 }, // Level
    { wch: 16 }, // Jawaban Benar
    { wch: 18 }, // Streak
    { wch: 24 }  // Waktu
  ];

  const codeStr = roomCode ? `_Room_${roomCode}` : '';
  const filename = `Rekap_Nilai_Server_Zakat${codeStr}_${Date.now()}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

export function downloadScoreReportTXT(data: ScoreExportData) {
  const dateStr = data.timestamp || new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
  const filename = `Laporan_Nilai_Zakat_${(data.playerName || 'Pemain').replace(/\s+/g, '_')}_${Date.now()}.txt`;
  
  let detailsText = '';
  if (data.gameMode === 'Jutawan Zakat') {
    detailsText = `
- Uang Hadiah Jutawan : Rp ${(data.prizeMoney || 0).toLocaleString('id-ID')}
- Level Dicapai       : Level ${data.levelReached || 1} / 30`;
  } else if (data.gameMode === 'Zakat Adventure') {
    detailsText = `
- Tingkat Kepercayaan  : ${(data.trustPercent || 0)}%
- Warga Mandiri Dibantu: ${(data.wargaMandiriCount || 0)} Orang`;
  } else if (data.gameMode === 'Kuis Zakat Interaktif (AR)') {
    detailsText = `
- Skor Mentah Kuis     : ${(data.quizRawScore || 0)} Poin`;
  }

  const content = `
===================================================================
             LAPORAN NILAI AKHIR & PENGHARGAAN ZAKAT
                     PAHLAWAN ZAKAT NUSANTARA
===================================================================

Nama Pemain   : ${data.playerName || 'Pemain'}
Mode Permainan: ${data.gameMode}
Tanggal & Waktu: ${dateStr}

-------------------------------------------------------------------
RINCIAN PENCAPAIAN PERMAINAN:
-------------------------------------------------------------------${detailsText}

-------------------------------------------------------------------
KONVERSI NILAI AKHIR PERMAINAN:
-------------------------------------------------------------------
Nilai Akhir           : ${data.convertedScore.toLocaleString('id-ID')} / ${data.maxScore.toLocaleString('id-ID')} POIN
Status & Predikat     : ${data.gradePredikat}

===================================================================
Catatan: Sertifikat dan Laporan Nilai ini diterbitkan secara otomatis
oleh Sistem Game Edukasi & Simulasi Zakat Nusantara.
===================================================================
`.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
