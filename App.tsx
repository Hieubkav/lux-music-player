import React, { useState, useEffect, useRef } from 'react';
import { PlayerControls } from './components/PlayerControls';
import { Playlist } from './components/Playlist';
import { TRACKS } from './constants';
import { PlayerState } from './types';

const App: React.FC = () => {
  // State
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    currentTrackId: TRACKS[0].id,
    volume: 75,
  });

  // Ref to hold the Audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Object once
  useEffect(() => {
    audioRef.current = new Audio(TRACKS[0].url);
    audioRef.current.volume = 0.75;

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Derived state
  const currentTrackIndex = TRACKS.findIndex(t => t.id === playerState.currentTrackId);
  const currentTrack = TRACKS[currentTrackIndex] || TRACKS[0];

  // Logic: Handle Track Change
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const currentUrl = currentTrack.url;

    // Only change source if it's different to prevent reloading on re-renders
    if (currentUrl && audio.src !== currentUrl) {
      audio.src = currentUrl;
      audio.load();
      if (playerState.isPlaying) {
        audio.play().catch(error => {
          console.error("Playback failed:", error);
          setPlayerState(prev => ({ ...prev, isPlaying: false }));
        });
      }
    }
  }, [playerState.currentTrackId, currentTrack.url, playerState.isPlaying]);

  // Logic: Handle Play/Pause actions
  useEffect(() => {
    if (!audioRef.current) return;

    if (playerState.isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback prevented:", error);
          // Revert state if play failed (e.g. browser policy)
          setPlayerState(prev => ({ ...prev, isPlaying: false }));
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [playerState.isPlaying]);

  // Logic: Handle Volume Change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume / 100;
    }
  }, [playerState.volume]);

  // Logic: Event Listeners for Time Update and Song End
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleEnded = () => {
      // Auto play next track
      setPlayerState(prev => {
        const currentIndex = TRACKS.findIndex(t => t.id === prev.currentTrackId);
        const nextIndex = (currentIndex + 1) % TRACKS.length;
        return {
          ...prev,
          currentTrackId: TRACKS[nextIndex].id,
          currentTime: 0,
          isPlaying: true
        };
      });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []); // Run once to attach static listeners that depend on state setter only

  // Handlers
  const togglePlay = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const changeTrack = (id: string) => {
    setPlayerState(prev => ({
      ...prev,
      currentTrackId: id,
      currentTime: 0,
      isPlaying: true // Auto play when clicking a new track
    }));
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    changeTrack(TRACKS[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    changeTrack(TRACKS[prevIndex].id);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  };

  const handleVolumeChange = (vol: number) => {
    setPlayerState(prev => ({ ...prev, volume: vol }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      
      {/* Main Glass Card */}
      <div className="w-full max-w-5xl h-[85vh] md:h-[700px] bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/40 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

        {/* Left: Player Controls (40%) */}
        <div className="w-full md:w-[45%] h-full relative z-10 md:border-r border-white/20">
          <PlayerControls 
            track={currentTrack}
            isPlaying={playerState.isPlaying}
            onPlayPause={togglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
            currentTime={playerState.currentTime}
            duration={currentTrack.duration} // Use static duration for smoother UI, or audio.duration if loaded
            onSeek={handleSeek}
            volume={playerState.volume}
            onVolumeChange={handleVolumeChange}
          />
        </div>

        {/* Right: Playlist (60%) */}
        <div className="w-full md:w-[55%] h-full relative z-10 bg-white/30">
          <Playlist 
            tracks={TRACKS}
            currentTrackId={playerState.currentTrackId}
            onSelectTrack={changeTrack}
            isPlaying={playerState.isPlaying}
          />
        </div>

      </div>
    </div>
  );
};

export default App;