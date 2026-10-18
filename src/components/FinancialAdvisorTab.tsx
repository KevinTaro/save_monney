import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  UserCheck, 
  GraduationCap,
  Calendar,
  Layers,
  Calculator
} from 'lucide-react';
import { soundFx } from '../utils/audio.ts';
import { simulateCompoundGrowth } from '../utils/financialAdvisor.ts';
import type { FinancialHealthMetrics, VirtualPet } from '../types.ts';

interface FinancialAdvisorTabProps {
  metrics: FinancialHealthMetrics;
  currentBalance: number;
  activePet: VirtualPet;
  onMarkAdvisorChecked: () => void;
}

export const FinancialAdvisorTab: React.FC<FinancialAdvisorTabProps> = ({
  metrics,
  currentBalance,
  activePet,
  onMarkAdvisorChecked,
}) => {
  const [viewMode, setViewMode] = useState<'kid' | 'pro'>('kid');
  const [weeklySaveAmount, setWeeklySaveAmount] = useState<number>(50);

  // Trigger achievement trigger on view
  React.useEffect(() => {
    onMarkAdvisorChecked();
  }, [onMarkAdvisorChecked]);

  const compoundProjections = simulateCompoundGrowth(currentBalance, weeklySaveAmount, 3.5, 5);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'AAA': return 'from-emerald-500 to-teal-600 text-white border-emerald-300';
      case 'AA': return 'from-blue-500 to-cyan-600 text-white border-blue-300';
      case 'A': return 'from-amber-400 to-yellow-500 text-amber-950 border-amber-300';
      case 'B': return 'from-orange-400 to-amber-500 text-white border-orange-300';
      default: return 'from-rose-400 to-red-500 text-white border-rose-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-2 border-indigo-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold text-indigo-200 border border-indigo-400/30">
              <GraduationCap className="w-4 h-4 text-indigo-300" />
              <span>小小金融顧問理財體檢室</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              月度消費與資產健康分析 📈
            </h2>
            <p className="text-sm text-indigo-200/90 font-medium max-w-xl">
              表面簡單易懂，背後是由 CFP 國際理財規劃顧問演算法進行的收支與儲蓄診斷！
            </p>
          </div>

          {/* Perspective Toggle: Kid View vs Pro Advisor View */}
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center shrink-0">
            <button
              onClick={() => {
                soundFx.playPop();
                setViewMode('kid');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                viewMode === 'kid'
                  ? 'bg-amber-400 text-amber-950 shadow-md'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              🎒 小學生直覺模式
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setViewMode('pro');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                viewMode === 'pro'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              👔 專業顧問視角
            </button>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Health Score & Grade Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* Grade Badge */}
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${getGradeColor(metrics.grade)} flex flex-col items-center justify-center shadow-lg border-4 shrink-0`}>
              <span className="text-2xl font-black">{metrics.grade}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">顧問評等</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800">{metrics.gradeTitle}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {metrics.gradeDescription}
              </p>
            </div>
          </div>

          {/* Health Score Gauge */}
          <div className="text-center sm:text-right bg-amber-50/70 px-5 py-3 rounded-2xl border border-amber-200/60 shrink-0 w-full sm:w-auto">
            <span className="text-xs font-bold text-amber-800 block">理財健康綜合分數</span>
            <div className="flex items-baseline justify-center sm:justify-end gap-1">
              <span className="text-3xl font-black text-amber-900">{metrics.healthScore}</span>
              <span className="text-xs font-bold text-amber-700">/ 100 分</span>
            </div>
            {/* Score progress bar */}
            <div className="w-36 h-2 bg-amber-200 rounded-full mt-1.5 overflow-hidden mx-auto sm:ml-auto sm:mr-0">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.healthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* The 3 Core Financial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Savings Rate */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                儲蓄率 (Savings Rate)
              </span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                目標 30%
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {metrics.savingsRate}%
              </span>
              <span className="text-xs text-slate-500">
                (存下 ${metrics.netSavings} 元)
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, metrics.savingsRate)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              {metrics.savingsRate >= 30
                ? '🎉 超越理財標準！具備優秀的延遲享受能力！'
                : '💡 每賺 10 元存下 3 元，儲蓄率就能達標喔！'}
            </p>
          </div>

          {/* Pillar 2: Needs vs Wants */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Layers className="w-4 h-4 text-purple-500" />
                「需要」vs「想要」比例
              </span>
              <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                自律指標
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-blue-600">🎒 需要 {metrics.needsRatio}%</span>
              <span className="text-purple-600">🎁 想要 {metrics.wantsRatio}%</span>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${metrics.needsRatio}%` }}
                title={`需要: ${metrics.needsRatio}%`}
              />
              <div 
                className="bg-purple-500 h-full transition-all duration-500"
                style={{ width: `${metrics.wantsRatio}%` }}
                title={`想要: ${metrics.wantsRatio}%`}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              {metrics.wantsRatio <= 40
                ? '🌟 太棒了！懂得將大部分零用錢留給必需品。'
                : '⚠️ 「想要」花費較多，購物前試著先深呼吸默數 30 秒！'}
            </p>
          </div>

          {/* Pillar 3: Cash Runway / Safety Buffer */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                金庫安全儲備週數
              </span>
              <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                緊急儲備
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">
                {metrics.safetyBufferWeeks} 週
              </span>
              <span className="text-xs text-slate-500">
                (總額 ${currentBalance})
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, metrics.safetyBufferWeeks * 15)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              即使沒有新零用錢，金庫也能維持正常文具生活約 {metrics.safetyBufferWeeks} 週！
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts: Spending Categories Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category Breakdown Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <span>📊 開銷類別排行榜</span>
            </h4>
            <span className="text-xs font-bold text-slate-500">
              總支出 ${metrics.totalExpense}
            </span>
          </div>

          {metrics.categoryBreakdown.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">目前尚無支出資料</div>
          ) : (
            <div className="space-y-3">
              {metrics.categoryBreakdown.map(cat => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      {cat.category} ({cat.count} 筆)
                    </span>
                    <span className="font-bold text-slate-900">
                      ${cat.amount} ({cat.percentage}%)
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visual Cash Flow Comparison (Income vs Expense vs Savings) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5 mb-3">
              <span>⚖️ 收支平衡天平</span>
            </h4>

            <div className="space-y-3.5">
              {/* Income */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-700">💰 總收入 (小金庫加滿)</span>
                  <span className="font-black text-emerald-700">${metrics.totalIncome}</span>
                </div>
                <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>
              </div>

              {/* Expense */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-rose-700">💸 總花費 (開銷使用)</span>
                  <span className="font-black text-rose-700">${metrics.totalExpense}</span>
                </div>
                <div className="w-full h-3 bg-rose-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ 
                      width: `${metrics.totalIncome > 0 ? Math.min(100, Math.round((metrics.totalExpense / metrics.totalIncome) * 100)) : (metrics.totalExpense > 0 ? 100 : 0)}%` 
                    }} 
                  />
                </div>
              </div>

              {/* Net Savings */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-800">🪙 實質留存金 (存進撲滿)</span>
                  <span className="font-black text-amber-800">${metrics.netSavings}</span>
                </div>
                <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ 
                      width: `${metrics.totalIncome > 0 ? Math.max(0, Math.min(100, Math.round((metrics.netSavings / metrics.totalIncome) * 100))) : 0}%` 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/70 text-xs text-amber-900 mt-4">
            <span className="font-bold">💡 理財顧問金律：</span>
            <span>「不是收入多的人變富翁，而是懂得留住錢的人最富有！」</span>
          </div>
        </div>
      </div>

      {/* Automated Diagnostic Advisory Section (自動化個人理財建議) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            💡
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              自動化個人專屬理財診斷報告
            </h3>
            <p className="text-xs text-slate-500">
              根據本月記帳與開銷習慣，自動生成改善行動指南
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {metrics.automatedAdvice.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 space-y-2 transition-all ${
                item.type === 'positive'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : item.type === 'warning'
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                  : 'bg-blue-50/60 border-blue-200 text-blue-950'
              }`}
            >
              <div className="flex items-start gap-2">
                {item.type === 'positive' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : item.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="font-black text-sm">{item.title}</h5>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 text-xs text-slate-700">
                <strong className="text-amber-800">👉 推薦行動：</strong>
                <span>{item.actionableStep}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View Mode Detailed Explanations */}
        {viewMode === 'pro' ? (
          <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-700 space-y-3 mt-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <UserCheck className="w-4 h-4" />
              <span>CFP 金融理財顧問詳細覆核意見書（給家長與小顧問）</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-slate-300">
              {metrics.parentAdvisorNote}
            </p>
          </div>
        ) : (
          <div className="bg-amber-100/70 p-4 rounded-2xl border border-amber-300/80 flex items-start gap-3 mt-4">
            <span className="text-3xl shrink-0">{activePet.avatar}</span>
            <div className="space-y-1">
              <h5 className="font-bold text-amber-950 text-xs">
                {activePet.name} 寫給小探險家的一段話：
              </h5>
              <p className="text-xs text-amber-900 leading-relaxed">
                {metrics.kidFriendlySummary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Compound Growth Magic Time Machine (複利魔法時光機) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                🔮 複利魔法時光機（錢滾錢的秘密）
              </h3>
              <p className="text-xs text-slate-500">
                如果從現在開始，每週固定多存一點點錢，未來會變成多少？
              </p>
            </div>
          </div>

          {/* Amount Slider selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">每週多存：</span>
            {[20, 50, 100, 200].map(amt => (
              <button
                key={amt}
                onClick={() => {
                  soundFx.playPop();
                  setWeeklySaveAmount(amt);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  weeklySaveAmount === amt
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-purple-50 text-slate-700'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Projection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {compoundProjections.map(item => (
            <div
              key={item.year}
              className="bg-purple-50/50 rounded-2xl p-3 border border-purple-100 text-center space-y-1"
            >
              <div className="text-[11px] font-bold text-purple-600">
                第 {item.year} 年底
              </div>
              <div className="text-base sm:text-lg font-black text-purple-950">
                ${item.totalValue.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                + 利息 ${item.interestEarned}
              </div>
              <div className="text-[9px] text-slate-400">
                自存 ${item.totalSaved}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-purple-100/50 p-3 rounded-2xl text-xs text-purple-900 border border-purple-200">
          ✨ <strong>金融小知識：</strong> 愛因斯坦說過：「複利是世界第八大奇蹟！」時間就是你最大的超能力，越早開始存錢，複利的小雪球就會滾得越大！
        </div>
      </div>
    </div>
  );
};
