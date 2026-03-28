import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  FolderHeart, 
  Music, 
  History,
  Home,
  BookOpen,
  Settings
} from 'lucide-react';

interface TaskbarProps {
  view: 'landing' | 'vault';
  onViewChange: (view: 'landing' | 'vault') => void;
  activeOverlay: string | null;
  onOverlayChange: (overlay: string | null) => void;
  onOpenSettings: () => void;
}

export default function Taskbar({ view, onViewChange, activeOverlay, onOverlayChange, onOpenSettings }: TaskbarProps) {
  const items = [
    { id: 'features', icon: <Sparkles size={20} />, label: 'Features', type: 'overlay' },
    { id: 'try-it', icon: <Search size={20} />, label: 'Try It', type: 'overlay' },
    { id: 'calendar', icon: <Calendar size={20} />, label: 'Calendar', type: 'overlay' },
    { id: 'albums', icon: <FolderHeart size={20} />, label: 'Albums', type: 'overlay' },
    { id: 'timeline', icon: <History size={20} />, label: 'Timeline', type: 'overlay' },
    { id: 'scrapbook', icon: <BookOpen size={20} />, label: 'Journal', type: 'overlay' },
    { id: 'music', icon: <Music size={20} />, label: 'Music', type: 'overlay' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-parchment/80 backdrop-blur-xl border border-light-brown/30 rounded-full shadow-2xl pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
      {items.map((item) => {
        const isActive = activeOverlay === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => {
              onOverlayChange(activeOverlay === item.id ? null : item.id);
            }}
            className={`relative group flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all flex-shrink-0 ${
              isActive 
                ? 'bg-moss text-cream shadow-inner' 
                : 'text-brown hover:bg-brown/10'
            }`}
          >
            <div className="scale-90 sm:scale-100">
              {item.icon}
            </div>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-moss text-cream text-[10px] font-hand rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block">
              {item.label}
            </span>
            {isActive && (
              <motion.div 
                layoutId="active-pill"
                className="absolute inset-0 bg-moss rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
      
      <div className="w-[1px] h-6 bg-brown/20 mx-1" />
      
      <button
        onClick={onOpenSettings}
        className="relative group flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all flex-shrink-0 text-brown hover:bg-brown/10"
      >
        <Settings size={20} />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-moss text-cream text-[10px] font-hand rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block">
          Settings
        </span>
      </button>
    </div>
  );
}
