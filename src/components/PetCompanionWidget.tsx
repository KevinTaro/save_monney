import React, { useState } from 'react';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { soundFx } from '../utils/audio.ts';
import type { VirtualPet } from '../types.ts';

interface PetCompanionWidgetProps {
  activePet: VirtualPet;
  onOpenQuickAdd: () => void;
}

export const PetCompanionWidget: React.FC<PetCompanionWidgetProps> = ({
  activePet,
  onOpenQuickAdd,
}) => {
  const [minimized, setMinimized] = useState<boolean>(false);
  const [bubbleText, setBubbleText] = useState<string>(activePet.dialogueList[0]);

  const handlePetClick = () => {
    soundFx.playPetHappy();
    const nextText = activePet.dialogueList[Math.floor(Math.random() * activePet.dialogueList.length)];
    setBubbleText(nextText);
  };

  if (minimized) {
    return (
      <button
        onClick={() => {
          soundFx.playPop();
          setMinimized(false);
        }}
        className="fixed bottom-4 right-4 z-40 bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-2xl shadow-xl border-2 border-amber-300 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        title="叫出理財小寵物"
      >
        <span className="text-2xl animate-bounce">{activePet.avatar}</span>
        <span className="text-xs font-black text-amber-950 pr-1">{activePet.name.split('・')[0]}</span>
      </button>
    );
  }

  return (
    <aside aria-label="理財小夥伴" className="fixed bottom-4 right-4 z-40 max-w-xs flex flex-col items-end pointer-events-none select-none">
      {/* Speech Bubble */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border-2 border-amber-300 text-xs font-bold text-slate-800 mb-2 pointer-events-auto relative max-w-[240px] animate-in slide-in-from-bottom-2">
        <button
          onClick={() => setMinimized(true)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-[10px] cursor-pointer"
          aria-label="縮小"
        >
          <X className="w-3 h-3" />
        </button>

        <div className="flex items-start gap-1.5">
          <MessageCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-snug text-amber-950">{bubbleText}</p>
        </div>

        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePetClick}
            className="text-[10px] text-amber-700 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>換句話說</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              onOpenQuickAdd();
            }}
            className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-black px-2 py-0.5 rounded-lg shadow-2xs cursor-pointer active:scale-95"
          >
            + 記一筆
          </button>
        </div>

        {/* Triangle arrow */}
        <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-amber-300" />
      </div>

      {/* Pet Interactive Button */}
      <button
        onClick={handlePetClick}
        className="pointer-events-auto w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-3 border-white shadow-xl flex items-center justify-center text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        title="摸摸小寵物"
      >
        <span className="animate-pulse">{activePet.avatar}</span>
      </button>
    </aside>
  );
};
