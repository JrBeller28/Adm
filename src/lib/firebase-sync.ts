import { doc, setDoc, getDocs, collection, writeBatch } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { db, auth } from './firebase';
import { BulkStockItem, PackagedProduct, StoreSettings } from '../types';

export const syncToFirebase = async (
  bulkStocks: BulkStockItem[],
  packagedProducts: PackagedProduct[],
  settings: StoreSettings
) => {
  // Ensure user is signed in before syncing
  if (!auth.currentUser) {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  const batch = writeBatch(db);

  // Sync Bulk Stocks
  bulkStocks.forEach((item) => {
    const ref = doc(db, 'bulkStocks', item.id);
    batch.set(ref, item);
  });

  // Sync Packaged Products
  packagedProducts.forEach((item) => {
    const ref = doc(db, 'packagedProducts', item.id);
    batch.set(ref, item);
  });

  // Sync Settings
  const settingsRef = doc(db, 'storeSettings', 'default');
  batch.set(settingsRef, settings);

  await batch.commit();
};

export const fetchFromFirebase = async () => {
  const bulkStocksSnap = await getDocs(collection(db, 'bulkStocks'));
  const bulkStocks = bulkStocksSnap.docs.map(doc => doc.data() as BulkStockItem);

  const packagedProductsSnap = await getDocs(collection(db, 'packagedProducts'));
  const packagedProducts = packagedProductsSnap.docs.map(doc => doc.data() as PackagedProduct);

  const settingsSnap = await getDocs(collection(db, 'storeSettings'));
  let settings: StoreSettings | null = null;
  if (!settingsSnap.empty) {
    settings = settingsSnap.docs[0].data() as StoreSettings;
  }

  return { bulkStocks, packagedProducts, settings };
};
