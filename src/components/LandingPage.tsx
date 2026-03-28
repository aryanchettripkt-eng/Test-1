import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Flower, 
  Camera, 
  Mic, 
  Music, 
  BookOpen, 
  Search, 
  Lock, 
  Shield, 
  Download, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  Settings
} from 'lucide-react';
import { searchMemories, Memory } from '../lib/gemini';

interface LandingPageProps {
  onEnterVault: () => void;
  memories: Memory[];
  onOpenSettings: () => void;
}

export default function LandingPage({ onEnterVault, memories, onOpenSettings }: LandingPageProps) {
  const [demoQuery, setDemoQuery] = useState('');
  const [demoResult, setDemoResult] = useState<{ intro: string; memoryId: string | null } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;

      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const token = event.data.token;
        handleSyncPhotos(token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSyncPhotos = async (token: string) => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/photos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch photos');
      const data = await response.json();
      console.log('Synced photos:', data);
      alert('Successfully synced your Google Photos! They are now being woven into your journal.');
    } catch (error) {
      console.error('Sync Error:', error);
      alert('Failed to sync photos. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const startGoogleSync = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      window.open(url, 'google_auth', 'width=600,height=700');
    } catch (error) {
      console.error('Auth URL Error:', error);
    }
  };

  const handleDemoSearch = async () => {
    if (!demoQuery.trim()) return;
    setIsSearching(true);
    const result = await searchMemories(demoQuery, memories);
    setDemoResult(result);
    setIsSearching(false);
  };

  return (
    <div className="relative z-10">
      <div className="film-grain" />
      <div className="light-leak" />
      
      {/* Scattered Scrapbook Photos & Desk Clutter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        {/* Top Left: Camera & Photos */}
        <motion.div 
          initial={{ opacity: 0, x: -50, y: -50, rotate: -20 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: -15 }}
          transition={{ duration: 1.2 }}
          className="absolute top-[5%] left-[5%] w-64 h-64 z-0"
        >
          <div className="absolute top-0 left-0 w-40 h-32 bg-soft-black rounded-sm shadow-2xl flex items-center justify-center border-4 border-zinc-800">
             <div className="w-20 h-20 rounded-full border-8 border-zinc-700 bg-zinc-900 shadow-inner" />
             <div className="absolute top-2 right-4 w-6 h-4 bg-zinc-700 rounded-sm" />
          </div>
          <motion.div 
            initial={{ opacity: 0, rotate: 10 }}
            animate={{ opacity: 1, rotate: 5 }}
            transition={{ delay: 0.5 }}
            className="absolute top-20 left-10 w-32 h-40 bg-white p-2 shadow-xl border border-brown/10 rotate-12"
          >
            <img src="https://picsum.photos/seed/mem1/300/400" className="w-full h-32 object-cover grayscale-[0.3]" referrerPolicy="no-referrer" />
            <div className="mt-1 font-hand text-[10px] text-brown/60 text-center">Summer '94</div>
          </motion.div>
        </motion.div>

        {/* Top Right: Open Book & Headphones */}
        <motion.div 
          initial={{ opacity: 0, x: 50, y: -50, rotate: 20 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute top-[8%] right-[5%] w-72 h-72 z-0"
        >
          <div className="absolute top-0 right-0 w-56 h-72 bg-parchment shadow-2xl rounded-sm border-r-8 border-brown/20 flex overflow-hidden">
            <div className="w-1/2 border-r border-brown/10 p-4">
              <div className="w-full h-2 bg-brown/10 mb-2" />
              <div className="w-3/4 h-2 bg-brown/10 mb-2" />
              <div className="w-full h-2 bg-brown/10 mb-2" />
            </div>
            <div className="w-1/2 p-4">
              <div className="w-full h-2 bg-brown/10 mb-2" />
              <div className="w-1/2 h-2 bg-brown/10 mb-2" />
            </div>
          </div>
          {/* Headphones */}
          <div className="absolute -top-10 -right-5 w-48 h-48 border-[12px] border-soft-black rounded-full opacity-40" />
        </motion.div>

        {/* Bottom Left: Phone & Jeans Hint */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute bottom-[-10%] left-[10%] w-80 h-96 z-0"
        >
          <div className="w-full h-full bg-blue-900/20 rounded-t-full blur-3xl" />
          <div className="absolute top-20 left-20 w-32 h-64 bg-zinc-900 rounded-2xl shadow-2xl border-4 border-zinc-800 p-2">
            <div className="w-full h-full bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
               <Music className="text-zinc-600 animate-pulse" size={40} />
            </div>
          </div>
        </motion.div>

        {/* Bottom Right: Drawing Book & Crayons & Checkered Blanket */}
        <motion.div 
          initial={{ opacity: 0, x: 50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="absolute bottom-[5%] right-[5%] w-80 h-80 z-0"
        >
          <div className="absolute bottom-0 right-0 w-full h-full bg-checkered rounded-full blur-2xl opacity-40" />
          <div className="absolute bottom-10 right-10 w-56 h-72 bg-white shadow-2xl rounded-sm p-6 rotate-[-5deg]">
             <div className="w-full h-full border-2 border-dashed border-brown/10 flex items-center justify-center">
                <Flower className="text-dusty-rose/30" size={80} />
             </div>
          </div>
          {/* Crayons */}
          <div className="absolute bottom-5 right-20 flex gap-1 rotate-12">
            <div className="w-2 h-16 bg-red-400 rounded-full shadow-sm" />
            <div className="w-2 h-14 bg-blue-400 rounded-full shadow-sm" />
            <div className="w-2 h-18 bg-yellow-400 rounded-full shadow-sm" />
          </div>
        </motion.div>

        {/* Floating Stickers & Notes */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-[40%] right-[15%] w-12 h-12 bg-faded-yellow rounded-full flex items-center justify-center shadow-md rotate-12 border border-brown/20 font-hand text-xs text-brown">oops</div>
          <div className="absolute top-[25%] left-[20%] w-16 h-8 bg-dusty-rose/40 rounded-sm flex items-center justify-center shadow-sm -rotate-6 border border-brown/10 font-hand text-[10px] text-dark-brown">i love you!</div>
          <div className="absolute bottom-[30%] left-[5%] font-hand text-sm text-brown/40 italic">live, laugh, and love... :)</div>
          <div className="absolute top-[10%] left-[45%] font-hand text-xs text-brown/30 tracking-widest">i think i like this little life...</div>
        </motion.div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-4 flex items-center justify-between bg-gradient-to-b from-cream/95 to-transparent backdrop-blur-[4px]">
        <a href="#" className="font-serif text-xl text-dark-brown flex items-center gap-2">
          Reminiq
        </a>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-brown/60 hover:text-brown transition-colors"
          title="API Settings"
        >
          <Settings size={20} />
        </button>
      </nav>

      {/* Hero */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-5 py-20 bg-[radial-gradient(ellipse_at_30%_40%,rgba(232,216,144,0.25)_0%,transparent_60%),radial-gradient(ellipse_at_70%_60%,rgba(201,160,160,0.2)_0%,transparent_55%),radial-gradient(ellipse_at_50%_20%,rgba(138,158,123,0.15)_0%,transparent_50%),var(--color-warm-white)] text-center overflow-hidden relative">
        {/* Decorative Desk Clutter */}
        <motion.div 
          initial={{ opacity: 0, rotate: -15, x: -100 }}
          animate={{ opacity: 1, rotate: -5, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute top-20 left-10 w-48 h-64 bg-white p-3 pb-12 shadow-2xl border border-black/5 rotate-[-5deg] hidden lg:block"
        >
          <img src="https://picsum.photos/seed/vintage1/400/600" className="w-full h-full object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
          <div className="absolute bottom-3 left-0 right-0 font-hand text-sm text-brown">Paris, 1994</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, rotate: 15, x: 100 }}
          animate={{ opacity: 1, rotate: 8, x: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute bottom-40 right-10 w-56 h-40 bg-white p-3 pb-10 shadow-2xl border border-black/5 rotate-[8deg] hidden lg:block"
        >
          <img src="https://picsum.photos/seed/vintage2/600/400" className="w-full h-full object-cover sepia-[0.2]" referrerPolicy="no-referrer" />
          <div className="absolute bottom-2 left-0 right-0 font-hand text-xs text-brown">The old garden gate</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute top-1/4 right-[15%] w-32 h-32 opacity-60 pointer-events-none hidden md:block"
        >
          <div className="w-full h-full border-2 border-dashed border-moss/20 rounded-full animate-spin-slow" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-moss/30" size={40} />
        </motion.div>

        {/* Floating Stickers */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[15%] left-[25%] px-4 py-1 bg-faded-yellow/40 border border-brown/10 rounded-full font-hand text-xs text-brown/60 backdrop-blur-sm hidden sm:block"
        >
          ✦ remember this ✦
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0], rotate: [3, -3, 3] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-[20%] left-[15%] px-4 py-1 bg-dusty-rose/20 border border-brown/10 rounded-full font-hand text-xs text-brown/60 backdrop-blur-sm hidden sm:block"
        >
          stay curious
        </motion.div>

        <div className="relative px-20 py-15 max-w-[700px] z-20">
          {/* Torn paper edge top */}
          <div className="absolute top-[-8px] left-[-4px] right-[-4px] h-5 bg-warm-white torn-edge-top z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block font-hand text-sm text-moss bg-moss/10 border border-moss/30 px-3.5 py-1 rounded-full mb-6 tracking-widest"
          >
            ✦ a personal memory keeper ✦
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-serif text-6xl md:text-8xl font-semibold text-dark-brown leading-[1.05] mb-5"
          >
            Reminiq
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-classic italic text-xl text-brown leading-relaxed mb-10"
          >
            A place where your memories rest,<br />
            like pressed flowers between old pages.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              onClick={onEnterVault}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="inline-block px-9 py-3.5 bg-moss text-cream font-hand text-lg tracking-wider rounded-[2px] relative transition-all hover:bg-dark-brown hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[3px_3px_0_var(--color-light-brown),6px_6px_0_rgba(138,158,123,0.3)] hover:shadow-[5px_5px_0_var(--color-light-brown),8px_8px_0_rgba(138,158,123,0.3)]"
            >
              ✦ Open the Journal ✦
            </motion.button>
            
            <motion.button 
              onClick={startGoogleSync}
              disabled={isSyncing}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="inline-flex items-center justify-center gap-2 px-9 py-3.5 bg-white text-dark-brown font-hand text-lg tracking-wider rounded-[2px] border border-light-brown/30 transition-all hover:bg-cream hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[3px_3px_0_var(--color-light-brown),6px_6px_0_rgba(138,158,123,0.1)] hover:shadow-[5px_5px_0_var(--color-light-brown),8px_8px_0_rgba(138,158,123,0.1)] disabled:opacity-50"
            >
              <Camera size={20} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : "Sync Google Photos"}
            </motion.button>
          </div>
        </div>
      </section>

      <footer className="bg-ink py-20 px-10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-parchment/20 to-transparent" />
        <div className="font-serif text-2xl text-parchment italic">Reminiq</div>
        <p className="font-hand text-base text-parchment/50 max-w-[300px] text-center md:text-left">Made with warmth for quiet people with full hearts.</p>
        <div className="flex gap-8">
          {['Privacy', 'About', 'Contact'].map(l => (
            <a key={l} href="#" className="font-hand text-base text-parchment/60 hover:text-dusty-rose transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
