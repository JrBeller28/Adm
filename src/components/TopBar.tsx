import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Scan, 
  AlertTriangle, 
  CloudCheck, 
  RefreshCw, 
  Clock, 
  Calendar,
  Sparkles,
  ShoppingBag,
  Layers,
  PackagePlus,
  PackageCheck,
  CalendarDays,
  BarChart3,
  Barcode,
  Home
} from 'lucide-react';
import { ActiveTab, StoreSettings } from '../types';

interface TopBarProps {
  activeTab: ActiveTab;
  onOpenMobileSidebar: () => void;
  lowStockCount: number;
  onOpenLowStock: () => void;
  onOpenScanner?: () => void;
  settings: StoreSettings;
  isSyncing: boolean;
  onManualSync: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onOpenMobileSidebar,
  lowStockCount,
  onOpenLowStock,
  onOpenScanner,
  settings,
  isSyncing,
  onManualSync,
}) => {
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateString(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Title and subtitle mapping per active tab with colorful badges
  const getTabInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard Utama',
          desc: 'Ringkasan performa penjualan hari ini, omset & produk terlaris',
          icon: <Home className="w-5 h-5 text-indigo-600 stroke-[2.2]" />,
          badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'pos':
        return {
          title: 'Kasir Penjualan POS',
          desc: 'Input transaksi, scan barcode, bayar tunai/QRIS & cetak struk',
          icon: <ShoppingBag className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'repack':
        return {
          title: 'Proses Packing Bal',
          desc: 'Konversi bal-balan mentah menjadi kemasan ritel (10k, 5k, 500g)',
          icon: <Layers className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'stock-bal':
        return {
          title: 'Stok Bal-balan (Kulakan)',
          desc: 'Inventaris bahan baku mentah dalam satuan bal dari supplier',
          icon: <PackagePlus className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'stock-packaged':
        return {
          title: 'Stok Kemasan Siap Jual',
          desc: 'Monitoring stok kemasan etalase, HPP, margin laba & barcode',
          icon: <PackageCheck className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'reports-daily':
        return {
          title: 'Laporan Penjualan Harian',
          desc: 'Rincian omset dan laba detail per jenis kemasan & riwayat nota',
          icon: <CalendarDays className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'analytics':
        return {
          title: 'Home & Analitik Penjualan',
          desc: 'Ringkasan performa bulanan, produk terlaris & statistik bisnis',
          icon: <BarChart3 className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'labels':
        return {
          title: 'Cetak Label Barcode',
          desc: 'Pembuatan dan pencetakan stiker barcode untuk kemasan plastik',
          icon: <Barcode className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      default:
        return {
          title: settings.storeName,
          desc: 'Sistem Operasional Toko Snack Berkah Nusa',
          icon: <Sparkles className="w-5 h-5 text-slate-700 stroke-[2.2]" />,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Page Title / Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Active Section Info */}
          <div className="min-w-0 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${tabInfo.badgeStyle} border flex items-center justify-center shrink-0 shadow-xs`}>
              {tabInfo.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate leading-tight">
                {tabInfo.title}
              </h2>
              <p className="text-[11px] text-slate-400 truncate hidden md:block font-medium">
                {tabInfo.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Live Clock */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Real-time Clock Widget */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 text-slate-800 border border-slate-200/60 px-3 py-1.5 rounded-2xl text-xs font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Clock className="w-3.5 h-3.5 text-slate-700" />
            <span className="font-bold text-slate-900">{timeString || '00:00:00'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-sans text-slate-500 hidden lg:inline font-medium">
              {dateString}
            </span>
          </div>

          {/* Barcode Scanner Shortcut Button */}
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm shadow-slate-900/20 hover:shadow-md transition-all active:scale-95 cursor-pointer"
              title="Buka Kamera Barcode Scanner (F8)"
            >
              <Scan className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Scan Barcode</span>
              <kbd className="hidden md:inline text-[9px] bg-white/20 text-white px-1 py-0.2 rounded border border-white/30 font-mono font-bold">
                F8
              </kbd>
            </button>
          )}

          {/* Low Stock Warning Badge Pill */}
          <button
            onClick={onOpenLowStock}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
              lowStockCount > 0
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 shadow-xs ring-1 ring-rose-200/60'
                : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
            }`}
            title="Klik untuk melihat stok menipis"
          >
            <AlertTriangle
              className={`w-3.5 h-3.5 ${
                lowStockCount > 0 ? 'text-rose-600 animate-bounce' : 'text-slate-400'
              }`}
            />
            <span className="hidden md:inline">Stok Menipis</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                lowStockCount > 0
                  ? 'bg-rose-600 text-white ring-2 ring-rose-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {lowStockCount}
            </span>
          </button>

          {/* Cloud Sync Button */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
            title="Data tersimpan otomatis. Klik untuk sinkron manual."
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            ) : (
              <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="hidden lg:inline font-bold">
              {isSyncing ? 'Sinkron...' : 'Cloud Online'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
