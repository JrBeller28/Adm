import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BulkStockItem, 
  PackagedProduct, 
  Transaction, 
  RepackRecord, 
  StoreSettings, 
  ActiveTab, 
  TargetPackageResult 
} from './types';
import { 
  INITIAL_BULK_STOCK, 
  INITIAL_PACKAGED_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REPACK_HISTORY, 
  INITIAL_SETTINGS 
} from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { POSView } from './components/POSView';
import { RepackView } from './components/RepackView';
import { BulkStockView } from './components/BulkStockView';
import { PackagedStockView } from './components/PackagedStockView';
import { DailyReportView } from './components/DailyReportView';
import { AnalyticsView } from './components/AnalyticsView';
import { BarcodeLabelsView } from './components/BarcodeLabelsView';
import { ReceiptModal } from './components/ReceiptModal';
import { QRISModal } from './components/QRISModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { LowStockModal } from './components/LowStockModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProductPhotoModal } from './components/ProductPhotoModal';
import { StoreSettingsView } from './components/StoreSettingsView';
import { syncToFirebase } from './lib/firebase-sync';

export default function App() {
  // LocalStorage persistence helpers with ADI MULYA namespace
  const [bulkStocks, setBulkStocks] = useState<BulkStockItem[]>(() => {
    const saved = localStorage.getItem('adimulya_bulk_stocks');
    return saved ? JSON.parse(saved) : INITIAL_BULK_STOCK;
  });

  const [packagedProducts, setPackagedProducts] = useState<PackagedProduct[]>(() => {
    const saved = localStorage.getItem('adimulya_packaged_products');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGED_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('adimulya_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [repackHistory, setRepackHistory] = useState<RepackRecord[]>(() => {
    const saved = localStorage.getItem('adimulya_repack_history');
    return saved ? JSON.parse(saved) : INITIAL_REPACK_HISTORY;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('adimulya_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.storeName && !parsed.storeName.includes('BERKAH NUSA')) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceiptTrx, setActiveReceiptTrx] = useState<Transaction | null>(null);

  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [qrisAmount, setQrisAmount] = useState(0);
  const [qrisCallback, setQrisCallback] = useState<((ref: string) => void) | null>(null);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);
  const [preSelectedLabelProduct, setPreSelectedLabelProduct] = useState<PackagedProduct | null>(null);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activePhotoProduct, setActivePhotoProduct] = useState<PackagedProduct | null>(null);

  // Sidebar responsive states
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global Keyboard Shortcuts (F1 - F9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'F1' || (e.altKey && e.key === '1')) {
        e.preventDefault();
        setActiveTab('dashboard');
      } else if (e.key === 'F2' || (e.altKey && e.key === '2')) {
        e.preventDefault();
        setActiveTab('pos');
      } else if (e.key === 'F3' || (e.altKey && e.key === '3')) {
        e.preventDefault();
        setActiveTab('repack');
      } else if (e.key === 'F4' || (e.altKey && e.key === '4')) {
        e.preventDefault();
        setActiveTab('stock-bal');
      } else if (e.key === 'F5' || (e.altKey && e.key === '5')) {
        e.preventDefault();
        setActiveTab('stock-packaged');
      } else if (e.key === 'F6' || (e.altKey && e.key === '6')) {
        e.preventDefault();
        setActiveTab('reports-daily');
      } else if (e.key === 'F7' || (e.altKey && e.key === '7')) {
        e.preventDefault();
        setActiveTab('analytics');
      } else if (e.key === 'F8' || (e.altKey && e.key === '8')) {
        e.preventDefault();
        setActiveTab('labels');
      } else if (e.key === 'F9' || (e.altKey && e.key === '9')) {
        e.preventDefault();
        setIsScannerOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('adimulya_bulk_stocks', JSON.stringify(bulkStocks));
  }, [bulkStocks]);

  useEffect(() => {
    localStorage.setItem('adimulya_packaged_products', JSON.stringify(packagedProducts));
  }, [packagedProducts]);

  useEffect(() => {
    localStorage.setItem('adimulya_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('adimulya_repack_history', JSON.stringify(repackHistory));
  }, [repackHistory]);

  useEffect(() => {
    localStorage.setItem('adimulya_settings', JSON.stringify(settings));
  }, [settings]);

  // Cloud sync simulation
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncToFirebase(bulkStocks, packagedProducts, settings);
      setSettings((prev) => ({
        ...prev,
        lastCloudSyncTimestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to sync to Firebase:', error);
      alert('Gagal sinkronisasi ke Cloud Database. Pastikan Anda sudah login.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Low stock count for alert badge
  const lowBulkCount = bulkStocks.filter((b) => b.stockBals <= b.minStockBalAlert).length;
  const lowPackagedCount = packagedProducts.filter((p) => p.stockPacks <= p.minStockAlert).length;
  const totalLowStock = lowBulkCount + lowPackagedCount;

  const prevLowStockRef = useRef(totalLowStock);

  useEffect(() => {
    // Play audio alert when low stock count increases
    if (totalLowStock > prevLowStockRef.current) {
      try {
        // Create an oscillator for a short beep
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5); // drop to A4
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (err) {
        console.warn('AudioContext not supported or blocked by browser policy:', err);
      }
    }
    prevLowStockRef.current = totalLowStock;
  }, [totalLowStock]);


  // Repack execution: cuts bal stock, adds to packaged stock
  const handleExecuteRepack = (
    bulkStockId: string,
    balsUsed: number,
    results: TargetPackageResult[],
    operator: string,
    notes: string
  ) => {
    const bulk = bulkStocks.find((b) => b.id === bulkStockId);
    if (!bulk) return;

    // 1. Deduct Bal stock
    setBulkStocks((prev) =>
      prev.map((b) =>
        b.id === bulkStockId
          ? { ...b, stockBals: Math.max(0, b.stockBals - balsUsed) }
          : b
      )
    );

    // 2. Increase Packaged product stocks
    setPackagedProducts((prev) =>
      prev.map((p) => {
        const match = results.find((r) => r.packageId === p.id);
        if (match) {
          return {
            ...p,
            stockPacks: p.stockPacks + match.qtyProduced,
          };
        }
        return p;
      })
    );

    // 3. Log into Repack history
    const newRecord: RepackRecord = {
      id: `rep-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      bulkStockId,
      bulkName: bulk.name,
      balsUsed,
      results,
      operator,
      notes,
    };

    setRepackHistory((prev) => [newRecord, ...prev]);
  };

  // Add new bulk variant
  const handleAddBulkStock = (item: Omit<BulkStockItem, 'id'>) => {
    const newBulk: BulkStockItem = {
      ...item,
      id: `bulk-${Date.now().toString().slice(-6)}`,
    };
    setBulkStocks((prev) => [...prev, newBulk]);
  };

  // Restock existing bulk
  const handleRestockBulk = (bulkId: string, additionalBals: number, costPerBal: number) => {
    setBulkStocks((prev) =>
      prev.map((b) =>
        b.id === bulkId
          ? {
              ...b,
              stockBals: b.stockBals + additionalBals,
              costPerBal,
              lastRestockDate: new Date().toISOString().slice(0, 10),
            }
          : b
      )
    );
  };

  // Manual stock update (opname)
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setPackagedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stockPacks: Math.max(0, newStock) } : p
      )
    );
  };

  // Add new packaged variant
  const handleAddProduct = (product: Omit<PackagedProduct, 'id'>) => {
    const newProd: PackagedProduct = {
      ...product,
      id: `pkg-${Date.now().toString().slice(-6)}`,
    };
    setPackagedProducts((prev) => [...prev, newProd]);
  };

  // Complete POS sale
  const handleCompleteSale = (saleData: Omit<Transaction, 'id' | 'invoiceNumber' | 'timestamp'>) => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = (transactions.length + 1).toString().padStart(4, '0');
    const invoiceNumber = `TRX-${dateStr}-${seq}`;

    // 1. Deduct packaged stock
    setPackagedProducts((prev) =>
      prev.map((prod) => {
        const soldItem = saleData.items.find((i) => i.productId === prod.id);
        if (soldItem) {
          return {
            ...prod,
            stockPacks: Math.max(0, prod.stockPacks - soldItem.qty),
          };
        }
        return prod;
      })
    );

    // 2. Create transaction record
    const newTransaction: Transaction = {
      ...saleData,
      id: `trx-${Date.now()}`,
      invoiceNumber,
      timestamp: today.toISOString(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // 3. Open receipt modal with auto-print
    setActiveReceiptTrx(newTransaction);
    setIsReceiptOpen(true);
  };

  // Quick navigation handlers
  const handleStartRepack = (bulkId: string) => {
    setActiveTab('repack');
  };

  const handleOpenLabelModal = (product: PackagedProduct) => {
    setPreSelectedLabelProduct(product);
    setActiveTab('labels');
  };

  const handleOpenQRIS = (amount: number, onConfirm: (ref: string) => void) => {
    setQrisAmount(amount);
    setQrisCallback(() => onConfirm);
    setIsQRISOpen(true);
  };

  const handleProductScanned = (product: PackagedProduct) => {
    // If in POS tab, we can let user know
    setActiveTab('pos');
  };

  const handleSavePhoto = (productId: string, imageUrl: string) => {
    setPackagedProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, imageUrl } : p)
    );
  };

  // Reset to default data
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang data aplikasi ke data bawaan toko snack?')) {
      localStorage.clear();
      setBulkStocks(INITIAL_BULK_STOCK);
      setPackagedProducts(INITIAL_PACKAGED_PRODUCTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setRepackHistory(INITIAL_REPACK_HISTORY);
      setSettings(INITIAL_SETTINGS);
      alert('Data toko snack berhasil direset.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        lowStockCount={totalLowStock}
        lowBulkCount={lowBulkCount}
        lowPackagedCount={lowPackagedCount}
        onOpenLowStock={() => setIsLowStockModalOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        settings={settings}
        isSyncing={isSyncing}
        onManualSync={handleManualSync}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'
      }`}>
        {/* Top Header / App Bar */}
        <TopBar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          lowStockCount={totalLowStock}
          onOpenLowStock={() => setIsLowStockModalOpen(true)}
          onOpenScanner={() => setIsScannerOpen(true)}
          settings={settings}
          isSyncing={isSyncing}
          onManualSync={handleManualSync}
        />

        {/* Main View Area with Mobile Bottom Padding */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            bulkStocks={bulkStocks}
            packagedProducts={packagedProducts}
            settings={settings}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenReceipt={(trx) => {
              setActiveReceiptTrx(trx);
              setIsReceiptOpen(true);
            }}
            onOpenLowStock={() => setIsLowStockModalOpen(true)}
          />
        )}

        {activeTab === 'pos' && (
          <POSView
            products={packagedProducts}
            settings={settings}
            onOpenScanner={() => setIsScannerOpen(true)}
            onCompleteSale={handleCompleteSale}
            onOpenQRIS={handleOpenQRIS}
          />
        )}

        {activeTab === 'repack' && (
          <RepackView
            bulkStocks={bulkStocks}
            packagedProducts={packagedProducts}
            repackHistory={repackHistory}
            onExecuteRepack={handleExecuteRepack}
          />
        )}

        {activeTab === 'stock-bal' && (
          <BulkStockView
            bulkStocks={bulkStocks}
            onAddBulkStock={handleAddBulkStock}
            onRestockBulk={handleRestockBulk}
            onStartRepack={handleStartRepack}
          />
        )}

        {activeTab === 'stock-packaged' && (
          <PackagedStockView
            products={packagedProducts}
            bulkStocks={bulkStocks}
            onUpdateProductStock={handleUpdateProductStock}
            onAddProduct={handleAddProduct}
            onOpenLabelModal={handleOpenLabelModal}
            onStartRepack={handleStartRepack}
            onOpenPhotoModal={(product) => {
              setActivePhotoProduct(product);
              setIsPhotoModalOpen(true);
            }}
          />
        )}

        {activeTab === 'reports-daily' && (
          <DailyReportView
            transactions={transactions}
            onOpenReceipt={(trx) => {
              setActiveReceiptTrx(trx);
              setIsReceiptOpen(true);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            transactions={transactions}
            bulkStocks={bulkStocks}
            packagedProducts={packagedProducts}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPhotoModal={(product) => {
              setActivePhotoProduct(product);
              setIsPhotoModalOpen(true);
            }}
          />
        )}

        {activeTab === 'labels' && (
          <BarcodeLabelsView
            products={packagedProducts}
            settings={settings}
            preSelectedProduct={preSelectedLabelProduct}
          />
        )}

        {activeTab === 'settings' && (
          <StoreSettingsView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}
      
          </motion.div>
        </AnimatePresence>
</main>

      {/* Footer Info (Added mb-20 on mobile so bottom bar doesn't cover it) */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 mb-20 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; 2026 {settings.storeName} — Sistem Operasional Gudang & Kasir Toko Snack
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-red-600 transition-colors"
            >
              Reset Data Demo
            </button>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Cloud Database: Online</span>
          </div>
        </div>
      </footer>

      {/* Android-Style Bottom Navigation Bar (Mobile Only) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        lowBulkCount={lowBulkCount}
        lowPackagedCount={lowPackagedCount}
      />
    </div>

    {/* Modals */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={activeReceiptTrx}
        settings={settings}
        autoPrint={settings.autoPrintReceipt}
      />

      <QRISModal
        isOpen={isQRISOpen}
        onClose={() => setIsQRISOpen(false)}
        amount={qrisAmount}
        invoiceNumber={`TRX-${Date.now().toString().slice(-6)}`}
        settings={settings}
        onPaymentSuccess={(ref) => {
          setIsQRISOpen(false);
          if (qrisCallback) qrisCallback(ref);
        }}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        products={packagedProducts}
        onProductScanned={handleProductScanned}
      />

      <LowStockModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        bulkStocks={bulkStocks}
        packagedProducts={packagedProducts}
        onStartRepack={handleStartRepack}
        onOpenBulkView={() => setActiveTab('stock-bal')}
      />

      <ProductPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setActivePhotoProduct(null);
        }}
        product={activePhotoProduct}
        onSavePhoto={handleSavePhoto}
      />
    </div>
  );
}
