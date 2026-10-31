import React, { useState } from 'react';
import { Barcode, Printer, Check, Copy, Sparkles, SlidersHorizontal } from 'lucide-react';
import { PackagedProduct, StoreSettings } from '../types';
import { formatRupiah, getPackageBadgeInfo } from '../utils/formatters';

interface BarcodeLabelsViewProps {
  products: PackagedProduct[];
  settings: StoreSettings;
  preSelectedProduct?: PackagedProduct | null;
}

export const BarcodeLabelsView: React.FC<BarcodeLabelsViewProps> = ({
  products,
  settings,
  preSelectedProduct,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preSelectedProduct?.id || products[0]?.id || ''
  );
  const [labelCopies, setLabelCopies] = useState<number>(8);

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handlePrintLabels = () => {
    window.print();
  };

  // Generate simple Code 128 / EAN style visual barcode lines
  const renderBarcodeLines = (code: string) => {
    // Generate deterministic bar widths based on code characters
    const bars: { width: number; isBlack: boolean }[] = [];
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = ((hash << 5) - hash) + code.charCodeAt(i);
    }
    let seed = Math.abs(hash);

    for (let i = 0; i < 48; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const width = (seed % 3) + 1; // 1 to 3px
      const isBlack = i % 2 === 0;
      bars.push({ width, isBlack });
    }

    return (
      <div className="flex items-center justify-center h-10 overflow-hidden px-1">
        {bars.map((bar, idx) => (
          <div
            key={idx}
            style={{ width: `${bar.width * 1.5}px` }}
            className={`h-full ${bar.isBlack ? 'bg-black' : 'bg-white'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Barcode className="w-5 h-5 text-amber-500" />
            <span>Cetak Label Barcode Stiker Kemasan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cetak stiker barcode untuk ditempel pada plastik kemasan (10k, 5k, 500g) agar bisa di-scan kasir.
          </p>
        </div>

        <button
          onClick={handlePrintLabels}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak {labelCopies} Label Sekarang</span>
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pilih Produk Kemasan:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatRupiah(p.sellingPrice)}) — {p.barcode}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Jumlah Label Dicetak:
          </label>
          <div className="flex items-center gap-2">
            {[4, 8, 12, 24].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setLabelCopies(cnt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  labelCopies === cnt
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cnt} Lembar
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="100"
              value={labelCopies}
              onChange={(e) => setLabelCopies(parseInt(e.target.value) || 1)}
              className="w-20 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-center"
            />
          </div>
        </div>
      </div>

      {/* Printable Sheet Preview */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200/60">
        <div className="text-xs font-semibold text-slate-500 mb-3 flex items-center justify-between">
          <span>Pratinjau Lembar Label Stiker (Grid):</span>
          <span className="text-[11px] text-slate-400">Siap print di kertas stiker HVS / Thermal</span>
        </div>

        {activeProduct && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2 bg-white rounded-xl border border-slate-300 shadow-inner">
            {Array.from({ length: labelCopies }).map((_, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border-2 border-slate-300 rounded-lg text-center font-sans space-y-1 shadow-2xs hover:border-amber-400 transition-colors"
              >
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate">
                  {settings.storeName}
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {activeProduct.snackName}
                </div>
                <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                  {activeProduct.packageLabel} ({activeProduct.weightGram}g)
                </div>

                {/* Barcode Graphic */}
                <div className="py-1">
                  {renderBarcodeLines(activeProduct.barcode)}
                  <div className="font-mono text-[11px] font-bold tracking-widest text-slate-800 mt-0.5">
                    {activeProduct.barcode}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-950 font-mono pt-0.5 border-t border-dashed border-slate-200/60">
                  {formatRupiah(activeProduct.sellingPrice)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
