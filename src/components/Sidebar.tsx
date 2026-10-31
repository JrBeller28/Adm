import React from 'react';
import { 
  Home,
  ShoppingBag, 
  Layers, 
  PackagePlus, 
  PackageCheck, 
  CalendarDays, 
  BarChart3, 
  Barcode, 
  Scan, 
  AlertTriangle, 
  CloudCheck, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  Store,
  Clock,
  Settings
} from 'lucide-react';
import { ActiveTab, StoreSettings } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  lowStockCount: number;
  lowBulkCount: number;
  lowPackagedCount: number;
  onOpenLowStock: () => void;
  onOpenScanner?: () => void;
  settings: StoreSettings;
  isSyncing: boolean;
  onManualSync: () => void;
}

interface NavItemDef {
  id: ActiveTab;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  shortcut: string;
  badgeCount?: number;
  badgeType?: 'danger' | 'warning' | 'info';
  color: {
    icon: string;
    bg: string;
    border: string;
    hoverBg: string;
    hoverText: string;
    activeBg: string;
    activeIcon: string;
  };
}

interface NavGroup {
  groupName: string;
  groupColor: string;
  items: NavItemDef[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  lowStockCount,
  lowBulkCount,
  lowPackagedCount,
  onOpenLowStock,
  onOpenScanner,
  settings,
  isSyncing,
  onManualSync,
}) => {
  const navGroups: NavGroup[] = [
    {
      groupName: 'RINGKASAN & UTAMA',
      groupColor: 'text-indigo-400',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Utama',
          sublabel: 'Performa Hari Ini',
          icon: <Home className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F1',
          color: {
            icon: 'text-indigo-400',
            bg: 'bg-indigo-500/15',
            border: 'border-indigo-500/30',
            hoverBg: 'group-hover:bg-indigo-500/25',
            hoverText: 'group-hover:text-indigo-300',
            activeBg: 'bg-indigo-500 text-white shadow-indigo-500/25',
            activeIcon: 'bg-slate-950 text-indigo-400',
          },
        },
      ],
    },
    {
      groupName: 'KASIR & PENJUALAN',
      groupColor: 'text-emerald-400',
      items: [
        {
          id: 'pos',
          label: 'Kasir POS',
          sublabel: 'Transaksi & Struk',
          icon: <ShoppingBag className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F2',
          color: {
            icon: 'text-emerald-400',
            bg: 'bg-emerald-500/15',
            border: 'border-emerald-500/30',
            hoverBg: 'group-hover:bg-emerald-500/25',
            hoverText: 'group-hover:text-emerald-300',
            activeBg: 'bg-emerald-500 text-slate-950 shadow-emerald-500/25',
            activeIcon: 'bg-slate-950 text-emerald-400',
          },
        },
        {
          id: 'repack',
          label: 'Proses Packing Bal',
          sublabel: 'Pecah ke 10k / 5k / 500g',
          icon: <Layers className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F3',
          color: {
            icon: 'text-amber-400',
            bg: 'bg-amber-500/15',
            border: 'border-amber-500/30',
            hoverBg: 'group-hover:bg-amber-500/25',
            hoverText: 'group-hover:text-amber-300',
            activeBg: 'bg-amber-500 text-slate-950 shadow-amber-500/25',
            activeIcon: 'bg-slate-950 text-amber-400',
          },
        },
      ],
    },
    {
      groupName: 'INVENTARIS & GUDANG',
      groupColor: 'text-sky-400',
      items: [
        {
          id: 'stock-bal',
          label: 'Stok Bal-balan',
          sublabel: 'Barang Kulakan',
          icon: <PackagePlus className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F4',
          badgeCount: lowBulkCount,
          badgeType: 'danger',
          color: {
            icon: 'text-sky-400',
            bg: 'bg-sky-500/15',
            border: 'border-sky-500/30',
            hoverBg: 'group-hover:bg-sky-500/25',
            hoverText: 'group-hover:text-sky-300',
            activeBg: 'bg-sky-500 text-slate-950 shadow-sky-500/25',
            activeIcon: 'bg-slate-950 text-sky-400',
          },
        },
        {
          id: 'stock-packaged',
          label: 'Stok Kemasan',
          sublabel: 'Siap Jual & Etalase',
          icon: <PackageCheck className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F5',
          badgeCount: lowPackagedCount,
          badgeType: 'warning',
          color: {
            icon: 'text-violet-400',
            bg: 'bg-violet-500/15',
            border: 'border-violet-500/30',
            hoverBg: 'group-hover:bg-violet-500/25',
            hoverText: 'group-hover:text-violet-300',
            activeBg: 'bg-violet-500 text-slate-950 shadow-violet-500/25',
            activeIcon: 'bg-slate-950 text-violet-400',
          },
        },
        {
          id: 'labels',
          label: 'Label Barcode',
          sublabel: 'Cetak Stiker Struk',
          icon: <Barcode className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F8',
          color: {
            icon: 'text-teal-400',
            bg: 'bg-teal-500/15',
            border: 'border-teal-500/30',
            hoverBg: 'group-hover:bg-teal-500/25',
            hoverText: 'group-hover:text-teal-300',
            activeBg: 'bg-teal-500 text-slate-950 shadow-teal-500/25',
            activeIcon: 'bg-slate-950 text-teal-400',
          },
        },
      ],
    },
    {
      groupName: 'LAPORAN & BISNIS',
      groupColor: 'text-fuchsia-400',
      items: [
        {
          id: 'reports-daily',
          label: 'Laporan Harian',
          sublabel: 'Omset per Kemasan',
          icon: <CalendarDays className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F6',
          color: {
            icon: 'text-rose-400',
            bg: 'bg-rose-500/15',
            border: 'border-rose-500/30',
            hoverBg: 'group-hover:bg-rose-500/25',
            hoverText: 'group-hover:text-rose-300',
            activeBg: 'bg-rose-500 text-slate-950 shadow-rose-500/25',
            activeIcon: 'bg-slate-950 text-rose-400',
          },
        },
        {
          id: 'analytics',
          label: 'Analitik & Grafik',
          sublabel: 'Performa Bulanan',
          icon: <BarChart3 className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F7',
          color: {
            icon: 'text-indigo-400',
            bg: 'bg-indigo-500/15',
            border: 'border-indigo-500/30',
            hoverBg: 'group-hover:bg-indigo-500/25',
            hoverText: 'group-hover:text-indigo-300',
            activeBg: 'bg-indigo-500 text-slate-950 shadow-indigo-500/25',
            activeIcon: 'bg-slate-950 text-indigo-400',
          },
        },
        {
          id: 'settings',
          label: 'Pengaturan Toko',
          sublabel: 'Konfigurasi Sistem',
          icon: <Settings className="w-5 h-5 stroke-[2.2]" />,
          shortcut: 'F9',
          color: {
            icon: 'text-slate-400',
            bg: 'bg-slate-500/15',
            border: 'border-slate-500/30',
            hoverBg: 'group-hover:bg-slate-500/25',
            hoverText: 'group-hover:text-slate-300',
            activeBg: 'bg-slate-500 text-slate-950 shadow-slate-500/25',
            activeIcon: 'bg-slate-950 text-slate-400',
          },
        },
      ],
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Sidebar Container - Desktop only, hidden on mobile */}
      <aside
        className={`hidden md:flex fixed top-0 bottom-0 left-0 z-40 bg-white text-slate-900 border-r border-slate-200/60 flex-col justify-between transition-all duration-300 shadow-xl ${
          /* Desktop Responsive Width */
          isCollapsed ? 'md:w-20' : 'md:w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-200/60 flex items-center justify-between shrink-0 bg-slate-50">
          <div
            onClick={() => handleSelectTab('pos')}
            className="flex items-center gap-3 cursor-pointer select-none overflow-hidden group"
            title="Kembali ke Kasir POS"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0 transition-transform">
              <Store className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-slate-900 text-sm tracking-tight truncate leading-tight group-hover:text-amber-500 transition-colors">
                    {settings.storeName}
                  </h1>
                </div>
                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>Sistem Toko Snack</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse/Expand Toggle */}
          <button
            onClick={onToggleCollapse}
            className="flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 border border-transparent transition-colors"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Barcode Scanner Button in Sidebar */}
        {onOpenScanner && !isCollapsed && (
          <div className="px-3 pt-4">
            <button
              onClick={() => {
                onOpenScanner();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/10 transition-all cursor-pointer"
              title="Buka Kamera Barcode Scanner (F8)"
            >
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-slate-950" />
                <span>Scan Barcode</span>
              </div>
              <kbd className="text-[10px] bg-amber-600/50 text-slate-950 px-1.5 py-0.5 rounded border border-amber-700/30 font-mono font-bold">
                F8
              </kbd>
            </button>
          </div>
        )}

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <div className={`px-3 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-slate-500`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                  <span>{group.groupName}</span>
                </div>
              )}

              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const hasBadge = (item.badgeCount ?? 0) > 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border border-transparent ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? `${item.label} (${item.shortcut})` : undefined}
                  >
                    {/* Modern Squircle Colorful Icon Container */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 border ${
                        isActive
                          ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-inner'
                          : 'bg-slate-50 text-slate-500 border-slate-200/60 group-hover:bg-white group-hover:border-slate-300 group-hover:scale-105 shadow-2xs'
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* Labels */}
                    {!isCollapsed && (
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.label}</span>
                          <span
                            className={`text-[9px] font-mono px-1 py-0.2 rounded border transition-colors ${
                              isActive
                                ? 'bg-slate-700 text-slate-300 border-slate-600 font-bold'
                                : 'bg-slate-100 text-slate-400 border-slate-200/60'
                            }`}
                          >
                            {item.shortcut}
                          </span>
                        </div>
                        <div
                          className={`text-[10px] truncate transition-colors ${
                            isActive ? 'text-slate-300 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {item.sublabel}
                        </div>
                      </div>
                    )}

                    {/* Alert Badge */}
                    {hasBadge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs ${
                          item.badgeType === 'danger'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-slate-950 font-bold'
                        } ${isCollapsed ? 'absolute -top-1 -right-1 ring-2 ring-white' : ''}`}
                      >
                        {item.badgeCount}
                      </span>
                    )}

                    {/* Active bar indicator on collapsed mode */}
                    {isCollapsed && isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-amber-500 rounded-r-md" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Widget: Low stock alert & Cloud Sync Status */}
        <div className="p-3 border-t border-slate-200/60 bg-slate-50 space-y-2 shrink-0">
          {/* Low Stock Warning Pill */}
          {lowStockCount > 0 && (
            <button
              onClick={() => {
                onOpenLowStock();
                onCloseMobile();
              }}
              className={`w-full p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-between transition-colors shadow-xs cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Klik untuk membuka peringatan stok menipis"
            >
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
                {!isCollapsed && <span className="truncate">Stok Menipis</span>}
              </div>
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                {lowStockCount}
              </span>
            </button>
          )}

          {/* Cloud Database Sync Widget */}
          <div
            className={`flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 text-xs text-slate-600 shadow-xs ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <CloudCheck className="w-4 h-4 text-emerald-500" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <div className="font-bold text-[11px] text-slate-900 leading-tight">
                    Cloud Database
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Tersinkronisasi
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={onManualSync}
                disabled={isSyncing}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
                title="Sinkronisasi Manual"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-slate-500' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
