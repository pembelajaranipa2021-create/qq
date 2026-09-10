import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, Crown, Sparkles, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';
import { downloadScoreReportTXT, downloadScoreReportExcel, getPredikatScore, calculateJutawanScore } from '../utils/scoreExporter';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  playerAvatar: string;
  totalScore: number;
  levelReached: number;
  rank?: number;
  gameMode?: 'Jutawan Zakat' | 'Zakat Adventure' | 'Kuis Zakat Interaktif (AR)';
  convertedScore?: number;
  maxScore?: number;
  prizeMoney?: number;
  trustPercent?: number;
  wargaMandiriCount?: number;
  quizRawScore?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  playerName,
  playerAvatar,
  totalScore,
  levelReached,
  rank,
  gameMode = 'Jutawan Zakat',
  convertedScore,
  maxScore = 2500,
  prizeMoney,
  trustPercent,
  wargaMandiriCount,
  quizRawScore
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEffects.playVictoryFanfare();
      // Burst confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Calculate normalized converted points if not directly provided
  let finalConvertedScore = convertedScore;
  if (finalConvertedScore === undefined) {
    if (gameMode === 'Jutawan Zakat') {
      finalConvertedScore = calculateJutawanScore(prizeMoney !== undefined ? prizeMoney : totalScore, levelReached);
    } else {
      finalConvertedScore = totalScore;
    }
  }

  const predikat = getPredikatScore(finalConvertedScore, maxScore);

  const handleExportExcel = () => {
    downloadScoreReportExcel({
      playerName,
      gameMode,
      prizeMoney: prizeMoney !== undefined ? prizeMoney : totalScore,
      levelReached,
      trustPercent,
      wargaMandiriCount,
      quizRawScore,
      convertedScore: finalConvertedScore,
      maxScore,
      gradePredikat: predikat
    });
  };

  const handleExportTXT = () => {
    downloadScoreReportTXT({
      playerName,
      gameMode,
      prizeMoney: prizeMoney !== undefined ? prizeMoney : totalScore,
      levelReached,
      trustPercent,
      wargaMandiriCount,
      quizRawScore,
      convertedScore: finalConvertedScore,
      maxScore,
      gradePredikat: predikat
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FDFCF0] border-4 border-[#3D405B] rounded-3xl w-full max-w-2xl shadow-[8px_8px_0px_#3D405B] text-[#3D405B] overflow-hidden flex flex-col relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-[#F4F1DE] hover:bg-[#E07A5F] hover:text-white text-[#3D405B] border-2 border-[#3D405B] transition-colors cursor-pointer shadow-[2px_2px_0px_#3D405B]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Printable Area */}
        <div id="certificate-print-area" className="p-6 sm:p-8 text-center space-y-4 relative border-4 border-[#3D405B] m-3 rounded-2xl bg-[#FDFCF0] shadow-[3px_3px_0px_#3D405B]">
          
          {/* Header Seal */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2CC8F] text-[#3D405B] shadow-[2px_2px_0px_#3D405B] border-2 border-[#3D405B] mx-auto text-3xl font-black">
            🕌
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#E07A5F]">
              SERTIFIKAT & HASIL NILAI AKHIR
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#3D405B] font-serif tracking-wide uppercase">
              PAHLAWAN ZAKAT NUSANTARA
            </h2>
            <p className="text-xs text-[#3D405B]/80 font-bold italic">
              Mode Permainan: <span className="text-[#E07A5F] font-black">{gameMode}</span>
            </p>
          </div>

          <div className="py-2.5 border-y-2 border-[#3D405B]/20 max-w-md mx-auto space-y-1">
            <p className="text-xs text-[#3D405B] font-bold">Diberikan Kepada Pahlawan Zakat:</p>
            <div className="text-2xl sm:text-3xl font-black text-[#3D405B] font-serif flex items-center justify-center gap-2">
              <img src={playerAvatar} alt="avatar" className="w-10 h-10 object-contain inline-block" />
              <span className="text-[#E07A5F] underline decoration-[#3D405B] decoration-wavy underline-offset-4">
                {playerName}
              </span>
            </div>
          </div>

          {/* Achievement Metrics & Final Score */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto text-center pt-1">
            <div className="bg-[#F2CC8F]/80 p-2.5 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-black text-[#3D405B]/80 block">Nilai Akhir Konversi</span>
              <span className="text-lg sm:text-xl font-black text-[#E07A5F] font-mono">
                {finalConvertedScore.toLocaleString('id-ID')} / {maxScore.toLocaleString('id-ID')}
              </span>
            </div>

            {gameMode === 'Jutawan Zakat' && (
              <>
                <div className="bg-[#F4F1DE] p-2.5 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B]">
                  <span className="text-[10px] uppercase font-black text-[#3D405B]/70 block">Uang Hadiah</span>
                  <span className="text-xs sm:text-sm font-black text-[#3D405B] font-mono">
                    Rp {(prizeMoney !== undefined ? prizeMoney : totalScore).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-[#F4F1DE] p-2.5 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B]">
                  <span className="text-[10px] uppercase font-black text-[#3D405B]/70 block">Level Dicapai</span>
                  <span className="text-xs sm:text-sm font-black text-[#E07A5F] font-mono">
                    Lvl {levelReached}/30
                  </span>
                </div>
              </>
            )}

            {gameMode === 'Zakat Adventure' && (
              <>
                <div className="bg-[#F4F1DE] p-2.5 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B]">
                  <span className="text-[10px] uppercase font-black text-[#3D405B]/70 block">Kepercayaan</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600 font-mono">
                    {trustPercent}%
                  </span>
                </div>
                <div className="bg-[#F4F1DE] p-2.5 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B]">
                  <span className="text-[10px] uppercase font-black text-[#3D405B]/70 block">Warga Mandiri</span>
                  <span className="text-xs sm:text-sm font-black text-[#E07A5F] font-mono">
                    {wargaMandiriCount} Orang
                  </span>
                </div>
              </>
            )}

            {gameMode === 'Kuis Zakat Interaktif (AR)' && (
              <div className="bg-[#F4F1DE] p-2.5 rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] col-span-2">
                <span className="text-[10px] uppercase font-black text-[#3D405B]/70 block">Skor Kuis Mentah</span>
                <span className="text-xs sm:text-sm font-black text-[#3D405B] font-mono">
                  {(quizRawScore !== undefined ? quizRawScore : totalScore).toLocaleString('id-ID')} Poin
                </span>
              </div>
            )}
          </div>

          <div className="bg-[#81B29A]/20 border-2 border-[#3D405B]/40 rounded-xl py-1.5 px-3 max-w-md mx-auto">
            <span className="text-[10px] font-black uppercase text-[#3D405B]/70 block">Predikat Pencapaian</span>
            <span className="text-xs font-black text-[#3D405B]">{predikat}</span>
          </div>

          <p className="text-[11px] text-[#3D405B]/80 font-semibold italic pt-1 max-w-sm mx-auto">
            "Semoga ilmu zakat ini menjadi pembersih harta, penambah keberkahan, dan amal jariyah untuk kebaikan dunia dan akhirat."
          </p>

          <div className="pt-2 border-t-2 border-[#3D405B]/20 flex items-center justify-between text-[10px] text-[#3D405B] font-bold max-w-md mx-auto">
            <span>Tanggal: {todayStr}</span>
            <span className="font-black text-[#E07A5F]">Akademi Jutawan Zakat</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="bg-[#F4F1DE] px-4 sm:px-6 py-3 border-t-2 border-[#3D405B] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-[#81B29A] hover:bg-[#F2CC8F] text-[#3D405B] font-black text-xs rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] flex items-center gap-1.5 cursor-pointer transition-all"
              title="Unduh file rekapan nilai format Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#E07A5F]" /> Export Excel (.XLSX)
            </button>

            <button
              onClick={handleExportTXT}
              className="px-3.5 py-2 bg-[#E07A5F] hover:bg-[#F2CC8F] text-white hover:text-[#3D405B] font-black text-xs rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] flex items-center gap-1.5 cursor-pointer transition-all"
              title="Unduh file laporan rincian nilai akhir (.txt)"
            >
              <FileText className="w-4 h-4" /> Export TXT
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="px-3.5 py-2 bg-[#FDFCF0] hover:bg-[#F2CC8F] text-[#3D405B] font-black text-xs rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#E07A5F]" /> Cetak Sertifikat
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#F2CC8F] hover:bg-[#81B29A] text-[#3D405B] font-black text-xs rounded-xl border-2 border-[#3D405B] shadow-[2px_2px_0px_#3D405B] cursor-pointer transition-all"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};

