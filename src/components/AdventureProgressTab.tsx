import React, { useState } from 'react';
import { Compass, Gift, Target, Plus, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio.ts';
import type { SavingsGoal, VirtualPet } from '../types.ts';

interface AdventureProgressTabProps {
  goals: SavingsGoal[];
  activePet: VirtualPet;
  currentBalance: number;
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'completed'>) => void;
  onUpdateGoalProgress: (goalId: string, delta: number) => void;
  onCompleteGoal: (goalId: string) => void;
}

export const AdventureProgressTab: React.FC<AdventureProgressTabProps> = ({
  goals,
  activePet,
  currentBalance,
  onAddGoal,
  onUpdateGoalProgress,
  onCompleteGoal,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || '');
  const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTarget, setNewTarget] = useState<number>(500);
  const [newIcon, setNewIcon] = useState<string>('🚀');
  const [openedChests, setOpenedChests] = useState<number[]>([]);

  const activeGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  const currentPercent = activeGoal
    ? Math.min(100, Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100))
    : 0;

  const handleOpenChest = (milestone: number) => {
    if (openedChests.includes(milestone)) return;
    if (currentPercent < milestone) {
      soundFx.playPop();
      alert(`還差一點點喔！當願望達成 ${milestone}% 時，這個神秘寶箱就會開啟！`);
      return;
    }

    soundFx.playFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    setOpenedChests([...openedChests, milestone]);
  };

  const handleSaveToGoal = (amount: number) => {
    if (!activeGoal) return;
    if (amount > currentBalance) {
      alert(`小金庫餘額只有 $${currentBalance} 元，不夠存入 $${amount} 元喔！`);
      return;
    }
    soundFx.playCoin();
    onUpdateGoalProgress(activeGoal.id, amount);
  };

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTarget <= 0) return;
    soundFx.playFanfare();
    onAddGoal({
      title: newTitle.trim(),
      targetAmount: Number(newTarget),
      currentAmount: 0,
      icon: newIcon,
      category: '夢想儲蓄',
    });
    setShowAddGoalModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Adventure Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-2 border-emerald-500">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-950/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-emerald-400/30">
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>勇者存錢大冒險地圖</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              把存錢變成一場 RPG 冒險！🗺️
            </h2>
            <p className="text-sm text-emerald-100 font-medium max-w-lg">
              每一次克制衝動、把零用錢存入願望，你的小勇者就會在地圖上前進一步！
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playPop();
              setShowAddGoalModal(true);
            }}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2.5 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>設立新願望目標</span>
          </button>
        </div>
      </div>

      {/* Goal Switcher Tabs if multiple goals */}
      {goals.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {goals.map(g => (
            <button
              key={g.id}
              onClick={() => {
                soundFx.playPop();
                setSelectedGoalId(g.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                selectedGoalId === g.id
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.title}</span>
              <span className="text-[10px] opacity-80">
                ({Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))}%)
              </span>
            </button>
          ))}
        </div>
      )}

      {/* The RPG Adventure Map Progress Bar Container */}
      {activeGoal ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-md space-y-6">
          {/* Active Goal Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-2xs">
                {activeGoal.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-800">{activeGoal.title}</h3>
                  {currentPercent >= 100 && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-black px-2 py-0.5 rounded-full border border-amber-300">
                      🎉 願望達成！
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  目標金額：${activeGoal.targetAmount} 元 ｜ 目前累積：${activeGoal.currentAmount} 元
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-emerald-600 block">冒險完成度</span>
              <span className="text-3xl font-black text-emerald-700">{currentPercent}%</span>
            </div>
          </div>

          {/* Gamified RPG Adventure Map Track */}
          <div className="relative py-8 px-2 sm:px-6">
            {/* Background Track Line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${currentPercent}%` }}
              />
            </div>

            {/* Walking Character Avatar on the Map */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 pointer-events-none z-20 flex flex-col items-center -mt-8"
              style={{ left: `calc(${Math.min(95, Math.max(5, currentPercent))}% - 20px)` }}
            >
              <div className="text-2xl animate-bounce filter drop-shadow-md">
                {activePet.avatar}
              </div>
              <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                前進中
              </span>
            </div>

            {/* Adventure Milestone Nodes */}
            <div className="relative z-10 flex justify-between items-center">
              {/* Node 0% */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                  ⛺
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">新手村</span>
                <span className="text-[9px] text-slate-400">0%</span>
              </div>

              {/* Node 25% */}
              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleOpenChest(25)}>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md border-2 border-white transition-transform hover:scale-110 ${
                    currentPercent >= 25 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {openedChests.includes(25) ? '✨' : '🎁'}
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">綠寶石林</span>
                <span className="text-[9px] text-slate-400">25% 寶箱</span>
              </div>

              {/* Node 50% */}
              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleOpenChest(50)}>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md border-2 border-white transition-transform hover:scale-110 ${
                    currentPercent >= 50 ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {openedChests.includes(50) ? '✨' : '💎'}
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">水晶瀑布</span>
                <span className="text-[9px] text-slate-400">50% 寶箱</span>
              </div>

              {/* Node 75% */}
              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleOpenChest(75)}>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md border-2 border-white transition-transform hover:scale-110 ${
                    currentPercent >= 75 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {openedChests.includes(75) ? '✨' : '🏰'}
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-2">守護城堡</span>
                <span className="text-[9px] text-slate-400">75% 寶箱</span>
              </div>

              {/* Node 100% */}
              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleOpenChest(100)}>
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg border-2 border-white transition-transform hover:scale-110 ${
                    currentPercent >= 100 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  👑
                </div>
                <span className="text-[11px] font-black text-amber-900 mt-2">夢想王國</span>
                <span className="text-[9px] text-slate-400">100% 達成</span>
              </div>
            </div>
          </div>

          {/* Interactive Deposit / Progress Buttons */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>從小金庫存入願望目標：</span>
              </span>
              <span className="text-xs text-slate-500">
                可支配金庫餘額：${currentBalance} 元
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[20, 50, 100, 200].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSaveToGoal(amt)}
                  className="px-3 py-2 bg-white hover:bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs font-black text-emerald-800 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  + 存入 ${amt} 元
                </button>
              ))}

              {currentPercent >= 100 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playFanfare();
                    confetti({ particleCount: 80, spread: 90 });
                    onCompleteGoal(activeGoal.id);
                  }}
                  className="ml-auto px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>領取願望大獎勵！</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center space-y-4 border border-slate-200">
          <div className="text-5xl">🎯</div>
          <h3 className="text-lg font-bold text-slate-800">還沒有設立任何冒險願望喔！</h3>
          <p className="text-xs text-slate-500">
            設立一個目標，例如買喜歡的故事書或玩具，讓存錢充滿動力！
          </p>
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs"
          >
            設立第一個存錢願望
          </button>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-emerald-300 space-y-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <span>🎯</span>
              <span>設立新的冒險願望目標</span>
            </h3>

            <form onSubmit={handleCreateGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  願望名稱
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="例如：樂高機器人、看電影、買故事書"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  目標金額是多少？ (元)
                </label>
                <input
                  type="number"
                  min="50"
                  max="50000"
                  required
                  value={newTarget}
                  onChange={e => setNewTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  挑一個願望徽章圖示
                </label>
                <div className="flex gap-2 text-2xl">
                  {['🚀', '📚', '🎮', '🎨', '🚲', '👟', '⚽'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewIcon(icon)}
                      className={`p-2 rounded-xl border-2 cursor-pointer transition-all ${
                        newIcon === icon ? 'bg-emerald-100 border-emerald-500 scale-110' : 'border-slate-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-black bg-emerald-500 text-white hover:bg-emerald-600 shadow-md"
                >
                  確認出發冒險！
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
