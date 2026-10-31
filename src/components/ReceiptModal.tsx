import React, { useEffect } from 'react';
import { Printer, CheckCircle2, MessageSquare, Copy, X } from 'lucide-react';
import { Transaction, StoreSettings } from '../types';
import { formatRupiah, formatDateTimeIndo } from '../utils/formatters';

interface ReceiptModalProps {
  transaction: Transaction | null;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  autoPrint?: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  settings,
  isOpen,
  onClose,
  autoPrint = false,
}) => {
  useEffect(() => {
    if (isOpen && autoPrint && transaction) {
      const timer = setTimeout(() => {
        window.print();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoPrint, transaction]);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textLines = [
      `=============================`,
      `    ${settings.storeName}    `,
      ` ${settings.address} `,
      `    Telp: ${settings.phone}   `,
      `=============================`,
      `No. Nota : ${transaction.invoiceNumber}`,
      `Tanggal  : ${formatDateTimeIndo(transaction.timestamp)}`,
      `Kasir    : ${transaction.cashierName}`,
      transaction.customerName ? `Pelanggan: ${transaction.customerName}` : '',
      `-----------------------------`,
      ...transaction.items.map(
        (i) => `${i.name}\n  ${i.qty} x ${formatRupiah(i.sellingPrice)} = ${formatRupiah(i.subtotal)}`
      ),
      `-----------------------------`,
      `TOTAL      : ${formatRupiah(transaction.totalAmount)}`,
      `METODE     : ${transaction.paymentMethod}`,
      transaction.paymentMethod === 'TUNAI'
        ? `BAYAR      : ${formatRupiah(transaction.cashReceived)}\nKEMBALI    : ${formatRupiah(transaction.change)}`
        : `QRIS REF   : ${transaction.qrisRef || '-'}`,
      `=============================`,
      settings.footerMessage,
      `=============================`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(textLines);
    alert('Struk berhasil disalin ke clipboard!');
  };

  const handleShareWhatsApp = () => {
    const textLines = [
      `*STRUK PEMBELIAN ${settings.storeName}*`,
      `${settings.address}`,
      `Telp: ${settings.phone}`,
      `--------------------------------`,
      `No. Nota: *${transaction.invoiceNumber}*`,
      `Tanggal: ${formatDateTimeIndo(transaction.timestamp)}`,
      `Kasir: ${transaction.cashierName}`,
      transaction.customerName ? `Pelanggan: ${transaction.customerName}` : '',
      `--------------------------------`,
      ...transaction.items.map(
        (i) => `• ${i.name}\n  ${i.qty} x ${formatRupiah(i.sellingPrice)} = *${formatRupiah(i.subtotal)}*`
      ),
      `--------------------------------`,
      `*TOTAL: ${formatRupiah(transaction.totalAmount)}*`,
      `Metode: ${transaction.paymentMethod}`,
      transaction.paymentMethod === 'TUNAI'
        ? `Tunai: ${formatRupiah(transaction.cashReceived)} | Kembali: ${formatRupiah(transaction.change)}`
        : `Status: LUNAS QRIS`,
      `\n${settings.footerMessage}`,
    ].filter(Boolean).join('\n');

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textLines)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200/60">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-sm">Transaksi Berhasil & Cetak Struk</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk (Thermal)</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-3.5 rounded-xl text-xs transition-colors cursor-pointer"
            title="Kirim ke WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60 font-medium py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer"
            title="Salin Struk Teks"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preview Struk Thermal (58mm / 80mm paper look) */}
        <div className="p-6 bg-slate-100/80 flex justify-center max-h-[60vh] overflow-y-auto">
          <div
            id="printable-receipt"
            className={`bg-white text-slate-900 ${settings.receiptPaperSize === '80mm' ? 'w-[300px]' : 'w-[220px]'} p-6 shadow-md rounded-xl font-mono text-[11px] leading-relaxed border border-slate-200/60 mx-auto transition-all duration-300`}
          >
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="text-lg font-bold uppercase tracking-tight text-slate-950">
                {settings.storeName}
              </div>
              <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                {settings.address}
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                Telp: {settings.phone}
              </div>
            </div>

            {/* Meta Info */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold text-slate-900">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal :</span>
                <span>{formatDateTimeIndo(transaction.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir   :</span>
                <span>{transaction.cashierName}</span>
              </div>
              {transaction.customerName && (
                <div className="flex justify-between">
                  <span>Meja/Plg:</span>
                  <span className="font-bold text-slate-900">{transaction.customerName}</span>
                </div>
              )}
            </div>

            {/* Item List */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-2">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-slate-900 leading-tight">
                    {item.name}
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {item.qty} x {formatRupiah(item.sellingPrice).replace('Rp', '').trim()}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1.5 text-[11px]">
              <div className="flex justify-between font-bold text-slate-950 text-xs">
                <span>TOTAL</span>
                <span className="text-blue-600">{formatRupiah(transaction.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>PEMBAYARAN</span>
                <span className="font-bold text-slate-900">{transaction.paymentMethod}</span>
              </div>
              {transaction.paymentMethod === 'TUNAI' ? (
                <>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>TUNAI DITERIMA</span>
                    <span>{formatRupiah(transaction.cashReceived)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>KEMBALIAN</span>
                    <span className="font-bold text-slate-900">
                      {formatRupiah(transaction.change)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600 text-[10px]">
                  <span>REF TRANSAKSI</span>
                  <span className="font-mono text-slate-900">{transaction.qrisRef || 'APPROVED'}</span>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="text-center pt-3 text-[10px] text-slate-500 font-sans space-y-1">
              <div className="whitespace-pre-line leading-normal">
                {settings.footerMessage}
              </div>
              <div className="text-[9px] text-slate-400 pt-1 font-mono">
                *** TERIMA KASIH ***
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Tutup & Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
};
