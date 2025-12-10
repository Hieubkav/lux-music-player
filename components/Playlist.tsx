import React from 'react';
import { Track } from '../types';
import { Play, BarChart3 } from 'lucide-react';

interface PlaylistProps {
  tracks: Track[];
  currentTrackId: string;
  onSelectTrack: (trackId: string) => void;
  isPlaying: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const Playlist: React.FC<PlaylistProps> = ({ tracks, currentTrackId, onSelectTrack, isPlaying }) => {
  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-xl md:rounded-r-3xl p-6 md:p-8 border-l border-white/20">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Danh sách phát
          <span className="text-xs font-normal text-gray-500 bg-white/50 px-2 py-0.5 rounded-full border border-gray-100">
            {tracks.length} bài
          </span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">Gợi ý cho bạn hôm nay</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {tracks.map((track) => {
          const isActive = track.id === currentTrackId;
          
          return (
            <div 
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`
                group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300
                ${isActive 
                  ? 'bg-white shadow-lg shadow-indigo-100 scale-[1.02] border border-indigo-50' 
                  : 'hover:bg-white/60 hover:shadow-sm border border-transparent hover:border-white/50'
                }
              `}
            >
              {/* Thumbnail with overlay state */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <img 
                  src={track.albumArt} 
                  alt={track.title} 
                  className={`w-full h-full object-cover rounded-xl transition-all ${isActive ? 'shadow-md' : ''}`} 
                />
                
                {/* Playing Indicator Overlay */}
                <div className={`
                  absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-[1px]
                  transition-opacity duration-300
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                  {isActive && isPlaying ? (
                    <BarChart3 size={20} className="text-white animate-pulse" />
                  ) : (
                    <Play size={20} className="text-white fill-white" />
                  )}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm truncate ${isActive ? 'text-indigo-900' : 'text-gray-800'}`}>
                  {track.title}
                </h4>
                <p className={`text-xs truncate ${isActive ? 'text-indigo-500 font-medium' : 'text-gray-500'}`}>
                  {track.artist}
                </p>
              </div>

              {/* Duration / Visualizer */}
              <div className="text-xs font-semibold text-gray-400 w-10 text-right">
                 {isActive && isPlaying ? (
                   <div className="flex gap-[2px] justify-end h-3 items-end">
                     <span className="w-1 bg-indigo-500 rounded-t-sm animate-[pulse_0.6s_ease-in-out_infinite]"></span>
                     <span className="w-1 bg-indigo-500 rounded-t-sm animate-[pulse_0.8s_ease-in-out_infinite] h-[80%]"></span>
                     <span className="w-1 bg-indigo-500 rounded-t-sm animate-[pulse_1s_ease-in-out_infinite] h-[50%]"></span>
                   </div>
                 ) : (
                    formatDuration(track.duration)
                 )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer subtle decoration */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
         <button className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 transition-colors uppercase tracking-wider">
           Xem tất cả
         </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};