import React, { useState, useEffect } from 'react';
import {
  Layers,
  Smartphone,
  Eye,
  SlidersHorizontal,
  Info,
  Workflow,
  HelpCircle,
  Download,
  Maximize,
  Minimize,
  Monitor,
} from 'lucide-react';
import { PWA_FLOW_NODES, PWA_CONNECTIONS, SIMULATION_PRESETS } from './data/pwaFlowData';
import { FlowNode } from './types/flowchart';
import { SystemIdentityHeader } from './components/SystemIdentityHeader';
import { FlowchartVertical } from './components/FlowchartVertical';
import { FlowchartCanvas } from './components/FlowchartCanvas';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { FlowSimulator } from './components/FlowSimulator';
import { LegendBar } from './components/LegendBar';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AndroidBottomNav, AndroidTab } from './components/AndroidBottomNav';
import { AndroidApkModal } from './components/AndroidApkModal';

export default function App() {
  // System Identity State
  const [systemName, setSystemName] = useState(
    'Sistem Siklus Hidup & Arsitektur Progressive Web App (PWA)'
  );
  const [systemDescription, setSystemDescription] = useState(
    'Diagram alur proses menyeluruh: inisialisasi browser, registrasi Service Worker, caching offline-first, intersepsi fetch, antrean IndexedDB, hingga instalasi mandiri A2HS.'
  );

  // Tab State for Android Nav: 'vertical' | 'canvas' | 'simulator' | 'system' | 'apk'
  const [androidTab, setAndroidTab] = useState<AndroidTab>('vertical');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [inspectNode, setInspectNode] = useState<FlowNode | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // URL state
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-zcwgawfhtfgv3warnim35i-702679394276.asia-east1.run.app';

  // Toggle fullscreen (Immersive Android Mode)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleUpdateIdentity = (name: string, desc: string) => {
    setSystemName(name);
    setSystemDescription(desc);
  };

  const handleNodeSelect = (node: FlowNode) => {
    setActiveNodeId(node.id);
    setInspectNode(node);
  };

  const handleNodeSelectById = (nodeId: string) => {
    const found = PWA_FLOW_NODES.find((n) => n.id === nodeId);
    if (found) {
      setActiveNodeId(found.id);
      setInspectNode(found);
    }
  };

  const handleTabChange = (tab: AndroidTab) => {
    if (tab === 'apk') {
      setShowApkModal(true);
      return;
    }
    setAndroidTab(tab);
    if (tab === 'simulator') {
      setShowSimulator(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200 pb-20">
      {/* 1. ANDROID TOP APP BAR */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Wordmark / Brand */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>PWA Flowchart</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Android
                </span>
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links for Desktop / Tablet */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
            <button
              onClick={() => setAndroidTab('vertical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                androidTab === 'vertical'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Vertikal (Android)</span>
            </button>
            <button
              onClick={() => setAndroidTab('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                androidTab === 'canvas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Canvas 2D</span>
            </button>
            <button
              onClick={() => {
                setAndroidTab('simulator');
                setShowSimulator(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                androidTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Frame Toggle, Fullscreen, Install PWA) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Desktop Mockup Frame Toggle */}
            <button
              onClick={() => setDeviceFrameMode(!deviceFrameMode)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
              title="Pratinjau Frame Mockup HP Android"
            >
              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
              <span>{deviceFrameMode ? 'Layar Penuh' : 'Frame HP'}</span>
            </button>

            {/* Immersive Mode */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Layar Penuh / Immersive"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            <OfflineIndicator />
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* 2. MAIN VIEWPORT (Supports Full width or Android Phone Frame preview on desktop) */}
      <div className={`flex-1 w-full mx-auto ${deviceFrameMode ? 'py-8 flex justify-center' : 'py-4'}`}>
        <div
          className={`${
            deviceFrameMode
              ? 'w-[400px] h-[840px] bg-slate-950 border-[10px] border-slate-800 rounded-[48px] shadow-2xl overflow-y-auto relative flex flex-col ring-1 ring-slate-700/50'
              : 'max-w-7xl px-3 sm:px-6'
          }`}
        >
          {/* Android Speaker & Camera Notch (Only in Frame Mode) */}
          {deviceFrameMode && (
            <div className="sticky top-0 z-30 pt-3 pb-2 bg-slate-950 flex flex-col items-center">
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700 mr-2" />
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* IDENTITAS SISTEM (Prominent Header: Name on top, description right below) */}
            <SystemIdentityHeader
              systemName={systemName}
              systemDescription={systemDescription}
              onUpdateIdentity={handleUpdateIdentity}
            />

            {/* CONTROLS & FILTER BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-sm">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1 whitespace-nowrap">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  Filter:
                </span>
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'lifecycle', label: '1. Inisialisasi' },
                  { id: 'caching', label: '2. Offline/Cache' },
                  { id: 'sync', label: '3. Sync' },
                  { id: 'install', label: '4. A2HS' },
                ].map((tab) => {
                  const active = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => setShowApkModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/70 text-xs font-semibold transition cursor-pointer"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Paket APK</span>
                </button>

                <button
                  onClick={() => setShowHelp(true)}
                  className="p-1 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                  title="Panduan Simbol"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                </button>
              </div>
            </div>

            {/* SIMULATOR (Tab or toggle) */}
            {(androidTab === 'simulator' || showSimulator) && (
              <FlowSimulator
                presets={SIMULATION_PRESETS}
                nodes={PWA_FLOW_NODES}
                activeNodeId={activeNodeId}
                onSetActiveNodeId={setActiveNodeId}
              />
            )}

            {/* FLOWCHART SYMBOL LEGEND */}
            <LegendBar />

            {/* FLOWCHART VISUAL PRESENTATION */}
            <section className="relative w-full">
              {androidTab === 'canvas' ? (
                <FlowchartCanvas
                  nodes={
                    selectedCategory === 'all'
                      ? PWA_FLOW_NODES
                      : PWA_FLOW_NODES.filter(
                          (n) => n.category === selectedCategory || n.type === 'terminator'
                        )
                  }
                  connections={PWA_CONNECTIONS}
                  activeNodeId={activeNodeId}
                  onSelectNode={handleNodeSelect}
                  systemName={systemName}
                  systemDescription={systemDescription}
                />
              ) : (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 sm:p-5 shadow-xl backdrop-blur-sm">
                  <div className="text-center mb-4 space-y-0.5">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      Tata Letak Khusus Layar Ponsel Android
                    </span>
                    <p className="text-xs text-slate-400">
                      Sentuh kotak proses atau percabangan untuk membaca kode & spesifikasi
                    </p>
                  </div>

                  <FlowchartVertical
                    nodes={PWA_FLOW_NODES}
                    activeNodeId={activeNodeId}
                    onSelectNode={handleNodeSelect}
                    selectedCategory={selectedCategory}
                  />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* 3. ANDROID BOTTOM NAVIGATION BAR (Thumb Ergonomics) */}
      <AndroidBottomNav
        currentTab={androidTab}
        onTabChange={handleTabChange}
      />

      {/* 4. NODE DETAIL DRAWER / INSPECTOR */}
      <NodeDetailDrawer
        node={inspectNode}
        onClose={() => setInspectNode(null)}
        onSelectNode={handleNodeSelectById}
      />

      {/* 5. ANDROID APK / TWA PACKAGING MODAL */}
      <AndroidApkModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
        appUrl={appUrl}
      />

      {/* 6. HELP & GUIDELINES MODAL */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" />
                Ketentuan & Simbol Standar Diagram Flowchart
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-6 h-3 rounded-full border border-emerald-400 bg-emerald-500/20 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Terminator (Mulai / Selesai):</strong>
                  <p className="text-slate-400 mt-0.5">Menunjukkan titik awal mula sistem diinisiasi dan titik akhir ketika sistem selesai atau berada dalam mode siaga (standby).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-3 border border-purple-400 bg-purple-500/20 shrink-0 mt-0.5" style={{ transform: 'skewX(-20deg)' }} />
                <div>
                  <strong className="text-white">Input / Output (Jajar Genjang):</strong>
                  <p className="text-slate-400 mt-0.5">Menandai masuknya aksi dari pengguna (seperti klik tombol instal atau akses URL) atau keluaran informasi ke layar UI.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-3 border border-blue-400 bg-blue-500/20 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Proses (Persegi Panjang):</strong>
                  <p className="text-slate-400 mt-0.5">Eksekusi komputasi, operasi Service Worker (install, activate, fetch), pembacaan cache, atau pendaftaran antrean IndexedDB.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3.5 h-3.5 rotate-45 border border-amber-400 bg-amber-500/20 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Keputusan (Belah Ketupat / Diamond):</strong>
                  <p className="text-slate-400 mt-0.5">Percabangan logika dengan dua jalur terarah: <strong>YA</strong> (kondisi terpenuhi) dan <strong>TIDAK</strong> (kondisi tidak terpenuhi / fallback).</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              Mengerti & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 mb-12 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Visual Flowchart Sistem PWA • Edisi Khusus Android & PWA</span>
          <span className="text-[11px] text-slate-600">Mendukung WebAPK, Touch Gestures & Layar Penuh</span>
        </div>
      </footer>
    </div>
  );
}


