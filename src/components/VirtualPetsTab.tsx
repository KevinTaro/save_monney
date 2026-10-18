import React, { useState } from 'react';
import { PawPrint, Heart, Lock, Check, Sparkles, Smile, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio.ts';
import { PET_ROSTER, getNextPetToUnlock } from '../utils/petSystem.ts';
import type { VirtualPet } from '../types.ts';

interface VirtualPetsTabProps {
  currentBalance: number;
  activePet: VirtualPet;
  onSelectPet: (pet: VirtualPet) => void;
}

export const VirtualPetsTab: React.FC<VirtualPetsTabProps> = ({
  currentBalance,
  activePet,
  onSelectPet,
}) => {
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [petHappiness, setPetHappiness] = useState<number>(85);
  const [petHunger, setPetHunger] = useState<number>(90);
  const [heartAnim, setHeartAnim] = useState<boolean>(false);

  const nextPetInfo = getNextPetToUnlock(currentBalance);

  const handleNextDialogue = () => {
    soundFx.playPetHappy();
    setDialogueIndex((dialogueIndex + 1) % activePet.dialogueList.length);
  };

  const handleFeedPet = () => {
    soundFx.playPetHappy();
    setPetHunger(prev => Math.min(100, prev + 10));
    setPetHappiness(prev => Math.min(100, prev + 5));
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 800);
  };

  const handlePetAction = () => {
    soundFx.playPetHappy();
    setPetHappiness(prev => Math.min(100, prev + 15));
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sanctuary Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-2 border-rose-400">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-rose-950/30 px-3 py-1 rounded-full text-xs font-bold text-rose-100 border border-rose-300/30">
              <PawPrint className="w-4 h-4 text-rose-200" />
              <span>虛擬寵物金庫樂園</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              根據帳戶餘額解鎖你的專屬神獸！🐾
            </h2>
            <p className="text-sm text-rose-100 font-medium max-w-xl">
              小金庫存款越高，能召喚的神奇寵物就越多！陪伴小探險家天天快樂學理財！
            </p>
          </div>

          {/* Next unlock teaser badge */}
          {nextPetInfo ? (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/30 text-right shrink-0">
              <span className="text-[11px] font-bold text-rose-100 block">下一隻解鎖夥伴</span>
              <div className="flex items-center gap-2 justify-end mt-0.5">
                <span className="text-xl">{nextPetInfo.pet.avatar}</span>
                <span className="text-sm font-black">{nextPetInfo.pet.name}</span>
              </div>
              <span className="text-xs text-amber-200 font-bold block mt-1">
                再存 ${nextPetInfo.needed.toLocaleString()} 元解鎖！
              </span>
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/30 text-right shrink-0">
              <span className="text-xs font-black text-yellow-200">👑 全套神獸全數解鎖！</span>
              <span className="text-[11px] block text-white">你是無庸置疑的理財大宗師！</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Pet Interactive Showcase Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Pet Big Avatar Container with Bouncing Effect */}
          <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-rose-50 via-amber-50 to-white rounded-3xl border-2 border-rose-100 shadow-inner w-full md:w-64 shrink-0">
            {/* Heart floating animation on pet/feed */}
            {heartAnim && (
              <div className="absolute top-2 text-3xl animate-ping pointer-events-none text-rose-500">
                💖
              </div>
            )}

            <div className="text-8xl select-none transform hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer animate-pulse" onClick={handlePetAction}>
              {activePet.avatar}
            </div>

            <span className="mt-3 font-black text-lg text-slate-800">
              {activePet.name}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 mt-1">
              {activePet.title}
            </span>

            {/* Hunger & Happiness meters */}
            <div className="w-full space-y-2 mt-4">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    心情親密度
                  </span>
                  <span>{petHappiness}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${petHappiness}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5">
                  <span className="flex items-center gap-1">
                    <Smile className="w-3.5 h-3.5 text-amber-500" />
                    飽足體力值
                  </span>
                  <span>{petHunger}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${petHunger}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dialogue & Interactive Action Area */}
          <div className="flex-1 space-y-4 w-full">
            {/* Dialogue Bubble */}
            <div className="relative bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-amber-900 block">
                    {activePet.species} 的理財小語：
                  </span>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">
                    「{activePet.dialogueList[dialogueIndex]}」
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleNextDialogue}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
                >
                  <span>聽聽下一句！</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>

            {/* Pet Personality & Bio */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">個性：</span>
                <span className="text-slate-600">{activePet.personality}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">最喜愛點心：</span>
                <span className="text-slate-600">{activePet.favoriteFood}</span>
              </div>
              <p className="text-slate-500 leading-relaxed pt-1 border-t border-slate-200">
                {activePet.description}
              </p>
            </div>

            {/* Pet Interactive Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleFeedPet}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>🍪 餵食小點心</span>
              </button>

              <button
                type="button"
                onClick={handlePetAction}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>💖 摸摸抱抱</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pet Roster / Gallery (All 6 pets) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <span>🏆 神獸圖鑑與解鎖條件</span>
          </h3>
          <span className="text-xs text-slate-500">
            目前金庫總額：${currentBalance.toLocaleString()} 元
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PET_ROSTER.map(pet => {
            const isUnlocked = currentBalance >= pet.unlockedThreshold;
            const isCurrentActive = activePet.id === pet.id;
            const neededToUnlock = pet.unlockedThreshold - currentBalance;

            return (
              <div
                key={pet.id}
                className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isCurrentActive
                    ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-300'
                    : isUnlocked
                    ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                    : 'border-slate-200 bg-slate-50/70 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl p-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      {isUnlocked ? pet.avatar : '🔒'}
                    </div>

                    {isCurrentActive ? (
                      <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                        <Check className="w-3 h-3" />
                        伴讀中
                      </span>
                    ) : isUnlocked ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        已召喚
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        解鎖門檻 ${pet.unlockedThreshold}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-sm text-slate-800">{pet.name}</h4>
                    <span className="text-[11px] text-rose-600 font-bold block">{pet.title}</span>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {pet.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3">
                  {isUnlocked ? (
                    <button
                      type="button"
                      disabled={isCurrentActive}
                      onClick={() => {
                        soundFx.playFanfare();
                        confetti({ particleCount: 30, spread: 60 });
                        onSelectPet(pet);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isCurrentActive
                          ? 'bg-amber-200 text-amber-900 cursor-default'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                      }`}
                    >
                      {isCurrentActive ? '當前守護神' : '帶牠一起去記帳！'}
                    </button>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>解鎖進度</span>
                        <span>差 ${neededToUnlock.toLocaleString()} 元</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((currentBalance / pet.unlockedThreshold) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
