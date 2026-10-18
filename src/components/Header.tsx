import React from 'react';
import { Volume2, VolumeX, Sparkles, PlusCircle, Flame, Award } from 'lucide-react';
import { soundFx } from '../utils/audio.ts';
import type { VirtualPet } from '../types.ts';

interface HeaderProps {
  balance: number;
  activePet: VirtualPet;
  onOpenQuickAdd: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  streakDays: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  activePet,
  onOpenQuickAdd,
  soundEnabled,
  onToggleSound,
  streakDays,
  unlockedBadgesCount,
  totalBadgesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm transition-all">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-md border-2 border-amber-200 transform group-hover:scale-105 transition-transform">
                {activePet.avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-xs">
                Lv.{Math.min(10, Math.max(1, Math.floor(balance / 300) + 1))}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-lg sm:text-xl text-amber-950 tracking-tight flex items-center gap-1">
                  小小理財探險家
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
                </h1>
              </div>
              <p className="text-xs text-amber-700/80 font-medium hidden sm:block">
                伴讀夥伴：{activePet.name}
              </p>
            </div>
          </div>

          {/* Quick Balance, Streak & Action buttons */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Streak Badge */}
            <div className="flex items-center gap-1 bg-amber-100/80 hover:bg-amber-100 text-amber-900 px-2.5 py-1.5 rounded-xl border border-amber-200/80 text-xs font-semibold shadow-xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span>連續 {streakDays} 天</span>
            </div>

            {/* Badges count */}
            <div className="hidden sm:flex items-center gap-1 bg-indigo-50 text-indigo-900 px-2.5 py-1.5 rounded-xl border border-indigo-200 text-xs font-semibold shadow-xs">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>{unlockedBadgesCount}/{totalBadgesCount} 徽章</span>
            </div>

            {/* Current Balance Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 sm:px-4 py-1.5 rounded-2xl shadow-md flex items-center gap-2 border border-emerald-400">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-100 block leading-none">
                  我的小金庫
                </span>
                <span className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  ${balance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                soundFx.playPop();
              }}
              aria-label={soundEnabled ? '關閉音效' : '開啟音效'}
              title={soundEnabled ? '音效已開啟' : '音效已關閉'}
              className="p-2 rounded-xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-800 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-700" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Quick Add Button */}
            <button
              onClick={() => {
                soundFx.playPop();
                onOpenQuickAdd();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm px-3.5 py-2 rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer border border-amber-400"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">記一筆</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
