import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Vault from './components/Vault';
import Taskbar from './components/Taskbar';
import ExtraPages from './components/ExtraPages';
import SmartChat from './components/SmartChat';
import { Memory, Album, DayReaction, sortMemoriesIntoAlbums } from './lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'vault'>('landing');
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [dayReactions, setDayReactions] = useState<DayReaction[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState<string | null>(null);

  // Sync state
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [googlePhotos, setGooglePhotos] = useState<any[]>([]);
  const [isFetchingPhotos, setIsFetchingPhotos] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setGoogleToken(event.data.token);
        fetchGooglePhotos(event.data.token);
      }
      if (event.data?.type === 'SPOTIFY_AUTH_SUCCESS') {
        setSpotifyToken(event.data.token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const connectGooglePhotos = async () => {
    const response = await fetch('/api/auth/google/url');
    const { url } = await response.json();
    window.open(url, 'google_auth', 'width=600,height=700');
  };

  const connectSpotify = async () => {
    const response = await fetch('/api/auth/spotify/url');
    const { url } = await response.json();
    window.open(url, 'spotify_auth', 'width=600,height=700');
  };

  const fetchGooglePhotos = async (token: string) => {
    setIsFetchingPhotos(true);
    try {
      const response = await fetch('/api/photos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setGooglePhotos(data.mediaItems || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsFetchingPhotos(false);
    }
  };

  // Seed initial memories
  useEffect(() => {
    const initialMemories: Memory[] = [
      {
        id: '1',
        type: 'text',
        title: 'A quiet Tuesday thought',
        desc: 'Had this idea about a community garden where each tile is made by a different neighbor. Something about the light on the courtyard.',
        mood: 'nostalgic',
        location: 'Home, late evening',
        date: new Date('2023-11-12T18:00:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/garden/800/600'
      },
      {
        id: '2',
        type: 'photo',
        title: 'The café in the rain',
        desc: 'It rained all afternoon and we stayed. Three rounds of coffee. We talked about everything we were afraid of.',
        mood: 'bittersweet',
        location: 'The corner café',
        date: new Date('2023-07-08T14:30:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/cafe/800/600'
      },
      {
        id: '3',
        type: 'text',
        title: 'Grandma folding cranes',
        desc: 'The light came through yellow curtains and made everything amber. I photographed it with my eyes.',
        mood: 'love',
        location: "Grandma's kitchen",
        date: new Date('2023-08-20T10:00:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/grandma/800/600'
      },
      {
        id: '4',
        type: 'photo',
        title: 'Neon Tokyo Nights',
        desc: 'The city never sleeps, and neither did we. Ramen at 3 AM tasted like victory.',
        mood: 'joy',
        location: 'Shinjuku, Tokyo',
        date: new Date('2023-12-15T03:00:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/tokyo/800/600'
      },
      {
        id: '5',
        type: 'photo',
        title: 'Mountain Mist',
        desc: 'Waking up above the clouds. The silence was so loud it felt like a physical weight.',
        mood: 'peaceful',
        location: 'Swiss Alps',
        date: new Date('2023-05-22T06:00:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/alps/800/600'
      },
      {
        id: '6',
        type: 'photo',
        title: 'Old Library Scent',
        desc: 'Dusty paper and vanilla. I could stay here forever, lost in stories that aren\'t mine.',
        mood: 'nostalgic',
        location: 'Oxford Library',
        date: new Date('2023-09-10T11:00:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/library/800/600'
      },
      {
        id: '7',
        type: 'photo',
        title: 'Golden Hour Beach',
        desc: 'The sand was warm and the water was cold. Perfect balance.',
        mood: 'joy',
        location: 'Malibu, CA',
        date: new Date('2023-08-05T19:30:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/beach/800/600'
      },
      {
        id: '8',
        type: 'photo',
        title: 'Abandoned Piano',
        desc: 'Found in a forest clearing. It played a song of decay and beauty.',
        mood: 'melancholic',
        location: 'Black Forest',
        date: new Date('2023-10-30T15:00:00Z').toISOString(),
        photoUrl: 'https://picsum.photos/seed/piano/800/600'
      }
    ];
    setMemories(initialMemories);
  }, []);

  const addMemory = (memory: Memory) => {
    setMemories(prev => [memory, ...prev]);
  };

  const updateAlbums = (newAlbums: Album[]) => {
    setAlbums(newAlbums);
  };

  const handleSortIntoAlbums = async () => {
    if (memories.length === 0) return;
    setIsSorting(true);
    try {
      const sortedAlbums = await sortMemoriesIntoAlbums(memories);
      setAlbums(sortedAlbums);
      setActiveOverlay('albums');
    } catch (error) {
      console.error("Sorting failed:", error);
    } finally {
      setIsSorting(false);
    }
  };

  const updateAlbumTitle = (albumId: string, newTitle: string) => {
    setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, title: newTitle } : a));
  };

  const updateAlbum = (albumId: string, data: Partial<Album>) => {
    setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, ...data } : a));
  };

  const updateDayReaction = (date: string, emoji: string) => {
    setDayReactions(prev => {
      const existing = prev.find(r => r.date === date);
      if (existing) {
        return prev.map(r => r.date === date ? { ...r, emoji } : r);
      }
      return [...prev, { date, emoji }];
    });
  };

  const handleAddMemoryAtDate = (date: string) => {
    setPrefilledDate(date);
    setIsAddModalOpen(true);
    setActiveOverlay(null);
  };

  const handleSuggestAlbum = (album: Album) => {
    setAlbums(prev => [album, ...prev]);
    setActiveOverlay('albums');
  };

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('REMINIQ_GEMINI_API_KEY') || '');

  const saveApiKey = (key: string) => {
    localStorage.setItem('REMINIQ_GEMINI_API_KEY', key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
    // Reload to ensure the new key is picked up by getAI
    window.location.reload();
  };

  return (
    <main className="min-h-screen">
      {/* Film Grain Overlay (Global) */}
      <div className="film-grain" />
      
      {view === 'landing' ? (
        <LandingPage 
          onEnterVault={() => setView('vault')} 
          memories={memories} 
          onOpenSettings={() => setIsApiKeyModalOpen(true)}
        />
      ) : (
        <Vault 
          onBack={() => setView('landing')} 
          memories={memories} 
          onAddMemory={addMemory}
          albums={albums}
          onUpdateAlbums={updateAlbums}
          onUpdateAlbumTitle={updateAlbumTitle}
          onUpdateAlbum={updateAlbum}
          dayReactions={dayReactions}
          onUpdateDayReaction={updateDayReaction}
          activeOverlay={activeOverlay}
          onCloseOverlay={() => setActiveOverlay(null)}
          onSortAlbums={handleSortIntoAlbums}
          isSorting={isSorting}
          isAddModalOpen={isAddModalOpen}
          onSetIsAddModalOpen={setIsAddModalOpen}
          prefilledDate={prefilledDate}
          onClearPrefilledDate={() => setPrefilledDate(null)}
          googleToken={googleToken}
          googlePhotos={googlePhotos}
          isFetchingPhotos={isFetchingPhotos}
          onConnectGoogle={connectGooglePhotos}
          onFetchPhotos={fetchGooglePhotos}
          spotifyToken={spotifyToken}
          onConnectSpotify={connectSpotify}
          onOpenSettings={() => setIsApiKeyModalOpen(true)}
        />
      )}

      <Taskbar 
        view={view} 
        onViewChange={setView} 
        activeOverlay={activeOverlay} 
        onOverlayChange={setActiveOverlay}
        onOpenSettings={() => setIsApiKeyModalOpen(true)}
      />

      <AnimatePresence>
        {activeOverlay && (
          <ExtraPages 
            activeOverlay={activeOverlay} 
            onClose={() => setActiveOverlay(null)} 
            memories={memories}
            albums={albums}
            onUpdateAlbums={updateAlbums}
            onUpdateAlbumTitle={updateAlbumTitle}
            onUpdateAlbum={updateAlbum}
            dayReactions={dayReactions}
            onUpdateDayReaction={updateDayReaction}
            onSortAlbums={handleSortIntoAlbums}
            isSorting={isSorting}
            onAddMemoryAtDate={handleAddMemoryAtDate}
          />
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {isApiKeyModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cream p-8 rounded-sm shadow-2xl max-w-md w-full border border-brown/20 relative"
            >
              <button 
                onClick={() => setIsApiKeyModalOpen(false)}
                className="absolute top-4 right-4 text-brown/40 hover:text-brown transition-colors"
              >
                ✕
              </button>
              <h2 className="font-serif text-2xl text-dark-brown mb-4">Gemini API Settings</h2>
              <p className="font-classic italic text-brown mb-6">Provide your own Gemini API key to enable AI-powered features like album sorting and smart search.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-hand text-sm text-brown mb-1">Your API Key</label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your key here..."
                    className="w-full bg-white/50 border border-brown/20 p-3 rounded-sm font-mono text-sm focus:outline-none focus:border-moss"
                  />
                </div>
                <button 
                  onClick={() => saveApiKey(apiKey)}
                  className="w-full py-3 bg-moss text-cream font-hand text-lg tracking-wider rounded-sm hover:bg-dark-brown transition-colors"
                >
                  Save Key
                </button>
                <p className="text-[10px] text-brown/40 text-center">
                  Your key is stored locally in your browser and never sent to our servers.
                  Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline">AI Studio</a>.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SmartChat 
        memories={memories} 
        onSuggestAlbum={handleSuggestAlbum} 
      />
    </main>
  );
}

