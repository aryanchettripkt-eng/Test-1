import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  Plus, 
  MapPin, 
  Music as MusicIcon,
  Mic,
  Image as ImageIcon,
  SmilePlus,
  Clock,
  BookOpen
} from 'lucide-react';
import { Memory, DayReaction } from '../lib/gemini';

interface CalendarViewProps {
  memories: Memory[];
  dayReactions: DayReaction[];
  onUpdateDayReaction: (date: string, emoji: string) => void;
  onClose: () => void;
  onAddMemoryAtDate: (date: string) => void;
}

export default function CalendarView({ 
  memories, 
  dayReactions,
  onUpdateDayReaction,
  onClose, 
  onAddMemoryAtDate 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const monthNumber = String(month + 1).padStart(2, '0');

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i);

  const getMemoriesForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return memories.filter(m => m.date.startsWith(dateStr));
  };

  const getReactionForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dayReactions.find(r => r.date === dateStr)?.emoji;
  };

  const commonEmojis = ['✨', '❤️', '🌙', '🍃', '🌊', '🕯️', '🎞️', '☕'];

  const selectedDateStr = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : '';
  const selectedMemories = memories.filter(m => m.date.startsWith(selectedDateStr));
  const selectedReaction = dayReactions.find(r => r.date === selectedDateStr)?.emoji;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] overflow-hidden flex items-center justify-center p-4 md:p-8"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 z-[-1]">
        <img 
          src="https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1920" 
          className="w-full h-full object-cover brightness-[0.6] sepia-[0.2]"
          alt="Atmospheric background"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[9002] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
      >
        <X size={24} />
      </button>

      {/* Main Calendar Sheet */}
      <motion.div 
        initial={{ y: 50, rotate: -1 }}
        animate={{ y: 0, rotate: 0 }}
        className="relative w-full max-w-5xl aspect-[4/3] bg-warm-white shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col p-6 md:p-12 overflow-hidden"
      >
        {/* Tape at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 backdrop-blur-sm border border-white/20 -translate-y-4 rotate-1 z-10" />

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-baseline gap-6">
            <span className="font-serif text-8xl md:text-9xl text-dark-brown leading-none opacity-90">{monthNumber}</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-2">
                <button onClick={prevMonth} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                  <ChevronLeft size={24} className="text-dark-brown" />
                </button>
                <h2 className="font-serif text-3xl md:text-4xl text-dark-brown italic">{monthName}</h2>
                <button onClick={nextMonth} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                  <ChevronRight size={24} className="text-dark-brown" />
                </button>
              </div>
              <span className="font-hand text-xl text-brown/60">{year}</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="font-hand text-sm text-brown/40 uppercase tracking-widest mb-1">Reminiq Journal</div>
            <div className="w-32 h-[1px] bg-brown/20" />
          </div>
        </div>

        {/* Grid Labels */}
        <div className="grid grid-cols-7 border-b border-black/10 mb-0">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="py-2 text-center text-[10px] md:text-xs font-bold tracking-[0.2em] text-dark-brown/60">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 border-l border-t border-black/10">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="border-r border-b border-black/10 bg-black/[0.02]" />
          ))}
          {days.map(d => {
            const dateMemories = getMemoriesForDate(d);
            const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
            const reaction = getReactionForDate(d);

            return (
              <button
                key={d}
                onClick={() => setSelectedDate(new Date(year, month, d))}
                className="relative border-r border-b border-black/10 hover:bg-black/[0.03] transition-colors group overflow-hidden"
              >
                {/* Day Number */}
                <span className={`absolute top-2 left-2 font-serif text-sm md:text-base ${isToday ? 'text-moss font-bold' : 'text-dark-brown/60'}`}>
                  {String(d).padStart(2, '0')}
                </span>

                {/* Reaction Sticker */}
                {reaction && (
                  <span className="absolute top-1 right-1 text-sm md:text-base drop-shadow-sm rotate-12">{reaction}</span>
                )}

                {/* Memory Stickers */}
                <div className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none">
                  {dateMemories.length > 0 && (
                    <div className="relative w-full h-full">
                      {dateMemories.slice(0, 2).map((mem, i) => (
                        <motion.div
                          key={mem.id}
                          initial={{ scale: 0, rotate: i * 15 - 7 }}
                          animate={{ scale: 1, rotate: i * 15 - 7 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          {mem.photoUrl ? (
                            <div className="w-4/5 aspect-square bg-white p-1 shadow-md border border-black/5 -rotate-3 group-hover:scale-110 transition-transform">
                              <img src={mem.photoUrl} className="w-full h-full object-cover grayscale-[0.2]" alt="" referrerPolicy="no-referrer" />
                            </div>
                          ) : (
                            <div className="w-1/2 aspect-square bg-parchment/80 border border-brown/20 flex items-center justify-center text-brown/40 rotate-6 group-hover:scale-110 transition-transform">
                              {mem.type === 'voice' ? <Mic size={16} /> : <BookOpen size={16} />}
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {dateMemories.length > 2 && (
                        <div className="absolute bottom-1 right-1 font-hand text-[10px] text-brown/40">+{dateMemories.length - 2}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Add Button on Hover */}
                <div className="absolute inset-0 bg-moss/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus size={20} className="text-moss/40" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-between text-dark-brown/40 font-hand italic">
          <span>GAIBS {year}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-moss" /> Today</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-dusty-rose" /> Memories</span>
          </div>
        </div>
      </motion.div>

      {/* Day Details Modal */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 z-[9010] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDate(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-cream border border-light-brown/20 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-light-brown/10 flex items-center justify-between bg-warm-white">
                <div>
                  <h3 className="font-serif text-3xl text-dark-brown italic">
                    {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <p className="font-hand text-lg text-brown/60">
                    {selectedMemories.length === 0 ? "A quiet day..." : `${selectedMemories.length} moments preserved.`}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={24} className="text-dark-brown/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Emoji Reaction Selector */}
                <div className="bg-white/40 border border-light-brown/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <SmilePlus size={18} className="text-moss" />
                    <span className="font-hand text-lg text-brown/60">How did this day feel?</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => selectedDateStr && onUpdateDayReaction(selectedDateStr, emoji)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110 ${selectedReaction === emoji ? 'bg-moss/20 border border-moss/40 scale-110' : 'bg-white/40 border border-transparent hover:bg-white/60'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Memories List */}
                <div className="space-y-6">
                  {selectedMemories.length > 0 ? (
                    selectedMemories.map((mem, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={mem.id}
                        className="bg-white p-6 shadow-sm border border-light-brown/10 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 text-brown/40 text-[10px] uppercase tracking-widest mb-1">
                              <Clock size={12} />
                              <span>{new Date(mem.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {mem.location && (
                                <>
                                  <span className="mx-1">•</span>
                                  <MapPin size={12} />
                                  <span>{mem.location}</span>
                                </>
                              )}
                            </div>
                            <h4 className="font-serif text-xl text-dark-brown italic">{mem.title}</h4>
                          </div>
                          <div className="flex gap-2">
                            {mem.type === 'photo' && <ImageIcon size={18} className="text-moss" />}
                            {mem.type === 'voice' && <Mic size={18} className="text-moss" />}
                            {mem.type === 'music' && <MusicIcon size={18} className="text-moss" />}
                          </div>
                        </div>

                        {mem.photoUrl && (
                          <div className="aspect-video rounded-sm overflow-hidden mb-4 grayscale-[0.2] hover:grayscale-0 transition-all duration-500">
                            <img src={mem.photoUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          </div>
                        )}

                        <p className="text-brown/80 font-hand text-lg leading-relaxed mb-4">{mem.desc}</p>

                        {mem.music && (
                          <div className="flex items-center gap-4 bg-parchment/30 p-3 rounded-xl border border-light-brown/10">
                            <div className="w-12 h-12 rounded-lg bg-white/50 flex items-center justify-center overflow-hidden">
                              {mem.music.albumArt ? (
                                <img src={mem.music.albumArt} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <MusicIcon size={20} className="text-brown/20" />
                              )}
                            </div>
                            <div>
                              <div className="text-dark-brown font-medium text-sm">{mem.music.song}</div>
                              <div className="text-brown/40 text-xs">{mem.music.artist}</div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-12 text-center border-2 border-dashed border-light-brown/10 rounded-2xl">
                      <Plus size={48} className="mx-auto text-light-brown/20 mb-4" />
                      <p className="text-brown/40 font-hand text-xl italic">No moments captured yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-warm-white border-t border-light-brown/10">
                <button 
                  onClick={() => {
                    onAddMemoryAtDate(selectedDateStr);
                    setSelectedDate(null);
                  }}
                  className="w-full py-4 bg-moss text-cream font-hand text-xl rounded-sm hover:bg-dark-brown transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <Plus size={20} />
                  Add a new memory
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
