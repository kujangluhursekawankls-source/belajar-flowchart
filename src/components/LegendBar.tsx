import React from 'react';

export const LegendBar: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-400 font-semibold tracking-wide flex items-center gap-2">
          <span>LEGENDA SIMBOL STANDAR:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          {/* Terminator */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-3.5 rounded-full border border-emerald-400 bg-emerald-500/20" />
            <span className="font-medium text-emerald-300">Terminator (Mulai/Selesai)</span>
          </div>

          {/* Input / Output */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-3.5 border border-purple-400 bg-purple-500/20"
              style={{ transform: 'skewX(-20deg)' }}
            />
            <span className="font-medium text-purple-300">Input / Output (Data)</span>
          </div>

          {/* Proses */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-3.5 rounded-sm border border-blue-400 bg-blue-500/20" />
            <span className="font-medium text-blue-300">Proses (Eksekusi / SW)</span>
          </div>

          {/* Keputusan */}
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rotate-45 border border-amber-400 bg-amber-500/20" />
            <span className="font-medium text-amber-300">Keputusan (YA / TIDAK)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
