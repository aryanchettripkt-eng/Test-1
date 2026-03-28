import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Music } from 'lucide-react';

interface MusicPlayerProps {
  song: string;
  artist: string;
  albumArt?: string;
  audioUrl?: string;
  autoPlay?: boolean;
}

export default function MusicPlayer({ song, artist, albumArt, audioUrl, autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && audioUrl) {
      setIsPlaying(true);
      audioRef.current?.play().catch(() => setIsPlaying(false));
    }
  }, [audioUrl, autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) return null;

  return (
    <div className="bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 flex items-center gap-4 group">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
        {albumArt ? (
          <img src={albumArt} className={`w-full h-full object-cover transition-transform duration-[5s] linear ${isPlaying ? 'scale-110 rotate-6' : ''}`} />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <Music size={24} className="text-white/20" />
          </div>
        )}
        <button 
          onClick={togglePlay}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white fill-white" />}
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-white font-serif italic text-lg truncate">{song}</div>
        <div className="text-white/40 font-hand text-sm truncate">{artist}</div>
        
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-moss transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-shrink-0">
        <Volume2 size={16} className="text-white/20" />
      </div>
    </div>
  );
}
