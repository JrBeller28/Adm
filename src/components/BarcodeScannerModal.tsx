import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Scan, Keyboard, Check, AlertCircle } from 'lucide-react';
import { PackagedProduct } from '../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: PackagedProduct[];
  onProductScanned: (product: PackagedProduct) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductScanned,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setManualCode('');
      setLastScanned(null);
      setCameraError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseCamera(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Silakan gunakan scanner USB / input barcode.');
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Ignore audio error
    }
  };

  const handleScanCode = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    const found = products.find(
      (p) => p.barcode.toLowerCase() === trimmed.toLowerCase() ||
             p.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (found) {
      playBeep();
      setLastScanned(found.name);
      onProductScanned(found);
      setManualCode('');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      alert(`Barcode "${trimmed}" tidak ditemukan dalam daftar produk kemasan.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScanCode(manualCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200/60">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm">Scanner Barcode Produk</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Last scanned alert */}
          {lastScanned && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Berhasil scan: <strong>{lastScanned}</strong></span>
            </div>
          )}

          {/* Scanner options toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (useCamera) {
                  stopCamera();
                } else {
                  startCamera();
                }
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                useCamera
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{useCamera ? 'Matikan Kamera' : 'Scan via Kamera HP/Web'}</span>
            </button>
          </div>

          {/* Camera Viewport */}
          {useCamera && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              {/* Laser scan animation overlay */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-28 border-2 border-dashed border-amber-400 rounded-lg pointer-events-none flex flex-col justify-center items-center">
                <div className="w-full h-0.5 bg-red-500 shadow-sm shadow-red-500 animate-pulse" />
                <span className="text-[10px] text-white/80 bg-black/50 px-2 py-0.5 rounded mt-8">
                  Arahkan barcode ke dalam kotak
                </span>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Input Gun / Keyboard input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-slate-500" />
                <span>Scanner USB / Input Kode Manual:</span>
              </span>
              <span className="text-[10px] text-slate-400">Tekan Enter untuk cari</span>
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Contoh: 8991001001 atau nama snack..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <button
                onClick={() => handleScanCode(manualCode)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Scan
              </button>
            </div>
          </div>

          {/* Quick Click Sample Barcodes for fast testing */}
          <div className="pt-2 border-t border-slate-200/60">
            <div className="text-[11px] font-medium text-slate-500 mb-2">
              Simulasi Cepat (Klik Barcode):
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {products.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleScanCode(p.barcode)}
                  className="text-left p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200/60 hover:border-amber-200 transition-colors text-[11px]"
                >
                  <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                  <div className="text-slate-500 font-mono text-[10px]">{p.barcode}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200/60 flex justify-end">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
