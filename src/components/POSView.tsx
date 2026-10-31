import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Scan, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  QrCode, 
  Banknote, 
  ArrowRight, 
  Package, 
  Sparkles,
  CreditCard,
  CheckCircle2,
  Tag,
  Receipt,
  Calculator,
  Percent
} from 'lucide-react';
import { PackagedProduct, SaleItem, Transaction, StoreSettings, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/formatters';
import { CashierCalculatorModal, CalculatorTab } from './CashierCalculatorModal';

interface POSViewProps {
  products: PackagedProduct[];
  settings: StoreSettings;
  onOpenScanner: () => void;
  onCompleteSale: (transaction: Omit<Transaction, 'id' | 'invoiceNumber' | 'timestamp'>) => void;
  onOpenQRIS: (amount: number, onConfirm: (ref: string) => void) => void;
}

export const POSView: React.FC<POSViewProps> = ({
  products,
  settings,
  onOpenScanner,
  onCompleteSale,
  onOpenQRIS,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [cashierName, setCashierName] = useState('Dewi (Kasir)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [mobilePosTab, setMobilePosTab] = useState<'catalog' | 'cart'>('catalog');

  // Calculator modal state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorTab, setCalculatorTab] = useState<CalculatorTab>('standard');

  const openCalculator = (tab: CalculatorTab = 'standard') => {
    setCalculatorTab(tab);
    setIsCalculatorOpen(true);
  };

  // Keyboard shortcut (Alt+K or Alt+C) to quickly toggle cashier calculator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'c')) || (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        setIsCalculatorOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Category filter tabs matching ADI MULYA domain
  const categoryTabs = ['Semua', 'Sembako', 'Pakan Ternak', 'Aksesori', 'Lainnya'];

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.snackName.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'Semua') return matchesSearch;
    if (selectedCategory === 'Lainnya') {
      return matchesSearch && !['Sembako', 'Pakan Ternak', 'Aksesori'].includes(p.category || '');
    }
    return matchesSearch && p.category === selectedCategory;
  });

  const addToCart = (product: PackagedProduct) => {
    if (product.stockPacks <= 0) {
      alert(`Stok "${product.name}" saat ini habis!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.qty >= product.stockPacks) {
          alert(`Jumlah melebihi stok yang tersedia (${product.stockPacks} porsi/pack).`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                qty: item.qty + 1,
                subtotal: (item.qty + 1) * item.sellingPrice,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            snackName: product.snackName,
            packageType: product.packageType,
            packageLabel: product.packageLabel,
            sellingPrice: product.sellingPrice,
            costPrice: product.costPrice,
            qty: 1,
            subtotal: product.sellingPrice,
            barcode: product.barcode,
            imageUrl: product.imageUrl,
            category: product.category,
          },
        ];
      }
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            if (product && newQty > product.stockPacks) {
              alert(`Jumlah melebihi stok (${product.stockPacks} porsi/pack).`);
              return item;
            }
            return {
              ...item,
              qty: newQty,
              subtotal: newQty * item.sellingPrice,
            };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCashReceived(0);
    setDiscountAmount(0);
  };

  const subtotalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalAmount = Math.max(0, subtotalAmount - discountAmount);
  const totalCost = cart.reduce((sum, item) => sum + item.qty * item.costPrice, 0);
  const totalProfit = Math.max(0, totalAmount - totalCost);
  const change = Math.max(0, cashReceived - totalAmount);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Quick cash amount presets
  const quickCashOptions = [
    totalAmount,
    20000,
    50000,
    100000,
    200000,
  ].filter((v, idx, arr) => v > 0 && arr.indexOf(v) === idx && v >= totalAmount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang belanja masih kosong.');
      return;
    }

    if (paymentMethod === 'TUNAI' && cashReceived < totalAmount) {
      alert(`Uang tunai kurang! Total tagihan: ${formatRupiah(totalAmount)}, Uang diterima: ${formatRupiah(cashReceived)}`);
      return;
    }

    if (paymentMethod === 'QRIS') {
      onOpenQRIS(totalAmount, (qrisRef) => {
        finalizeTransaction(qrisRef);
      });
      return;
    }

    finalizeTransaction();
  };

  const finalizeTransaction = (qrisRef?: string) => {
    onCompleteSale({
      items: cart,
      totalAmount,
      totalCost,
      totalProfit,
      paymentMethod,
      cashReceived: paymentMethod === 'TUNAI' ? cashReceived : totalAmount,
      change: paymentMethod === 'TUNAI' ? change : 0,
      qrisRef,
      cashierName,
      customerName: customerName.trim() || undefined,
      syncedToCloud: true,
    });

    clearCart();
    setCustomerName('');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Mobile Catalog / Cart Segmented Switcher (< lg) */}
      <div className="lg:hidden flex p-1 bg-slate-200/80 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setMobilePosTab('catalog')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobilePosTab === 'catalog'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Katalog Produk ({filteredProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobilePosTab('cart')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            mobilePosTab === 'cart'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Keranjang</span>
          {totalItemsCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              mobilePosTab === 'cart' ? 'bg-white text-slate-900' : 'bg-blue-600 text-white'
            }`}>
              {totalItemsCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SECTION: Search, Categories, & Product Cards Grid (7 cols) */}
        <div className={`space-y-4 lg:col-span-7 ${mobilePosTab === 'cart' ? 'hidden lg:block' : 'block'}`}>
          {/* Search Bar matching mockup */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/60 shadow-xs flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari sembako, pakan ternak, barcode..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white font-medium text-slate-900 transition-all"
              />
            </div>

            <button
              onClick={onOpenScanner}
              className="px-3 sm:px-4 py-2.5 bg-slate-100 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl text-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer active:scale-95"
              title="Buka Kamera Barcode Scanner"
            >
              <Scan className="w-4 h-4 text-slate-900" />
              <span className="hidden sm:inline">Scan Barcode</span>
            </button>

            <button
              type="button"
              onClick={() => openCalculator('standard')}
              className="px-3 sm:px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300/80 font-bold rounded-2xl text-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer active:scale-95 shadow-2xs"
              title="Buka Kalkulator Kasir (Alt+K atau Alt+C)"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Kalkulator</span>
            </button>
          </div>

          {/* Category Filter Pills matching mockup (Semua, Minuman, Makanan, Snack, Lainnya) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryTabs.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid matching mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[68vh] overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200/60">
                Tidak ada produk yang cocok dengan pencarian.
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isOutOfStock = p.stockPacks <= 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`p-3 rounded-2xl bg-white border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer active:scale-98 relative overflow-hidden ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                      {p.category && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 shadow-xs">
                          {p.category}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-slate-900 transition-colors">
                        {p.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Stok: {p.stockPacks}
                      </div>
                    </div>

                    {/* Price & Add (+) Button matching mockup */}
                    <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
                        {formatRupiah(p.sellingPrice)}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                        disabled={isOutOfStock}
                        className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-md shadow-blue-500/25 active:scale-90 transition-all cursor-pointer"
                        title="Tambah ke keranjang"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Cart Panel matching mockup (5 cols) */}
        <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-xs p-5 flex flex-col space-y-4 lg:sticky lg:top-20 lg:col-span-5 ${mobilePosTab === 'catalog' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Cart Header matching mockup: Keranjang (X) | Hapus */}
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>Keranjang</span>
              <span className="text-slate-900">({totalItemsCount})</span>
            </h3>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold transition-colors cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Cart Items List matching mockup */}
          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                Keranjang masih kosong. Pilih menu di sebelah kiri.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between gap-3">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Name & Unit Price */}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {formatRupiah(item.sellingPrice)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCartQty(item.productId, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.productId, 1)}
                      className="w-6 h-6 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-20 text-right font-mono font-bold text-xs text-slate-900">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Breakdown matching mockup */}
          <div className="space-y-1.5 pt-3 border-t border-slate-200/60 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-slate-800">{formatRupiah(subtotalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Diskon</span>
                <button
                  type="button"
                  onClick={() => openCalculator('discount')}
                  className="text-[10px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded-md font-bold cursor-pointer transition-colors flex items-center gap-0.5"
                  title="Hitung Diskon Belanja"
                >
                  <Percent className="w-2.5 h-2.5" />
                  <span>{discountAmount > 0 ? 'Ubah' : '+ Diskon'}</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {discountAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => setDiscountAmount(0)}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                    title="Hapus diskon"
                  >
                    Hapus
                  </button>
                )}
                <span className={`font-mono font-bold ${discountAmount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {discountAmount > 0 ? `- ${formatRupiah(discountAmount)}` : formatRupiah(0)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/60">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Method Tabs matching mockup: [ Tunai ] [ QRIS ] [ Transfer ] */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Metode Pembayaran
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('TUNAI');
                  setCashReceived(totalAmount);
                }}
                className={`py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'TUNAI'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Tunai</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QRIS')}
                className={`py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'QRIS'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('TRANSFER')}
                className={`py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'TRANSFER'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Transfer</span>
              </button>
            </div>
          </div>

          {/* Cash details if Tunai */}
          {paymentMethod === 'TUNAI' && (
            <div className="space-y-2 p-3 bg-slate-100/50 border border-blue-100 rounded-2xl text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Uang Diterima:</span>
                  <button
                    type="button"
                    onClick={() => openCalculator('change')}
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 px-1.5 py-0.5 rounded-md font-bold cursor-pointer transition-colors flex items-center gap-0.5"
                    title="Buka Kalkulator Kembalian"
                  >
                    <Calculator className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Hitung</span>
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={cashReceived || ''}
                  onChange={(e) => setCashReceived(parseInt(e.target.value) || 0)}
                  placeholder="Rp 0"
                  className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono text-right focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Quick Cash Options */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickCashOptions.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCashReceived(val)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 border border-slate-300 text-[10px] font-mono text-slate-800 font-bold transition-colors cursor-pointer"
                  >
                    {val === totalAmount ? 'Uang Pas' : formatRupiah(val)}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-blue-100 font-bold">
                <span className="text-slate-700">Kembalian:</span>
                <span className={`font-mono text-sm font-bold ${cashReceived < totalAmount ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {cashReceived < totalAmount
                    ? `Kurang ${formatRupiah(totalAmount - cashReceived)}`
                    : formatRupiah(change)}
                </span>
              </div>
            </div>
          )}

          {/* Customer & Cashier Inputs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                Kasir:
              </label>
              <input
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                Meja / Pembeli:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Meja 1 / Pelanggan"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Checkout Button matching mockup: Bayar Sekarang */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-2xl text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Bayar Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Kalkulator Kasir */}
      <CashierCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialTab={calculatorTab}
        currentSubtotal={subtotalAmount}
        currentTotal={totalAmount}
        onApplyDiscount={(discount) => setDiscountAmount(discount)}
        onApplyCashReceived={(cash) => {
          setCashReceived(cash);
          setPaymentMethod('TUNAI');
        }}
      />
    </div>
  );
};
