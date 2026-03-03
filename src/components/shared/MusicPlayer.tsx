'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

// Global audio instance and state
let globalAudio: HTMLAudioElement | null = null;
let currentTrackIndex = 0;
let isBTSPlaying = false;

// Main playlist - 3 songs that play continuously on main pages
const PLAYLIST = [
  '/music/Ninety One - Aiyptama.mp3',
  '/music/Alpha - Demim.mp3',
  '/music/Ninety One - Jurek.mp3',
];

// BTS track for Celebrate Together page
const BTS_TRACK = '/music/BTS - I Need U (Piano).mp3';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create global audio instance if it doesn't exist
    if (!globalAudio) {
      globalAudio = new Audio(PLAYLIST[0]);
      globalAudio.loop = false; // We'll manually loop through playlist
      globalAudio.volume = 0.5;

      globalAudio.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
      });

      globalAudio.addEventListener('play', () => setIsPlaying(true));
      globalAudio.addEventListener('pause', () => setIsPlaying(false));
      
      // When song ends, play next track
      globalAudio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
        if (globalAudio) {
          globalAudio.src = PLAYLIST[currentTrackIndex];
          globalAudio.play().catch(() => {});
        }
      });
    }

    return () => {
      // Don't cleanup - keep audio global
    };
  }, []);

  const togglePlay = async () => {
    if (!globalAudio) return;

    if (isPlaying) {
      globalAudio.pause();
    } else {
      try {
        await globalAudio.play();
      } catch (err) {
        console.log('Playback failed');
      }
    }
  };

  const toggleMute = () => {
    if (!globalAudio) return;

    globalAudio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Expose mute function for video popup
  useEffect(() => {
    const handleMuteMusic = () => {
      if (globalAudio) {
        globalAudio.muted = true;
        setIsMuted(true);
      }
    };
    
    const handleUnmuteMusic = () => {
      if (globalAudio) {
        globalAudio.muted = false;
        setIsMuted(false);
      }
    };

    window.addEventListener('muteMusic', handleMuteMusic);
    window.addEventListener('unmuteMusic', handleUnmuteMusic);

    return () => {
      window.removeEventListener('muteMusic', handleMuteMusic);
      window.removeEventListener('unmuteMusic', handleUnmuteMusic);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex gap-2">
      {/* Play/Pause button */}
      <motion.button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-1" />
        )}
      </motion.button>

      {/* Mute button */}
      <motion.button
        onClick={toggleMute}
        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white/60" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </motion.button>
    </div>
  );
}

// Helper function to start audio (called from IntroSequence)
export const startGlobalAudio = async () => {
  if (!globalAudio) return false;
  try {
    await globalAudio.play();
    return true;
  } catch (err) {
    console.log('Audio start failed');
    return false;
  }
};

// Switch between playlist and BTS
export const switchTrack = (track: 'playlist' | 'bts') => {
  if (!globalAudio) return;
  
  const wasPlaying = !globalAudio.paused;
  
  if (track === 'bts' && !isBTSPlaying) {
    // Switch to BTS
    globalAudio.src = BTS_TRACK;
    globalAudio.loop = true;
    isBTSPlaying = true;
    if (wasPlaying) {
      globalAudio.play().catch(() => {});
    }
  } else if (track === 'playlist' && isBTSPlaying) {
    // Switch back to playlist
    globalAudio.src = PLAYLIST[0];
    globalAudio.loop = false;
    currentTrackIndex = 0;
    isBTSPlaying = false;
    if (wasPlaying) {
      globalAudio.play().catch(() => {});
    }
  }
};

// Mute/unmute music (called from video popup)
export const muteMusic = () => {
  window.dispatchEvent(new CustomEvent('muteMusic'));
};

export const unmuteMusic = () => {
  window.dispatchEvent(new CustomEvent('unmuteMusic'));
};

export default MusicPlayer;
