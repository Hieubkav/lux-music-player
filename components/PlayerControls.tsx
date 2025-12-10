import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Volume1, VolumeX } from 'lucide-react';
import { Track } from '../types';
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';

interface PlayerControlsProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange
}) => {
  return (
    <div className="flex flex-col h-full justify-between p-6 md:p-10 relative overflow-hidden">
      {/* Decorative Background Blur specific to art color */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>

      {/* Album Art */}
      <div className="relative w-full aspect-square mb-8 group">
        <div className={`absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full transform scale-90 translate-y-4 transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}></div>
        <img 
          src={track.albumArt} 
          alt={track.title} 
          className={`relative w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700 ease-in-out ${isPlaying ? 'scale-100' : 'scale-[0.95]'}`}
        />
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 truncate">{track.title}</h2>
        <p className="text-lg text-gray-500 font-medium">{track.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <Slider 
          value={currentTime} 
          max={duration} 
          onChange={onSeek}
        />
        <div className="flex justify-between text-xs font-semibold text-gray-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-6 w-full">
          <Button variant="icon" className="hover:text-indigo-500 transition-colors">
            <Shuffle size={20} />
          </Button>

          <Button variant="icon" onClick={onPrev} className="scale-110">
            <SkipBack size={28} className="fill-current" />
          </Button>

          <Button 
            variant="primary" 
            size="xl" 
            onClick={onPlayPause}
            className="shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause size={32} className="fill-current" />
            ) : (
              <Play size={32} className="fill-current translate-x-1" />
            )}
          </Button>

          <Button variant="icon" onClick={onNext} className="scale-110">
            <SkipForward size={28} className="fill-current" />
          </Button>

          <Button variant="icon" className="hover:text-indigo-500 transition-colors">
            <Repeat size={20} />
          </Button>
        </div>
        
        {/* Volume - Simplified */}
        <div className="flex items-center gap-3 w-3/4 max-w-[200px] group">
          <Button variant="icon" size="sm" onClick={() => onVolumeChange(volume === 0 ? 50 : 0)}>
             {volume === 0 ? <VolumeX size={18} /> : volume < 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
          </Button>
          <Slider 
            value={volume} 
            max={100} 
            onChange={onVolumeChange} 
            className="opacity-60 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
};