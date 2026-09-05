"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { LUCKY_WHEEL_SECTORS, LuckyWheelSector, TRUE_FALSE_QUESTIONS } from "@/lib/data";
import { CheckCircle2, XCircle } from "lucide-react";

interface LuckyWheelGameProps {
  onClose: () => void;
}

export default function LuckyWheelGame({ onClose }: LuckyWheelGameProps) {
  const { addStudentXp } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSector, setSelectedSector] = useState<LuckyWheelSector | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentQuiz] = useState(TRUE_FALSE_QUESTIONS[Math.floor(Math.random() * TRUE_FALSE_QUESTIONS.length)]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  const sectors = LUCKY_WHEEL_SECTORS;
  const numSectors = sectors.length;
  const sectorAngle = 360 / numSectors;

  const handleSpin = () => {
    if (isSpinning) return;
    sound.playClick();
    setIsSpinning(true);
    setSelectedSector(null);
    setQuizModalOpen(false);
    setQuizAnswered(false);

    // Random turns: between 5 and 8 full spins + random offset
    const randomSectorIdx = Math.floor(Math.random() * numSectors);
    const targetAngle = 360 * 6 + (numSectors - 1 - randomSectorIdx) * sectorAngle + sectorAngle / 2;
    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = sectors[randomSectorIdx];
      setSelectedSector(chosen);

      if (chosen.type === "bonus") {
        sound.playVictory();
        addStudentXp(chosen.rewardXp);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        sound.playCorrect();
        setQuizModalOpen(true);
      }
    }, 4000);
  };

  const handleAnswerQuiz = (userChoice: boolean) => {
    if (quizAnswered || !selectedSector) return;
    sound.playClick();
    const correct = userChoice === currentQuiz.isTrue;
    setQuizAnswered(true);
    setQuizCorrect(correct);

    if (correct) {
      sound.playVictory();
      addStudentXp(selectedSector.rewardXp);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      sound.playWrong();
      addStudentXp(10); // Encouragement XP
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-slate-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              🎡
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl tracking-tight">Vòng Quay Tri Thức</h3>
              <p className="text-xs text-amber-100">
                Thử thách may mắn mỗi ngày — Rinh trọn điểm thưởng XP
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-6 text-center">
          {/* Wheel Visual */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
            {/* Pointer arrow on top */}
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-rose-600 drop-shadow-md" />

            {/* Outer Ring */}
            <div className="w-full h-full rounded-full p-2.5 bg-slate-100 border-4 border-amber-400 shadow-xl relative overflow-hidden flex items-center justify-center">
              {/* Spinning Plate */}
              <div
                className="w-full h-full rounded-full overflow-hidden relative shadow-inner"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0.95, 0.35, 1)" : "none",
                }}
              >
                {sectors.map((sector, index) => {
                  const angle = (360 / numSectors) * index;
                  return (
                    <div
                      key={sector.id}
                      className="absolute w-1/2 h-full top-0 right-0 origin-left flex items-center justify-center"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      <div
                        className="w-full h-full origin-left flex items-center pl-6 text-white font-bold text-xs sm:text-sm select-none"
                        style={{
                          backgroundColor: sector.color,
                          clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                        }}
                      >
                        <span className="transform -rotate-90 origin-center translate-x-3 text-center whitespace-nowrap drop-shadow-sm">
                          {sector.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Center Hub */}
              <div className="absolute z-10 w-16 h-16 rounded-full bg-white border-4 border-amber-400 shadow-md flex items-center justify-center font-black text-amber-600 text-xs">
                QUAY 🎯
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!isSpinning && !selectedSector && (
            <button
              onClick={handleSpin}
              className="px-8 py-3.5 rounded-xl font-bold text-base bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transition transform hover:scale-105"
            >
              Quay Ngay Lập Tức
            </button>
          )}

          {isSpinning && (
            <p className="text-sm font-semibold text-slate-500 animate-pulse">
              Vòng quay đang chọn thử thách ngẫu nhiên cho em...
            </p>
          )}

          {/* Result Alert when Bonus */}
          {!isSpinning && selectedSector && selectedSector.type === "bonus" && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 max-w-md w-full animate-fade-in space-y-2">
              <span className="text-3xl block">🎁</span>
              <h4 className="font-bold text-base">Chúc mừng em!</h4>
              <p className="text-xs text-emerald-700">{selectedSector.description}</p>
              <div className="text-sm font-black text-emerald-600">+{selectedSector.rewardXp} XP Đã Nhận!</div>
              <button
                onClick={handleSpin}
                className="mt-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Quay Thêm Lượt Nữa
              </button>
            </div>
          )}

          {/* Quiz Challenge Card */}
          {!isSpinning && selectedSector && selectedSector.type === "quiz" && quizModalOpen && (
            <div className="p-5 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-left max-w-md w-full animate-fade-in space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Thử Thách: {selectedSector.label}
                </span>
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                  +{selectedSector.rewardXp} XP
                </span>
              </div>

              <p className="text-sm font-bold text-slate-800">
                {currentQuiz.question}
              </p>

              {!quizAnswered ? (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleAnswerQuiz(true)}
                    className="py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Đúng
                  </button>
                  <button
                    onClick={() => handleAnswerQuiz(false)}
                    className="py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Sai
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    quizCorrect ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
                  }`}>
                    {quizCorrect ? "🎉 Tuyệt vời! Em đã trả lời chính xác và nhận trọn điểm thưởng." : "💡 Chưa đúng rồi! Hãy xem lời giải nhé."}
                    <p className="mt-1 text-[11px] text-slate-600">{currentQuiz.explanation}</p>
                  </div>
                  <button
                    onClick={handleSpin}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Quay Lượt Tiếp Theo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
