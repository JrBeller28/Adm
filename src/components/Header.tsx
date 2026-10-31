import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Layers, 
  PackageCheck, 
  CalendarDays, 
  BarChart3, 
  AlertTriangle, 
  CloudCheck, 
  Barcode,
  RefreshCw,
  Clock,
  Scan,
  Sparkles,
  ChevronRight,
  Wifi,
  PackagePlus
} from 'lucide-react';
import { ActiveTab, StoreSettings } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lowStockCount: number;
  lowBulkCount: number;
  lowPackagedCount: number;
  onOpenLowStock: () => void;
  onOpenScanner?: () => void;
  settings: StoreSettings;
  isSyncing: boolean;
  onManualSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
  lowBulkCount,
  lowPackagedCount,
  onOpenLowStock,
  onOpenScanner,
  settings,
  isSyncing,
  onManualSync,
}) => {
  // Live clock
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener (F1-F7 or Alt+1-7)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'F1' || (e.altKey && e.key === '1')) {
        e.preventDefault();
        setActiveTab('pos');
      } else if (e.key === 'F2' || (e.altKey && e.key === '2')) {
        e.preventDefault();
        setActiveTab('repack');
      } else if (e.key === 'F3' || (e.altKey && e.key === '3')) {
        e.preventDefault();
        setActiveTab('stock-bal');
      } else if (e.key === 'F4' || (e.altKey && e.key === '4')) {
        e.preventDefault();
        setActiveTab('stock-packaged');
      } else if (e.key === 'F5' || (e.altKey && e.key === '5')) {
        e.preventDefault();
        setActiveTab('reports-daily');
      } else if (e.key === 'F6' || (e.altKey && e.key === '6')) {
        e.preventDefault();
        setActiveTab('analytics');
      } else if (e.key === 'F7' || (e.altKey && e.key === '7')) {
        e.preventDefault();
        setActiveTab('labels');
      } else if (e.key === 'F8' || (e.altKey && e.key === '8')) {
        e.preventDefault();
        onOpenScanner?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, onOpenScanner]);

  const navItems: {
    id: ActiveTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    shortcut: string;
    badgeCount?: number;
    colorScheme: {
      activeBg: string;
      activeText: string;
      activeBorder: string;
      activeIconBg: string;
      inactiveIconBg: string;
      inactiveIconText: string;
    };
  }[] = [
    {
      id: 'pos',
      label: 'Kasir POS',
      sublabel: 'Penjualan & Struk',
      icon: <ShoppingBag className="w-4 h-4" />,
      shortcut: 'F1',
      colorScheme: {
        activeBg: 'bg-amber-500 text-white',
        activeText: 'text-white',
        activeBorder: 'border-amber-600',
        activeIconBg: 'bg-amber-400 text-white',
        inactiveIconBg: 'bg-amber-50 text-amber-600',
        inactiveIconText: 'text-amber-600',
      },
    },
    {
      id: 'repack',
      label: 'Proses Repack Sak',
      sublabel: 'Pecah Karung ke Eceran',
      icon: <Layers className="w-4 h-4" />,
      shortcut: 'F2',
      colorScheme: {
        activeBg: 'bg-amber-500 text-white',
        activeText: 'text-white',
        activeBorder: 'border-amber-600',
        activeIconBg: 'bg-amber-400 text-white',
        inactiveIconBg: 'bg-orange-50 text-orange-600',
        inactiveIconText: 'text-orange-600',
      },
    },
    {
      id: 'stock-bal',
      label: 'Stok Karung & Sak',
      sublabel: 'Gudang Kulakan',
      icon: <PackagePlus className="w-4 h-4" />,
      shortcut: 'F3',
      badgeCount: lowBulkCount,
      colorScheme: {
        activeBg: 'bg-amber-500 text-white',
        activeText: 'text-white',
        activeBorder: 'border-amber-600',
        activeIconBg: 'bg-amber-400 text-white',
        inactiveIconBg: 'bg-blue-50 text-blue-600',
        inactiveIconText: 'text-blue-600',
      },
    },
    {
      id: 'stock-packaged',
      label: 'Stok Kemasan & Eceran',
      sublabel: 'Siap Jual & Etalase',
      icon: <PackageCheck className="w-4 h-4" />,
      shortcut: 'F4',
      badgeCount: lowPackagedCount,
      colorScheme: {
        activeBg: 'bg-amber-500 text-white',
        activeText: 'text-white',
        activeBorder: 'border-amber-600',
        activeIconBg: 'bg-amber-400 text-white',
        inactiveIconBg: 'bg-emerald-50 text-emerald-600',
        inactiveIconText: 'text-emerald-600',
      },
    },
    {
      id: 'reports-daily',
      label: 'Laporan Harian',
      sublabel: 'Omset per Kategori',
      icon: <CalendarDays className="w-4 h-4" />,
      shortcut: 'F5',
      colorScheme: {
        activeBg: 'bg-amber-500 text-white',
        activeText: 'text-white',
        activeBorder: 'border-amber-600',
        activeIconBg: 'bg-amber-400 text-white',
        inactiveIconBg: 'bg-purple-50 text-purple-600',
        inactiveIconText: 'text-purple-600',
      },
    },
    {
      id: 'analytics',
      label: 'Analitik & Tren',
      sublabel: 'Grafik Performa',
      icon: <BarChart3 className="w-4 h-4" />,
      shortcut: 'F6',
      colorScheme: {
        activeBg: 'bg-amber-500 text-white',
        activeText: 'text-white',
        activeBorder: 'border-amber-600',
        activeIconBg: 'bg-amber-400 text-white',
        inactiveIconBg: 'bg-cyan-50 text-cyan-600',
        inactiveIconText: 'text-cyan-600',
      },
    },
    {
      id: 'labels',
      label: 'Label Barcode',
      sublabel: 'Cetak Stiker Kemasan',
      icon: <Barcode className="w-4 h-4" />,
      shortcut: 'F7',
      colorScheme: {
        activeBg: 'bg-amber-500 text-white',
        activeText: 'text-white',
        activeBorder: 'border-amber-600',
        activeIconBg: 'bg-amber-400 text-white',
        inactiveIconBg: 'bg-rose-50 text-rose-600',
        inactiveIconText: 'text-rose-600',
      },
    },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/60/90 sticky top-0 z-30 shadow-xs transition-all">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Store Info */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('pos')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25 ring-2 ring-amber-200/60 group-hover:scale-105 transition-transform">
                <span className="text-2xl drop-shadow-xs">🌾</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {settings.storeName}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-100 to-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300/60 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  Sembako & Pakan Ternak
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline line-clamp-1">
                  Pusat Sembako, Pakan Ternak & Aksesori Terlengkap
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{currentTime || '00:00:00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Tools: Barcode Scanner, Low Stock Pill, Cloud Sync */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Barcode Scanner Trigger Button */}
            {onOpenScanner && (
              <button
                onClick={onOpenScanner}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                title="Buka Barcode Scanner (F8)"
              >
                <Scan className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Scan Barcode</span>
                <kbd className="hidden lg:inline text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded border border-slate-700">F8</kbd>
              </button>
            )}

            {/* Low Stock Alert Pill */}
            <button
              onClick={onOpenLowStock}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                lowStockCount > 0
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
              }`}
              title="Klik untuk melihat produk yang stoknya menipis"
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${lowStockCount > 0 ? 'text-red-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Stok Menipis</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                lowStockCount > 0 ? 'bg-red-600 text-white ring-2 ring-red-200' : 'bg-slate-200 text-slate-600'
              }`}>
                {lowStockCount}
              </span>
            </button>

            {/* Cloud Sync Status Indicator */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer disabled:opacity-60"
              title="Data tersinkron otomatis. Klik untuk sinkron manual."
            >
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              ) : (
                <div className="relative">
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                </div>
              )}
              <span className="hidden sm:inline font-medium">
                {isSyncing ? 'Sinkron...' : 'Cloud Aktif'}
              </span>
            </button>
          </div>
        </div>

        {/* Modern Segmented Navigation Bar */}
        <nav className="pb-2.5 pt-1 overflow-x-auto scrollbar-none">
          <div className="inline-flex p-1.5 bg-slate-100/80 rounded-2xl border-none gap-1 sm:gap-1.5 min-w-full sm:min-w-0 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const hasAlert = (item.badgeCount ?? 0) > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {/* Icon Box */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/30'
                        : `${item.colorScheme.inactiveIconBg} group-hover:scale-105`
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Text Details */}
                  <div className="text-left flex flex-col justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className={isActive ? 'text-slate-900 font-bold' : 'text-slate-700'}>
                        {item.label}
                      </span>

                      {/* Hotkey tag */}
                      <span
                        className={`text-[9px] font-mono px-1 py-0.2 rounded border transition-colors hidden xl:inline ${
                          isActive
                            ? 'bg-amber-100 text-amber-800 border-amber-200 font-bold'
                            : 'bg-slate-200/80 text-slate-500 border-slate-300/80'
                        }`}
                      >
                        {item.shortcut}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-normal hidden lg:block leading-none mt-0.5">
                      {item.sublabel}
                    </span>
                  </div>

                  {/* Alert Pill if specific stock is low */}
                  {hasAlert && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded-full animate-bounce shadow-xs">
                      {item.badgeCount}
                    </span>
                  )}

                  
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Sticky Bottom Bar for quick phone/tablet POS use */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/60 z-40 py-1.5 px-3 flex justify-around items-center shadow-lg">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'pos' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'pos' ? 'bg-amber-100' : ''}`}>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span>Kasir</span>
        </button>

        <button
          onClick={() => setActiveTab('repack')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'repack' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'repack' ? 'bg-amber-100' : ''}`}>
            <Layers className="w-4 h-4" />
          </div>
          <span>Packing</span>
        </button>

        <button
          onClick={() => setActiveTab('stock-bal')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'stock-bal' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'stock-bal' ? 'bg-amber-100' : ''}`}>
            <PackagePlus className="w-4 h-4" />
          </div>
          <span>Stok Bal</span>
        </button>

        <button
          onClick={() => setActiveTab('stock-packaged')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'stock-packaged' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'stock-packaged' ? 'bg-amber-100' : ''}`}>
            <PackageCheck className="w-4 h-4" />
          </div>
          <span>Kemasan</span>
        </button>

        <button
          onClick={() => setActiveTab('reports-daily')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold ${
            activeTab === 'reports-daily' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'reports-daily' ? 'bg-amber-100' : ''}`}>
            <CalendarDays className="w-4 h-4" />
          </div>
          <span>Laporan</span>
        </button>
      </div>
    </header>
  );
};
