import type { Achievement, Transaction, SavingsGoal } from '../types.ts';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_tx',
    title: '初試啼聲 🐣',
    description: '記下人生的第 1 筆收支紀錄！邁出成為富翁的第一步！',
    icon: '📝',
    category: 'habit',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak_3',
    title: '三天好習慣 🌱',
    description: '連續 3 天都有認真記帳，習慣的小樹苗開始發芽了！',
    icon: '🌱',
    category: 'habit',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'streak_7',
    title: '一週小管家 🏆',
    description: '連續 7 天堅持記帳，展現驚人的自律毅力！',
    icon: '👑',
    category: 'habit',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'tx_count_20',
    title: '精算小達人 📊',
    description: '累計記錄超過 20 筆收支明細，對自己的錢錢瞭若指掌！',
    icon: '📈',
    category: 'habit',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'wisdom_eyes_5',
    title: '火眼金睛初級 👁️',
    description: '成功標記並分清 5 筆「需要」與「想要」的消費！',
    icon: '🧐',
    category: 'wisdom',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'wisdom_eyes_15',
    title: '理性消費大師 🛡️',
    description: '成功標記並分清 15 筆「需要」與「想要」，消費絕不盲目！',
    icon: '💎',
    category: 'wisdom',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
  },
  {
    id: 'savings_rate_30',
    title: '金幣守護神 🪙',
    description: '單月儲蓄率達到 30% 以上，超越理財黃金比例！',
    icon: '🛡️',
    category: 'savings',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'goal_completed_1',
    title: '夢想實踐家 🚀',
    description: '親手存滿並完成第 1 個冒險存錢願望！',
    icon: '🎯',
    category: 'savings',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'balance_500',
    title: '小樹洞聚寶盆 🌰',
    description: '個人小金庫餘額突破 500 元大關！解鎖松果小松鼠！',
    icon: '🌰',
    category: 'milestone',
    unlocked: false,
    progress: 0,
    maxProgress: 500,
  },
  {
    id: 'balance_1500',
    title: '千元金山 🏔️',
    description: '個人小金庫餘額突破 1,500 元！召喚福氣招財貓！',
    icon: '🏔️',
    category: 'milestone',
    unlocked: false,
    progress: 0,
    maxProgress: 1500,
  },
  {
    id: 'advisor_check',
    title: '理財智多星 🧠',
    description: '查看過專屬金融顧問的月度健康診斷報告！',
    icon: '🩺',
    category: 'wisdom',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'excel_export',
    title: '專業會計師 📑',
    description: '成功將記帳數據匯出成 Excel 或與 Google 試算表連動！',
    icon: '💾',
    category: 'milestone',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

export function evaluateAchievements(
  currentList: Achievement[],
  transactions: Transaction[],
  currentBalance: number,
  goals: SavingsGoal[],
  hasCheckedAdvisor: boolean = false,
  hasExported: boolean = false
): { updatedList: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const txCount = transactions.length;

  // Calculate unique dates count and streak
  const sortedDates = Array.from(new Set(transactions.map(t => t.date))).sort();
  const dateCount = sortedDates.length;

  // Need vs Want count
  const needWantCount = transactions.filter(t => t.type === 'expense' && (t.intention === 'need' || t.intention === 'want')).length;

  // Completed goals
  const completedGoalsCount = goals.filter(g => g.completed || g.currentAmount >= g.targetAmount).length;

  // Savings rate
  const totalInc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalInc > 0 ? Math.max(0, Math.round(((totalInc - totalExp) / totalInc) * 100)) : 0;

  const updatedList = currentList.map(ach => {
    let progress = ach.progress;
    let shouldUnlock = ach.unlocked;

    switch (ach.id) {
      case 'first_tx':
        progress = Math.min(1, txCount);
        shouldUnlock = txCount >= 1;
        break;
      case 'streak_3':
        progress = Math.min(3, dateCount);
        shouldUnlock = dateCount >= 3;
        break;
      case 'streak_7':
        progress = Math.min(7, dateCount);
        shouldUnlock = dateCount >= 7;
        break;
      case 'tx_count_20':
        progress = Math.min(20, txCount);
        shouldUnlock = txCount >= 20;
        break;
      case 'wisdom_eyes_5':
        progress = Math.min(5, needWantCount);
        shouldUnlock = needWantCount >= 5;
        break;
      case 'wisdom_eyes_15':
        progress = Math.min(15, needWantCount);
        shouldUnlock = needWantCount >= 15;
        break;
      case 'savings_rate_30':
        progress = Math.min(30, savingsRate);
        shouldUnlock = savingsRate >= 30;
        break;
      case 'goal_completed_1':
        progress = Math.min(1, completedGoalsCount);
        shouldUnlock = completedGoalsCount >= 1;
        break;
      case 'balance_500':
        progress = Math.min(500, Math.max(0, currentBalance));
        shouldUnlock = currentBalance >= 500;
        break;
      case 'balance_1500':
        progress = Math.min(1500, Math.max(0, currentBalance));
        shouldUnlock = currentBalance >= 1500;
        break;
      case 'advisor_check':
        progress = hasCheckedAdvisor ? 1 : ach.progress;
        shouldUnlock = hasCheckedAdvisor || ach.unlocked;
        break;
      case 'excel_export':
        progress = hasExported ? 1 : ach.progress;
        shouldUnlock = hasExported || ach.unlocked;
        break;
      default:
        break;
    }

    if (shouldUnlock && !ach.unlocked) {
      const unlockedItem = {
        ...ach,
        unlocked: true,
        progress: ach.maxProgress,
        unlockedAt: new Date().toLocaleDateString('zh-TW'),
      };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return {
      ...ach,
      progress,
      unlocked: ach.unlocked || shouldUnlock,
    };
  });

  return { updatedList, newlyUnlocked };
}
