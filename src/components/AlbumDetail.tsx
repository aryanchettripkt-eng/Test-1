import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  Mic, 
  Plus, 
  Trash2, 
  Check, 
  BookOpen, 
  Image as ImageIcon,
  Link as LinkIcon,
  Play,
  Pause
} from 'lucide-react';
import { Memory, Album } from '../lib/gemini';

interface AlbumDetailProps {
  album: Album;
  memories: Memory[];
  onBack: () => void;
  onUpdateAlbum: (data: Partial<Album>) => void;
}

export default function AlbumDetail({ album, memories, onBack, onUpdateAlbum }: AlbumDetailProps) {
  const [selectedForJournal, setSelectedForJournal] = useState<string[]>([]);
  const [journalText, setJournalText] = useState(album.journalText || '');
  const [linkedMemoryIds, setLinkedMemoryIds] = useState<string[]>(album.linkedMemoryIds || []);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(album.voiceNoteUrl || null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const albumMemories = memories.filter(m => album.memoryIds.includes(m.id));

  const handleToggleSelection = (id: string) => {
    setSelectedForJournal(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLinkToJournal = () => {
    const newLinks = [...new Set([...linkedMemoryIds, ...selectedForJournal])];
    setLinkedMemoryIds(newLinks);
    setSelectedForJournal([]);
    onUpdateAlbum({ linkedMemoryIds: newLinks });
  };

  const handleRemoveLink = (id: string) => {
    const newLinks = linkedMemoryIds.filter(i => i !== id);
    setLinkedMemoryIds(newLinks);
    onUpdateAlbum({ linkedMemoryIds: newLinks });
  };

  const handleRemoveFromAlbum = (id: string) => {
    const newMemoryIds = album.memoryIds.filter(i => i !== id);
    const newLinkedIds = linkedMemoryIds.filter(i => i !== id);
    setLinkedMemoryIds(newLinkedIds);
    onUpdateAlbum({ memoryIds: newMemoryIds, linkedMemoryIds: newLinkedIds });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalText(e.target.value);
    onUpdateAlbum({ journalText: e.target.value });
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Simulate saving a voice note
      const mockVoiceUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      setVoiceNote(mockVoiceUrl);
      onUpdateAlbum({ voiceNoteUrl: mockVoiceUrl });
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[8000] bg-cream flex flex-col md:flex-row overflow-hidden"
    >
      {/* Left Side: Photo Grid */}
      <div className="w-full md:w-1/2 h-full flex flex-col border-r border-light-brown/20 bg-warm-white/30">
        <div className="p-8 pb-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 font-hand text-brown/60 hover:text-dark-brown">
            <ChevronLeft size={18} />
            back to albums
          </button>
          <div className="font-serif text-xl text-dark-brown italic">{album.title}</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {albumMemories.map(mem => (
              <div 
                key={mem.id}
                onClick={() => handleToggleSelection(mem.id)}
                className={`relative aspect-square bg-white p-2 shadow-sm cursor-pointer transition-all group ${selectedForJournal.includes(mem.id) ? 'ring-2 ring-moss scale-95' : 'hover:scale-[1.02]'}`}
              >
                {mem.photoUrl ? (
                  <img src={mem.photoUrl} className="w-full h-full object-cover grayscale-[0.1]" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-parchment flex items-center justify-center text-brown/20">
                    <BookOpen size={24} />
                  </div>
                )}
                
                {selectedForJournal.includes(mem.id) && (
                  <div className="absolute top-1 right-1 bg-moss text-white rounded-full p-0.5 shadow-md">
                    <Check size={12} />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {selectedForJournal.length > 0 && (
          <motion.div 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="p-6 bg-cream border-t border-light-brown/20 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)]"
          >
            <div className="font-hand text-sm text-brown">{selectedForJournal.length} moments selected</div>
            <button 
              onClick={handleLinkToJournal}
              className="bg-moss text-cream font-hand px-6 py-2 rounded-[2px] hover:bg-dark-brown transition-all flex items-center gap-2"
            >
              <LinkIcon size={14} />
              Link to Journal
            </button>
          </motion.div>
        )}
      </div>

      {/* Right Side: Journal Panel */}
      <div className="w-full md:w-1/2 h-full flex flex-col bg-cream relative">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23n)\' opacity=\'0.1\'/%3E%3C/svg%3E")' }} />
        
        <div className="p-8 pb-4 flex items-center justify-between relative z-10">
          <h2 className="font-serif text-2xl text-dark-brown italic">Album Journal</h2>
          <div className="flex items-center gap-3">
            {voiceNote && (
              <button className="w-8 h-8 rounded-full bg-sage/20 text-sage flex items-center justify-center hover:bg-sage/30 transition-all">
                <Play size={14} fill="currentColor" />
              </button>
            )}
            <button 
              onClick={toggleRecording}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-parchment text-brown hover:bg-faded-yellow'}`}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 relative z-10">
          {/* Journal Text Area */}
          <div className="relative min-h-[400px] bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_31px,rgba(196,168,130,0.2)_31px,rgba(196,168,130,0.2)_32px)] pl-12 before:content-[''] before:absolute before:left-8 before:top-0 before:bottom-0 before:w-[1px] before:bg-dusty-rose/30">
            <textarea 
              value={journalText}
              onChange={handleTextChange}
              placeholder="Write your thoughts about this collection of moments..."
              className="w-full h-full bg-transparent border-none outline-none font-hand text-xl text-ink leading-[2rem] resize-none placeholder:text-brown/30"
              rows={15}
            />
          </div>

          {/* Album Memories Gallery (Cozy Bottom Section) */}
          {albumMemories.length > 0 && (
            <div className="mt-12 pb-12">
              <div className="font-hand text-sm text-brown/60 italic mb-6 border-b border-light-brown/10 pb-2 flex justify-between items-center">
                <span>Scrapbook of moments...</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50">Click to zoom • {albumMemories.length} items</span>
              </div>
              <div className="flex flex-wrap gap-8">
                {albumMemories.map((mem, index) => {
                  // Random rotation for cozy scrapbook feel
                  const rotation = (index % 3 - 1) * 3 + (Math.random() * 2 - 1);
                  const isLinked = linkedMemoryIds.includes(mem.id);
                  
                  return (
                    <motion.div 
                      key={mem.id} 
                      initial={{ opacity: 0, scale: 0.9, rotate: rotation }}
                      animate={{ opacity: 1, scale: 1, rotate: rotation }}
                      whileHover={{ scale: 1.1, rotate: 0, zIndex: 20 }}
                      className={`relative flex-shrink-0 w-36 bg-white p-2 pb-8 shadow-xl border border-brown/5 group cursor-pointer transition-shadow hover:shadow-2xl ${isLinked ? 'ring-1 ring-moss/30' : ''}`}
                      onClick={() => mem.photoUrl && setZoomedImage(mem.photoUrl)}
                    >
                      <div className="aspect-square overflow-hidden bg-parchment mb-3 relative">
                        {mem.photoUrl ? (
                          <img src={mem.photoUrl} className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brown/20">
                            <BookOpen size={28} />
                          </div>
                        )}
                        {isLinked && (
                          <div className="absolute top-1 left-1 bg-moss/80 text-white p-0.5 rounded-full shadow-sm">
                            <Check size={10} />
                          </div>
                        )}
                      </div>
                      
                      {/* Polaroid Caption Style */}
                      <div className="font-hand text-xs text-brown/70 truncate text-center px-1">
                        {mem.title || 'Untitled'}
                      </div>
                      <div className="font-hand text-[8px] text-brown/30 text-center mt-0.5">
                        {new Date(mem.date).toLocaleDateString()}
                      </div>

                      {/* Actions */}
                      <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromAlbum(mem.id);
                          }}
                          className="bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1.5 shadow-lg backdrop-blur-sm transition-colors"
                          title="Remove from album"
                        >
                          <Trash2 size={12} />
                        </button>
                        {!isLinked && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSelection(mem.id);
                              handleLinkToJournal();
                            }}
                            className="bg-moss/90 hover:bg-moss text-white rounded-full p-1.5 shadow-lg backdrop-blur-sm transition-colors"
                            title="Pin to story"
                          >
                            <Plus size={12} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Zoom Overlay */}
        <AnimatePresence>
          {zoomedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedImage(null)}
              className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 cursor-zoom-out"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-full bg-white p-3 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <img src={zoomedImage} className="max-w-full max-h-[80vh] object-contain" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setZoomedImage(null)}
                  className="absolute -top-4 -right-4 bg-white text-dark-brown rounded-full p-2 shadow-xl hover:bg-dusty-rose hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
