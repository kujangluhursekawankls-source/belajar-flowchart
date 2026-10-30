import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
        isOnline
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-amber-400" />
          <span>Mode Offline (Cache Aktif)</span>
        </>
      )}
    </div>
  );
};
