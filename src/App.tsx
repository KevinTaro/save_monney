/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header.tsx';
import { Navigation, TabKey } from './components/Navigation.tsx';
import { ExpenseTrackerTab } from './components/ExpenseTrackerTab.tsx';
import { FinancialAdvisorTab } from './components/FinancialAdvisorTab.tsx';
import { AdventureProgressTab } from './components/AdventureProgressTab.tsx';
import { VirtualPetsTab } from './components/VirtualPetsTab.tsx';
import { AchievementsTab } from './components/AchievementsTab.tsx';
import { ExportGoogleSheetTab } from './components/ExportGoogleSheetTab.tsx';
import { QuickAddModal } from './components/QuickAddModal.tsx';
import { PetCompanionWidget } from './components/PetCompanionWidget.tsx';

import { calculateTotalBalance, calculateFinancialMetrics } from './utils/financialAdvisor.ts';
import { PET_ROSTER, getUnlockedPets } from './utils/petSystem.ts';
import { INITIAL_ACHIEVEMENTS, evaluateAchievements } from './utils/achievements.ts';
import { INITIAL_TRANSACTIONS, INITIAL_GOALS } from './utils/mockData.ts';
import { soundFx } from './utils/audio.ts';
import type { Transaction, SavingsGoal, Achievement, VirtualPet } from './types.ts';

const STORAGE_KEYS = {
  TRANSACTIONS: 'little_wealth_explorer_tx_v2',
  GOALS: 'little_wealth_explorer_goals_v2',
  ACHIEVEMENTS: 'little_wealth_explorer_achievements_v2',
  ACTIVE_PET: 'little_wealth_explorer_active_pet_v2',
  SOUND_ENABLED: 'little_wealth_explorer_sound_v2',
};

export default function App() {
  // Load initial data from localStorage or mock defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_GOALS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [activePetId, setActivePetId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PET) || 'shiba';
    } catch {
      return 'shiba';
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [currentTab, setCurrentTab] = useState<TabKey>('tracker');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [hasCheckedAdvisor, setHasCheckedAdvisor] = useState<boolean>(false);
  const [hasExported, setHasExported] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync soundFx config
  useEffect(() => {
    soundFx.enabled = soundEnabled;
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }, [achievements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PET, activePetId);
    } catch {
      // ignore
    }
  }, [activePetId]);

  // Derived state: Total Balance
  const currentBalance = useMemo(() => {
    return calculateTotalBalance(transactions, 0);
  }, [transactions]);

  // Derived state: Financial Health Metrics
  const metrics = useMemo(() => {
    return calculateFinancialMetrics(transactions, currentBalance, 30);
  }, [transactions, currentBalance]);

  // Unlocked Pets
  const unlockedPets = useMemo(() => {
    return getUnlockedPets(currentBalance);
  }, [currentBalance]);

  // Active Pet object
  const activePet = useMemo(() => {
    const found = PET_ROSTER.find(p => p.id === activePetId);
    // If active pet is locked due to balance decrease, fall back to first unlocked
    if (found && currentBalance >= found.unlockedThreshold) {
      return found;
    }
    return unlockedPets[0] || PET_ROSTER[0];
  }, [activePetId, currentBalance, unlockedPets]);

  // Calculate bookkeeping streak (consecutive days)
  const streakDays = useMemo(() => {
    if (transactions.length === 0) return 0;
    const uniqueDates = Array.from(new Set(transactions.map(t => t.date))).sort();
    return Math.min(uniqueDates.length, 7);
  }, [transactions]);

  // Evaluate achievements on state changes
  useEffect(() => {
    const { updatedList, newlyUnlocked } = evaluateAchievements(
      achievements,
      transactions,
      currentBalance,
      goals,
      hasCheckedAdvisor,
      hasExported
    );

    if (newlyUnlocked.length > 0) {
      soundFx.playFanfare();
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      setToastMessage(`🎉 榮譽解鎖：獲得「${newlyUnlocked[0].title}」徽章！`);
      setTimeout(() => setToastMessage(null), 4000);
      setAchievements(updatedList);
    }
  }, [transactions, currentBalance, goals, hasCheckedAdvisor, hasExported, achievements]);

  // Handlers
  const handleAddTransaction = useCallback((newTx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleQuickPreset = useCallback((preset: Omit<Transaction, 'id' | 'timestamp'>) => {
    soundFx.playCoin();
    try {
      confetti({
        particleCount: 30,
        spread: 50,
      });
    } catch {
      // ignore
    }
    handleAddTransaction(preset);
  }, [handleAddTransaction]);

  const handleAddGoal = useCallback((newGoal: Omit<SavingsGoal, 'id' | 'completed'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      completed: false,
    };
    setGoals(prev => [...prev, goal]);
  }, []);

  const handleUpdateGoalProgress = useCallback((goalId: string, delta: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        const newAmount = Math.max(0, g.currentAmount + delta);
        return {
          ...g,
          currentAmount: newAmount,
          completed: newAmount >= g.targetAmount,
        };
      })
    );
  }, []);

  const handleCompleteGoal = useCallback((goalId: string) => {
    setGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, completed: true } : g))
    );
    setToastMessage('🎉 恭喜你達成了存錢願望！你是最棒的冒險家！');
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const handleSelectPet = useCallback((pet: VirtualPet) => {
    setActivePetId(pet.id);
    setToastMessage(`🐾 已召喚 ${pet.name} 擔任隨行伴讀守護獸！`);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleLoadDemoData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setGoals(INITIAL_GOALS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setActivePetId('shiba');
    setToastMessage('✨ 已成功載入小學生示範帳本資料！');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleClearAllData = useCallback(() => {
    setTransactions([]);
    setGoals([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setActivePetId('shiba');
    setToastMessage('已重設帳本為全新狀態！');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const unlockedBadgesCount = useMemo(() => {
    return achievements.filter(a => a.unlocked).length;
  }, [achievements]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-100/40 text-slate-800 font-sans selection:bg-amber-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-amber-900 text-amber-50 px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-amber-300 font-bold text-xs sm:text-sm animate-in slide-in-from-top-2 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        balance={currentBalance}
        activePet={activePet}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        streakDays={streakDays}
        unlockedBadgesCount={unlockedBadgesCount}
        totalBadgesCount={achievements.length}
      />

      {/* Tab Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unlockedPetsCount={unlockedPets.length}
      />

      {/* Main Tab Content */}
      <main className="max-w-5xl mx-auto px-4 py-4">
        {currentTab === 'tracker' && (
          <ExpenseTrackerTab
            transactions={transactions}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onQuickPreset={handleQuickPreset}
            activePet={activePet}
          />
        )}

        {currentTab === 'advisor' && (
          <FinancialAdvisorTab
            metrics={metrics}
            currentBalance={currentBalance}
            activePet={activePet}
            onMarkAdvisorChecked={() => setHasCheckedAdvisor(true)}
          />
        )}

        {currentTab === 'adventure' && (
          <AdventureProgressTab
            goals={goals}
            activePet={activePet}
            currentBalance={currentBalance}
            onAddGoal={handleAddGoal}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onCompleteGoal={handleCompleteGoal}
          />
        )}

        {currentTab === 'pets' && (
          <VirtualPetsTab
            currentBalance={currentBalance}
            activePet={activePet}
            onSelectPet={handleSelectPet}
          />
        )}

        {currentTab === 'achievements' && (
          <AchievementsTab achievements={achievements} />
        )}

        {currentTab === 'export' && (
          <ExportGoogleSheetTab
            transactions={transactions}
            metrics={metrics}
            goals={goals}
            currentBalance={currentBalance}
            onLoadDemoData={handleLoadDemoData}
            onClearAllData={handleClearAllData}
            onExportSuccess={() => setHasExported(true)}
          />
        )}
      </main>

      {/* Floating Pet Companion Widget */}
      <PetCompanionWidget
        activePet={activePet}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
