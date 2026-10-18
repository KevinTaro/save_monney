import React, { useState } from 'react';
import { X, HelpCircle, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio.ts';
import type { Transaction, TransactionType, ExpenseIntention } from '../types.ts';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

const INCOME_CATEGORIES = [
  { name: '零用錢', icon: '💰', hint: '每週或每月固定零用' },
  { name: '家事獎勵', icon: '🧹', hint: '洗碗、掃地、丟垃圾獎金' },
  { name: '壓歲紅包', icon: '🧧', hint: '過年或節慶長輩給的紅包' },
  { name: '好表現獎金', icon: '🌟', hint: '考試進步、比賽得獎' },
  { name: '其他收入', icon: '🎁', hint: '親友送的零花錢等' },
];

const EXPENSE_CATEGORIES = [
  { name: '學習文具', icon: '✏️', hint: '筆記本、彩色筆、橡皮擦' },
  { name: '點心零食', icon: '🍪', hint: '放學點心、麵包、餅乾' },
  { name: '飲料冰品', icon: '🧃', hint: '鮮奶、果汁、冰棒' },
  { name: '玩具遊戲', icon: '🎮', hint: '玩具車、積木、扭蛋公仔' },
  { name: '圖書漫畫', icon: '📚', hint: '故事書、科普雜誌' },
  { name: '交通車票', icon: '🚌', hint: '公車、捷運儲值' },
  { name: '禮物分享', icon: '🎁', hint: '送同學生日禮物' },
  { name: '其他支出', icon: '🏷️', hint: '雜項小開銷' },
];

const QUICK_NOTES: Record<string, string[]> = {
  '學習文具': ['買 2B 鉛筆', '買彩色筆', '買筆記本', '立可帶替芯'],
  '點心零食': ['放學紅豆餅', '巧克力餅乾', '茶葉蛋', '營養麵包'],
  '飲料冰品': ['冰棒', '草莓牛奶', '微糖豆漿', '珍珠鮮奶'],
  '玩具遊戲': ['轉扭蛋', '戰鬥陀螺', '神奇寶貝卡牌', '小樂高'],
  '家事獎勵': ['幫媽媽洗碗', '倒垃圾與回收', '整理自己房間', '照顧小寵物'],
  '零用錢': ['週一零用錢', '月度零用錢'],
};

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<number | ''>(50);
  const [category, setCategory] = useState<string>('學習文具');
  const [intention, setIntention] = useState<ExpenseIntention>('need');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showConceptHelp, setShowConceptHelp] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    soundFx.playPop();
    if (newType === 'income') {
      setCategory('零用錢');
      setIntention('savings_income');
    } else {
      setCategory('學習文具');
      setIntention('need');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount <= 0) {
      return;
    }

    soundFx.playCoin();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
    } catch {
      // ignore
    }

    onAddTransaction({
      date,
      type,
      amount: finalAmount,
      category,
      intention: type === 'income' ? 'savings_income' : intention,
      note: note.trim() || category,
    });

    onClose();
    // Reset state
    setAmount(50);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h2 className="text-lg font-black text-amber-950">小探險家記帳時間</h2>
          </div>
          <button
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* Income or Expense Big Toggle */}
          <div className="grid grid-cols-2 gap-3 bg-amber-50 p-1.5 rounded-2xl border-2 border-amber-200">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <span>💰 收到錢 (收入)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <span>💸 花了錢 (支出)</span>
            </button>
          </div>

          {/* Amount input & Quick Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              金額是多少呢？ (元)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-amber-600">
                $
              </span>
              <input
                type="number"
                min="1"
                max="999999"
                required
                value={amount}
                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="50"
                className="w-full pl-10 pr-4 py-3 text-2xl font-black text-slate-800 bg-amber-50/50 border-2 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[10, 20, 50, 100, 200, 500].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setAmount(val);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    amount === val
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-white hover:bg-amber-100/70 text-slate-700 border-slate-200'
                  }`}
                >
                  +${val}
                </button>
              ))}
            </div>
          </div>

          {/* Crucial Educational Question: "需要" vs "想要" (for expenses only) */}
          {type === 'expense' && (
            <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold text-sm">🎒 智慧二選一：</span>
                  <span className="text-xs font-black text-amber-900">這是「需要」還是「想要」？</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConceptHelp(!showConceptHelp)}
                  className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold underline cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>不懂差別？</span>
                </button>
              </div>

              {showConceptHelp && (
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1.5 animate-in slide-in-from-top-1">
                  <p>
                    <strong className="text-emerald-700">🎒 需要 (Needs)：</strong>
                    上課必要的文具、回家的車票、止飢的正餐（沒有它就無法上課或餓肚子）。
                  </p>
                  <p>
                    <strong className="text-purple-700">🎁 想要 (Wants)：</strong>
                    心動想買的扭蛋、多買的零食糖果、玩具（擁有了很開心，但沒有也不影響生活）。
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setIntention('need');
                  }}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    intention === 'need'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-xl">🎒</span>
                  <span>我是「需要」</span>
                  <span className="text-[10px] opacity-90">生活與學習必需品</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setIntention('want');
                  }}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    intention === 'want'
                      ? 'bg-purple-500 text-white border-purple-600 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-xl">🎁</span>
                  <span>我是「想要」</span>
                  <span className="text-[10px] opacity-90">讓生活更有趣但非必需</span>
                </button>
              </div>
            </div>
          )}

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              選擇類別
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {currentCategories.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setCategory(cat.name);
                    if (!note) {
                      setNote(cat.name);
                    }
                  }}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    category === cat.name
                      ? 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs scale-105'
                      : 'bg-white border-slate-100 hover:border-amber-200 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Note & Custom Note */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">
                寫點備註（選填）
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200"
              />
            </div>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="例如：買彩色筆、放學買紅豆餅..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
            />

            {/* Quick memo suggestions */}
            {QUICK_NOTES[category] && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_NOTES[category].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setNote(tag);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-amber-100 text-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
            >
              <Check className="w-5 h-5" />
              <span>記到小金庫帳本！</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
