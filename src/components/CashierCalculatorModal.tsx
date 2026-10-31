import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, 
  X, 
  Banknote, 
  Percent, 
  RotateCcw, 
  Delete, 
  ArrowRight, 
  Check, 
  Coins, 
  Copy,
  Sparkles,
  Equal
} from 'lucide-react';
import { formatRupiah, formatNumber } from '../utils/formatters';

export type CalculatorTab = 'standard' | 'change' | 'discount';

interface CashierCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: CalculatorTab;
  currentSubtotal: number;
  currentTotal: number;
  onApplyDiscount: (discount: number) => void;
  onApplyCashReceived: (cash: number) => void;
}

// Indonesian Rupiah Denominations for change calculation
const DENOMINATIONS = [
  { value: 100000, label: 'Rp 100.000' },
  { value: 50000, label: 'Rp 50.000' },
  { value: 20000, label: 'Rp 20.000' },
  { value: 10000, label: 'Rp 10.000' },
  { value: 5000, label: 'Rp 5.000' },
  { value: 2000, label: 'Rp 2.000' },
  { value: 1000, label: 'Rp 1.000' },
  { value: 500, label: 'Rp 500' },
];

export const CashierCalculatorModal: React.FC<CashierCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'standard',
  currentSubtotal,
  currentTotal,
  onApplyDiscount,
  onApplyCashReceived,
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(initialTab);

  // --- TAB 1: Standard Calculator State ---
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcEquation, setCalcEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  // --- TAB 2: Change Calculator State ---
  const [changeBillTotal, setChangeBillTotal] = useState<number>(currentTotal);
  const [changeCashReceived, setChangeCashReceived] = useState<number>(0);

  // --- TAB 3: Discount Calculator State ---
  const [discountBaseAmount, setDiscountBaseAmount] = useState<number>(currentSubtotal || currentTotal || 0);
  const [discountType, setDiscountType] = useState<'percent' | 'nominal'>('percent');
  const [discountPercentVal, setDiscountPercentVal] = useState<number>(10);
  const [discountNominalVal, setDiscountNominalVal] = useState<number>(5000);

  // Sync props when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setChangeBillTotal(currentTotal);
      setChangeCashReceived(currentTotal > 0 ? currentTotal : 0);
      setDiscountBaseAmount(currentSubtotal > 0 ? currentSubtotal : currentTotal);
      setHasCopied(false);
    }
  }, [isOpen, initialTab, currentSubtotal, currentTotal]);

  // Standard calculator helper functions
  const handleCalcDigit = useCallback((digit: string) => {
    setCalcDisplay((prev) => {
      if (isNewNumber) {
        setIsNewNumber(false);
        return digit === '.' ? '0.' : digit;
      }
      if (digit === '.' && prev.includes('.')) return prev;
      if (prev === '0' && digit !== '.') return digit;
      // limit max length
      if (prev.replace(/\D/g, '').length >= 12) return prev;
      return prev + digit;
    });
  }, [isNewNumber]);

  const handleCalcDoubleZero = useCallback((zeros: string) => {
    setCalcDisplay((prev) => {
      if (isNewNumber || prev === '0') {
        setIsNewNumber(false);
        return '0';
      }
      if (prev.replace(/\D/g, '').length >= 12) return prev;
      return prev + zeros;
    });
  }, [isNewNumber]);

  const handleCalcOperator = useCallback((op: string) => {
    const currentVal = parseFloat(calcDisplay) || 0;
    setCalcEquation(`${currentVal} ${op} `);
    setIsNewNumber(true);
  }, [calcDisplay]);

  const handleCalcEqual = useCallback(() => {
    if (!calcEquation) return;
    try {
      const parts = calcEquation.trim().split(' ');
      if (parts.length >= 2) {
        const firstNum = parseFloat(parts[0]);
        const operator = parts[1];
        const secondNum = parseFloat(calcDisplay);
        let res = 0;

        if (operator === '+') res = firstNum + secondNum;
        else if (operator === '-') res = firstNum - secondNum;
        else if (operator === '×' || operator === '*') res = firstNum * secondNum;
        else if (operator === '÷' || operator === '/') {
          res = secondNum === 0 ? 0 : firstNum / secondNum;
        }

        // Round to 2 decimals if not integer
        const formattedRes = Math.round(res * 100) / 100;
        setCalcEquation(`${calcEquation}${calcDisplay} =`);
        setCalcDisplay(String(formattedRes));
        setIsNewNumber(true);
      }
    } catch {
      setCalcDisplay('0');
      setCalcEquation('');
    }
  }, [calcEquation, calcDisplay]);

  const handleCalcClear = useCallback(() => {
    setCalcDisplay('0');
    setCalcEquation('');
    setIsNewNumber(true);
  }, []);

  const handleCalcBackspace = useCallback(() => {
    setCalcDisplay((prev) => {
      if (prev.length <= 1 || prev === '0') return '0';
      return prev.slice(0, -1);
    });
  }, []);

  const handleCalcPercent = useCallback(() => {
    const currentVal = parseFloat(calcDisplay) || 0;
    const parts = calcEquation.trim().split(' ');
    if (parts.length >= 2) {
      const baseNum = parseFloat(parts[0]);
      const percentVal = (baseNum * currentVal) / 100;
      setCalcDisplay(String(Math.round(percentVal)));
    } else {
      setCalcDisplay(String(currentVal / 100));
    }
    setIsNewNumber(true);
  }, [calcDisplay, calcEquation]);

  // Keyboard shortcut listener inside calculator
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // If active tab is standard calculator, capture numpad
      if (activeTab === 'standard') {
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          handleCalcDigit(e.key);
        } else if (e.key === '.') {
          e.preventDefault();
          handleCalcDigit('.');
        } else if (e.key === '+') {
          e.preventDefault();
          handleCalcOperator('+');
        } else if (e.key === '-') {
          e.preventDefault();
          handleCalcOperator('-');
        } else if (e.key === '*') {
          e.preventDefault();
          handleCalcOperator('×');
        } else if (e.key === '/') {
          e.preventDefault();
          handleCalcOperator('÷');
        } else if (e.key === 'Enter' || e.key === '=') {
          e.preventDefault();
          handleCalcEqual();
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          handleCalcBackspace();
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleCalcClear();
        } else if (e.key === '%') {
          e.preventDefault();
          handleCalcPercent();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, handleCalcDigit, handleCalcOperator, handleCalcEqual, handleCalcBackspace, handleCalcClear, handleCalcPercent, onClose]);

  // Numeric value of standard calculator display
  const standardCalcNumericVal = useMemo(() => {
    const num = parseFloat(calcDisplay);
    return isNaN(num) ? 0 : Math.max(0, Math.round(num));
  }, [calcDisplay]);

  // --- Change tab calculations ---
  const changeDiff = changeCashReceived - changeBillTotal;
  const isSufficient = changeDiff >= 0;

  // Breakdown of change banknotes
  const changeBreakdown = useMemo(() => {
    if (changeDiff <= 0) return [];
    let remaining = changeDiff;
    const result: { label: string; count: number; value: number }[] = [];

    for (const denom of DENOMINATIONS) {
      if (remaining >= denom.value) {
        const count = Math.floor(remaining / denom.value);
        remaining = remaining % denom.value;
        result.push({
          label: denom.label,
          count,
          value: denom.value * count,
        });
      }
    }
    return result;
  }, [changeDiff]);

  // --- Discount tab calculations ---
  const calculatedDiscountAmount = useMemo(() => {
    const base = Math.max(0, discountBaseAmount);
    if (discountType === 'percent') {
      const pct = Math.min(100, Math.max(0, discountPercentVal));
      return Math.round((base * pct) / 100);
    } else {
      return Math.min(base, Math.max(0, discountNominalVal));
    }
  }, [discountBaseAmount, discountType, discountPercentVal, discountNominalVal]);

  const finalAmountAfterDiscount = Math.max(0, discountBaseAmount - calculatedDiscountAmount);

  const handleCopyResult = (val: number | string) => {
    navigator.clipboard.writeText(String(val));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200/70 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Kalkulator Kasir</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                  ESC untuk tutup
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Hitung kembalian, diskon belanja & kalkulasi cepat
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="p-2 bg-slate-100/90 border-b border-slate-200/70">
          <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('standard')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'standard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span>Kalkulator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('change')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'change'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kembalian</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('discount')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'discount'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              <span>Diskon</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5">
          {/* ================= TAB 1: STANDARD CALCULATOR ================= */}
          {activeTab === 'standard' && (
            <div className="space-y-3.5">
              {/* LCD Display */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col justify-between min-h-[92px]">
                <div className="text-right text-xs font-mono text-slate-400 h-5 overflow-hidden text-ellipsis">
                  {calcEquation || '\u00A0'}
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <div className="text-[11px] font-mono text-amber-400 font-medium">
                    {standardCalcNumericVal > 0 ? formatRupiah(standardCalcNumericVal) : 'Rp 0'}
                  </div>
                  <div className="text-right text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white overflow-x-auto scrollbar-none">
                    {calcDisplay}
                  </div>
                </div>
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <button
                  type="button"
                  onClick={handleCalcClear}
                  className="py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm transition-all cursor-pointer active:scale-95 border border-rose-200/60"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={handleCalcBackspace}
                  className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-slate-200/60"
                  title="Hapus digit terakhir"
                >
                  <Delete className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCalcPercent}
                  className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all cursor-pointer active:scale-95 border border-slate-200/60"
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcOperator('÷')}
                  className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  ÷
                </button>

                {/* Row 2 */}
                <button
                  type="button"
                  onClick={() => handleCalcDigit('7')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  7
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDigit('8')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  8
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDigit('9')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  9
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcOperator('×')}
                  className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  ×
                </button>

                {/* Row 3 */}
                <button
                  type="button"
                  onClick={() => handleCalcDigit('4')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDigit('5')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  5
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDigit('6')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  6
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcOperator('-')}
                  className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  −
                </button>

                {/* Row 4 */}
                <button
                  type="button"
                  onClick={() => handleCalcDigit('1')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDigit('2')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDigit('3')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcOperator('+')}
                  className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  type="button"
                  onClick={() => handleCalcDigit('0')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-base transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDoubleZero('00')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  00
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcDoubleZero('000')}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 border border-slate-200/70 shadow-xs"
                >
                  000
                </button>
                <button
                  type="button"
                  onClick={handleCalcEqual}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center"
                >
                  <Equal className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Quick-Action Buttons */}
              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyResult(calcDisplay)}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (standardCalcNumericVal > 0) {
                      onApplyDiscount(standardCalcNumericVal);
                      onClose();
                    }
                  }}
                  disabled={standardCalcNumericVal <= 0}
                  className="py-2 px-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Jadikan Diskon</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (standardCalcNumericVal > 0) {
                      onApplyCashReceived(standardCalcNumericVal);
                      onClose();
                    }
                  }}
                  disabled={standardCalcNumericVal <= 0}
                  className="py-2 px-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Jadikan Bayar</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: CHANGE CALCULATOR ================= */}
          {activeTab === 'change' && (
            <div className="space-y-4">
              {/* Total Tagihan Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    Total Tagihan / Belanja:
                  </label>
                  {currentTotal > 0 && currentTotal !== changeBillTotal && (
                    <button
                      type="button"
                      onClick={() => setChangeBillTotal(currentTotal)}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
                    >
                      Pakai Total Keranjang ({formatRupiah(currentTotal)})
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={changeBillTotal || ''}
                    onChange={(e) => setChangeBillTotal(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/70 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Uang Diterima Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    Uang Diterima dari Pembeli:
                  </label>
                  <button
                    type="button"
                    onClick={() => setChangeCashReceived(changeBillTotal)}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold underline cursor-pointer"
                  >
                    Uang Pas
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={changeCashReceived || ''}
                    onChange={(e) => setChangeCashReceived(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/70 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Quick Denomination Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[10000, 20000, 50000, 100000, 200000, 500000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setChangeCashReceived(val)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        changeCashReceived === val
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      {formatRupiah(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change Result Card */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isSufficient
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {isSufficient ? 'Kembalian Tunai' : 'Uang Kurang'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {isSufficient ? 'Harus Dikembalikan' : 'Perlu Tambahan Uang'}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">
                  {formatRupiah(Math.abs(changeDiff))}
                </div>

                {/* Breakdown of bills if sufficient */}
                {isSufficient && changeBreakdown.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/70 space-y-1.5">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Coins className="w-3 h-3 text-emerald-600" />
                      <span>Saran Pecahan Uang Kembalian:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {changeBreakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="px-2 py-1 bg-white/90 rounded-lg border border-emerald-200/70 text-[11px] font-medium flex items-center justify-between shadow-2xs"
                        >
                          <span className="font-bold text-emerald-900">{item.count} lembar</span>
                          <span className="font-mono text-slate-600">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply to POS Action */}
              <button
                type="button"
                onClick={() => {
                  onApplyCashReceived(changeCashReceived);
                  onClose();
                }}
                disabled={changeCashReceived <= 0 || !isSufficient}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Terapkan Uang Bayar ke Kasir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================= TAB 3: DISCOUNT CALCULATOR ================= */}
          {activeTab === 'discount' && (
            <div className="space-y-4">
              {/* Nilai Belanja Dasar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">
                    Nilai Acuan / Subtotal:
                  </label>
                  {currentSubtotal > 0 && (
                    <button
                      type="button"
                      onClick={() => setDiscountBaseAmount(currentSubtotal)}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
                    >
                      Pakai Subtotal Keranjang ({formatRupiah(currentSubtotal)})
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={discountBaseAmount || ''}
                    onChange={(e) => setDiscountBaseAmount(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/70 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Tipe Diskon Switcher (Persen vs Nominal) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Metode Perhitungan Diskon:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === 'percent'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>Persentase (%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscountType('nominal')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      discountType === 'nominal'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Potongan Tunai (Rp)</span>
                  </button>
                </div>
              </div>

              {/* Input detail based on type */}
              {discountType === 'percent' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Persentase Diskon:</span>
                    <span className="font-mono font-bold text-blue-700">{discountPercentVal}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={discountPercentVal}
                      onChange={(e) => setDiscountPercentVal(parseInt(e.target.value) || 0)}
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercentVal || ''}
                      onChange={(e) => setDiscountPercentVal(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200/70 rounded-xl font-mono text-center text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Preset % buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[5, 10, 15, 20, 25, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountPercentVal(pct)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          discountPercentVal === pct
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Nominal Potongan:</span>
                    <span className="font-mono font-bold text-blue-700">{formatRupiah(discountNominalVal)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={discountNominalVal || ''}
                      onChange={(e) => setDiscountNominalVal(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/70 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Preset Nominal buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[2000, 5000, 10000, 15000, 20000, 50000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDiscountNominalVal(val)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          discountNominalVal === val
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                        }`}
                      >
                        {formatRupiah(val)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Discount Summary Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Harga Normal:</span>
                  <span className="font-mono font-bold text-slate-800">{formatRupiah(discountBaseAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Potongan Diskon:</span>
                  <span className="font-mono text-sm">- {formatRupiah(calculatedDiscountAmount)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-blue-200 text-slate-900">
                  <span className="font-bold">Total Setelah Diskon:</span>
                  <span className="text-xl font-mono font-bold text-blue-900">
                    {formatRupiah(finalAmountAfterDiscount)}
                  </span>
                </div>
              </div>

              {/* Apply Discount to Cart Action */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onApplyDiscount(0);
                    onClose();
                  }}
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Reset / Hapus Diskon
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onApplyDiscount(calculatedDiscountAmount);
                    onClose();
                  }}
                  disabled={calculatedDiscountAmount < 0}
                  className="py-3 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pasang Diskon</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
