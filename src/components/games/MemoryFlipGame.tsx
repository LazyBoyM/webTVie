"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { Trophy, RotateCcw, Clock, Sparkles } from "lucide-react";

interface MemoryFlipGameProps {
  onClose: () => void;
}

interface CardItem {
  id: number;
  pairId: number;
  text: string;
  subText?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const PAIRS_SOURCE = [
  { pairId: 1, a: "Can đảm", b: "Dũng cảm" },
  { pairId: 2, a: "Siêng năng", b: "Cần cù" },
  { pairId: 3, a: "Gọn gàng", b: "Ngăn nắp" },
  { pairId: 4, a: "Lạc quan", b: "Bi quan" },
  { pairId: 5, a: "Uống nước", b: "Nhớ nguồn" },
  { pairId: 6, a: "Lá lành", b: "Đùm lá rách" },
];

export default function MemoryFlipGame({ onClose }: MemoryFlipGameProps) {
  const { addStudentXp } = useAuth();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize cards
  const initGame = () => {
    const list: CardItem[] = [];
    let idCounter = 0;

    PAIRS_SOURCE.forEach((p) => {
      list.push({
        id: idCounter++,
        pairId: p.pairId,
        text: p.a,
        isFlipped: false,
        isMatched: false,
      });
      list.push({
        id: idCounter++,
        pairId: p.pairId,
        text: p.b,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(list.sort(() => 0.5 - Math.random()));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setIsFinished(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || flippedIds.length === 2) return;

    sound.playClick();

    const newCards = cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = newCards.find((c) => c.id === nextFlipped[0])!;
      const secondCard = newCards.find((c) => c.id === nextFlipped[1])!;

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        sound.playCorrect();
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          )
        );
        setMatches((m) => {
          const nextMatches = m + 1;
          if (nextMatches === PAIRS_SOURCE.length) {
            // Victory
            setTimeout(() => {
              setIsFinished(true);
              sound.playVictory();
              addStudentXp(200);
              confetti({ particleCount: 120, spread: 80 });
            }, 500);
          }
          return nextMatches;
        });
        setFlippedIds([]);
      } else {
        // Not matched
        sound.playWrong();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-mint-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Game Top Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-mint-600 to-teal-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
              🃏
            </div>
            <div>
              <h3 className="font-black font-heading text-lg sm:text-xl tracking-tight leading-tight">
                Lật Thẻ Ghép Đôi Từ Ngữ
              </h3>
              <p className="text-mint-100 text-xs font-bold">Tìm cặp từ đồng nghĩa, trái nghĩa & thành ngữ ca dao</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-center">
              <span className="block text-[10px] uppercase font-bold text-mint-100">Thời Gian</span>
              <span className="text-base font-black flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {formatTime(seconds)}
              </span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Moves & Score Header */}
        <div className="px-6 py-3 bg-mint-50/70 border-b border-mint-100 flex items-center justify-between text-xs font-bold text-emerald-800">
          <span>Lượt lật: {moves}</span>
          <span>Đã ghép: {matches} / {PAIRS_SOURCE.length} cặp</span>
        </div>

        {/* Grid of cards */}
        {!isFinished ? (
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5">
              {cards.map((card) => {
                return (
                  <button
                    key={card.id}
                    disabled={card.isMatched || card.isFlipped}
                    onClick={() => handleCardClick(card)}
                    className={`h-28 sm:h-32 rounded-2xl font-black text-base sm:text-lg transition-all duration-300 transform flex items-center justify-center p-3 text-center border-2 shadow-sm ${
                      card.isMatched
                        ? "bg-emerald-100 border-emerald-400 text-emerald-800 scale-95 shadow-inner"
                        : card.isFlipped
                        ? "bg-white border-spark-400 text-spark-900 shadow-md ring-2 ring-spark-300"
                        : "bg-gradient-to-br from-mint-500 to-emerald-600 border-emerald-700 text-white hover:scale-105 active:scale-95"
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="font-heading">{card.text}</span>
                    ) : (
                      <Sparkles className="w-8 h-8 text-mint-200 opacity-80" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Finished summary */
          <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center animate-fade-in">
            <div className="inline-block p-4 bg-mint-100 rounded-3xl animate-bounce">
              <span className="text-5xl">🎉</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 font-heading">Siêu Trí Nhớ!</h2>
              <p className="text-slate-500 font-bold mt-1">
                Em đã ghép đủ tất cả các cặp kiến thức trong {formatTime(seconds)} với {moves} lượt lật!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="block text-xs font-bold text-emerald-600 uppercase">Thời Gian</span>
                <span className="text-2xl font-black text-emerald-950">{formatTime(seconds)}</span>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="block text-xs font-bold text-amber-600 uppercase">XP Nhận Được</span>
                <span className="text-2xl font-black text-amber-950">+200 ⚡</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={initGame}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Chơi Lại
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 py-3.5 text-white font-black rounded-2xl btn-game-green flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" /> Hoàn Thành
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
