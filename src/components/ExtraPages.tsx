import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, BookOpen, Search, Leaf, FolderHeart, History, Music, Check, Edit2, Star, Heart, Camera as CameraIcon, Mic, Type, Play, SkipBack, SkipForward, Smile, Pin } from 'lucide-react';
import { Memory, Album, DayReaction } from '../lib/gemini';
import CalendarView from './CalendarView';
import AlbumDetail from './AlbumDetail';
import MusicPlayer from './MusicPlayer';

interface ExtraPagesProps {
  activeOverlay: string | null;
  onClose: () => void;
  memories: Memory[];
  albums: Album[];
  onUpdateAlbums: (albums: Album[]) => void;
  onUpdateAlbumTitle: (albumId: string, newTitle: string) => void;
  onUpdateAlbum: (albumId: string, data: Partial<Album>) => void;
  dayReactions: DayReaction[];
  onUpdateDayReaction: (date: string, emoji: string) => void;
  onSortAlbums: () => void;
  isSorting: boolean;
  onAddMemoryAtDate: (date: string) => void;
}

export default function ExtraPages({ 
  activeOverlay, 
  onClose, 
  memories,
  albums,
  onUpdateAlbums,
  onUpdateAlbumTitle,
  onUpdateAlbum,
  dayReactions,
  onUpdateDayReaction,
  onSortAlbums,
  isSorting,
  onAddMemoryAtDate
}: ExtraPagesProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');

  if (!activeOverlay) return null;

  const startEditingAlbum = (album: Album) => {
    setEditingAlbumId(album.id);
    setEditTitleValue(album.title);
  };

  const saveAlbumTitle = (albumId: string) => {
    onUpdateAlbumTitle(albumId, editTitleValue);
    setEditingAlbumId(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[10000] bg-warm-white overflow-y-auto"
    >
      <div className="film-grain" />
      
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-[10001] p-3 bg-moss text-cream rounded-full shadow-xl hover:scale-110 transition-transform"
      >
        <X size={24} />
      </button>

      <div className="max-w-5xl mx-auto px-6 py-24">
        {activeOverlay === 'features' && (
          <section className="space-y-16">
            <div className="text-center">
              <div className="font-hand text-sm text-moss tracking-[0.12em] uppercase mb-3">✦ what it does ✦</div>
              <h2 className="font-serif text-4xl md:text-6xl text-dark-brown leading-tight mb-5">Every feature feels like<br /><em className="italic text-brown">turning a page.</em></h2>
              <p className="font-body italic text-brown max-w-[500px] mx-auto text-lg leading-relaxed">Not a database. Not a productivity tool. A companion for your inner life.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <Sparkles className="text-moss" />, title: 'Smart Memory Collection', desc: 'Gather notes, photos, voice memos, and stray thoughts from anywhere.', tag: 'gather' },
                { icon: <BookOpen className="text-brown" />, title: 'AI Organisation', desc: 'Memories arrange themselves by feeling, person, place, and season.', tag: 'organise' },
                { icon: <Search className="text-dusty-rose" />, title: 'Contextual Recall', desc: 'Type a feeling, a name, a half-remembered sentence — and it finds it.', tag: 'recall' },
                { icon: <Leaf className="text-sage" />, title: 'Gentle Summaries', desc: 'At the end of a month, receive a soft letter written in your own voice.', tag: 'reflect' }
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-parchment p-10 border border-light-brown/40 relative group"
                >
                  <div className="absolute -top-1.5 right-6 w-10 h-5 bg-faded-yellow/60 rotate-1 border border-brown/20" />
                  <div className="text-4xl mb-6">{f.icon}</div>
                  <h3 className="font-serif text-2xl text-dark-brown mb-4">{f.title}</h3>
                  <p className="font-body text-lg text-brown leading-relaxed mb-6">{f.desc}</p>
                  <span className="inline-block font-hand text-sm text-moss px-3 py-1 bg-moss/10 rounded-full border border-moss/30">{f.tag}</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {activeOverlay === 'try-it' && (
          <section className="space-y-16">
            <div className="text-center">
              <div className="font-hand text-sm text-moss tracking-[0.12em] uppercase mb-3">✦ try a quiet search ✦</div>
              <h2 className="font-serif text-4xl md:text-6xl text-dark-brown leading-tight max-w-[700px] mx-auto">Write a feeling.<br /><em className="italic text-brown">Find a memory.</em></h2>
            </div>

            <div className="max-w-3xl mx-auto bg-cream border-[1.5px] border-light-brown rounded-[4px] shadow-2xl relative overflow-hidden">
              <div className="p-12 pl-20 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_31px,rgba(196,168,130,0.25)_31px,rgba(196,168,130,0.25)_32px)] relative before:content-[''] before:absolute before:left-16 before:top-0 before:bottom-0 before:w-[1px] before:bg-dusty-rose/50">
                <div className="font-hand text-lg text-brown mb-4">What are you trying to remember?</div>
                <textarea 
                  className="w-full border-none outline-none bg-transparent font-hand text-3xl text-ink resize-none leading-[2.5rem] min-h-[120px] placeholder:text-brown/40" 
                  placeholder="that late-night idea about the garden…" 
                  rows={3} 
                />
                <button 
                  className="mt-8 px-10 py-4 bg-moss text-cream font-hand text-xl cursor-pointer rounded-[2px] transition-all hover:bg-dark-brown hover:-translate-y-px tracking-wider shadow-lg"
                >
                  Find it in my Reminiq →
                </button>
              </div>
            </div>
          </section>
        )}

        {activeOverlay === 'calendar' && (
          <CalendarView 
            memories={memories}
            dayReactions={dayReactions}
            onUpdateDayReaction={onUpdateDayReaction}
            onClose={onClose}
            onAddMemoryAtDate={onAddMemoryAtDate}
          />
        )}

        {activeOverlay === 'albums' && (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-4xl text-dark-brown italic">Your Curated Albums</h2>
                <p className="font-hand text-lg text-brown/50 italic">AI-sorted by time, place, and feeling...</p>
              </div>
              <button 
                onClick={onSortAlbums}
                disabled={isSorting}
                className="bg-sage/10 border border-sage/30 text-moss font-hand text-lg px-6 py-2 rounded-full hover:bg-sage/20 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={18} className={isSorting ? "animate-spin" : ""} />
                {isSorting ? "Sorting..." : "Re-sort with AI"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {albums.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-brown/30">
                  <FolderHeart size={64} className="mb-4 opacity-20" />
                  <p className="font-hand text-2xl italic">No albums yet. Click "Re-sort" to organize your memories.</p>
                </div>
              ) : (
                albums.map((album) => (
                  <div key={album.id} className="group cursor-pointer" onClick={() => setSelectedAlbum(album)}>
                    <div className="flex items-center justify-between mb-4">
                      {editingAlbumId === album.id ? (
                        <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                          <input 
                            autoFocus
                            value={editTitleValue}
                            onChange={(e) => setEditTitleValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveAlbumTitle(album.id)}
                            className="bg-parchment/40 border-b border-brown/30 font-serif italic text-xl text-dark-brown outline-none w-full px-1"
                          />
                          <button onClick={() => saveAlbumTitle(album.id)} className="text-moss hover:text-dark-brown">
                            <Check size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/title">
                          <h3 className="font-serif text-2xl text-dark-brown italic">{album.title}</h3>
                          <button 
                            onClick={(e) => { e.stopPropagation(); startEditingAlbum(album); }}
                            className="opacity-0 group-hover/title:opacity-100 text-brown/30 hover:text-brown transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      )}
                      <span className="font-hand text-sm text-brown/40">{album.memoryIds.length} items</span>
                    </div>
                    
                    <div className="relative aspect-square">
                      {[...Array(Math.min(3, album.memoryIds.length))].map((_, idx) => {
                        const memId = album.memoryIds[idx];
                        const mem = memories.find(m => m.id === memId);
                        return (
                          <div 
                            key={idx}
                            className="absolute inset-0 bg-white shadow-md border border-brown/5 p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                            style={{ 
                              transform: `rotate(${idx * 3 - 3}deg) translate(${idx * 4}px, ${idx * 4}px)`,
                              zIndex: 3 - idx
                            }}
                          >
                            {mem?.photoUrl ? (
                              <img src={mem.photoUrl} className="w-full h-full object-cover grayscale-[0.1]" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-parchment flex items-center justify-center text-brown/10">
                                <BookOpen size={48} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <AnimatePresence>
              {selectedAlbum && (
                <AlbumDetail 
                  album={selectedAlbum}
                  memories={memories}
                  onBack={() => setSelectedAlbum(null)}
                  onUpdateAlbum={(data) => onUpdateAlbum(selectedAlbum.id, data)}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {activeOverlay === 'timeline' && (
          <div className="space-y-24 pb-32 relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
              <Star className="absolute top-10 left-[10%] text-brown rotate-12" size={40} />
              <Heart className="absolute top-40 right-[15%] text-dusty-rose -rotate-12" size={30} />
              <div className="absolute bottom-20 left-[5%] font-hand text-4xl text-brown/30 -rotate-6">memories...</div>
              <Star className="absolute bottom-40 right-[10%] text-moss rotate-45" size={24} />
            </div>

            <div className="text-center relative">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-40">
                <CameraIcon size={48} className="text-brown" />
              </div>
              <h2 className="font-hand text-6xl text-dark-brown -rotate-2 mb-4">Vibin' through the stash</h2>
              <p className="font-hand text-xl text-brown/60 italic">A reel of moments, unspooled...</p>
            </div>

            {/* Film Strips */}
            <div className="space-y-20">
              {/* Group memories into chunks for strips */}
              {Array.from({ length: Math.ceil(memories.length / 4) }).map((_, stripIdx) => {
                const stripMemories = memories.slice(stripIdx * 4, (stripIdx + 1) * 4);
                const rotation = stripIdx % 2 === 0 ? 'rotate-1' : '-rotate-1';
                
                return (
                  <div key={stripIdx} className={`relative ${rotation}`}>
                    {/* Film Strip Container */}
                    <div className="bg-zinc-900 py-10 px-4 shadow-2xl relative border-y-[12px] border-zinc-950">
                      {/* Top Sprocket Holes */}
                      <div className="absolute top-2 left-0 right-0 flex justify-around px-4">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-warm-white/10 rounded-sm" />
                        ))}
                      </div>

                      <div className="flex justify-center gap-2 overflow-x-auto scrollbar-hide">
                        {stripMemories.map((m) => (
                          <motion.div 
                            key={m.id}
                            whileHover={{ scale: 1.02, zIndex: 10 }}
                            className="flex-shrink-0 w-64 aspect-[4/3] bg-zinc-800 relative group cursor-pointer border-x border-zinc-950/50"
                          >
                            {m.photoUrl ? (
                              <img 
                                src={m.photoUrl} 
                                className="w-full h-full object-cover grayscale-[0.2] sepia-[0.1] group-hover:grayscale-0 transition-all duration-700" 
                                referrerPolicy="no-referrer" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/10">
                                {m.type === 'voice' ? <Mic size={48} /> : <Type size={48} />}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <p className="font-hand text-white text-sm truncate">{m.title}</p>
                              <p className="font-hand text-white/60 text-[10px]">{new Date(m.date).toLocaleDateString()}</p>
                            </div>
                            
                            {/* Frame Numbers */}
                            <div className="absolute -bottom-8 left-2 font-mono text-[10px] text-white/30">
                              {Math.floor(Math.random() * 36) + 1}A
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Bottom Sprocket Holes */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-around px-4">
                        {Array.from({ length: 15 }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-warm-white/10 rounded-sm" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Handwritten Caption for the strip */}
                    <div className="mt-4 text-center">
                      <span className="font-hand text-2xl text-brown/70 italic">
                        {stripIdx === 0 ? "the early days..." : stripIdx === 1 ? "bits of joy" : "and so it goes..."}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scattered Slides & Doodles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
              {memories.slice(0, 2).map((m, i) => (
                <motion.div 
                  key={`slide-${m.id}`}
                  initial={{ opacity: 0, rotate: i === 0 ? -5 : 5 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <div className="bg-[#f2e8d5] p-5 pb-16 shadow-2xl relative w-72 border border-brown/10">
                    <div className="text-center mb-3">
                      <span className="text-[#e24a3b] font-bold text-xs tracking-tighter">Kodachrome</span>
                      <div className="text-[#e24a3b] text-[10px] font-bold -mt-1">SLIDE</div>
                    </div>
                    <div className="aspect-square bg-zinc-900 overflow-hidden relative">
                      {m.photoUrl && <img src={m.photoUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                    </div>
                    <div className="absolute bottom-5 left-5 font-hand text-xs text-brown/60">
                      {new Date(m.date).toLocaleDateString()}
                    </div>
                    <div className="absolute bottom-5 right-5 text-[#e24a3b] font-bold text-xl">+</div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-[#e24a3b] text-[7px] font-bold uppercase tracking-widest">Processed by Kodak</div>
                    
                    {/* Scribble next to slide */}
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 font-hand text-brown/40 text-xl rotate-12 hidden lg:block">
                      this one!!
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Final Doodle */}
            <div className="flex justify-center pt-12">
              <div className="relative">
                <div className="font-hand text-3xl text-brown/40 italic">to be continued...</div>
                <Star className="absolute -top-6 -right-8 text-faded-yellow animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {activeOverlay === 'scrapbook' && (
          <div className="relative min-h-[120vh] flex items-center justify-center p-4 sm:p-10">
            {/* Clipboard Base */}
            <div className="relative w-full max-w-5xl bg-[#c4a882] rounded-3xl shadow-2xl p-4 sm:p-8 border-4 border-[#8b5e3c]">
              {/* Clipboard Clip */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-16 bg-[#a67c52] rounded-t-xl border-x-4 border-t-4 border-[#8b5e3c] flex items-center justify-center z-20">
                <div className="w-32 h-4 bg-[#8b5e3c] rounded-full" />
              </div>

              {/* Journal Paper Spread */}
              <div className="bg-warm-white w-full min-h-[1000px] rounded-lg shadow-inner relative overflow-hidden p-6 sm:p-12 border border-brown/10">
                {/* Grid/Lines Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8b5e3c 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                {/* Scattered Memories */}
                {memories.map((m, i) => {
                  // Deterministic but scattered look
                  const rotation = (i * 13) % 20 - 10;
                  const left = (i * 23) % 65 + 5;
                  const top = (i * 37) % 75 + 5;
                  
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.8, rotate: rotation }}
                      animate={{ opacity: 1, scale: 1, rotate: rotation }}
                      whileHover={{ scale: 1.05, zIndex: 100 }}
                      className="absolute cursor-move group"
                      style={{ left: `${left}%`, top: `${top}%`, zIndex: i + 10 }}
                      drag
                      dragMomentum={false}
                    >
                      <div className="bg-white p-2 pb-10 shadow-lg border border-brown/5 relative w-48 sm:w-64">
                        {m.photoUrl ? (
                          <div className="relative aspect-square overflow-hidden">
                            <img src={m.photoUrl} className="w-full h-full object-cover grayscale-[0.1] sepia-[0.1]" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]" />
                          </div>
                        ) : (
                          <div className="w-full aspect-square bg-parchment flex items-center justify-center text-brown/40 font-hand text-center p-4 text-sm">
                            {m.title}
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                          <span className="font-hand text-[12px] text-brown/60 italic truncate max-w-[70%]">{m.title}</span>
                          <span className="font-hand text-[10px] text-brown/40">{new Date(m.date).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Tape effect */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-faded-yellow/30 rotate-3 border border-brown/5 backdrop-blur-[1px]" />
                        
                        {/* Random doodles on some photos */}
                        {i % 3 === 0 && (
                          <div className="absolute -top-2 -right-2 text-dusty-rose rotate-12">
                            <Heart size={20} fill="currentColor" className="opacity-40" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Static Aesthetic Elements */}
                {/* Bunny Sticker (Mockup) */}
                <div className="absolute top-20 left-10 rotate-[-15deg] z-50 pointer-events-none">
                  <div className="w-24 h-24 bg-[#8b5e3c]/20 rounded-full flex flex-col items-center justify-center border-2 border-[#8b5e3c]/30 p-2">
                    <div className="w-12 h-12 bg-brown rounded-full mb-1" />
                    <span className="font-hand text-[10px] text-brown font-bold">MONSTER</span>
                  </div>
                </div>

                {/* Passport/ID Sticker */}
                <div className="absolute bottom-40 left-[15%] rotate-6 z-40">
                  <div className="bg-[#fdf6e3] p-4 border border-brown/20 shadow-md w-56 font-mono text-[10px] text-brown/70">
                    <div className="border-b border-brown/20 pb-1 mb-2 font-bold text-center">PASSPORT OF MEMORIES</div>
                    <div className="flex gap-3">
                      <div className="w-16 h-20 bg-brown/10 border border-brown/20" />
                      <div className="space-y-1">
                        <div>NAME: REMINIQ USER</div>
                        <div>DATE: 01.01.2026</div>
                        <div>LOC: EVERYWHERE</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Handwritten Notes */}
                <div className="absolute top-12 left-[30%] font-hand text-3xl text-brown/40 pointer-events-none">
                  i think i like this little life...
                </div>
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-hand text-4xl text-dark-brown/50 pointer-events-none whitespace-nowrap">
                  live, laugh, and love... :)
                </div>

                {/* Music Widget Mockup */}
                <div className="absolute bottom-20 right-10 w-72 bg-zinc-900/95 p-5 rounded-2xl shadow-2xl rotate-[-2deg] z-50 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-moss to-dark-brown rounded-lg shadow-inner flex items-center justify-center text-cream/20">
                      <Music size={32} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-serif text-white text-sm truncate">Beautiful Smile</div>
                      <div className="font-hand text-white/40 text-xs truncate">Your Eyes</div>
                    </div>
                    <Heart size={16} className="text-dusty-rose fill-dusty-rose" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white/40 w-[60%]" />
                    </div>
                    <div className="flex justify-between font-mono text-[8px] text-white/30">
                      <span>01:42</span>
                      <span>03:59</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center items-center gap-6 text-white/60">
                    <SkipBack size={18} />
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Play size={20} fill="currentColor" />
                    </div>
                    <SkipForward size={18} />
                  </div>
                </div>

                {/* Locket Photos Mockup */}
                <div className="absolute top-[40%] right-10 flex gap-2 rotate-12 z-40">
                  <div className="w-24 h-32 rounded-full border-4 border-faded-yellow bg-white shadow-xl overflow-hidden">
                    <img src="https://picsum.photos/seed/locket1/200/300" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-24 h-32 rounded-full border-4 border-faded-yellow bg-white shadow-xl overflow-hidden -mt-4">
                    <img src="https://picsum.photos/seed/locket2/200/300" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                  </div>
                </div>

                {/* Stickers scattered */}
                <div className="absolute top-1/4 left-1/4 opacity-30 pointer-events-none">
                  <Smile size={64} className="text-faded-yellow" />
                </div>
                <div className="absolute bottom-1/3 right-1/3 opacity-20 pointer-events-none">
                  <Pin size={48} className="text-brown rotate-45" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeOverlay === 'music' && (
          <div className="max-w-2xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="font-serif text-4xl text-dark-brown italic">The Soundtrack of Your Life</h2>
              <p className="font-hand text-lg text-brown/50 italic mt-2">Melodies tied to your most precious moments.</p>
            </div>
            
            <div className="space-y-6">
              {memories.filter(m => m.music).map((m, i) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-parchment/40 p-6 rounded-2xl border border-light-brown/10"
                >
                  <MusicPlayer 
                    song={m.music!.song}
                    artist={m.music!.artist}
                    albumArt={m.music!.albumArt}
                    audioUrl={m.musicUrl}
                  />
                  <div className="mt-4 font-hand text-sm text-brown/60 italic text-right">
                    — from "{m.title}"
                  </div>
                </motion.div>
              ))}
              
              {memories.filter(m => m.music).length === 0 && (
                <div className="text-center py-20 text-brown/30">
                  <Music size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="font-hand text-2xl italic">No music memories yet. Add a song to your next entry!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
