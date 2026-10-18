import React, { useState } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownLeft, Search, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio.ts';
import type { Transaction, VirtualPet } from '../types.ts';

interface ExpenseTrackerTabProps {
  transactions: Transaction[];
  onOpenQuickAdd: () => void;
  onDeleteTransaction: (id: string) => void;
  onQuickPreset: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
  activePet: VirtualPet;
}

export const ExpenseTrackerTab: React.FC<ExpenseTrackerTabProps> = ({
  transactions,
  onOpenQuickAdd,
  onDeleteTransaction,
  onQuickPreset,
  activePet,
}) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'need' | 'want'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Quick calculations for display
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Filtered transactions
  const filteredList = transactions
    .filter(t => {
      if (filter === 'income') return t.type === 'income';
      if (filter === 'expense') return t.type === 'expense';
      if (filter === 'need') return t.intention === 'need';
      if (filter === 'want') return t.intention === 'want';
      return true;
    })
    .filter(t => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.category.toLowerCase().includes(q) ||
        t.note.toLowerCase().includes(q) ||
        t.date.includes(q)
      );
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  const presets = [
    { label: '領週零用錢', amount: 100, type: 'income' as const, category: '零用錢', intention: 'savings_income' as const, note: '領到零用錢' },
    { label: '幫忙做家事', amount: 50, type: 'income' as const, category: '家事獎勵', intention: 'savings_income' as const, note: '洗碗與倒垃圾獎勵' },
    { label: '買放學點心', amount: 35, type: 'expense' as const, category: '點心零食', intention: 'want' as const, note: '放學紅豆餅' },
    { label: '買學校文具', amount: 45, type: 'expense' as const, category: '學習文具', intention: 'need' as const, note: '筆記本與自動筆芯' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner for Kid */}
      <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-amber-300 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-amber-900/10 text-amber-950 px-3 py-1 rounded-full text-xs font-bold">
              <span>{activePet.avatar}</span>
              <span>{activePet.name} 的金庫報報</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              今天也是存錢好日子！☀️
            </h2>
            <p className="text-sm font-semibold text-amber-900/80">
              記帳就像給未來的夢想存積木，每記一筆，城堡就蓋高一層！
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-amber-200/80 text-center shadow-xs">
              <span className="text-[11px] font-bold text-emerald-600 block">總共收到</span>
              <span className="text-base sm:text-lg font-black text-emerald-700">
                +${totalIncome}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-amber-200/80 text-center shadow-xs">
              <span className="text-[11px] font-bold text-rose-600 block">總共花費</span>
              <span className="text-base sm:text-lg font-black text-rose-700">
                -${totalExpense}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-amber-200/80 text-center shadow-xs">
              <span className="text-[11px] font-bold text-amber-700 block">存下來的</span>
              <span className={`text-base sm:text-lg font-black ${netSavings >= 0 ? 'text-amber-800' : 'text-rose-600'}`}>
                ${netSavings}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-10 text-9xl opacity-15 select-none pointer-events-none">
          🪙
        </div>
      </div>

      {/* Quick 1-Tap Presets */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>小學生常用「一秒快速記」</span>
          </h3>
          <span className="text-xs text-slate-400">點擊按鈕立即記錄</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {presets.map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onQuickPreset({
                  date: todayStr,
                  type: preset.type,
                  amount: preset.amount,
                  category: preset.category,
                  intention: preset.intention,
                  note: preset.note,
                });
              }}
              className="p-2.5 rounded-2xl border-2 border-amber-100 hover:border-amber-300 bg-amber-50/40 hover:bg-amber-100/60 text-left transition-all active:scale-95 cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                  {preset.label}
                </span>
                <span className={`text-xs font-black ${preset.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {preset.type === 'income' ? '+' : '-'}${preset.amount}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {preset.intention === 'need' ? '🎒 需要' : preset.intention === 'want' ? '🎁 想要' : '💰 存款'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-100 shadow-sm space-y-4">
        {/* Top Control Bar: Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-800">
              記帳明細簿 ({filteredList.length} 筆)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜尋項目或備註..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Big Action Add */}
            <button
              onClick={() => {
                soundFx.playPop();
                onOpenQuickAdd();
              }}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>記一筆</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: '全部' },
            { id: 'income', label: '💰 只看收入' },
            { id: 'expense', label: '💸 只看支出' },
            { id: 'need', label: '🎒 需要 (必需品)' },
            { id: 'want', label: '🎁 想要 (渴望品)' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => {
                soundFx.playPop();
                setFilter(p.id as typeof filter);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === p.id
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-amber-50 text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* List Items */}
        {filteredList.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="text-6xl animate-bounce">🎒</div>
            <h4 className="text-base font-bold text-slate-700">還沒有找到符合的紀錄喔！</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              按下「記一筆」按鈕，把今天的零用錢或買文具的花費記錄下來吧！
            </p>
            <button
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-1 bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md hover:bg-amber-600 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>馬上新增第一筆紀錄</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map(tx => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-3 group hover:bg-amber-50/30 px-2 rounded-2xl transition-colors"
                >
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : tx.intention === 'need'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {isIncome ? <ArrowDownLeft className="w-5 h-5 text-emerald-600" /> : <ArrowUpRight className="w-5 h-5 text-rose-500" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 truncate">
                          {tx.note || tx.category}
                        </span>
                        {/* Intention Pill */}
                        {isIncome ? (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                            存入金庫
                          </span>
                        ) : tx.intention === 'need' ? (
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded-md">
                            🎒 需要
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded-md">
                            🎁 想要
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="text-slate-500 font-medium">{tx.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-base font-black ${
                          isIncome ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isIncome ? '+' : '-'}${tx.amount}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playPop();
                        if (confirm(`確定要刪除「${tx.note || tx.category}」這筆紀錄嗎？`)) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="刪除此紀錄"
                      aria-label="刪除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
