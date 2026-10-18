import type { FinancialHealthMetrics, Transaction } from '../types.ts';

export const CATEGORY_COLORS: Record<string, string> = {
  '零用錢': '#10B981',
  '家事獎勵': '#34D399',
  '壓歲紅包': '#F59E0B',
  '好表現獎金': '#6366F1',
  '其他收入': '#8B5CF6',
  '點心零食': '#F87171',
  '飲料冰品': '#FB923C',
  '學習文具': '#60A5FA',
  '圖書漫畫': '#38BDF8',
  '玩具遊戲': '#EC4899',
  '娛樂遊玩': '#A855F7',
  '交通車票': '#94A3B8',
  '禮物分享': '#F472B6',
  '其他支出': '#CBD5E1',
};

export function calculateTotalBalance(transactions: Transaction[], initialBalance: number = 0): number {
  return transactions.reduce((acc, tx) => {
    if (tx.type === 'income') {
      return acc + tx.amount;
    } else {
      return acc - tx.amount;
    }
  }, initialBalance);
}

export function calculateFinancialMetrics(
  transactions: Transaction[],
  currentBalance: number,
  periodDays: number = 30
): FinancialHealthMetrics {
  const now = Date.now();
  const periodCutoff = now - periodDays * 24 * 60 * 60 * 1000;

  // Filter transactions within period (or all if not enough in period)
  const filtered = transactions.filter(t => t.timestamp >= periodCutoff);
  const targetTx = filtered.length >= 3 ? filtered : transactions;

  let totalIncome = 0;
  let totalExpense = 0;
  let needsAmount = 0;
  let wantsAmount = 0;
  const categoryMap = new Map<string, { amount: number; count: number }>();

  targetTx.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
      if (tx.intention === 'need') {
        needsAmount += tx.amount;
      } else {
        wantsAmount += tx.amount;
      }

      const existing = categoryMap.get(tx.category) || { amount: 0, count: 0 };
      categoryMap.set(tx.category, {
        amount: existing.amount + tx.amount,
        count: existing.count + 1,
      });
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;
  const needsRatio = totalExpense > 0 ? Math.round((needsAmount / totalExpense) * 100) : 0;
  const wantsRatio = totalExpense > 0 ? Math.round((wantsAmount / totalExpense) * 100) : 0;

  // Category breakdown list
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([cat, val]) => ({
      category: cat,
      amount: val.amount,
      percentage: totalExpense > 0 ? Math.round((val.amount / totalExpense) * 100) : 0,
      count: val.count,
      color: CATEGORY_COLORS[cat] || '#CBD5E1',
    }))
    .sort((a, b) => b.amount - a.amount);

  const topExpenseCategory = categoryBreakdown.length > 0
    ? categoryBreakdown[0]
    : { name: '尚無支出', amount: 0, percentage: 0 };

  // Calculate Financial Health Score (0 - 100)
  // Sub-scores:
  // 1. Savings Rate Score (max 35 pts): 40%+ is full 35, 20-40% is 25, 10-20% is 15, >0% is 10, <=0% is 0
  let scoreSavings = 0;
  if (savingsRate >= 40) scoreSavings = 35;
  else if (savingsRate >= 25) scoreSavings = 28;
  else if (savingsRate >= 15) scoreSavings = 20;
  else if (savingsRate > 0) scoreSavings = 10;
  else scoreSavings = 0;

  // 2. Needs vs Wants Budgeting Score (max 30 pts):
  // Financial literacy rule of thumb: Needs >= 55% or Wants <= 45% shows self-discipline
  let scoreDiscipline = 0;
  if (totalExpense === 0) {
    scoreDiscipline = 25; // Good restraint
  } else if (wantsRatio <= 30) {
    scoreDiscipline = 30; // Excellent self-control
  } else if (wantsRatio <= 50) {
    scoreDiscipline = 24; // Good balance
  } else if (wantsRatio <= 70) {
    scoreDiscipline = 15; // Room for improvement
  } else {
    scoreDiscipline = 8; // High impulse spending
  }

  // 3. Balance Buffer / Safety Runway (max 20 pts):
  // Estimated weekly expense (if weekly expense > 0)
  const averageWeeklyExpense = totalExpense > 0 ? Math.max(10, totalExpense / Math.max(1, periodDays / 7)) : 50;
  const safetyBufferWeeks = Math.max(0, Math.round((currentBalance / averageWeeklyExpense) * 10) / 10);
  let scoreBuffer = 0;
  if (safetyBufferWeeks >= 6) scoreBuffer = 20;
  else if (safetyBufferWeeks >= 4) scoreBuffer = 16;
  else if (safetyBufferWeeks >= 2) scoreBuffer = 12;
  else if (safetyBufferWeeks >= 1) scoreBuffer = 8;
  else scoreBuffer = 4;

  // 4. Regular Habit & Tracking Score (max 15 pts)
  let scoreHabit = Math.min(15, targetTx.length * 2);

  const rawScore = scoreSavings + scoreDiscipline + scoreBuffer + scoreHabit;
  const healthScore = Math.min(100, Math.max(10, rawScore));

  // Determine Grade
  let grade: 'AAA' | 'AA' | 'A' | 'B' | 'C' = 'B';
  let gradeTitle = '成長中的金幣探險家';
  let gradeDescription = '你的記帳旅程剛剛啟動，繼續保持記錄，把錢錢存得更有智慧！';

  if (healthScore >= 90) {
    grade = 'AAA';
    gradeTitle = '傳奇財富大宗師 🏆';
    gradeDescription = '太厲害了！你的儲蓄率極高，還能精準分清「需要」與「想要」，財務體質比許多大人還要棒！';
  } else if (healthScore >= 80) {
    grade = 'AA';
    gradeTitle = '頂級金幣守護隊長 🛡️';
    gradeDescription = '非常出色！收支控制十分穩健，金庫正在穩定成長中，是朋友圈裡的理財小學霸！';
  } else if (healthScore >= 70) {
    grade = 'A';
    gradeTitle = '聰明理財探險家 🧭';
    gradeDescription = '表現很棒！有養成存錢的好習慣，只要在「想要」的小零食或玩具上稍加控制，分數就會更上一層樓！';
  } else if (healthScore >= 55) {
    grade = 'B';
    gradeTitle = '奮力前進的存錢學徒 ⭐';
    gradeDescription = '有在認真記帳，但是「想要」的花費稍微多了一點點喔！試試看下次買東西前先默數 30 秒！';
  } else {
    grade = 'C';
    gradeTitle = '需要補給能量的探險新手 🎒';
    gradeDescription = '目前花得比存得多喔！別灰心，從今天開始立下每週存下 30% 零用錢的目標，一定能逆轉！';
  }

  // Impulse Spending Score (0-100, higher means more impulsive)
  const impulseSpendingScore = Math.min(100, Math.round(wantsRatio * 0.9 + (topExpenseCategory.name === '點心零食' || topExpenseCategory.name === '玩具遊戲' ? 10 : 0)));

  // Automated Financial Advisor Actionable Advice
  const automatedAdvice: FinancialHealthMetrics['automatedAdvice'] = [];

  if (savingsRate >= 35) {
    automatedAdvice.push({
      type: 'positive',
      title: '🌟 儲蓄率超越 50/30/20 黃金法則！',
      description: `你目前將高達 ${savingsRate}% 的收入好好存了起來，展現出超級棒的延遲享樂能力。`,
      actionableStep: '可以考慮將部分儲蓄劃分到「長期夢想基金」，讓大目標更快實現！',
    });
  } else if (savingsRate > 0) {
    automatedAdvice.push({
      type: 'tip',
      title: '💡 儲蓄率有進步空間',
      description: `目前儲蓄率為 ${savingsRate}%。金融顧問建議小學生理想的儲蓄比例是 20%~30%。`,
      actionableStep: '試試看「先存再花」魔法：每次拿到零用錢的第一天，先將 20 元存入小金庫不拿出來！',
    });
  } else {
    automatedAdvice.push({
      type: 'warning',
      title: '⚠️ 收支拉起黃色警報',
      description: '這段期間你的總支出大於或等於總收入，小金庫正在變瘦喔！',
      actionableStep: '打開你的「想要」清單，挑出一項本週可以先不買的點心或玩具！',
    });
  }

  if (wantsRatio > 55) {
    automatedAdvice.push({
      type: 'warning',
      title: '🎯 「想要」比例偏高警訊',
      description: `你的開銷中高達 ${wantsRatio}% 屬於非必需的「想要」支出。`,
      actionableStep: '購物前練習「3 天冷卻法」：想買玩具時，先在紙上記下來，等 3 天後若還是很想買才考慮！',
    });
  } else {
    automatedAdvice.push({
      type: 'positive',
      title: '🛡️ 火眼金睛！理性消費高手',
      description: `你很好地把控了「想要」與「需要」的界線，需要的文具學習支出佔據健康主導。`,
      actionableStep: '繼續保持這種分辨能力，你會比同齡小朋友更快存到第一桶冒險基金！',
    });
  }

  if (safetyBufferWeeks >= 4) {
    automatedAdvice.push({
      type: 'positive',
      title: '🏰 城堡級安全備用金庫',
      description: `以你現在的平均花費，目前存款可以支撐約 ${safetyBufferWeeks} 週的生活，非常有安全感！`,
      actionableStep: '這是最健康的財務盾牌，遇到緊急需要時完全不用擔心手忙腳亂。',
    });
  }

  // Kid friendly summary
  const kidFriendlySummary = `哈囉小探險家！你的小金庫總資產是 $${currentBalance} 元。這陣子你存下了 ${savingsRate}% 的錢錢，表現獲得「${grade} 等級」。如果能繼續分清買彩色筆（需要）和買糖果（想要），你的虛擬寵物就會長得更快更強壯喔！`;

  const parentAdvisorNote = `【家庭理財顧問專業視角】\n本期總收入 NT$${totalIncome}，總支出 NT$${totalExpense}，淨儲蓄 NT$${netSavings}（儲蓄率 ${savingsRate}%）。消費結構中「需要」佔 ${needsRatio}%，「想要」佔 ${wantsRatio}%。孩子目前的流動資金約可支撐 ${safetyBufferWeeks} 週日常開銷，健康度評分為 ${healthScore}/100（${grade} 級）。建議家長可透過「冒險存錢進度條」引導孩子設定具體的延遲滿足目標，並固定每週日進行 5 分鐘親子理財回顧。`;

  return {
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    needsAmount,
    wantsAmount,
    needsRatio,
    wantsRatio,
    healthScore,
    grade,
    gradeTitle,
    gradeDescription,
    safetyBufferWeeks,
    impulseSpendingScore,
    topExpenseCategory: {
      name: topExpenseCategory.category || '無',
      amount: topExpenseCategory.amount,
      percentage: topExpenseCategory.percentage,
    },
    categoryBreakdown,
    automatedAdvice,
    kidFriendlySummary,
    parentAdvisorNote,
  };
}

export function simulateCompoundGrowth(
  initialAmount: number,
  weeklyAdd: number,
  annualRatePercent: number = 3.0,
  years: number = 5
) {
  const result: { year: number; totalSaved: number; interestEarned: number; totalValue: number }[] = [];
  let currentValue = initialAmount;
  let totalContributed = initialAmount;
  const weeklyRate = annualRatePercent / 100 / 52;

  for (let y = 1; y <= years; y++) {
    for (let w = 1; w <= 52; w++) {
      currentValue += weeklyAdd;
      totalContributed += weeklyAdd;
      currentValue += currentValue * weeklyRate;
    }
    const interestEarned = Math.max(0, Math.round(currentValue - totalContributed));
    result.push({
      year: y,
      totalSaved: Math.round(totalContributed),
      interestEarned,
      totalValue: Math.round(currentValue),
    });
  }

  return result;
}
