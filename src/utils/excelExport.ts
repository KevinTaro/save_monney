import * as XLSX from 'xlsx';
import type { Transaction, FinancialHealthMetrics, SavingsGoal } from '../types.ts';

export function exportToExcel(
  transactions: Transaction[],
  metrics: FinancialHealthMetrics,
  goals: SavingsGoal[],
  currentBalance: number
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Transactions Detail (收支記帳明細)
  const txRows = transactions.map((t, idx) => ({
    '編號': idx + 1,
    '日期': t.date,
    '類型': t.type === 'income' ? '收入 (+)' : '支出 (-)',
    '類別': t.category,
    '屬性 (需要/想要)': t.type === 'income' ? '收入存款' : (t.intention === 'need' ? '🎒 需要 (必需品)' : '🎁 想要 (非必需)'),
    '金額 (NT$)': t.amount,
    '備註說明': t.note || '無',
  }));

  const wsTx = XLSX.utils.json_to_sheet(txRows);
  // Auto-fit column widths
  wsTx['!cols'] = [
    { wch: 8 },
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 20 },
    { wch: 14 },
    { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTx, '收支記帳明細');

  // Sheet 2: Monthly Financial Advisor Report (顧問月度理財報告)
  const reportRows = [
    { '指標項目': '當前小金庫總餘額', '數值/比例': `NT$ ${currentBalance}`, '顧問評析與建議': '孩子目前累積的總資產儲備' },
    { '指標項目': '本期總收入', '數值/比例': `NT$ ${metrics.totalIncome}`, '顧問評析與建議': '包含零用錢、家事獎金、紅包等' },
    { '指標項目': '本期總支出', '數值/比例': `NT$ ${metrics.totalExpense}`, '顧問評析與建議': '本期所有開銷加總' },
    { '指標項目': '淨儲蓄金額', '數值/比例': `NT$ ${metrics.netSavings}`, '顧問評析與建議': metrics.netSavings >= 0 ? '維持正向現金流，值得讚許！' : '支出超過收入，需檢視開銷' },
    { '指標項目': '儲蓄率 (Savings Rate)', '數值/比例': `${metrics.savingsRate}%`, '顧問評析與建議': metrics.savingsRate >= 30 ? '表現優異，達到金融顧問推薦的儲蓄黃金標準！' : '建議朝 20%~30% 的儲蓄比例努力' },
    { '指標項目': '「需要」必需花費佔比', '數值/比例': `${metrics.needsRatio}% (NT$ ${metrics.needsAmount})`, '顧問評析與建議': '學習文具、必要交通等基本需求' },
    { '指標項目': '「想要」慾望花費佔比', '數值/比例': `${metrics.wantsRatio}% (NT$ ${metrics.wantsAmount})`, '顧問評析與建議': metrics.wantsRatio > 50 ? '想要支出偏高，建議引導孩子練習延遲享樂' : '克制自律良好！' },
    { '指標項目': '財務健康綜合評分', '數值/比例': `${metrics.healthScore} / 100 分`, '顧問評析與建議': `等級：${metrics.grade} （${metrics.gradeTitle}）` },
    { '指標項目': '流動性安全週數', '數值/比例': `約 ${metrics.safetyBufferWeeks} 週`, '顧問評析與建議': '在無新增收入下，金庫存款可支撐的週數' },
    { '指標項目': '最大支出分類', '數值/比例': `${metrics.topExpenseCategory.name} (NT$ ${metrics.topExpenseCategory.amount})`, '顧問評析與建議': `佔總支出 ${metrics.topExpenseCategory.percentage}%` },
    { '指標項目': '理財顧問診斷建議 1', '數值/比例': metrics.automatedAdvice[0]?.title || '穩步前行', '顧問評析與建議': metrics.automatedAdvice[0]?.actionableStep || '繼續保持記帳好習慣' },
    { '指標項目': '理財顧問診斷建議 2', '數值/比例': metrics.automatedAdvice[1]?.title || '健康理財', '顧問評析與建議': metrics.automatedAdvice[1]?.actionableStep || '設定明確的存錢目標' },
  ];

  const wsReport = XLSX.utils.json_to_sheet(reportRows);
  wsReport['!cols'] = [
    { wch: 24 },
    { wch: 28 },
    { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, wsReport, '顧問月度理財報告');

  // Sheet 3: Savings Goals (冒險存錢目標)
  const goalRows = goals.map(g => ({
    '目標名稱': g.title,
    '目標金額 (NT$)': g.targetAmount,
    '已存金額 (NT$)': g.currentAmount,
    '達成進度 (%)': Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
    '狀態': g.currentAmount >= g.targetAmount ? '已達成 🎉' : '進行中 🚀',
    '類別': g.category,
    '目標期限': g.deadline || '無期限',
  }));

  const wsGoals = XLSX.utils.json_to_sheet(goalRows);
  wsGoals['!cols'] = [
    { wch: 22 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsGoals, '冒險存錢目標');

  const fileName = `小小理財探險家_財務報表_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// Generate TSV format for direct 1-click paste into Google Sheets
export function generateGoogleSheetTSV(transactions: Transaction[]): string {
  const header = ['日期', '類型', '類別', '屬性', '金額', '備註說明'].join('\t');
  const rows = transactions.map(t => {
    const typeLabel = t.type === 'income' ? '收入' : '支出';
    const intentionLabel = t.type === 'income' ? '存款' : (t.intention === 'need' ? '需要' : '想要');
    return [
      t.date,
      typeLabel,
      t.category,
      intentionLabel,
      t.amount,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ].join('\t');
  });

  return [header, ...rows].join('\n');
}

// Generate CSV string
export function generateCSV(transactions: Transaction[]): string {
  const header = ['日期', '類型', '類別', '需要或想要', '金額', '備註說明'].join(',');
  const rows = transactions.map(t => {
    const typeLabel = t.type === 'income' ? '收入' : '支出';
    const intentionLabel = t.type === 'income' ? '存款收入' : (t.intention === 'need' ? '需要' : '想要');
    return [
      t.date,
      typeLabel,
      t.category,
      intentionLabel,
      t.amount,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  return '\uFEFF' + [header, ...rows].join('\r\n');
}
