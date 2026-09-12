"use client";

import React from "react";

export default function GameCardArtwork({ gameId }: { gameId: string }) {
  switch (gameId) {
    case "speed-quiz":
      return (
        <div className="w-full h-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-yellow-300/30 blur-xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-orange-300/30 blur-lg pointer-events-none" />
          <svg viewBox="0 0 200 120" className="w-48 h-28 drop-shadow-md">
            {/* Ray Burst */}
            <g opacity="0.35">
              <line x1="100" y1="60" x2="100" y2="10" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="100" y1="60" x2="150" y2="25" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="100" y1="60" x2="50" y2="25" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />
            </g>
            {/* Golden Crown */}
            <path
              d="M 50 85 L 60 40 L 80 65 L 100 30 L 120 65 L 140 40 L 150 85 Z"
              fill="url(#goldCrownGrad)"
              stroke="#b45309"
              strokeWidth="2.5"
            />
            {/* Crown Rim */}
            <rect x="48" y="85" width="104" height="12" rx="4" fill="#d97706" stroke="#92400e" strokeWidth="2" />
            {/* Jewels on Crown */}
            <circle cx="60" cy="40" r="4.5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
            <circle cx="100" cy="30" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
            <circle cx="140" cy="40" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
            <circle cx="75" cy="91" r="3" fill="#fbbf24" />
            <circle cx="100" cy="91" r="3" fill="#ef4444" />
            <circle cx="125" cy="91" r="3" fill="#fbbf24" />
            {/* Giant Lightning Bolt */}
            <polygon
              points="105,15 125,50 110,50 120,80 90,45 102,45"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            {/* Stopwatch Badge */}
            <g transform="translate(140, 65)">
              <circle cx="18" cy="18" r="15" fill="#ffffff" stroke="#ea580c" strokeWidth="2.5" />
              <path d="M 18 10 L 18 18 L 24 20" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
              <rect x="16" y="1" width="4" height="3" rx="1" fill="#ea580c" />
            </g>
            <defs>
              <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "sorting-basket":
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-pink-400/25 blur-xl pointer-events-none" />
          <svg viewBox="0 0 200 120" className="w-48 h-28 drop-shadow-md">
            {/* Left Basket: Danh Từ */}
            <g transform="translate(20, 45)">
              <path d="M 5 25 L 12 55 L 48 55 L 55 25 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
              <ellipse cx="30" cy="25" rx="25" ry="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
              <rect x="8" y="32" width="44" height="15" rx="4" fill="#fff" />
              <text x="30" y="43" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#c2410c">Danh Từ</text>
              <circle cx="25" cy="20" r="7" fill="#ef4444" />
              <path d="M 25 13 Q 28 9 30 12" stroke="#15803d" strokeWidth="2" fill="none" />
            </g>
            {/* Center Basket: Động Từ */}
            <g transform="translate(70, 35)">
              <path d="M 6 30 L 14 65 L 52 65 L 60 30 Z" fill="#a855f7" stroke="#6b21a8" strokeWidth="2" />
              <ellipse cx="33" cy="30" rx="27" ry="7" fill="#e9d5ff" stroke="#6b21a8" strokeWidth="2" />
              <rect x="10" y="38" width="46" height="16" rx="4" fill="#fff" />
              <text x="33" y="50" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#6b21a8">Động Từ</text>
              <polygon points="33,12 37,22 47,23 39,29 42,38 33,33 24,38 27,29 19,23 29,22" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            </g>
            {/* Right Basket: Tính Từ */}
            <g transform="translate(126, 45)">
              <path d="M 5 25 L 12 55 L 48 55 L 55 25 Z" fill="#34d399" stroke="#047857" strokeWidth="2" />
              <ellipse cx="30" cy="25" rx="25" ry="6" fill="#a7f3d0" stroke="#047857" strokeWidth="2" />
              <rect x="8" y="32" width="44" height="15" rx="4" fill="#fff" />
              <text x="30" y="43" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#047857">Tính Từ</text>
              <circle cx="30" cy="20" r="7" fill="#f43f5e" />
            </g>
            {/* Falling guide sparkles */}
            <path d="M 40 10 L 32 22 M 103 5 L 103 16 M 160 10 L 150 22" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "sentence-builder":
      return (
        <div className="w-full h-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-300/25 blur-lg pointer-events-none" />
          <svg viewBox="0 0 200 120" className="w-48 h-28 drop-shadow-md">
            {/* Railroad tracks */}
            <line x1="10" y1="95" x2="190" y2="95" stroke="#94a3b8" strokeWidth="4" />
            <line x1="10" y1="98" x2="190" y2="98" stroke="#64748b" strokeWidth="2" />
            {[25, 55, 85, 115, 145, 175].map((x) => (
              <line key={x} x1={x} y1="92" x2={x} y2="102" stroke="#475569" strokeWidth="3" />
            ))}
            {/* Train Locomotive */}
            <g transform="translate(18, 42)">
              <rect x="0" y="18" width="42" height="30" rx="5" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
              <rect x="26" y="4" width="22" height="44" rx="4" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
              <rect x="30" y="10" width="14" height="14" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
              <rect x="6" y="6" width="10" height="14" rx="2" fill="#1e293b" />
              <circle cx="11" cy="-2" r="5" fill="#f8fafc" opacity="0.9" />
              <circle cx="18" cy="-8" r="7" fill="#f8fafc" opacity="0.75" />
              <circle cx="28" cy="-14" r="9" fill="#f8fafc" opacity="0.5" />
              <circle cx="12" cy="48" r="7" fill="#334155" stroke="#f1f5f9" strokeWidth="2" />
              <circle cx="36" cy="48" r="7" fill="#334155" stroke="#f1f5f9" strokeWidth="2" />
            </g>
            {/* Link 1 */}
            <rect x="66" y="70" width="10" height="4" rx="2" fill="#e2e8f0" />
            {/* Wagon 1: [Em] */}
            <g transform="translate(74, 52)">
              <rect x="0" y="10" width="42" height="26" rx="4" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
              <text x="21" y="27" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f">Em</text>
              <circle cx="10" cy="38" r="6" fill="#334155" stroke="#f1f5f9" strokeWidth="2" />
              <circle cx="32" cy="38" r="6" fill="#334155" stroke="#f1f5f9" strokeWidth="2" />
            </g>
            {/* Link 2 */}
            <rect x="122" y="70" width="10" height="4" rx="2" fill="#e2e8f0" />
            {/* Wagon 2: [Yêu TV] */}
            <g transform="translate(130, 52)">
              <rect x="0" y="10" width="52" height="26" rx="4" fill="#10b981" stroke="#065f46" strokeWidth="2" />
              <text x="26" y="27" textAnchor="middle" fontSize="10" fontWeight="900" fill="#064e3b">Yêu TV</text>
              <circle cx="12" cy="38" r="6" fill="#334155" stroke="#f1f5f9" strokeWidth="2" />
              <circle cx="40" cy="38" r="6" fill="#334155" stroke="#f1f5f9" strokeWidth="2" />
            </g>
          </svg>
        </div>
      );

    case "laser-match":
      return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-emerald-300/30 blur-xl pointer-events-none" />
          <svg viewBox="0 0 200 120" className="w-48 h-28 drop-shadow-md">
            {/* Left Tech Node */}
            <g transform="translate(20, 32)">
              <rect x="0" y="0" width="48" height="34" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="24" y="21" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#38bdf8">Xinh</text>
              <circle cx="48" cy="17" r="5" fill="#38bdf8" />
              <circle cx="48" cy="17" r="8" fill="#38bdf8" opacity="0.4" />
            </g>
            {/* Right Tech Node */}
            <g transform="translate(132, 54)">
              <rect x="0" y="0" width="48" height="34" rx="8" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
              <text x="24" y="21" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#34d399">Đẹp</text>
              <circle cx="0" cy="17" r="5" fill="#34d399" />
              <circle cx="0" cy="17" r="8" fill="#34d399" opacity="0.4" />
            </g>
            {/* Glowing Neon Laser Beam */}
            <path
              d="M 68 49 C 90 49, 110 71, 132 71"
              stroke="#38bdf8"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.3"
              fill="none"
            />
            <path
              d="M 68 49 C 90 49, 110 71, 132 71"
              stroke="#a7f3d0"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.7"
              fill="none"
            />
            <path
              d="M 68 49 C 90 49, 110 71, 132 71"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="100" cy="60" r="10" stroke="#facc15" strokeWidth="2" fill="none" opacity="0.8" />
            <circle cx="100" cy="60" r="4" fill="#facc15" />
          </svg>
        </div>
      );

    case "word-scramble":
      return (
        <div className="w-full h-full bg-gradient-to-br from-orange-400 via-amber-500 to-rose-500 flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-yellow-200/30 blur-xl pointer-events-none" />
          <svg viewBox="0 0 200 120" className="w-48 h-28 drop-shadow-md">
            {/* 3D Alphabet Wooden Tiles */}
            <g transform="translate(25, 45)">
              <rect x="0" y="0" width="34" height="36" rx="6" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
              <rect x="0" y="28" width="34" height="8" rx="4" fill="#fde68a" />
              <text x="17" y="24" textAnchor="middle" fontSize="16" fontWeight="900" fill="#92400e">TR</text>
            </g>
            <g transform="translate(70, 30)">
              <rect x="0" y="0" width="36" height="38" rx="6" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
              <rect x="0" y="30" width="36" height="8" rx="4" fill="#a7f3d0" />
              <text x="18" y="25" textAnchor="middle" fontSize="17" fontWeight="900" fill="#065f46">CH</text>
              <circle cx="32" cy="4" r="7" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
              <path d="M 29 4 L 31 7 L 36 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>
            <g transform="translate(120, 50)">
              <rect x="0" y="0" width="32" height="34" rx="6" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
              <rect x="0" y="26" width="32" height="8" rx="4" fill="#fde68a" />
              <text x="16" y="22" textAnchor="middle" fontSize="15" fontWeight="900" fill="#92400e">S/X</text>
            </g>
            {/* Magnifying Glass */}
            <g transform="translate(95, 10)">
              <circle cx="36" cy="36" r="26" fill="#bae6fd" opacity="0.45" stroke="#0284c7" strokeWidth="3.5" />
              <circle cx="36" cy="36" r="21" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
              <rect x="54" y="54" width="10" height="34" rx="4" transform="rotate(-45 54 54)" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <path d="M 22 24 A 18 18 0 0 1 38 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      );

    case "true-false":
      return (
        <div className="w-full h-full bg-gradient-to-br from-rose-500 via-red-500 to-amber-500 flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-amber-300/30 blur-xl pointer-events-none" />
          <svg viewBox="0 0 200 120" className="w-48 h-28 drop-shadow-md">
            {/* Buzzer: ĐÚNG */}
            <g transform="translate(30, 25)">
              <ellipse cx="32" cy="58" rx="28" ry="12" fill="#065f46" />
              <ellipse cx="32" cy="50" rx="28" ry="12" fill="#059669" />
              <ellipse cx="32" cy="44" rx="28" ry="12" fill="#10b981" />
              <ellipse cx="32" cy="38" rx="24" ry="18" fill="#34d399" />
              <circle cx="32" cy="34" r="14" fill="#ecfdf5" />
              <path d="M 26 34 L 30 38 L 38 29" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <text x="32" y="74" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffffff">ĐÚNG</text>
            </g>
            {/* VS */}
            <g transform="translate(95, 45)">
              <circle cx="5" cy="5" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="5" y="9" textAnchor="middle" fontSize="9" fontWeight="900" fill="#78350f">VS</text>
            </g>
            {/* Buzzer: SAI */}
            <g transform="translate(114, 25)">
              <ellipse cx="32" cy="58" rx="28" ry="12" fill="#7f1d1d" />
              <ellipse cx="32" cy="50" rx="28" ry="12" fill="#b91c1c" />
              <ellipse cx="32" cy="44" rx="28" ry="12" fill="#ef4444" />
              <ellipse cx="32" cy="38" rx="24" ry="18" fill="#f87171" />
              <circle cx="32" cy="34" r="14" fill="#fef2f2" />
              <path d="M 27 29 L 37 39 M 37 29 L 27 39" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
              <text x="32" y="74" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffffff">SAI</text>
            </g>
          </svg>
        </div>
      );

    case "memory-flip":
      return (
        <div className="w-full h-full bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-700 flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-cyan-300/30 blur-xl pointer-events-none" />
          <svg viewBox="0 0 200 120" className="w-48 h-28 drop-shadow-md">
            {/* Card 1 */}
            <g transform="translate(30, 25) rotate(-15 18 30)">
              <rect x="0" y="0" width="36" height="52" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
              <circle cx="18" cy="26" r="10" fill="#4338ca" />
              <text x="18" y="31" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e0e7ff">?</text>
            </g>
            {/* Card 2 */}
            <g transform="translate(68, 18) rotate(-4 20 30)">
              <rect x="0" y="0" width="38" height="54" rx="6" fill="#fef08a" stroke="#eab308" strokeWidth="2.5" />
              <polygon points="19,16 22,24 30,25 24,30 26,38 19,34 12,38 14,30 8,25 16,24" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
              <text x="19" y="47" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350f">ĐỒNG NGHĨA</text>
            </g>
            {/* Card 3 */}
            <g transform="translate(108, 18) rotate(4 20 30)">
              <rect x="0" y="0" width="38" height="54" rx="6" fill="#fef08a" stroke="#eab308" strokeWidth="2.5" />
              <polygon points="19,16 22,24 30,25 24,30 26,38 19,34 12,38 14,30 8,25 16,24" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
              <text x="19" y="47" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350f">ĐỒNG NGHĨA</text>
            </g>
            {/* Card 4 */}
            <g transform="translate(148, 25) rotate(15 18 30)">
              <rect x="0" y="0" width="36" height="52" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
              <circle cx="18" cy="26" r="10" fill="#4338ca" />
              <text x="18" y="31" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e0e7ff">?</text>
            </g>
            <circle cx="100" cy="12" r="3" fill="#fef08a" />
            <circle cx="58" cy="85" r="2" fill="#38bdf8" />
            <circle cx="145" cy="85" r="2" fill="#38bdf8" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
