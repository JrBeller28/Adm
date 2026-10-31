import React, { useState } from 'react';
import { 
  PackageCheck, 
  Search, 
  AlertTriangle, 
  Plus, 
  Barcode, 
  Edit3, 
  Layers, 
  Tag, 
  X, 
  TrendingUp, 
  Coins, 
  Package,
  CheckCircle2,
  Percent,
  Sparkles,
  Camera
} from 'lucide-react';
import { PackagedProduct, BulkStockItem, PackageType } from '../types';
import { formatRupiah, getPackageBadgeInfo } from '../utils/formatters';

interface PackagedStockViewProps {
  products: PackagedProduct[];
  bulkStocks: BulkStockItem[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onAddProduct: (product: Omit<PackagedProduct, 'id'>) => void;
  onOpenLabelModal: (product: PackagedProduct) => void;
  onStartRepack: (bulkId: string) => void;
  onOpenPhotoModal?: (product: PackagedProduct) => void;
}

export const PackagedStockView: React.FC<PackagedStockViewProps> = ({
  products,
  bulkStocks,
  onUpdateProductStock,
  onAddProduct,
  onOpenLabelModal,
  onStartRepack,
  onOpenPhotoModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStockTarget, setEditStockTarget] = useState<PackagedProduct | null>(null);
  const [manualStockInput, setManualStockInput] = useState<number>(0);

  // New product form
  const [newBulkId, setNewBulkId] = useState(bulkStocks[0]?.id || '');
  const [newPackageType, setNewPackageType] = useState<PackageType>('KEMASAN_10K');
  const [newWeightGram, setNewWeightGram] = useState(180);
  const [newInitialStock, setNewInitialStock] = useState(0);
  const [newMinAlert, setNewMinAlert] = useState(15);
  const [newCostPrice, setNewCostPrice] = useState(5500);
  const [newSellingPrice, setNewSellingPrice] = useState(10000);
  const [newBarcode, setNewBarcode] = useState('');

  const packageTypeFilters = [
    { id: 'ALL', label: 'Semua Kemasan' },
    { id: 'KEMASAN_10K', label: 'Kemasan 10 Ribu' },
    { id: 'KEMASAN_5K', label: 'Kemasan 5 Ribu' },
    { id: 'KEMASAN_500G', label: 'Setengah Kilo (500g)' },
    { id: 'KEMASAN_250G', label: '250 Gram' },
    { id: 'BAL', label: 'Bal Utuh' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.snackName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || p.packageType === selectedType;
    const matchesLow = !filterLowStockOnly || p.stockPacks <= p.minStockAlert;
    return matchesSearch && matchesType && matchesLow;
  });

  const totalPacks = products.reduce((sum, p) => sum + p.stockPacks, 0);
  const totalRetailValue = products.reduce((sum, p) => sum + p.stockPacks * p.sellingPrice, 0);
  const totalCostValue = products.reduce((sum, p) => sum + p.stockPacks * p.costPrice, 0);
  const lowStockPacksCount = products.filter((p) => p.stockPacks <= p.minStockAlert).length;

  const handleOpenEditStock = (prod: PackagedProduct) => {
    setEditStockTarget(prod);
    setManualStockInput(prod.stockPacks);
  };

  const handleSaveStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStockTarget) return;
    onUpdateProductStock(editStockTarget.id, manualStockInput);
    setEditStockTarget(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const bulk = bulkStocks.find((b) => b.id === newBulkId);
    if (!bulk) return;

    let packageLabel = 'Kemasan Khusus';
    if (newPackageType === 'KEMASAN_10K') packageLabel = 'Kemasan 10 Ribuan';
    else if (newPackageType === 'KEMASAN_5K') packageLabel = 'Kemasan 5 Ribuan';
    else if (newPackageType === 'KEMASAN_500G') packageLabel = 'Kemasan 500 Gram';
    else if (newPackageType === 'KEMASAN_250G') packageLabel = 'Kemasan 250 Gram';

    const generatedBarcode = newBarcode.trim() || `899${Math.floor(100000000 + Math.random() * 900000000)}`;

    onAddProduct({
      bulkStockId: bulk.id,
      name: `${bulk.name} (${packageLabel})`,
      snackName: bulk.name,
      packageType: newPackageType,
      packageLabel,
      weightGram: newWeightGram,
      costPrice: newCostPrice,
      sellingPrice: newSellingPrice,
      stockPacks: newInitialStock,
      minStockAlert: newMinAlert,
      barcode: generatedBarcode,
      category: bulk.category,
    });

    setShowAddModal(false);
    setNewBarcode('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome & Section Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/60 shadow-xs">
        <div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500">
            Inventaris Siap Jual
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            Stok Kemasan & Etalase Ritel ✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring stok etalase, barcode produk, penetapan harga jual, dan margin keuntungan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Tambah Kemasan Baru</span>
        </button>
      </div>

      {/* 4 STAT METRIC CARDS (Consistent with Laptop Dashboard Mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Total Pack Siap Jual */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <PackageCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {products.length} Varian
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Total Pack Siap Jual
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {totalPacks} <span className="text-xs sm:text-sm font-bold text-slate-500">Packs</span>
            </div>
          </div>
        </div>

        {/* Card 2: Potensi Omset Ritel */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Harga Jual
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Potensi Omset Ritel
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {formatRupiah(totalRetailValue)}
            </div>
          </div>
        </div>

        {/* Card 3: Nilai Modal HPP */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              HPP Ritel
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Nilai Modal Kemasan
            </div>
            <div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">
              {formatRupiah(totalCostValue)}
            </div>
          </div>
        </div>

        {/* Card 4: Status Peringatan Stok */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold ${
              lowStockPacksCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] ${lowStockPacksCount > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <span className={`inline-flex items-center text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
              lowStockPacksCount > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
            }`}>
              {lowStockPacksCount > 0 ? 'Perlu Repack' : 'Stok Aman'}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Produk Etalase Menipis
            </div>
            <div className={`text-base sm:text-xl lg:text-2xl font-bold font-mono tracking-tight mt-0.5 ${
              lowStockPacksCount > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {lowStockPacksCount} <span className="text-xs sm:text-sm font-bold text-slate-500">Varian</span>
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
            placeholder="Cari produk, kemasan, atau barcode..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium text-slate-900 transition-all"
          />
        </div>

        {/* Category Pills & Low Stock Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {packageTypeFilters.map((flt) => {
              const isActive = selectedType === flt.id;
              return (
                <button
                  key={flt.id}
                  onClick={() => setSelectedType(flt.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {flt.label}
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

      {/* Packaged Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200/60">
            Tidak ada produk kemasan yang sesuai pencarian.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isLowStock = product.stockPacks <= product.minStockAlert;
            const profitPerPack = product.sellingPrice - product.costPrice;
            const marginPct = Math.round((profitPerPack / product.sellingPrice) * 100);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative group">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-7 h-7" />
                        </div>
                      )}
                      {onOpenPhotoModal && (
                        <button
                          type="button"
                          onClick={() => onOpenPhotoModal(product)}
                          className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                          title="Kelola & Ganti Foto Produk"
                        >
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span>Foto</span>
                        </button>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">
                          {product.packageLabel}
                        </span>
                        {isLowStock && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold animate-pulse">
                            Tipis
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Barcode: {product.barcode}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Stock Details */}
                  <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400">Harga Jual:</span>
                        <div className="text-base font-bold text-blue-600 font-mono">
                          {formatRupiah(product.sellingPrice)}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-slate-400">Sisa Stok:</span>
                        <div className={`text-base font-bold font-mono ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                          {product.stockPacks} <span className="text-xs font-semibold text-slate-500">pack</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                      <span>HPP: {formatRupiah(product.costPrice)}</span>
                      <span className="text-emerald-600 font-bold">Laba: +{formatRupiah(profitPerPack)} ({marginPct}%)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-200/60">
                  {onOpenPhotoModal && (
                    <button
                      onClick={() => onOpenPhotoModal(product)}
                      className="py-2 px-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs rounded-xl border border-slate-200/60 flex items-center justify-center gap-1 transition-colors cursor-pointer active:scale-95"
                      title="Kelola & Ganti Foto"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      <span>Foto</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenLabelModal(product)}
                    className="py-2 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center justify-center gap-1 transition-colors cursor-pointer active:scale-95"
                  >
                    <Barcode className="w-3.5 h-3.5" />
                    <span>Label</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditStock(product)}
                    className="py-2 px-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/60 flex items-center justify-center gap-1 transition-colors cursor-pointer active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Stok</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Edit Stok Etalase */}
      {editStockTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200/60 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>Koreksi Stok Etalase</span>
              </h3>
              <button
                onClick={() => setEditStockTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStockAdjustment} className="space-y-4 mt-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  Produk: <span className="text-slate-900 font-bold">{editStockTarget.name}</span>
                </p>
                <label className="block text-xs font-bold text-slate-700 mt-2 mb-1">
                  Jumlah Stok Fisik Sekarang (Pack):
                </label>
                <input
                  type="number"
                  min="0"
                  value={manualStockInput}
                  onChange={(e) => setManualStockInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditStockTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200/60 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Kemasan Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200/60 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Tambah Varian Kemasan Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Bahan Baku Bal:</label>
                <select
                  value={newBulkId}
                  onChange={(e) => setNewBulkId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-900"
                >
                  {bulkStocks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Sisa: {b.stockBals} Bal)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kemasan:</label>
                  <select
                    value={newPackageType}
                    onChange={(e) => setNewPackageType(e.target.value as PackageType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="KEMASAN_10K">Kemasan 10 Ribuan</option>
                    <option value="KEMASAN_5K">Kemasan 5 Ribuan</option>
                    <option value="KEMASAN_500G">Setengah Kilo (500g)</option>
                    <option value="KEMASAN_250G">250 Gram</option>
                    <option value="BAL">Bal Utuh</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Berat Per Kemasan (Gram):</label>
                  <input
                    type="number"
                    value={newWeightGram}
                    onChange={(e) => setNewWeightGram(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HPP Kemasan (Rp):</label>
                  <input
                    type="number"
                    step="500"
                    value={newCostPrice}
                    onChange={(e) => setNewCostPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Jual Ritel (Rp):</label>
                  <input
                    type="number"
                    step="500"
                    value={newSellingPrice}
                    onChange={(e) => setNewSellingPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stok Awal Etalase:</label>
                  <input
                    type="number"
                    value={newInitialStock}
                    onChange={(e) => setNewInitialStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alert Stok Minimum:</label>
                  <input
                    type="number"
                    value={newMinAlert}
                    onChange={(e) => setNewMinAlert(parseInt(e.target.value) || 15)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Barcode Khusus (Opsional):</label>
                <input
                  type="text"
                  value={newBarcode}
                  onChange={(e) => setNewBarcode(e.target.value)}
                  placeholder="Kosongkan untuk buat otomatis (899...)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-mono"
                />
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
                  Buat Kemasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
