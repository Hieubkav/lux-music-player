export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // in seconds
  url?: string; // Optional real URL
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  currentTrackId: string;
  volume: number;
}