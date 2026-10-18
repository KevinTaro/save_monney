import React, { useState } from 'react';
import { Trophy, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio.ts';
import type { Achievement } from '../types.ts';

interface AchievementsTabProps {
  achievements: Achievement[];
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  achievements,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const overallPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-2 border-yellow-400">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-yellow-950/30 px-3 py-1 rounded-full text-xs font-bold text-yellow-100 border border-yellow-300/30">
              <Trophy className="w-4 h-4 text-yellow-200" />
              <span>榮譽勳章成就館</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              堅持記帳，點亮滿滿的榮譽徽章！🏅
            </h2>
            <p className="text-sm text-yellow-100 font-medium max-w-lg">
              每一個好習慣都是一枚閃閃發光的勛章，證明你比昨天的自己更有財務自律力！
            </p>
          </div>

          {/* Overall Progress Gauge */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center sm:text-right shrink-0">
            <span className="text-xs font-bold text-yellow-100 block">成就解鎖率</span>
            <div className="flex items-baseline justify-center sm:justify-end gap-1 mt-0.5">
              <span className="text-3xl font-black text-white">{unlockedCount}</span>
              <span className="text-sm font-bold text-yellow-200">/ {totalCount} 枚</span>
            </div>
            <div className="w-32 h-2 bg-yellow-900/30 rounded-full mt-2 overflow-hidden mx-auto sm:ml-auto sm:mr-0">
              <div
                className="h-full bg-yellow-300 rounded-full"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: `全部 (${achievements.length})` },
            { id: 'unlocked', label: `已解鎖 (${unlockedCount})` },
            { id: 'locked', label: `進行中 (${totalCount - unlockedCount})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                soundFx.playPop();
                setFilter(f.id as typeof filter);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(ach => {
          const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-gradient-to-b from-amber-50/80 to-white border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                      ach.unlocked
                        ? 'bg-gradient-to-tr from-yellow-300 to-amber-400 border-amber-300'
                        : 'bg-slate-200 border-slate-300 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                      已達成
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      進行中
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-800 flex items-center gap-1.5">
                    {ach.title}
                    {ach.unlocked && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress Footer */}
              <div className="pt-3 border-t border-slate-100 mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">達成進度</span>
                  <span className={ach.unlocked ? 'text-amber-800' : 'text-slate-600'}>
                    {ach.progress} / {ach.maxProgress} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.unlocked ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {ach.unlockedAt && (
                  <span className="text-[10px] text-slate-400 block text-right mt-1">
                    解鎖日期：{ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
