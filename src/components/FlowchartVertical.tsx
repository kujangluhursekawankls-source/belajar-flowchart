import React from 'react';
import { ArrowDown, CornerDownRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { FlowNode } from '../types/flowchart';

interface FlowchartVerticalProps {
  nodes: FlowNode[];
  activeNodeId: string | null;
  onSelectNode: (node: FlowNode) => void;
  selectedCategory: string;
}

export const FlowchartVertical: React.FC<FlowchartVerticalProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
  selectedCategory,
}) => {
  const filteredNodes = selectedCategory === 'all'
    ? nodes
    : nodes.filter(n => n.category === selectedCategory || n.type === 'terminator');

  return (
    <div className="w-full max-w-2xl mx-auto py-4 space-y-4">
      {filteredNodes.map((node, index) => {
        const isActive = activeNodeId === node.id;
        const isNextLast = index === filteredNodes.length - 1;

        return (
          <div key={node.id} className="relative flex flex-col items-center">
            {/* Step Node */}
            <div
              onClick={() => onSelectNode(node)}
              className={`w-full transition-all duration-200 cursor-pointer select-none ${
                isActive ? 'scale-[1.03] ring-4 ring-indigo-500/60 shadow-2xl' : 'hover:scale-[1.01]'
              }`}
            >
              {/* TERMINATOR (Oval / Pill) */}
              {node.type === 'terminator' && (
                <div
                  className={`w-full py-3.5 px-6 rounded-full text-center border shadow-lg transition flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
                      : 'bg-emerald-950/80 hover:bg-emerald-900/90 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <div className="font-bold text-sm md:text-base tracking-wide uppercase">
                    {node.title}
                  </div>
                </div>
              )}

              {/* INPUT / OUTPUT (Jajar Genjang / Parallelogram) */}
              {node.type === 'input_output' && (
                <div className="relative mx-3 py-3 px-6 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/40 text-purple-100 shadow-md transform -skew-x-6 rounded-lg transition">
                  <div className="transform skew-x-6 text-center space-y-0.5">
                    <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                      [ INPUT / OUTPUT DATA ]
                    </div>
                    <div className="font-bold text-sm text-white">
                      {node.title}
                    </div>
                    {node.subtitle && (
                      <div className="text-xs text-purple-200/80 line-clamp-1">
                        {node.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* KEPUTUSAN / DECISION (Belah Ketupat / Diamond Representation) */}
              {node.type === 'decision' && (
                <div className="relative w-full rounded-2xl bg-amber-950/60 hover:bg-amber-900/70 border-2 border-amber-500/60 p-4 text-amber-100 shadow-lg transition">
                  {/* Diamond Icon indicator */}
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="w-3.5 h-3.5 rotate-45 bg-amber-500 border border-amber-300 shadow-sm" />
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">
                      KEPUTUSAN (PERCABANGAN LOGIKA)
                    </span>
                  </div>

                  <div className="text-center font-bold text-sm md:text-base text-white">
                    {node.title}
                  </div>
                  {node.subtitle && (
                    <div className="text-center text-xs text-amber-200/80 mt-1">
                      {node.subtitle}
                    </div>
                  )}

                  {/* Branches preview */}
                  <div className="mt-3 pt-2 border-t border-amber-800/40 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">YA → #{node.yesTarget}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-950/50 border border-rose-700/50 text-rose-300 font-semibold">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">TIDAK → #{node.noTarget}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PROSES (Persegi Panjang / Standard Rectangle) */}
              {node.type === 'process' && (
                <div
                  className={`w-full py-3 px-5 rounded-xl border shadow-md transition ${
                    node.category === 'fallback'
                      ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-blue-950/70 hover:bg-blue-900/80 border-blue-500/40 text-blue-100'
                  }`}
                >
                  <div className="text-center space-y-0.5">
                    <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                      [ PROSES SISTEM ]
                    </div>
                    <div className="font-bold text-sm text-white">
                      {node.title}
                    </div>
                    {node.subtitle && (
                      <div className="text-xs text-blue-200/80 line-clamp-1">
                        {node.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Connecting Arrow */}
            {!isNextLast && (
              <div className="flex flex-col items-center my-1">
                <div className="w-0.5 h-4 bg-indigo-500/60" />
                <ArrowDown className="w-4 h-4 text-indigo-400 -mt-1" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
