import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  Layers, 
  Truck, 
  Plus, 
  Filter, 
  X, 
  CheckCircle2, 
  Coins, 
  ArrowRight,
  Sparkles,
  Package,
  ArrowUpRight,
  TrendingDown,
  Scale
} from 'lucide-react';
import { BulkStockItem } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface BulkStockViewProps {
  bulkStocks: BulkStockItem[];
  onAddBulkStock: (item: Omit<BulkStockItem, 'id'>) => void;
  onRestockBulk: (bulkId: string, additionalBals: number, costPerBal: number) => void;
  onStartRepack: (bulkId: string) => void;
}

export const BulkStockView: React.FC<BulkStockViewProps> = ({
  bulkStocks,
  onAddBulkStock,
  onRestockBulk,
  onStartRepack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockTarget, setRestockTarget] = useState<BulkStockItem | null>(null);
  const [additionalBals, setAdditionalBals] = useState<number>(5);
  const [costPerBalInput, setCostPerBalInput] = useState<number>(0);

  // New bulk form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Pedas & Gurih');
  const [newWeightKg, setNewWeightKg] = useState(5);
  const [newStockBals, setNewStockBals] = useState(5);
  const [newMinAlert, setNewMinAlert] = useState(3);
  const [newCost, setNewCost] = useState(130000);
  const [newSupplier, setNewSupplier] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const categories = ['ALL', ...Array.from(new Set(bulkStocks.map((b) => b.category)))];

  const filteredStocks = bulkStocks.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesLow = !filterLowStockOnly || b.stockBals <= b.minStockBalAlert;
    return matchesSearch && matchesCat && matchesLow;
  });

  const totalBals = bulkStocks.reduce((sum, b) => sum + b.stockBals, 0);
  const totalWeightKg = bulkStocks.reduce((sum, b) => sum + b.stockBals * b.weightPerBalKg, 0);
  const totalValuation = bulkStocks.reduce((sum, b) => sum + b.stockBals * b.costPerBal, 0);
  const lowStockBalsCount = bulkStocks.filter((b) => b.stockBals <= b.minStockBalAlert).length;

  const handleOpenRestock = (item: BulkStockItem) => {
    setRestockTarget(item);
    setAdditionalBals(5);
    setCostPerBalInput(item.costPerBal);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockTarget) return;
    onRestockBulk(restockTarget.id, additionalBals, costPerBalInput);
    setRestockTarget(null);
  };

  const handleCreateNewBulk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddBulkStock({
      name: newName.trim(),
      category: newCategory,
      weightPerBalKg: newWeightKg,
      stockBals: newStockBals,
      minStockBalAlert: newMinAlert,
      costPerBal: newCost,
      supplier: newSupplier || 'Grosir Sentra Snack',
      lastRestockDate: new Date().toISOString().slice(0, 10),
      notes: newNotes,
    });

    setShowAddModal(false);
    setNewName('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome & Section Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        <div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500">
            Inventaris & Manajemen Bahan
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            Stok Bal-balan (Gudang Kulakan) 📦
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring bahan baku mentah supplier dan persiapan repacking kemasan ritel.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Tambah Stok Bal Baru</span>
        </button>
      </div>

      {/* 4 STAT METRIC CARDS (Consistent with Laptop Dashboard Mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Total Stok Bal */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Boxes className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              ~{totalWeightKg} Kg
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Total Fisik Bal
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {totalBals} <span className="text-xs sm:text-sm font-bold text-slate-500">Bal</span>
            </div>
          </div>
        </div>

        {/* Card 2: Nilai Modal (HPP) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              HPP Bal
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Nilai Modal Bahan
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {formatRupiah(totalValuation)}
            </div>
          </div>
        </div>

        {/* Card 3: Varian Bahan Baku */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Siap Repack
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Varian Bahan Baku
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {bulkStocks.length} <span className="text-xs sm:text-sm font-bold text-slate-500">Jenis</span>
            </div>
          </div>
        </div>

        {/* Card 4: Status Peringatan Stok */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold ${
              lowStockBalsCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] ${lowStockBalsCount > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <span className={`inline-flex items-center text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
              lowStockBalsCount > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
            }`}>
              {lowStockBalsCount > 0 ? 'Perlu Kulakan' : 'Stok Aman'}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Stok Bal Menipis
            </div>
            <div className={`text-base sm:text-xl lg:text-2xl font-bold font-mono tracking-tight mt-0.5 ${
              lowStockBalsCount > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {lowStockBalsCount} <span className="text-xs sm:text-sm font-bold text-slate-500">Varian</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bahan bal atau supplier..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium text-slate-900 transition-all"
          />
        </div>

        {/* Category Pills & Low Stock Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua Kategori' : cat}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterLowStockOnly
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Stok Tipis</span>
          </button>
        </div>
      </div>

      {/* Bulk Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200/60">
            Tidak ada data stok bal yang sesuai pencarian.
          </div>
        ) : (
          filteredStocks.map((item) => {
            const isLowStock = item.stockBals <= item.minStockBalAlert;
            const stockPct = Math.min(100, Math.round((item.stockBals / (item.minStockBalAlert * 3)) * 100));

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-[11px] font-bold">
                      {item.category}
                    </span>

                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Tipis (Min: {item.minStockBalAlert})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Stok Aman
                      </span>
                    )}
                  </div>

                  {/* Name & Weight */}
                  <h3 className="font-bold text-base text-slate-900 tracking-tight">
                    {item.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{item.weightPerBalKg} Kg / Bal</span>
                    <span>•</span>
                    <span>Supplier: {item.supplier}</span>
                  </div>

                  {/* Stock Quantity Gauge */}
                  <div className="mt-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-slate-500">Sisa Persediaan:</span>
                      <div className="font-mono text-xl font-bold text-slate-900">
                        {item.stockBals} <span className="text-xs font-semibold text-slate-500">Bal</span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden relative">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                            isLowStock ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(5, stockPct)}%` }}
                        />
                      </div>
                      {!isLowStock && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      )}
                      {isLowStock && (
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
                      <span>Total: ~{item.stockBals * item.weightPerBalKg} Kg</span>
                      <span>HPP: {formatRupiah(item.costPerBal)} / bal</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions matching mockup buttons */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-200/60">
                  <button
                    onClick={() => onStartRepack(item.id)}
                    className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Packing Bal</span>
                  </button>

                  <button
                    onClick={() => handleOpenRestock(item)}
                    className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Kulakan / Restock</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Restock / Kulakan Bal Tambahan */}
      {restockTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200/60 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Kulakan Stok: {restockTarget.name}</span>
              </h3>
              <button
                onClick={() => setRestockTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jumlah Tambahan Bal Masuk:
                </label>
                <input
                  type="number"
                  min="1"
                  value={additionalBals}
                  onChange={(e) => setAdditionalBals(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Beli / HPP Per Bal (Rp):
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={costPerBalInput}
                  onChange={(e) => setCostPerBalInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Total Tambahan Berat:</span>
                  <span className="font-bold">{additionalBals * restockTarget.weightPerBalKg} Kg</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Biaya Kulakan:</span>
                  <span className="font-bold text-blue-700 font-mono">
                    {formatRupiah(additionalBals * costPerBalInput)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200/60 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25"
                >
                  Simpan Stok Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Varian Bal Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200/60 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Tambah Bahan Baku Bal Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBulk} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Snack / Bahan Bal:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Makaroni Bantet Super Pedas"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Pedas & Gurih">Pedas & Gurih</option>
                    <option value="Keripik & Kerupuk">Keripik & Kerupuk</option>
                    <option value="Manis & Asin">Manis & Asin</option>
                    <option value="Biskuit & Pastry">Biskuit & Pastry</option>
                    <option value="Kacang & Biji">Kacang & Biji</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Berat Per Bal (Kg):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={newWeightKg}
                    onChange={(e) => setNewWeightKg(parseFloat(e.target.value) || 5)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stok Awal Bal:</label>
                  <input
                    type="number"
                    min="0"
                    value={newStockBals}
                    onChange={(e) => setNewStockBals(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alert Stok Minimum:</label>
                  <input
                    type="number"
                    min="1"
                    value={newMinAlert}
                    onChange={(e) => setNewMinAlert(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HPP Beli Per Bal (Rp):</label>
                  <input
                    type="number"
                    step="1000"
                    value={newCost}
                    onChange={(e) => setNewCost(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Supplier:</label>
                  <input
                    type="text"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    placeholder="Grosir Sentra Snack"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200/60 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25"
                >
                  Tambah Varian Bal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
