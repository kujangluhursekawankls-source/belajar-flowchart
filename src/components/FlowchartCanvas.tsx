import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  Move,
  MousePointer,
} from 'lucide-react';
import { FlowNode, FlowConnection } from '../types/flowchart';

interface FlowchartCanvasProps {
  nodes: FlowNode[];
  connections: FlowConnection[];
  activeNodeId: string | null;
  onSelectNode: (node: FlowNode) => void;
  systemName: string;
  systemDescription: string;
}

export const FlowchartCanvas: React.FC<FlowchartCanvasProps> = ({
  nodes,
  connections,
  activeNodeId,
  onSelectNode,
  systemName,
  systemDescription,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: -100, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDist, setTouchDist] = useState<number | null>(null);

  // Node Map for fast coordinate lookup
  const nodeMap = new Map<string, FlowNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));
  const handleReset = () => {
    setZoom(0.85);
    setPan({ x: -100, y: 20 });
  };

  // Center on active node if set
  useEffect(() => {
    if (activeNodeId) {
      const activeNode = nodeMap.get(activeNodeId);
      if (activeNode && activeNode.x !== undefined && activeNode.y !== undefined) {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const targetX = rect.width / 2 - activeNode.x * zoom;
          const targetY = rect.height / 2 - activeNode.y * zoom;
          setPan({ x: targetX, y: targetY });
        }
      }
    }
  }, [activeNodeId]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile Android (Pan & Pinch to zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDist(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDist;
      setZoom((z) => Math.min(Math.max(z * factor, 0.4), 2.5));
      setTouchDist(dist);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDist(null);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.001;
    setZoom((z) => Math.min(Math.max(z + zoomDelta, 0.4), 2.5));
  };

  // Export as SVG
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart-sistem-pwa.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to generate orthogonal connector paths
  const getConnectorPath = (fromNode: FlowNode, toNode: FlowConnection) => {
    const target = nodeMap.get(toNode.to);
    if (!fromNode || !target) return '';

    const fx = fromNode.x || 0;
    const fy = fromNode.y || 0;
    const fw = fromNode.width || 200;
    const fh = fromNode.height || 60;

    const tx = target.x || 0;
    const ty = target.y || 0;
    const tw = target.width || 200;
    const th = target.height || 60;

    // Start point
    let startX = fx;
    let startY = fy + fh / 2;

    if (toNode.label === 'YA' && fromNode.type === 'decision') {
      // Branch down
      startX = fx;
      startY = fy + fh / 2;
    } else if (toNode.label === 'TIDAK' && fromNode.type === 'decision') {
      // Branch right or left depending on target x
      if (tx > fx) {
        startX = fx + fw / 2;
        startY = fy;
      } else {
        startX = fx - fw / 2;
        startY = fy;
      }
    }

    // End point (top of target)
    const endX = tx;
    const endY = ty - th / 2;

    // Smooth Orthogonal line calculation
    if (Math.abs(startX - endX) < 10) {
      // Straight vertical line
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    // Orthogonal with corner
    const midY = startY + (endY - startY) / 2;
    return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
  };

  return (
    <div className="relative w-full h-[620px] md:h-[750px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Perbesar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Perkecil (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="text-[11px] font-mono text-slate-400 px-1.5 min-w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Reset Posisi (Fit View)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleExportSVG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold shadow-lg backdrop-blur-md transition cursor-pointer"
            title="Ekspor diagram ke berkas vector SVG"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ekspor SVG</span>
          </button>
        </div>
      </div>

      {/* Navigation Touch Hint for Android */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-sm">
        <MousePointer className="w-3.5 h-3.5 text-indigo-400" />
        <span>Seret (Drag) untuk menggeser canvas • Scroll / Pinch untuk zoom • Klik node untuk detail</span>
      </div>

      {/* Interactive SVG Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className={`w-full flex-1 overflow-hidden cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.4" />
            </pattern>

            {/* Arrow Marker: Default Gray */}
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748b" />
            </marker>

            {/* Arrow Marker: Green (YA) */}
            <marker
              id="arrow-yes"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
            </marker>

            {/* Arrow Marker: Red (TIDAK) */}
            <marker
              id="arrow-no"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444" />
            </marker>

            {/* Drop Shadow Filter */}
            <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Canvas Transform Root */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* CONNECTOR PATHS */}
            {connections.map((conn, idx) => {
              const fromNode = nodeMap.get(conn.from);
              const toNode = nodeMap.get(conn.to);
              if (!fromNode || !toNode) return null;

              const pathString = getConnectorPath(fromNode, conn);
              const isYes = conn.label === 'YA';
              const isNo = conn.label === 'TIDAK';

              const strokeColor = isYes ? '#10b981' : isNo ? '#ef4444' : '#64748b';
              const markerEnd = isYes
                ? 'url(#arrow-yes)'
                : isNo
                ? 'url(#arrow-no)'
                : 'url(#arrow-default)';

              // Label Position calculation
              let labelX = (fromNode.x || 0);
              let labelY = (fromNode.y || 0) + (fromNode.height || 60) / 2 + 15;

              if (isNo && fromNode.type === 'decision') {
                labelX = (fromNode.x || 0) + (fromNode.width || 200) / 2 + 20;
                labelY = (fromNode.y || 0) - 8;
              } else if (isYes && fromNode.type === 'decision') {
                labelX = (fromNode.x || 0) + 16;
                labelY = (fromNode.y || 0) + (fromNode.height || 60) / 2 + 18;
              }

              return (
                <g key={`conn-${idx}`}>
                  <path
                    d={pathString}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isYes || isNo ? '3.5' : '2.5'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd={markerEnd}
                  />

                  {/* Decision Tag Label (YA / TIDAK) */}
                  {conn.label && (
                    <g transform={`translate(${labelX}, ${labelY})`}>
                      <rect
                        x="-20"
                        y="-10"
                        width="40"
                        height="20"
                        rx="4"
                        fill={isYes ? '#064e3b' : '#7f1d1d'}
                        stroke={isYes ? '#10b981' : '#ef4444'}
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {conn.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* FLOW NODES */}
            {nodes.map((node) => {
              const x = node.x || 0;
              const y = node.y || 0;
              const w = node.width || 260;
              const h = node.height || 70;
              const isActive = activeNodeId === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => onSelectNode(node)}
                  className="cursor-pointer transition-transform hover:opacity-95"
                  filter="url(#nodeShadow)"
                >
                  {/* ACTIVE GLOW RING */}
                  {isActive && (
                    <rect
                      x={-w / 2 - 8}
                      y={-h / 2 - 8}
                      width={w + 16}
                      height={h + 16}
                      rx={node.type === 'terminator' ? 40 : 16}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="4"
                      strokeDasharray="6 4"
                      className="animate-spin"
                    />
                  )}

                  {/* 1. TERMINATOR SHAPE (Oval / Stadium) */}
                  {node.type === 'terminator' && (
                    <>
                      <rect
                        x={-w / 2}
                        y={-h / 2}
                        width={w}
                        height={h}
                        rx={h / 2}
                        fill="#064e3b"
                        stroke={isActive ? '#34d399' : '#10b981'}
                        strokeWidth="3"
                      />
                      <circle cx={-w / 2 + 25} cy="0" r="5" fill="#34d399" />
                      <text
                        x="10"
                        y="5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {node.title}
                      </text>
                    </>
                  )}

                  {/* 2. DECISION SHAPE (Belah Ketupat / Diamond) */}
                  {node.type === 'decision' && (
                    <>
                      <polygon
                        points={`0,${-h / 2 - 6} ${w / 2 + 10},0 0,${h / 2 + 6} ${-w / 2 - 10},0`}
                        fill="#78350f"
                        stroke={isActive ? '#fbbf24' : '#f59e0b'}
                        strokeWidth="3"
                      />
                      <text
                        x="0"
                        y="-6"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {node.title}
                      </text>
                      {node.subtitle && (
                        <text
                          x="0"
                          y="14"
                          textAnchor="middle"
                          fill="#fef3c7"
                          fontSize="10"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                        >
                          {node.subtitle}
                        </text>
                      )}
                    </>
                  )}

                  {/* 3. INPUT / OUTPUT SHAPE (Jajar Genjang / Parallelogram) */}
                  {node.type === 'input_output' && (
                    <>
                      <polygon
                        points={`${-w / 2 + 20},${-h / 2} ${w / 2 + 20},${-h / 2} ${w / 2 - 20},${h / 2} ${-w / 2 - 20},${h / 2}`}
                        fill="#581c87"
                        stroke={isActive ? '#c084fc' : '#a855f7'}
                        strokeWidth="2.5"
                      />
                      <text
                        x="0"
                        y="-6"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {node.title}
                      </text>
                      {node.subtitle && (
                        <text
                          x="0"
                          y="14"
                          textAnchor="middle"
                          fill="#f3e8ff"
                          fontSize="10"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                        >
                          {node.subtitle}
                        </text>
                      )}
                    </>
                  )}

                  {/* 4. PROSES SHAPE (Persegi Panjang / Rectangle) */}
                  {node.type === 'process' && (
                    <>
                      <rect
                        x={-w / 2}
                        y={-h / 2}
                        width={w}
                        height={h}
                        rx="12"
                        fill={node.category === 'fallback' ? '#1e293b' : '#1e3a8a'}
                        stroke={
                          isActive
                            ? '#60a5fa'
                            : node.category === 'fallback'
                            ? '#475569'
                            : '#3b82f6'
                        }
                        strokeWidth="2.5"
                      />
                      <text
                        x="0"
                        y="-6"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {node.title}
                      </text>
                      {node.subtitle && (
                        <text
                          x="0"
                          y="14"
                          textAnchor="middle"
                          fill="#dbeafe"
                          fontSize="10"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                        >
                          {node.subtitle}
                        </text>
                      )}
                    </>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
