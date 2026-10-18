import React from 'react';
import { BookOpen, PieChart, Compass, PawPrint, Trophy, FileSpreadsheet } from 'lucide-react';
import { soundFx } from '../utils/audio.ts';

export type TabKey = 'tracker' | 'advisor' | 'adventure' | 'pets' | 'achievements' | 'export';

interface NavigationProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  unlockedPetsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  unlockedPetsCount,
}) => {
  const tabs = [
    { id: 'tracker' as TabKey, label: '記帳本', icon: BookOpen, color: 'text-amber-500' },
    { id: 'advisor' as TabKey, label: '顧問體檢', icon: PieChart, color: 'text-blue-500', badge: 'PRO' },
    { id: 'adventure' as TabKey, label: '冒險進度', icon: Compass, color: 'text-emerald-500' },
    { id: 'pets' as TabKey, label: '虛擬寵物', icon: PawPrint, color: 'text-rose-500', count: unlockedPetsCount },
    { id: 'achievements' as TabKey, label: '成就勳章', icon: Trophy, color: 'text-yellow-500' },
    { id: 'export' as TabKey, label: '試算表匯出', icon: FileSpreadsheet, color: 'text-teal-600' },
  ];

  return (
    <nav className="max-w-5xl mx-auto px-4 pt-3 pb-2">
      <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playPop();
                onSelectTab(tab.id);
              }}
              className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-[1.02] border-2 border-amber-600'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-amber-600 border border-amber-100 shadow-2xs hover:shadow-xs'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${isActive ? 'bg-amber-300 text-amber-950' : 'bg-blue-100 text-blue-700'}`}>
                  {tab.badge}
                </span>
              )}

              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-rose-400 text-white' : 'bg-rose-100 text-rose-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
