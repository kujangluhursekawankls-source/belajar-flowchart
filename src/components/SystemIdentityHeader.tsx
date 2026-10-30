import React, { useState } from 'react';
import { Edit3, Check, RotateCcw, Sparkles } from 'lucide-react';

interface SystemIdentityProps {
  systemName: string;
  systemDescription: string;
  onUpdateIdentity: (name: string, description: string) => void;
}

export const SystemIdentityHeader: React.FC<SystemIdentityProps> = ({
  systemName,
  systemDescription,
  onUpdateIdentity,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(systemName);
  const [draftDesc, setDraftDesc] = useState(systemDescription);

  const presets = [
    {
      name: 'Sistem Siklus Hidup & Arsitektur Progressive Web App (PWA)',
      desc: 'Diagram alur proses menyeluruh: inisialisasi browser, registrasi Service Worker, caching offline-first, intersepsi fetch, antrean IndexedDB, hingga instalasi mandiri A2HS.',
    },
    {
      name: 'Sistem Katalog & Transaksi PWA Offline-First',
      desc: 'Alur kerja aplikasi penjualan berbasis PWA yang menjamin operasional kasir tetap berjalan tanpa koneksi internet dengan sinkronisasi background otomatis.',
    },
    {
      name: 'Sistem Monitoring Lapangan Berbasis PWA',
      desc: 'Arsitektur pengumpulan data inspeksi lapangan teknisi dengan cache lokal, penanganan sinyal lemah, dan notifikasi sistem terintegrasi.',
    },
  ];

  const handleSave = () => {
    if (draftName.trim()) {
      onUpdateIdentity(draftName.trim(), draftDesc.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDraftName(systemName);
    setDraftDesc(systemDescription);
    setIsEditing(false);
  };

  const handleApplyPreset = (name: string, desc: string) => {
    setDraftName(name);
    setDraftDesc(desc);
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800/80 p-5 md:p-6 shadow-xl backdrop-blur-md">
      {!isEditing ? (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              IDENTITAS SISTEM
            </div>
            {/* Nama sistem ditampilkan sebagai judul utama di bagian atas diagram */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {systemName}
            </h1>
            {/* Deskripsi sistem ditampilkan tepat di bawah nama sistem */}
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-4xl pt-0.5">
              {systemDescription}
            </p>
          </div>

          <button
            onClick={() => {
              setDraftName(systemName);
              setDraftDesc(systemDescription);
              setIsEditing(true);
            }}
            className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer shrink-0"
            title="Ubah Nama & Deskripsi Sistem"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kustomisasi Identitas</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              Sesuaikan Identitas Sistem
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Check className="w-3.5 h-3.5" />
                Simpan
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Sistem (Judul Utama Diagram)
              </label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Contoh: Sistem Arsitektur & Siklus Hidup PWA"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deskripsi Sistem (Subjudul Tepat di Bawah Nama Sistem)
              </label>
              <textarea
                value={draftDesc}
                onChange={(e) => setDraftDesc(e.target.value)}
                rows={2}
                placeholder="Jelaskan secara singkat fungsi dan tujuan sistem..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Pilih Contoh Preset Siap Pakai:
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p.name, p.desc)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white text-xs transition text-left"
                >
                  {p.name.split(' ')[1] || `Preset ${idx + 1}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
