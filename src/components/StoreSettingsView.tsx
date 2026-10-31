import React from 'react';
import { StoreSettings } from '../types';
import { Save } from 'lucide-react';

interface StoreSettingsViewProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    onUpdateSettings({ ...settings, [name]: finalValue });
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/60 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Toko</h2>
            <p className="text-sm text-slate-500">Konfigurasi kasir, struk, dan sinkronisasi</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Save className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Profil Toko</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Toko</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pesan Footer Struk</label>
              <input
                type="text"
                name="footerMessage"
                value={settings.footerMessage}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Konfigurasi Struk</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ukuran Kertas Printer</label>
              <select
                name="receiptPaperSize"
                value={settings.receiptPaperSize || '58mm'}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              >
                <option value="58mm">58mm (Printer Thermal Kecil)</option>
                <option value="80mm">80mm (Printer Thermal Lebar)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1.5">Mempengaruhi lebar struk saat dicetak atau diunduh PDF.</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-700">Cetak Struk Otomatis</div>
                <div className="text-xs text-slate-500">Otomatis mencetak struk setelah pembayaran sukses</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoPrintReceipt"
                  checked={settings.autoPrintReceipt}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Cloud Database</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-700">Sinkronisasi Otomatis (Firebase)</div>
                <div className="text-xs text-slate-500">Simpan perubahan inventaris dan data toko ke cloud agar aman</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="cloudSyncEnabled"
                  checked={settings.cloudSyncEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            {settings.cloudSyncEnabled && settings.lastCloudSyncTimestamp && (
              <p className="text-xs text-emerald-600 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                Terakhir disinkronkan: {new Date(settings.lastCloudSyncTimestamp).toLocaleString('id-ID')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
