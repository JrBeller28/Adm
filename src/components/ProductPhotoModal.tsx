import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link, 
  Check, 
  Trash2, 
  Sparkles, 
  Package,
  Camera,
  AlertCircle
} from 'lucide-react';
import { PackagedProduct } from '../types';

interface ProductPhotoModalProps {
  product: PackagedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (productId: string, imageUrl: string) => void;
}

// Curated library of high-quality preset images for snacks, food & beverages
const PRESET_PHOTOS = [
  // Minuman & Kopi
  {
    name: 'Es Kopi Susu',
    category: 'Minuman',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Es Teh Manis',
    category: 'Minuman',
    url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Americano Dingin',
    category: 'Minuman',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Cappuccino Latte',
    category: 'Minuman',
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Matcha Latte',
    category: 'Minuman',
    url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80&auto=format&fit=crop',
  },
  // Snack & Keripik
  {
    name: 'Basreng Pedas',
    category: 'Snack',
    url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Keripik Singkong',
    category: 'Snack',
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Keripik Pisang Renyah',
    category: 'Snack',
    url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Makaroni Pedas Gurih',
    category: 'Snack',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Kacang Bawang / Biji',
    category: 'Snack',
    url: 'https://images.unsplash.com/photo-1536591375315-1b8368903274?w=400&q=80&auto=format&fit=crop',
  },
  // Makanan & Santapan
  {
    name: 'Nasi Goreng Spesial',
    category: 'Makanan',
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Roti Bakar Manis',
    category: 'Makanan',
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'French Fries Renyah',
    category: 'Makanan',
    url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&q=80&auto=format&fit=crop',
  },
  {
    name: 'Mie Goreng Telur',
    category: 'Makanan',
    url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80&auto=format&fit=crop',
  },
];

export const ProductPhotoModal: React.FC<ProductPhotoModalProps> = ({
  product,
  isOpen,
  onClose,
  onSavePhoto,
}) => {
  if (!isOpen || !product) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(product.imageUrl || '');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [presetCategory, setPresetCategory] = useState<string>('Semua');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WEBP).');
      return;
    }

    // Limit size to ~4MB to preserve local state performance
    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimum 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSelectedPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = () => {
    onSavePhoto(product.id, selectedPhoto);
    onClose();
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto('');
  };

  const filteredPresets = PRESET_PHOTOS.filter((item) => {
    if (presetCategory === 'Semua') return true;
    return item.category === presetCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200/60 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Kelola Foto Produk
              </h3>
              <p className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Current / Selected Preview Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/60 relative shadow-inner">
              {selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] gap-1">
                  <Package className="w-7 h-7 stroke-[1.5]" />
                  <span>Tanpa Foto</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="text-xs font-bold text-slate-900">
                Pratinjau Foto Produk
              </div>
              <p className="text-[11px] text-slate-500">
                Foto ini akan tampil di kasir POS, katalog produk, dan etalase toko.
              </p>
              {selectedPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold hover:underline pt-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Foto (Gunakan Ikon)</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Selector: Upload vs Preset Gallery vs URL */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload dari HP / File</span>
            </button>

            <button
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Koleksi Preset</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Link URL</span>
            </button>
          </div>

          {/* TAB 1: File Upload (Supports Drag & Drop + File Chooser) */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50/50 scale-99'
                    : 'border-slate-200/60 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Klik untuk memilih foto produk
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Mendukung format JPG, PNG, WEBP (maks. 4MB) atau seret foto ke sini
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Curated Preset Photos Library */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              {/* Category pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['Semua', 'Minuman', 'Snack', 'Makanan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPresetCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      presetCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of Preset Photos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {filteredPresets.map((preset, idx) => {
                  const isSelected = selectedPhoto === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(preset.url)}
                      className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                          : 'border-slate-200/60 hover:border-blue-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-2 text-white">
                        <div className="text-[10px] font-bold line-clamp-1">
                          {preset.name}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Custom Web URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Tempel Link URL Gambar Web:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/foto-produk.jpg"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrl.trim()) {
                      setSelectedPhoto(customUrl.trim());
                    }
                  }}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200/60 text-slate-600 font-bold text-xs hover:bg-white transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Foto Produk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
