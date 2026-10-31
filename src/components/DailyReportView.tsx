import React, { useState } from 'react';
import { 
  CalendarDays, 
  Printer, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  Receipt, 
  Eye, 
  ArrowUpRight, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Coins, 
  PackageCheck, 
  CreditCard,
  Banknote,
  QrCode,
  Search,
  ShoppingBag
} from 'lucide-react';
import { Transaction, PackageType } from '../types';
import { formatRupiah, formatDateTimeIndo } from '../utils/formatters';

interface DailyReportViewProps {
  transactions: Transaction[];
  onOpenReceipt: (transaction: Transaction) => void;
}

export const DailyReportView: React.FC<DailyReportViewProps> = ({
  transactions,
  onOpenReceipt,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [searchInvoice, setSearchInvoice] = useState('');

  // Filter transactions by date range
  const dayTransactions = transactions.filter((t) => {
    const tDate = t.timestamp.substring(0, 10);
    return tDate >= startDate && tDate <= endDate;
  });

  const filteredTransactions = dayTransactions.filter((t) => {
    if (!searchInvoice.trim()) return true;
    const q = searchInvoice.toLowerCase();
    return (
      t.invoiceNumber.toLowerCase().includes(q) ||
      (t.customerName && t.customerName.toLowerCase().includes(q)) ||
      t.cashierName.toLowerCase().includes(q)
    );
  });

  // Aggregate stats
  const totalRevenue = dayTransactions.reduce((s, t) => s + t.totalAmount, 0);
  const totalCost = dayTransactions.reduce((s, t) => s + t.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const totalItemsSold = dayTransactions.reduce(
    (s, t) => s + t.items.reduce((si, item) => si + item.qty, 0),
    0
  );

  // Breakdown by package type / category
  const packageBreakdown: Record<
    PackageType,
    { label: string; qty: number; revenue: number; profit: number }
  > = {
    KEMASAN_10K: { label: 'Kemasan 10 Ribu', qty: 0, revenue: 0, profit: 0 },
    KEMASAN_5K: { label: 'Kemasan 5 Ribu', qty: 0, revenue: 0, profit: 0 },
    KEMASAN_500G: { label: 'Setengah Kilo (500g)', qty: 0, revenue: 0, profit: 0 },
    KEMASAN_250G: { label: '250 Gram', qty: 0, revenue: 0, profit: 0 },
    BAL: { label: 'Bal Utuh (Grosir)', qty: 0, revenue: 0, profit: 0 },
    CUSTOM: { label: 'Menu & Minuman', qty: 0, revenue: 0, profit: 0 },
  };

  dayTransactions.forEach((trx) => {
    trx.items.forEach((item) => {
      const type = item.packageType || 'CUSTOM';
      if (packageBreakdown[type]) {
        packageBreakdown[type].qty += item.qty;
        packageBreakdown[type].revenue += item.subtotal;
        packageBreakdown[type].profit += item.subtotal - item.costPrice * item.qty;
      }
    });
  });

  const cashTotal = dayTransactions
    .filter((t) => t.paymentMethod === 'TUNAI')
    .reduce((s, t) => s + t.totalAmount, 0);

  const qrisTotal = dayTransactions
    .filter((t) => t.paymentMethod === 'QRIS')
    .reduce((s, t) => s + t.totalAmount, 0);

  const transferTotal = dayTransactions
    .filter((t) => t.paymentMethod === 'TRANSFER')
    .reduce((s, t) => s + t.totalAmount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Date Filter & Title Bar matching mockup aesthetic */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        <div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500">
            Rekap Keuangan & Penjualan
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            Laporan Penjualan Harian 📊
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring omset, laba kotor, rincian pembayaran, dan daftar riwayat nota kasir.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => {
              setStartDate(todayStr);
              setEndDate(todayStr);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              startDate === todayStr && endDate === todayStr
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
            }`}
          >
            Hari Ini
          </button>
          <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 shadow-sm shadow-slate-200/20">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value > endDate) setEndDate(e.target.value);
              }}
              className="px-3 py-1.5 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
            <span className="text-slate-400 font-bold px-1 text-xs">-</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4 STAT METRIC CARDS (Consistent with Laptop Dashboard Mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Total Omset */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Omset
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Total Omset Penjualan
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {formatRupiah(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Card 2: Laba Kotor */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {totalRevenue > 0 ? `${Math.round((totalProfit / totalRevenue) * 100)}% Margin` : '0%'}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Estimasi Laba Kotor
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-emerald-600 tracking-tight mt-0.5">
              {formatRupiah(totalProfit)}
            </div>
          </div>
        </div>

        {/* Card 3: Jumlah Nota */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Nota
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Jumlah Transaksi
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {dayTransactions.length} <span className="text-xs sm:text-sm font-bold text-slate-500">Nota</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Item Terjual */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <PackageCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Porsi / Pack
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Total Produk Terjual
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {totalItemsSold} <span className="text-xs sm:text-sm font-bold text-slate-500">Item</span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN BREAKDOWN: Payment Methods & Package Types */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Metode Pembayaran (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Metode Pembayaran</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Rekap Harian</span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Tunai */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Uang Tunai (Cash)</div>
                  <div className="text-[10px] text-slate-400">Pembayaran di meja/kasir</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-sm text-slate-900">
                {formatRupiah(cashTotal)}
              </div>
            </div>

            {/* QRIS */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">QRIS Dinamis</div>
                  <div className="text-[10px] text-slate-400">Scan GoPay, OVO, BCA, dll</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-sm text-slate-900">
                {formatRupiah(qrisTotal)}
              </div>
            </div>

            {/* Transfer */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Transfer Bank</div>
                  <div className="text-[10px] text-slate-400">Rekening BCA / Mandiri</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-sm text-slate-900">
                {formatRupiah(transferTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rincian Omset per Jenis Kemasan / Menu (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Rincian Omset per Jenis Kemasan</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Detail Porsi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {Object.entries(packageBreakdown).map(([key, data]) => {
              if (data.qty === 0 && data.revenue === 0) return null;
              return (
                <div
                  key={key}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">{data.label}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-blue-700 text-[10px] font-mono font-bold">
                      {data.qty} terjual
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-medium">Omset:</span>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {formatRupiah(data.revenue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRANSACTION LIST SECTION */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-600" />
              <span>Riwayat Nota Transaksi ({filteredTransactions.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar seluruh nota penjualan yang tercatat pada tanggal terpilih
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Cari nota / pelanggan..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200/60">
              Tidak ada transaksi pada tanggal ini.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">No. Nota</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Pelanggan / Meja</th>
                  <th className="py-3 px-3">Kasir</th>
                  <th className="py-3 px-3">Metode</th>
                  <th className="py-3 px-3 text-right">Total Belanja</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {trx.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(trx.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {trx.customerName || 'Umum'}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {trx.cashierName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-blue-700 text-[10px] font-bold">
                        {trx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(trx.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onOpenReceipt(trx)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
                        title="Lihat & Cetak Struk"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
