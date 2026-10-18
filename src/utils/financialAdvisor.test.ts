import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotalBalance, calculateFinancialMetrics, simulateCompoundGrowth } from './financialAdvisor.ts';
import type { Transaction } from '../types.ts';

test('calculateTotalBalance computes net balance properly', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2026-10-01',
      type: 'income',
      amount: 500,
      category: '零用錢',
      intention: 'savings_income',
      note: '每週零用錢',
      timestamp: Date.now() - 5000,
    },
    {
      id: '2',
      date: '2026-10-02',
      type: 'expense',
      amount: 120,
      category: '學習文具',
      intention: 'need',
      note: '買筆記本與自動鉛筆',
      timestamp: Date.now() - 4000,
    },
    {
      id: '3',
      date: '2026-10-03',
      type: 'expense',
      amount: 50,
      category: '點心零食',
      intention: 'want',
      note: '放學冰棒',
      timestamp: Date.now() - 3000,
    },
  ];

  const balance = calculateTotalBalance(transactions, 100);
  assert.equal(balance, 100 + 500 - 120 - 50);
  assert.equal(balance, 430);
});

test('calculateFinancialMetrics correctly categorizes needs vs wants and savings rate', () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2026-10-01',
      type: 'income',
      amount: 1000,
      category: '零用錢',
      intention: 'savings_income',
      note: '月度零用錢',
      timestamp: Date.now() - 10000,
    },
    {
      id: '2',
      date: '2026-10-02',
      type: 'expense',
      amount: 300,
      category: '學習文具',
      intention: 'need',
      note: '美術用具',
      timestamp: Date.now() - 8000,
    },
    {
      id: '3',
      date: '2026-10-03',
      type: 'expense',
      amount: 100,
      category: '點心零食',
      intention: 'want',
      note: '餅乾',
      timestamp: Date.now() - 6000,
    },
  ];

  const metrics = calculateFinancialMetrics(transactions, 600);

  assert.equal(metrics.totalIncome, 1000);
  assert.equal(metrics.totalExpense, 400);
  assert.equal(metrics.netSavings, 600);
  assert.equal(metrics.savingsRate, 60); // 60%
  assert.equal(metrics.needsAmount, 300);
  assert.equal(metrics.wantsAmount, 100);
  assert.equal(metrics.needsRatio, 75); // 300 / 400 = 75%
  assert.equal(metrics.wantsRatio, 25); // 100 / 400 = 25%
  assert.equal(metrics.grade, 'AAA'); // High savings rate and discipline yields top score
  assert.ok(metrics.healthScore >= 80);
});

test('simulateCompoundGrowth projects compounding properly', () => {
  const growth = simulateCompoundGrowth(1000, 50, 3, 3);
  assert.equal(growth.length, 3);
  // Year 1 should have accumulated contributions + interest
  assert.ok(growth[0].totalValue > growth[0].totalSaved);
  assert.ok(growth[2].totalValue > growth[1].totalValue);
});
