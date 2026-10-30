import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { SimulationPreset, FlowNode } from '../types/flowchart';

interface FlowSimulatorProps {
  presets: SimulationPreset[];
  nodes: FlowNode[];
  activeNodeId: string | null;
  onSetActiveNodeId: (id: string | null) => void;
}

export const FlowSimulator: React.FC<FlowSimulatorProps> = ({
  presets,
  nodes,
  activeNodeId,
  onSetActiveNodeId,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState(presets[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentPreset = presets.find((p) => p.id === selectedPresetId) || presets[0];
  const nodeMap = new Map<string, FlowNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const currentNode = currentPreset?.path[currentStepIndex]
    ? nodeMap.get(currentPreset.path[currentStepIndex])
    : null;

  // Sync active node to parent
  useEffect(() => {
    if (currentPreset?.path[currentStepIndex]) {
      onSetActiveNodeId(currentPreset.path[currentStepIndex]);
    }
  }, [currentStepIndex, currentPreset]);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < currentPreset.path.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1600);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, currentPreset]);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (currentStepIndex >= currentPreset.path.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < currentPreset.path.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    onSetActiveNodeId(null);
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              Simulator Interaktif Alur PWA
            </h3>
            <p className="text-[11px] text-slate-400">
              Uji coba jalannya proses dan percabangan keputusan secara otomatis
            </p>
          </div>
        </div>

        {/* Step Counter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-mono">
            Langkah: <strong className="text-white">{currentStepIndex + 1}</strong> / {currentPreset.path.length}
          </span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / currentPreset.path.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                  : 'bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Current Step Description Card */}
      {currentNode && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span>Node Aktif: {currentNode.id}</span>
              <span>•</span>
              <span className="capitalize">{currentNode.type}</span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {currentNode.title}
            </div>
            {currentNode.subtitle && (
              <div className="text-xs text-slate-300 line-clamp-1">
                {currentNode.subtitle}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Mulai Simulasi</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= currentPreset.path.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Langkah Berikutnya</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Ulangi dari Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 italic hidden sm:block">
          {currentPreset.description}
        </div>
      </div>
    </div>
  );
};
