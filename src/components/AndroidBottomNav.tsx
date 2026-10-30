import React from 'react';
import { Smartphone, Layers, Activity, FileText, Download } from 'lucide-react';

export type AndroidTab = 'vertical' | 'canvas' | 'simulator' | 'system' | 'apk';

interface AndroidBottomNavProps {
  currentTab: AndroidTab;
  onTabChange: (tab: AndroidTab) => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'vertical' as AndroidTab,
      label: 'Alur Android',
      icon: Smartphone,
    },
    {
      id: 'canvas' as AndroidTab,
      label: 'Kanvas 2D',
      icon: Layers,
    },
    {
      id: 'simulator' as AndroidTab,
      label: 'Simulator',
      icon: Activity,
    },
    {
      id: 'system' as AndroidTab,
      label: 'Identitas',
      icon: FileText,
    },
    {
      id: 'apk' as AndroidTab,
      label: 'Paket APK',
      icon: Download,
    },
  ];

  const handleTabClick = (tabId: AndroidTab) => {
    // Tactile haptic feedback for Android
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore if not allowed
      }
    }
    onTabChange(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 pb-[env(safe-area-inset-bottom)] shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-400 scale-110'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
