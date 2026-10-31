import { PackageType } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTimeIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function getPackageBadgeInfo(packageType: PackageType): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (packageType) {
    case 'SAK_50KG':
      return {
        label: 'Sak / Karung 50kg',
        bg: 'bg-amber-100/90',
        text: 'text-amber-950',
        border: 'border-amber-300/90',
      };
    case 'PACK_5KG':
      return {
        label: 'Pack / Sak 5kg',
        bg: 'bg-sky-100/90',
        text: 'text-sky-950',
        border: 'border-sky-300/90',
      };
    case 'ECERAN_1KG':
      return {
        label: 'Eceran 1 Kg',
        bg: 'bg-emerald-100/90',
        text: 'text-emerald-950',
        border: 'border-emerald-300/90',
      };
    case 'ECERAN_500G':
      return {
        label: 'Eceran 500g',
        bg: 'bg-teal-100/90',
        text: 'text-teal-950',
        border: 'border-teal-300/90',
      };
    case 'LITER':
      return {
        label: 'Botol / Literan',
        bg: 'bg-blue-100/90',
        text: 'text-blue-950',
        border: 'border-blue-300/90',
      };
    case 'PCS':
      return {
        label: 'Satuan Pcs / Unit',
        bg: 'bg-indigo-100/90',
        text: 'text-indigo-950',
        border: 'border-indigo-300/90',
      };
    case 'KEMASAN_10K':
      return {
        label: 'Kemasan 10 Ribu',
        bg: 'bg-amber-100/90',
        text: 'text-amber-950',
        border: 'border-amber-300/90',
      };
    case 'KEMASAN_5K':
      return {
        label: 'Kemasan 5 Ribu',
        bg: 'bg-orange-100/90',
        text: 'text-orange-950',
        border: 'border-orange-300/90',
      };
    case 'KEMASAN_500G':
      return {
        label: 'Setengah Kilo (500g)',
        bg: 'bg-emerald-100/90',
        text: 'text-emerald-950',
        border: 'border-emerald-300/90',
      };
    case 'KEMASAN_250G':
      return {
        label: '250 Gram',
        bg: 'bg-teal-100/90',
        text: 'text-teal-950',
        border: 'border-teal-300/90',
      };
    case 'BAL':
      return {
        label: 'Karung / Bal Utuh',
        bg: 'bg-purple-100/90',
        text: 'text-purple-950',
        border: 'border-purple-300/90',
      };
    default:
      return {
        label: 'Kemasan Khusus',
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        border: 'border-slate-300',
      };
  }
}
