export type TransactionType = 'income' | 'expense';

export type ExpenseIntention = 'need' | 'want' | 'savings_income';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  category: string;
  intention: ExpenseIntention; // 'need': 需要, 'want': 想要, 'savings_income': 收入/存入
  note: string;
  balanceAfter?: number;
  timestamp: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  category: string;
  deadline?: string;
  completed: boolean;
}

export interface VirtualPet {
  id: string;
  name: string;
  species: string;
  avatar: string;
  unlockedThreshold: number; // Required account balance to unlock
  title: string;
  description: string;
  favoriteFood: string;
  personality: string;
  dialogueList: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'habit' | 'savings' | 'wisdom' | 'milestone';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface FinancialHealthMetrics {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number; // percentage 0 - 100
  needsAmount: number;
  wantsAmount: number;
  needsRatio: number; // percentage of total expenses
  wantsRatio: number; // percentage of total expenses
  healthScore: number; // 0 - 100
  grade: 'AAA' | 'AA' | 'A' | 'B' | 'C';
  gradeTitle: string;
  gradeDescription: string;
  safetyBufferWeeks: number; // estimated weeks of typical expense covered
  impulseSpendingScore: number; // 0-100 (lower is better)
  topExpenseCategory: { name: string; amount: number; percentage: number };
  categoryBreakdown: { category: string; amount: number; percentage: number; count: number; color: string }[];
  automatedAdvice: {
    type: 'positive' | 'warning' | 'tip';
    title: string;
    description: string;
    actionableStep: string;
  }[];
  kidFriendlySummary: string;
  parentAdvisorNote: string;
}
