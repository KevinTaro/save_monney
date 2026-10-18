import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Database, 
  RefreshCw, 
  FileText,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio.ts';
import { exportToExcel, generateGoogleSheetTSV } from '../utils/excelExport.ts';
import type { Transaction, FinancialHealthMetrics, SavingsGoal } from '../types.ts';

interface ExportGoogleSheetTabProps {
  transactions: Transaction[];
  metrics: FinancialHealthMetrics;
  goals: SavingsGoal[];
  currentBalance: number;
  onLoadDemoData: () => void;
  onClearAllData: () => void;
  onExportSuccess: () => void;
}

export const ExportGoogleSheetTab: React.FC<ExportGoogleSheetTabProps> = ({
  transactions,
  metrics,
  goals,
  currentBalance,
  onLoadDemoData,
  onClearAllData,
  onExportSuccess,
}) => {
  const [copiedTSV, setCopiedTSV] = useState<boolean>(false);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleDownloadExcel = () => {
    soundFx.playFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
    });
    exportToExcel(transactions, metrics, goals, currentBalance);
    onExportSuccess();
  };

  const handleCopyTSV = () => {
    const tsv = generateGoogleSheetTSV(transactions);
    navigator.clipboard.writeText(tsv).then(() => {
      soundFx.playPop();
      setCopiedTSV(true);
      onExportSuccess();
      setTimeout(() => setCopiedTSV(false), 2500);
    });
  };

  const handleCopyFormula = (formula: string, key: string) => {
    navigator.clipboard.writeText(formula).then(() => {
      soundFx.playPop();
      setCopiedFormula(key);
      setTimeout(() => setCopiedFormula(null), 2000);
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-2 border-teal-500">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-teal-950/30 px-3 py-1 rounded-full text-xs font-bold text-teal-100 border border-teal-300/30">
              <FileSpreadsheet className="w-4 h-4 text-teal-200" />
              <span>試算表雲端連動中心</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              匯出 Excel 報表與 Google 試算表連動 📊
            </h2>
            <p className="text-sm text-teal-100 font-medium max-w-xl">
              隨時將孩子的記帳記錄與金融顧問分析報告下載成標準 Excel 試算表，或一鍵複製貼入 Google Sheets 雲端共享！
            </p>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-5 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0 border border-amber-300"
          >
            <Download className="w-5 h-5" />
            <span>下載完整 Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Excel Export & Google Sheets Sync */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Excel Multi-Sheet Exporter */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-teal-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                📗
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">
                  Excel (.xlsx) 專業工作簿
                </h3>
                <span className="text-xs text-slate-400">包含 3 大完整工作表頁籤</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              點擊下載後，將自動生成包含「收支記帳明細」、「顧問月度理財報告」與「冒險存錢目標」的專業檔案，版面與欄位皆已排版優化。
            </p>

            <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <span className="font-bold text-emerald-950 block">包含內容：</span>
              <ul className="space-y-1 text-slate-600">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>工作表 1：收支明細（含需要/想要標籤與自訂備註）</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>工作表 2：金融顧問診斷報告（儲蓄率、安全週數、改善建議）</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>工作表 3：冒險目標清單與進度達成率</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>點我下載 Excel 檔案</span>
          </button>
        </div>

        {/* Card 2: Google Sheets Direct Sync */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-teal-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                📑
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">
                  Google 試算表 (Google Sheets)
                </h3>
                <span className="text-xs text-slate-400">一秒貼入雲端，親子共同檢視</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              點擊「複製試算表內容」，然後開啟 Google Sheets 按下 <code>Ctrl+V</code>（或 <code>Cmd+V</code>），所有欄位自動對齊！
            </p>

            <div className="bg-teal-50/60 p-3.5 rounded-2xl border border-teal-200 space-y-2 text-xs">
              <span className="font-bold text-teal-950 block">操作只需兩步：</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>點擊下方綠色按鈕「複製試算表表格」</li>
                <li>點擊「開啟新的 Google 試算表」並直接貼上</li>
              </ol>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyTSV}
              className={`flex-1 py-3 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                copiedTSV
                  ? 'bg-emerald-500 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {copiedTSV ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTSV ? '已複製！可直接在試算表貼上' : '複製試算表內容'}</span>
            </button>

            <a
              href="https://sheets.new"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex items-center justify-center transition-colors shadow-2xs"
              title="開啟新的 Google 試算表"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Google Sheets Helpful Formulas Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Code className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-base">
              Google 試算表理財公式庫
            </h3>
            <p className="text-xs text-slate-500">
              貼在 Google Sheets 中，就能自動計算出與本 App 一模一樣的金融顧問指標！
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            {
              key: 'f1',
              title: '總收入計算公式',
              formula: '=SUMIF(B:B, "收入", E:E)',
              desc: '自動計算所有類型為「收入」的金額總和',
            },
            {
              key: 'f2',
              title: '總支出計算公式',
              formula: '=SUMIF(B:B, "支出", E:E)',
              desc: '自動計算所有類型為「支出」的開銷總和',
            },
            {
              key: 'f3',
              title: '儲蓄率公式 (Savings Rate)',
              formula: '=(SUMIF(B:B,"收入",E:E)-SUMIF(B:B,"支出",E:E))/SUMIF(B:B,"收入",E:E)',
              desc: '計算本月存下來的錢佔總收入的比例（格式設為百分比）',
            },
            {
              key: 'f4',
              title: '「想要」衝動開銷筆數統計',
              formula: '=COUNTIF(D:D, "想要")',
              desc: '計算開銷中有多少筆屬於非必需的想要消費',
            },
          ].map(item => (
            <div
              key={item.key}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-xs text-slate-800 block">{item.title}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
              </div>
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 mt-2 font-mono text-xs text-emerald-800">
                <code className="truncate">{item.formula}</code>
                <button
                  onClick={() => handleCopyFormula(item.formula, item.key)}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 shrink-0 ml-2 cursor-pointer"
                  title="複製公式"
                >
                  {copiedFormula === item.key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management & Demo reset */}
      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-600" />
            <span className="font-bold text-xs text-slate-700">資料庫與範例管理</span>
          </div>
          <span className="text-[11px] text-slate-400">目前本地已安全儲存</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (confirm('確定要載入示範小學生的記帳範本嗎？（將會加入豐富的範例紀錄）')) {
                soundFx.playPop();
                onLoadDemoData();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>載入範例小學生帳本</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('確定要清空所有紀錄嗎？所有記帳明細將會被重設！')) {
                soundFx.playPop();
                onClearAllData();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <span>清空重設帳本</span>
          </button>
        </div>
      </div>
    </div>
  );
};
