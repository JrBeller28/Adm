import React from 'react';
import { AlertTriangle, X, PackagePlus, Layers, ArrowRight } from 'lucide-react';
import { BulkStockItem, PackagedProduct } from '../types';
import { formatRupiah } from '../utils/formatters';

interface LowStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  bulkStocks: BulkStockItem[];
  packagedProducts: PackagedProduct[];
  onStartRepack: (bulkId: string) => void;
  onOpenBulkView: () => void;
}

export const LowStockModal: React.FC<LowStockModalProps> = ({
  isOpen,
  onClose,
  bulkStocks,
  packagedProducts,
  onStartRepack,
  onOpenBulkView,
}) => {
  if (!isOpen) return null;

  const lowBulkStocks = bulkStocks.filter((b) => b.stockBals <= b.minStockBalAlert);
  const lowPackaged = packagedProducts.filter((p) => p.stockPacks <= p.minStockAlert);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200/60">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-200 animate-bounce" />
            <h3 className="font-bold text-sm">Peringatan Inventaris: Stok Menipis</h3>
          </div>
          <button
            onClick={onClose}
            className="text-red-200 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Low Bal Stocks */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-red-500" />
                <span>Stok Karung & Sak Menipis ({lowBulkStocks.length} Varian)</span>
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onOpenBulkView();
                }}
                className="text-[11px] text-amber-600 font-semibold hover:underline"
              >
                Lihat Semua Karung & Sak &rarr;
              </button>
            </div>

            {lowBulkStocks.length === 0 ? (
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-medium border border-emerald-200">
                Semua stok bal-balan mentah dalam kondisi aman.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200/60 rounded-xl overflow-hidden">
                {lowBulkStocks.map((b) => (
                  <div key={b.id} className="p-3 bg-red-50/50 hover:bg-red-50 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{b.name}</div>
                      <div className="text-[10px] text-slate-500">
                        Supplier: {b.supplier} • Bal @ {b.weightPerBalKg} Kg
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-red-600">
                        Tersisa {b.stockBals} Bal
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Batas alert: &le;{b.minStockBalAlert} Bal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Low Packaged Stocks */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <PackagePlus className="w-4 h-4 text-amber-500" />
                <span>Stok Kemasan Menipis ({lowPackaged.length} Varian)</span>
              </h4>
            </div>

            {lowPackaged.length === 0 ? (
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-medium border border-emerald-200">
                Semua stok kemasan siap jual dalam kondisi aman.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200/60 rounded-xl overflow-hidden">
                {lowPackaged.map((p) => (
                  <div key={p.id} className="p-3 bg-amber-50/40 hover:bg-amber-50 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {p.packageLabel} • Harga: {formatRupiah(p.sellingPrice)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-red-600">
                          Sisa {p.stockPacks} pack
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Min: {p.minStockAlert}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onStartRepack(p.bulkStockId);
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>Pecah Bal</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
