import React, { useState } from 'react';
import { 
  Home,
  ShoppingBag, 
  Layers, 
  Boxes, 
  PackagePlus, 
  PackageCheck, 
  Barcode, 
  Scan, 
  CalendarDays, 
  X,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenScanner: () => void;
  lowStockCount?: number;
  lowBulkCount?: number;
  lowPackagedCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
  lowStockCount = 0,
  lowBulkCount = 0,
  lowPackagedCount = 0,
}) => {
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'pos' | 'inventory'>('none');

  const totalLowStock = lowBulkCount + lowPackagedCount || lowStockCount;

  const isHomeActive = activeTab === 'dashboard' || activeTab === 'analytics';
  const isInventoryActive = activeTab === 'stock-bal' || activeTab === 'stock-packaged' || activeTab === 'labels';
  const isReportsActive = activeTab === 'reports-daily';
  const isPosActive = activeTab === 'pos' || activeTab === 'repack';

  const handleSelectSubmenu = (tab: ActiveTab) => {
    setActiveTab(tab);
    setActiveDrawer('none');
  };

  return (
    <>
      {/* Backdrop overlay for open menu sheet */}
      {activeDrawer !== 'none' && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-150"
          onClick={() => setActiveDrawer('none')}
        />
      )}

      {/* POPUP SUBMENU SHEET: KASIR & PENJUALAN */}
      {activeDrawer === 'pos' && (
        <div 
          id="mobile-drawer-pos"
          className="md:hidden fixed bottom-20 left-3 right-3 max-w-lg mx-auto z-50 bg-white border border-slate-200/60 rounded-2xl shadow-2xl p-4 text-slate-900 animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  KASIR & PENJUALAN
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Pilih kasir POS atau proses packing bal</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveDrawer('none')}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 mt-3">
            {/* 1. Kasir Penjualan POS */}
            <button
              id="mobile-menu-item-pos"
              onClick={() => handleSelectSubmenu('pos')}
              className={`w-full group flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                activeTab === 'pos'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    activeTab === 'pos'
                      ? 'bg-white text-slate-900 border-transparent shadow-xs'
                      : 'bg-blue-50 text-slate-900 border-blue-100'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${activeTab === 'pos' ? 'text-white' : 'text-slate-900'}`}>
                      Kasir Penjualan POS
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        activeTab === 'pos'
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      F1
                    </span>
                  </div>
                  <p className={`text-[11px] ${activeTab === 'pos' ? 'text-slate-300' : 'text-slate-400'}`}>
                    Input Nota, Barcode & Cetak Struk
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'pos' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* 2. Proses Packing Bal */}
            <button
              id="mobile-menu-item-repack"
              onClick={() => handleSelectSubmenu('repack')}
              className={`w-full group flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                activeTab === 'repack'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    activeTab === 'repack'
                      ? 'bg-white text-slate-900 border-transparent shadow-xs'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}
                >
                  <Layers className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${activeTab === 'repack' ? 'text-white' : 'text-slate-900'}`}>
                      Proses Packing Bal
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        activeTab === 'repack'
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      F2
                    </span>
                  </div>
                  <p className={`text-[11px] ${activeTab === 'repack' ? 'text-slate-300' : 'text-slate-400'}`}>
                    Konversi Bal Mentah ke Kemasan Siap Jual
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'repack' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>
      )}

      {/* POPUP SUBMENU SHEET: INVENTARIS & GUDANG */}
      {activeDrawer === 'inventory' && (
        <div 
          id="mobile-drawer-inventory"
          className="md:hidden fixed bottom-20 left-3 right-3 max-w-lg mx-auto z-50 bg-white border border-slate-200/60 rounded-2xl shadow-2xl p-4 text-slate-900 animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  INVENTARIS & GUDANG
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Pilih inventaris bahan atau produk etalase</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveDrawer('none')}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 mt-3">
            {/* 1. Stok Bal-balan */}
            <button
              id="mobile-menu-item-stock-bal"
              onClick={() => handleSelectSubmenu('stock-bal')}
              className={`w-full group flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                activeTab === 'stock-bal'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    activeTab === 'stock-bal'
                      ? 'bg-white text-slate-900 border-transparent shadow-xs'
                      : 'bg-sky-50 text-sky-600 border-sky-100'
                  }`}
                >
                  <PackagePlus className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${activeTab === 'stock-bal' ? 'text-white' : 'text-slate-900'}`}>
                      Stok Bal-balan (Kulakan)
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        activeTab === 'stock-bal'
                          ? 'bg-white/20 text-white'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      F3
                    </span>
                  </div>
                  <p className={`text-[11px] ${activeTab === 'stock-bal' ? 'text-slate-300' : 'text-slate-400'}`}>
                    Bahan Baku Kulakan dari Supplier
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'stock-bal' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* 2. Stok Kemasan Siap Jual */}
            <button
              id="mobile-menu-item-stock-packaged"
              onClick={() => handleSelectSubmenu('stock-packaged')}
              className={`w-full group flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                activeTab === 'stock-packaged'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    activeTab === 'stock-packaged'
                      ? 'bg-white text-slate-900 border-transparent shadow-xs'
                      : 'bg-violet-50 text-violet-600 border-violet-100'
                  }`}
                >
                  <PackageCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${activeTab === 'stock-packaged' ? 'text-white' : 'text-slate-900'}`}>
                      Stok Kemasan Siap Jual
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        activeTab === 'stock-packaged'
                          ? 'bg-white/20 text-white'
                          : 'bg-violet-50 text-violet-700 border border-violet-200'
                      }`}
                    >
                      F4
                    </span>
                  </div>
                  <p className={`text-[11px] ${activeTab === 'stock-packaged' ? 'text-slate-300' : 'text-slate-400'}`}>
                    Produk Ritel Etalase Siap Jual
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'stock-packaged' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* 3. Cetak Label Barcode */}
            <button
              id="mobile-menu-item-labels"
              onClick={() => handleSelectSubmenu('labels')}
              className={`w-full group flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                activeTab === 'labels'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                  : 'bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    activeTab === 'labels'
                      ? 'bg-white text-slate-900 border-transparent shadow-xs'
                      : 'bg-teal-50 text-teal-600 border-teal-100'
                  }`}
                >
                  <Barcode className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${activeTab === 'labels' ? 'text-white' : 'text-slate-900'}`}>
                      Cetak Label Barcode
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        activeTab === 'labels'
                          ? 'bg-white/20 text-white'
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}
                    >
                      F7
                    </span>
                  </div>
                  <p className={`text-[11px] ${activeTab === 'labels' ? 'text-slate-300' : 'text-slate-400'}`}>
                    Format Stiker Barcode & Harga Ritel
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'labels' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Modern Light Clean Bottom Navigation Bar (5 Icons: HOME - GUDANG - SCAN - LAPORAN - KASIR) */}
      <nav 
        id="mobile-bottom-bar"
        aria-label="Navigasi Utama Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] px-1.5 py-1"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-end relative">
          
          {/* 1. HOME */}
          <button
            id="mobile-nav-home"
            onClick={() => { setActiveDrawer('none'); setActiveTab('dashboard'); }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative group cursor-pointer ${
              isHomeActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Dashboard Utama & Ringkasan Hari Ini"
          >
            <div 
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isHomeActive
                  ? 'bg-blue-50 text-slate-900 border border-blue-200 shadow-xs scale-105'
                  : 'text-slate-400'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className={`text-[9px] font-bold tracking-tight mt-0.5 truncate max-w-[65px] ${
              isHomeActive ? 'text-slate-900' : 'text-slate-500'
            }`}>
              HOME
            </span>
          </button>

          {/* 2. INVENTARIS & GUDANG */}
          <button
            id="mobile-nav-inventory"
            onClick={() => setActiveDrawer(activeDrawer === 'inventory' ? 'none' : 'inventory')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative group cursor-pointer ${
              isInventoryActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Menu Inventaris & Gudang"
          >
            <div 
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 relative ${
                isInventoryActive
                  ? 'bg-blue-50 text-slate-900 border border-blue-200 shadow-xs scale-105'
                  : 'text-slate-400'
              }`}
            >
              <Boxes className="w-5 h-5 stroke-[2.2]" />
              {totalLowStock > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                  {totalLowStock > 9 ? '9+' : totalLowStock}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-bold tracking-tight mt-0.5 truncate max-w-[65px] ${
              isInventoryActive ? 'text-slate-900' : 'text-slate-500'
            }`}>
              GUDANG
            </span>
          </button>

          {/* 3. SCAN BARCODE (Elevated Center Action Button matching mobile mockup) */}
          <button
            id="mobile-nav-scanner"
            onClick={() => { setActiveDrawer('none'); onOpenScanner(); }}
            className="flex flex-col items-center justify-center -mt-3.5 relative group cursor-pointer"
            title="Buka Scanner Barcode Kamera"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/35 ring-4 ring-white active:scale-95 transition-all">
              <Scan className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-bold text-slate-900 tracking-tight mt-0.5">
              SCAN
            </span>
          </button>

          {/* 4. LAPORAN & BISNIS */}
          <button
            id="mobile-nav-reports"
            onClick={() => { setActiveDrawer('none'); setActiveTab('reports-daily'); }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative group cursor-pointer ${
              isReportsActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Laporan Harian (F5)"
          >
            <div 
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isReportsActive
                  ? 'bg-blue-50 text-slate-900 border border-blue-200 shadow-xs scale-105'
                  : 'text-slate-400'
              }`}
            >
              <CalendarDays className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className={`text-[9px] font-bold tracking-tight mt-0.5 truncate max-w-[65px] ${
              isReportsActive ? 'text-slate-900' : 'text-slate-500'
            }`}>
              LAPORAN
            </span>
          </button>

          {/* 5. KASIR & PENJUALAN */}
          <button
            id="mobile-nav-pos"
            onClick={() => setActiveDrawer(activeDrawer === 'pos' ? 'none' : 'pos')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative group cursor-pointer ${
              isPosActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Menu Kasir & Penjualan"
          >
            <div 
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isPosActive
                  ? 'bg-blue-50 text-slate-900 border border-blue-200 shadow-xs scale-105'
                  : 'text-slate-400'
              }`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className={`text-[9px] font-bold tracking-tight mt-0.5 truncate max-w-[65px] ${
              isPosActive ? 'text-slate-900' : 'text-slate-500'
            }`}>
              KASIR
            </span>
          </button>

        </div>
      </nav>
    </>
  );
};
