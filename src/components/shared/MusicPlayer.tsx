'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

// Global audio instance
let globalAudio: HTMLAudioElement | null = null;
let currentTrack: string = 'ninety-one';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create global audio instance if it doesn't exist
    if (!globalAudio) {
      globalAudio = new Audio('/music/Ninety One - Aiyptama.mp3');
      globalAudio.loop = true;
      globalAudio.volume = 0.5;

      globalAudio.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
      });

      globalAudio.addEventListener('play', () => setIsPlaying(true));
      globalAudio.addEventListener('pause', () => setIsPlaying(false));
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

// Switch track based on page
export const switchTrack = (track: 'ninety-one' | 'bts') => {
  if (!globalAudio) return;
  
  if (track === currentTrack) return; // Already playing this track
  
  const wasPlaying = !globalAudio.paused;
  const currentTime = globalAudio.currentTime;
  
  if (track === 'bts') {
    globalAudio.src = '/music/BTS - I Need U (Piano).mp3';
  } else {
    globalAudio.src = '/music/Ninety One - Aiyptama.mp3';
  }
  
  currentTrack = track;
  globalAudio.loop = true;
  globalAudio.volume = 0.5;
  
  if (wasPlaying) {
    globalAudio.play().catch(() => {});
  }
};

export default MusicPlayer;
