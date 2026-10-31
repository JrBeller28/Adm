import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, X, RefreshCw, Smartphone } from 'lucide-react';
import { StoreSettings } from '../types';
import { formatRupiah } from '../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';

interface QRISModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  invoiceNumber: string;
  settings: StoreSettings;
  onPaymentSuccess: (qrisRef: string) => void;
}

export const QRISModal: React.FC<QRISModalProps> = ({
  isOpen,
  onClose,
  amount,
  invoiceNumber,
  settings,
  onPaymentSuccess,
}) => {
  const [status, setStatus] = useState<'WAITING' | 'CHECKING' | 'SUCCESS'>('WAITING');
  const [qrisPayload, setQrisPayload] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('WAITING');
      const payload = `00020101021226590014ID.GO.QRIS.WWW0118${settings.qrisNmid}0215${invoiceNumber}520454115303360540${amount}5802ID59${settings.qrisMerchantName.slice(0, 15)}6007JAKARTA6304`;
      setQrisPayload(payload);
    }
  }, [isOpen, amount, invoiceNumber, settings]);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setStatus('CHECKING');
    setTimeout(() => {
      setStatus('SUCCESS');
      const ref = `QRIS-${Date.now().toString().slice(-8)}`;
      setTimeout(() => {
        onPaymentSuccess(ref);
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200/60">
        {/* Header QRIS */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white text-red-600 px-2 py-0.5 rounded font-bold text-xs tracking-wider">
              QRIS
            </div>
            <span className="text-xs font-medium text-red-100">
              Pembayaran Non-Tunai
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-red-200 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="text-xs text-slate-500 font-medium">Merchant:</div>
          <div className="font-bold text-slate-900 text-sm">{settings.qrisMerchantName}</div>
          <div className="text-[10px] text-slate-400 font-mono">NMID: {settings.qrisNmid}</div>

          {/* Amount Display */}
          <div className="mt-3 py-2 px-4 bg-slate-50 rounded-xl border border-slate-200/60 inline-block">
            <span className="text-xs text-slate-500 block">Total Tagihan:</span>
            <span className="text-xl font-bold text-slate-900">
              {formatRupiah(amount)}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="mt-4 p-4 bg-white border-2 border-slate-800 rounded-xl inline-block shadow-xs relative">
            {qrisPayload && (
              <QRCodeSVG
                value={qrisPayload}
                size={192}
                level="M"
                includeMargin={false}
              />
            )}

            {status === 'CHECKING' && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-2xs flex flex-col items-center justify-center rounded-xl">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  Memverifikasi Pembayaran...
                </span>
              </div>
            )}

            {status === 'SUCCESS' && (
              <div className="absolute inset-0 bg-emerald-500 text-white flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 mb-1" />
                <span className="text-sm font-bold">LUNAS!</span>
                <span className="text-[10px] text-emerald-100">Memproses Struk...</span>
              </div>
            )}
          </div>

          <p className="mt-3 text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>Scan pakai GoPay, OVO, Dana, BCA, Livin, dll</span>
          </p>

          {/* Simulate Scanner Button */}
          <div className="mt-5 pt-4 border-t border-slate-200/60">
            <button
              onClick={handleSimulatePayment}
              disabled={status !== 'WAITING'}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Konfirmasi Pelanggan Sudah Bayar</span>
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Batal / Ganti Metode Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
