export type PackageType = 
  | 'KEMASAN_10K'
  | 'KEMASAN_5K'
  | 'KEMASAN_500G'
  | 'KEMASAN_250G'
  | 'BAL'
  | 'CUSTOM';

export interface BulkStockItem {
  id: string;
  name: string;
  category: string;
  weightPerBalKg: number;
  stockBals: number;
  minStockBalAlert: number;
  costPerBal: number;
  supplier: string;
  lastRestockDate: string;
  notes?: string;
}

export interface PackagedProduct {
  id: string;
  bulkStockId: string;
  name: string;
  snackName: string;
  packageType: PackageType;
  packageLabel: string;
  weightGram: number;
  stockPacks: number;
  minStockAlert: number;
  costPrice: number;
  sellingPrice: number;
  barcode: string;
  colorTag?: string;
  category?: string;
  imageUrl?: string;
}

export interface TargetPackageResult {
  packageId: string;
  packageType: PackageType;
  packageLabel: string;
  qtyProduced: number;
}

export interface RepackRecord {
  id: string;
  timestamp: string;
  bulkStockId: string;
  bulkName: string;
  balsUsed: number;
  results: TargetPackageResult[];
  operator: string;
  notes?: string;
}

export interface RestockRecord {
  id: string;
  timestamp: string;
  bulkStockId: string;
  bulkName: string;
  balsAdded: number;
  costPerBal: number;
  totalCost: number;
  supplier: string;
  invoiceNo?: string;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  snackName: string;
  packageType: PackageType;
  packageLabel: string;
  sellingPrice: number;
  costPrice: number;
  qty: number;
  subtotal: number;
  barcode: string;
  category?: string;
  imageUrl?: string;
}

export type PaymentMethod = 'TUNAI' | 'QRIS' | 'TRANSFER';

export interface Transaction {
  id: string;
  invoiceNumber: string;
  timestamp: string;
  items: SaleItem[];
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  paymentMethod: PaymentMethod;
  cashReceived: number;
  change: number;
  qrisRef?: string;
  cashierName: string;
  customerName?: string;
  syncedToCloud: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  footerMessage: string;
  autoPrintReceipt: boolean;
  qrisMerchantName: string;
  qrisNmid: string;
  cloudSyncEnabled: boolean;
  lastCloudSyncTimestamp?: string;
  receiptPaperSize?: '58mm' | '80mm';
}

export type ActiveTab = 
  | 'dashboard'
  | 'pos'
  | 'repack'
  | 'stock-bal'
  | 'stock-packaged'
  | 'reports-daily'
  | 'analytics'
  | 'labels'
  | 'settings';
