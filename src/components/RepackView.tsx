import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Package, 
  Scale, 
  Sparkles, 
  History, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { BulkStockItem, PackagedProduct, RepackRecord, TargetPackageResult } from '../types';
import { formatNumber, formatDateTimeIndo } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface RepackViewProps {
  bulkStocks: BulkStockItem[];
  packagedProducts: PackagedProduct[];
  repackHistory: RepackRecord[];
  onExecuteRepack: (
    bulkStockId: string,
    balsUsed: number,
    results: TargetPackageResult[],
    operator: string,
    notes: string
  ) => void;
}

export const RepackView: React.FC<RepackViewProps> = ({
  bulkStocks,
  packagedProducts,
  repackHistory,
  onExecuteRepack,
}) => {
  const [selectedBulkId, setSelectedBulkId] = useState<string>(bulkStocks[0]?.id || '');
  const [balsToUse, setBalsToUse] = useState<number>(1);
  const [operator, setOperator] = useState<string>('Rian (Bagian Packing)');
  const [notes, setNotes] = useState<string>('');

  // Target packages state: key = packageId, value = qtyProduced
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedBulk = bulkStocks.find((b) => b.id === selectedBulkId);
  const relevantPackages = packagedProducts.filter(
    (p) => p.bulkStockId === selectedBulkId
  );

  const handleQtyChange = (packageId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [packageId]: Math.max(0, val || 0),
    }));
  };

  // Calculate estimated total weight
  const totalInputGram = (selectedBulk ? selectedBulk.weightPerBalKg * 1000 : 0) * balsToUse;
  
  let totalOutputGram = 0;
  relevantPackages.forEach((pkg) => {
    const qty = quantities[pkg.id] || 0;
    totalOutputGram += qty * pkg.weightGram;
  });

  const weightDifference = totalInputGram - totalOutputGram;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBulk) return;

    if (selectedBulk.stockBals < balsToUse) {
      alert(`Stok bal tidak mencukupi! Tersedia: ${selectedBulk.stockBals} bal.`);
      return;
    }

    if (balsToUse <= 0) {
      alert('Jumlah bal yang dipecah harus lebih dari 0.');
      return;
    }

    const results: TargetPackageResult[] = [];
    relevantPackages.forEach((pkg) => {
      const qty = quantities[pkg.id] || 0;
      if (qty > 0) {
        results.push({
          packageId: pkg.id,
          packageType: pkg.packageType,
          packageLabel: pkg.packageLabel,
          qtyProduced: qty,
        });
      }
    });

    if (results.length === 0) {
      alert('Masukkan minimal 1 hasil kemasan yang diproduksi!');
      return;
    }

    onExecuteRepack(selectedBulkId, balsToUse, results, operator, notes);

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    setSuccessMessage(
      `Sukses! ${balsToUse} bal "${selectedBulk.name}" berhasil dipecah menjadi ${results.reduce((a, b) => a + b.qtyProduced, 0)} bungkus kemasan baru.`
    );

    // Reset quantities
    setQuantities({});
    setNotes('');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Explainer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        <div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500">
            Operasional Gudang
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            Proses Packing Bal (Pecah ke Aneka Kemasan) 📦
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Konversi otomatis: memotong stok bal-balan mentah dan instan menambah persediaan kemasan siap jual di Kasir POS.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-slate-100 border border-slate-300/80 text-blue-700 text-xs font-bold self-start sm:self-center">
          Stok Bal ➔ Stok Ritel Otomatis
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Form Packing on Left, History & Analytics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/60 shadow-xs p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Select Bal */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Pilih Bahan Bal yang Akan Di-Packing:
              </label>
              <select
                value={selectedBulkId}
                onChange={(e) => {
                  setSelectedBulkId(e.target.value);
                  setQuantities({});
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
              >
                {bulkStocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — (Sisa: {b.stockBals} Bal @ {b.weightPerBalKg} Kg)
                  </option>
                ))}
              </select>

              {selectedBulk && (
                <div className="mt-2.5 p-3 bg-slate-100/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-900" />
                    <span>Sisa Stok Fisik: <strong>{selectedBulk.stockBals} Bal</strong></span>
                  </div>
                  <span>Berat per Bal: <strong>{selectedBulk.weightPerBalKg} Kg ({selectedBulk.weightPerBalKg * 1000} g)</strong></span>
                </div>
              )}
            </div>

            {/* Step 2: Number of bals to unpack */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Jumlah Bal yang Dibuka / Dipecah:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max={selectedBulk ? selectedBulk.stockBals : 10}
                  value={balsToUse}
                  onChange={(e) => setBalsToUse(parseInt(e.target.value) || 1)}
                  className="w-28 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-2xl text-sm font-bold text-slate-900 text-center focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white font-mono"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Bal (= <strong>{(selectedBulk?.weightPerBalKg || 5) * balsToUse * 1000} gram</strong> bahan mentah)
                </span>
              </div>
            </div>

            {/* Step 3: Target Output Quantities */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Masukkan Hasil Kemasan yang Jadi:
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Otomatis masuk ke stok kemasan
                </span>
              </div>

              <div className="space-y-2.5">
                {relevantPackages.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200/60">
                    Belum ada jenis kemasan untuk produk ini.
                  </div>
                ) : (
                  relevantPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {pkg.packageLabel} ({pkg.weightGram} g)
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>Stok saat ini: {pkg.stockPacks} pack</span>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-slate-400">{pkg.barcode}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Hasil:</span>
                        <input
                          type="number"
                          min="0"
                          value={quantities[pkg.id] || ''}
                          placeholder="0"
                          onChange={(e) => handleQtyChange(pkg.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-xl text-xs font-bold text-slate-900 text-center focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-mono"
                        />
                        <span className="text-xs text-slate-600 font-medium">bungkus</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Weight reconciliation helper */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-slate-900" />
                  <span>Kalkulasi Timbangan:</span>
                </span>
                <span>
                  Total Bahan: <strong>{formatNumber(totalInputGram)} g</strong>
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Terkemas: <strong>{formatNumber(totalOutputGram)} g</strong></span>
                <span className={weightDifference < 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                  Selisih/Susut: {formatNumber(weightDifference)} g
                </span>
              </div>
            </div>

            {/* Operator and Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Petugas Packing:
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Catatan / Keterangan (Opsional):
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Plastik sealer tebal 0.8"
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Simpan & Tambah ke Stok Kemasan Otomatis</span>
            </button>
          </form>
        </div>

        {/* Right Column: History & Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Flow Illustration */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-900" />
              <span>Alur Kerja Toko Snack</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <p><strong>Kulakan Bal:</strong> Masuk gudang sebagai stok bal-balan (5kg/4kg).</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <p><strong>Repacking / Pecah Bal:</strong> Petugas menimbang & mengemas ke 10k, 5k, 500g.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <p><strong>Stok Otomatis:</strong> Stok bal berkurang, stok kemasan siap jual langsung bertambah di Kasir!</p>
              </div>
            </div>
          </div>

          {/* Recent Repack Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200/60 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Riwayat Repacking Terbaru
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {repackHistory.length} catatan
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {repackHistory.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Belum ada riwayat repacking.
                </div>
              ) : (
                repackHistory.map((rec) => (
                  <div key={rec.id} className="p-3.5 text-xs space-y-1 hover:bg-slate-50/80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rec.bulkName}</span>
                      <span className="text-[10px] text-slate-400">
                        {formatDateTimeIndo(rec.timestamp)}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Dipecah: <strong className="text-blue-700">{rec.balsUsed} Bal</strong> oleh {rec.operator}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.results.map((res, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-blue-700 border border-blue-100 font-medium text-[10px]"
                        >
                          +{res.qtyProduced} {res.packageLabel}
                        </span>
                      ))}
                    </div>
                    {rec.notes && (
                      <div className="text-[10px] text-slate-400 italic mt-0.5">
                        "{rec.notes}"
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
