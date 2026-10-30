import React, { useState } from 'react';
import { Download, Check, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>PWA Terpasang</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  return (
    <>
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          title="Instal aplikasi ini ke perangkat Android / Desktop"
        >
          <Download className="w-4 h-4" />
          <span>{installSuccess ? 'Berhasil Terpasang' : 'Instal PWA'}</span>
        </button>
      )}

      {isIOS && (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <Share className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instal di iOS</span>
          </button>

          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">Instal PWA di Safari iPhone/iPad</h3>
                  <button
                    onClick={() => setShowIOSGuide(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>1. Tekan tombol <strong>Bagikan (Share)</strong> di bilah bawah browser Safari.</p>
                  <p>2. Gulir ke bawah lalu pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</p>
                  <p>3. Tekan <strong>Tambah (Add)</strong> di pojok kanan atas.</p>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
                >
                  Mengerti
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!isInstallable && !isIOS && !isInstalled && (
        <button
          onClick={() => {
            alert('Aplikasi siap diinstal! Di browser Android/Chrome, buka menu browser (titik tiga) lalu pilih "Instal Aplikasi" atau "Tambahkan ke Layar Utama".');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Info Instal PWA</span>
        </button>
      )}
    </>
  );
};
