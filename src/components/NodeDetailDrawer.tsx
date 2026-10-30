import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Info, CornerDownRight } from 'lucide-react';
import { FlowNode } from '../types/flowchart';

interface NodeDetailDrawerProps {
  node: FlowNode | null;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onSelectNode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const handleCopy = () => {
    if (node.codeSnippet) {
      navigator.clipboard.writeText(node.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getShapeBadge = (type: string) => {
    switch (type) {
      case 'terminator':
        return { label: 'Terminator (Mulai/Selesai)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'decision':
        return { label: 'Keputusan (Belah Ketupat / Diamond)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'input_output':
        return { label: 'Input / Output (Jajar Genjang)', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      default:
        return { label: 'Proses (Persegi Panjang)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    }
  };

  const badge = getShapeBadge(node.type);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      <div
        className="w-full md:max-w-xl max-h-[85vh] md:max-h-[90vh] bg-slate-900 border border-slate-800 rounded-t-3xl md:rounded-2xl p-5 md:p-6 shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag bar */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4 md:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                {badge.label}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ID: {node.id}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
              {node.title}
            </h2>
            {node.subtitle && (
              <p className="text-xs text-slate-400 mt-1">{node.subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
            aria-label="Tutup Detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 flex-1">
          {/* Penjelasan Teknis */}
          {node.technicalDetails && node.technicalDetails.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                Spesifikasi & Cara Kerja Proses PWA
              </h4>
              <ul className="space-y-1.5 pl-1">
                {node.technicalDetails.map((detail, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Percabangan Keputusan */}
          {node.type === 'decision' && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Alur Percabangan Keputusan:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {node.yesTarget && (
                  <button
                    onClick={() => onSelectNode(node.yesTarget!)}
                    className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-left hover:bg-emerald-900/40 transition group cursor-pointer"
                  >
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">
                      Cabang: YA (Benar)
                    </div>
                    <div className="text-white text-xs font-medium truncate mt-0.5 flex items-center gap-1">
                      <span>Lanjut ke #{node.yesTarget}</span>
                      <CornerDownRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                )}
                {node.noTarget && (
                  <button
                    onClick={() => onSelectNode(node.noTarget!)}
                    className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-left hover:bg-rose-900/40 transition group cursor-pointer"
                  >
                    <div className="text-[10px] font-bold text-rose-400 uppercase">
                      Cabang: TIDAK (Salah)
                    </div>
                    <div className="text-white text-xs font-medium truncate mt-0.5 flex items-center gap-1">
                      <span>Lanjut ke #{node.noTarget}</span>
                      <CornerDownRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Code Snippet */}
          {node.codeSnippet && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Implementasi Kode PWA (JavaScript / Web API)
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition py-0.5 px-2 rounded bg-slate-800 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-indigo-200 font-mono overflow-x-auto leading-relaxed">
                <code>{node.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
