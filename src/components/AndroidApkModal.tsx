import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, ExternalLink, Copy, Check, Terminal, ShieldCheck } from 'lucide-react';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const cliCommand = `npx @bubblewrap/cli init --manifest="${appUrl}/manifest.webmanifest" && npx @bubblewrap/cli build`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl overflow-y-auto space-y-4">
        {/* Mobile drag handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Versi Android & Paket APK
              </h3>
              <p className="text-xs text-slate-400">
                Pilihan cara menjalankan di perangkat Android
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METODE 1: WebAPK (Instan & Direkomendasikan) */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Metode 1: WebAPK Bawaan Android (Tanpa Download File APK)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sistem operasi Android (versi 8+) secara otomatis mengubah PWA ini menjadi file <strong>WebAPK resmi</strong> saat Anda menekan tombol instal. Ikon akan terpasang di *app drawer*, mendukung notifikasi latar belakang, dan berjalan mandiri di layar penuh (*standalone*).
          </p>
          <div className="pt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-emerald-300 font-medium">
              Buka di Chrome Android → Tekan "Instal PWA"
            </span>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 text-xs py-1 px-2.5 rounded-lg bg-emerald-700/50 hover:bg-emerald-600/60 text-white transition cursor-pointer font-medium"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'URL Tersalin' : 'Salin URL'}</span>
            </button>
          </div>
        </div>

        {/* METODE 2: PWABuilder (Download File APK / AAB untuk Google Play) */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
              <span>Metode 2: Unduh File .APK / .AAB via PWABuilder</span>
            </div>
            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
            >
              <span>Buka Tool</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gunakan layanan resmi <strong>PWABuilder.com</strong> (didukung Microsoft & Google) untuk membuat file installer `.apk` mandiri atau paket `.aab` untuk Google Play Store:
          </p>
          <ol className="text-xs text-slate-300 space-y-1 list-decimal pl-4">
            <li>Kunjungi <strong>pwabuilder.com</strong></li>
            <li>Tempelkan tautan aplikasi ini: <code className="text-indigo-300 font-mono text-[11px] bg-slate-900 px-1 rounded">{appUrl}</code></li>
            <li>Klik <strong>Build Android Package</strong> untuk langsung mengunduh file `.apk` bertandatangan digital.</li>
          </ol>
        </div>

        {/* METODE 3: Google Bubblewrap CLI */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Metode 3: CLI Google Bubblewrap (Developer)
            </span>
            <button
              onClick={handleCopyCli}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCli ? 'Disalin' : 'Salin Perintah'}</span>
            </button>
          </div>
          <pre className="p-2.5 rounded-lg bg-slate-900 text-[11px] text-indigo-300 font-mono overflow-x-auto">
            <code>{cliCommand}</code>
          </pre>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
        >
          Tutup Panduan
        </button>
      </div>
    </div>
  );
};
