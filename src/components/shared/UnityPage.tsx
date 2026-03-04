"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { switchTrack, muteMusic, unmuteMusic } from "./MusicPlayer";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import { memoryCache } from './PreloadAssets';
import ALL_VIDEOS from '@/lib/all-videos.json';

const GIRLS = [
  { name: "Alyok",    color: "#ff007f", emoji: "💗" },
  { name: "Sabinina", color: "#00f0ff", emoji: "💙" },
  { name: "Nazken",   color: "#ffb800", emoji: "💛" },
  { name: "Molya",    color: "#b500ff", emoji: "💜" },
  { name: "Zhansiko", color: "#ff2a00", emoji: "❤️" },
  { name: "Oliyash",  color: "#00ffa3", emoji: "💚" },
  { name: "Ardashon", color: "#ff8c00", emoji: "🧡" },
];

// Use all uploaded videos from Cloudinary
export const VIDEOS = ALL_VIDEOS;

const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  id: i, x: Math.random() * 100, color: GIRLS[i % GIRLS.length].color,
  size: 6 + Math.random() * 8, delay: Math.random() * 4, dur: 3 + Math.random() * 4, drift: (Math.random() - 0.5) * 80,
}));

const BURST = Array.from({ length: 40 }, (_, i) => ({
  id: i, angle: (i / 40) * 360, color: GIRLS[i % GIRLS.length].color, dist: 150 + Math.random() * 200,
}));

export const POLAROID_ROWS = [
  [{ id: 1, src: "/memories/20230212_222942.jpg", rotation: -5 }, { id: 2, src: "/memories/20230302_225341.jpg", rotation: 3 }, { id: 3, src: "/memories/20230429_010315.jpg", rotation: -2 }, { id: 4, src: "/memories/20230530_195736.jpg", rotation: 4 }, { id: 5, src: "/memories/20230625_123347.jpg", rotation: -4 }, { id: 6, src: "/memories/20230701_235147.jpg", rotation: 3 }],
  [{ id: 7, src: "/memories/20231014_151529.jpg", rotation: -3 }, { id: 8, src: "/memories/20240204_170451.jpg", rotation: 2 }, { id: 9, src: "/memories/20240217_175354.jpg", rotation: -4 }, { id: 10, src: "/memories/20240224_172616.jpg", rotation: 5 }, { id: 11, src: "/memories/20240224_180233.jpg", rotation: -3 }, { id: 12, src: "/memories/20240224_180238.jpg", rotation: 4 }],
  [{ id: 13, src: "/memories/20240224_180244.jpg", rotation: -2 }, { id: 14, src: "/memories/20240401_194531.jpg", rotation: 3 }, { id: 15, src: "/memories/20240506_155343.jpg", rotation: -5 }, { id: 16, src: "/memories/20240910_160847(0).jpg", rotation: 4 }, { id: 17, src: "/memories/20250205_160151.jpg", rotation: -3 }, { id: 18, src: "/memories/20250405_193634.jpg", rotation: 2 }],
  [{ id: 19, src: "/memories/20250612_095517.jpg", rotation: -4 }, { id: 20, src: "/memories/20250629_131417.jpg", rotation: 5 }, { id: 21, src: "/memories/20251212_223319.jpg", rotation: -3 }, { id: 22, src: "/memories/20260302_113814.jpg", rotation: 3 }, { id: 23, src: "/memories/20260302_113824.jpg", rotation: -2 }, { id: 24, src: "/memories/20260302_113854.jpg", rotation: 4 }],
  [{ id: 25, src: "/memories/Collage (Photo budka).png", rotation: -4 }, { id: 26, src: "/memories/DSC09666.JPG", rotation: 3 }, { id: 27, src: "/memories/IMG_1267.png", rotation: -3 }, { id: 28, src: "/memories/IMG_20250216_111400_549.png", rotation: 2 }, { id: 29, src: "/memories/IMG_20250905_222750_848.jpg", rotation: -5 }, { id: 30, src: "/memories/IMG_3749.JPG", rotation: 4 }],
  [{ id: 31, src: "/memories/IMG_3776.jpg", rotation: -3 }, { id: 32, src: "/memories/IMG_3896.JPG", rotation: 3 }, { id: 33, src: "/memories/IMG_5243.JPG", rotation: -2 }, { id: 34, src: "/memories/IMG_5652.JPG", rotation: 4 }, { id: 35, src: "/memories/IMG_5658.JPG", rotation: -5 }, { id: 36, src: "/memories/IMG_6162.JPG", rotation: 3 }],
  [{ id: 37, src: "/memories/IMG_7252.PNG", rotation: -3 }, { id: 38, src: "/memories/IMG_8408.JPG", rotation: 2 }, { id: 39, src: "/memories/IMG_8465.JPG", rotation: -4 }, { id: 40, src: "/memories/IMG_8565.jpg", rotation: 3 }, { id: 41, src: "/memories/IMG_9536.JPG", rotation: -2 }, { id: 42, src: "/memories/photo_2026-03-02 18.09.41.jpeg", rotation: 4 }],
  [{ id: 43, src: "/memories/photo_2026-03-02 18.10.06.jpeg", rotation: -5 }, { id: 44, src: "/memories/photo_2026-03-02 18.10.15.jpeg", rotation: 3 }, { id: 45, src: "/memories/photo_2026-03-02 18.10.18.jpeg", rotation: -4 }, { id: 46, src: "/memories/photo_2026-03-02 18.11.08.jpeg", rotation: 3 }, { id: 47, src: "/memories/photo_2026-03-02 18.11.09.jpeg", rotation: -2 }, { id: 48, src: "/memories/photo_2026-03-02 18.11.10.jpeg", rotation: 4 }],
  [{ id: 49, src: "/memories/photo_2026-03-02 18.11.11 (1).jpeg", rotation: -3 }, { id: 50, src: "/memories/photo_2026-03-02 18.11.11.jpeg", rotation: 3 }, { id: 51, src: "/memories/photo_2026-03-02 18.11.12.jpeg", rotation: -2 }, { id: 52, src: "/memories/photo_2026-03-02 18.11.13.jpeg", rotation: 4 }, { id: 53, src: "/memories/photo_2026-03-02 18.11.14.jpeg", rotation: -5 }, { id: 54, src: "/memories/photo_2026-03-02 18.11.18.jpeg", rotation: 3 }],
  [{ id: 55, src: "/memories/photo_2026-03-02 18.11.20.jpeg", rotation: -2 }, { id: 56, src: "/memories/photo_2026-03-03 17.38.55.jpeg", rotation: 4 }, { id: 57, src: "/memories/Screenshot 2026-03-02 at 18.25.01.png", rotation: -3 }, { id: 58, src: "/memories/Screenshot 2026-03-02 at 18.25.51.png", rotation: 3 }, { id: 59, src: "/memories/YBS - Vogue (God of Music).png", rotation: -5 }],
];

export function UnityPage({ onBack }: { onBack: () => void }) {
  const [show, setShow] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; id: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Switch to BTS music when entering Celebrate Together page
  useEffect(() => {
    switchTrack('bts');
    return () => {
      // Switch back to playlist when leaving
      switchTrack('playlist');
    };
  }, []);

  useEffect(() => { const t = setTimeout(() => setShow(true), 300); return () => clearTimeout(t); }, []);

  // Handle video time update
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  }, []);

  // Handle video loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  }, []);

  // Handle video ended
  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Seek video
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Close video modal
  const closeVideoModal = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    setSelectedVideo(null);
    unmuteMusic(); // Unmute background music when closing video
  }, []);

  // Handle video click
  const handleVideoClick = useCallback((video: { src: string; id: number }) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    setIsMuted(false); // Unmute when opening popup
    setProgress(0);
    muteMusic(); // Mute background music when opening video
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, #0d0120 0%, #050008 60%, #000000 100%)" }}>
      
      {CONFETTI.map((c) => (
        <motion.div key={c.id} initial={{ y: -20, opacity: 0 }}
          animate={{ y: ["0vh", "110vh"], x: [0, c.drift], opacity: [0, 1, 1, 0], rotate: [0, 360, 720] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 rounded-sm pointer-events-none"
          style={{ left: `${c.x}%`, width: c.size, height: c.size, backgroundColor: c.color, boxShadow: `0 0 6px ${c.color}` }} />
      ))}

      <AnimatePresence>
        {show && (<>
          {BURST.map((b) => {
            const rad = (b.angle * Math.PI) / 180;
            return (<motion.div key={b.id} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: Math.cos(rad) * b.dist, y: Math.sin(rad) * b.dist, scale: 0, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{ backgroundColor: b.color, boxShadow: `0 0 8px ${b.color}` }} />);
          })}
        </>)}
      </AnimatePresence>

      {[1, 1.8, 2.6].map((s, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          animate={{ scale: [s, s * 1.08, s], opacity: [0.08, 0.15, 0.08] }}
          transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }}
          style={{ width: 400, height: 400, background: `conic-gradient(${GIRLS.map((g, j) => `${g.color} ${j * (360 / GIRLS.length)}deg`).join(", ")})`, filter: "blur(40px)" }} />
      ))}

      {/* Photo Popup Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Use cached image if available, otherwise load from URL */}
              {memoryCache.has(selectedPhoto) ? (
                <img
                  src={memoryCache.get(selectedPhoto)}
                  alt="Memory"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <Image
                  src={selectedPhoto}
                  alt="Memory"
                  width={1200}
                  height={1200}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  quality={90}
                  priority
                />
              )}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 text-white/80 hover:text-white text-4xl font-bold"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Popup Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative max-w-5xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video */}
              <video
                ref={videoRef}
                src={selectedVideo.src}
                className="w-full max-h-[75vh] object-contain rounded-lg"
                muted={isMuted}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                autoPlay
              />
              
              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                {/* Progress bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer mb-3
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer"
                />
                
                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {isPlaying ? <Pause size={24} className="fill-white" /> : <Play size={24} className="fill-white" />}
                    </button>
                    
                    {/* Volume */}
                    <button
                      onClick={toggleMute}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    
                    {/* Time display */}
                    <span className="text-white/60 text-sm font-mono">
                      {formatTime(progress)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={closeVideoModal}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-start py-8">
          <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center max-w-4xl mt-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <span className="text-6xl sm:text-8xl font-serif font-bold tracking-tight text-white"
                style={{ textShadow: "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)" }}>March 8</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase text-white/80"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
                Happy International Women&apos;s Day
              </h2>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }} className="flex flex-col items-center gap-4">
              {/* First row - 4 names */}
              <div className="flex flex-wrap justify-center gap-3">
                {GIRLS.slice(0, 4).map((g, i) => (
                  <motion.div key={g.name} initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                    style={{ border: `1px solid ${g.color}40`, background: `${g.color}15`, boxShadow: `0 0 20px ${g.color}20` }}>
                    <span>{g.emoji}</span>
                    <span className="text-sm font-semibold tracking-wider" style={{ color: g.color, textShadow: `0 0 10px ${g.color}` }}>{g.name}</span>
                  </motion.div>
                ))}
              </div>
              {/* Second row - 3 names */}
              <div className="flex flex-wrap justify-center gap-3">
                {GIRLS.slice(4, 7).map((g, i) => (
                  <motion.div key={g.name} initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                    style={{ border: `1px solid ${g.color}40`, background: `${g.color}15`, boxShadow: `0 0 20px ${g.color}20` }}>
                    <span>{g.emoji}</span>
                    <span className="text-sm font-semibold tracking-wider" style={{ color: g.color, textShadow: `0 0 10px ${g.color}` }}>{g.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.8 }}
              className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl">
              Seven stars. Seven stories. One constellation that makes every room brighter, every moment louder, and every dream bigger.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.8 }}
              className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl">
              Thank you for being who you are — today and every day.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 0.8 }} className="flex flex-col items-center gap-1">
              <span className="text-white/30 text-sm tracking-widest">— with love, Timson</span>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-3xl mt-2">🌸</motion.div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 1 }}
            className="mt-12 w-full max-w-6xl px-4 pb-16">
            <h3 className="text-xl font-serif tracking-[0.3em] uppercase text-white/60 mb-8 text-center">Memories</h3>
            <div className="space-y-16">
              {POLAROID_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="relative h-48 w-full flex justify-center">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="relative w-full h-full flex justify-center">
                    {row.map((polaroid, i) => (
                      <motion.div key={polaroid.id}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0, rotate: polaroid.rotation }}
                        transition={{ delay: 3.2 + (rowIndex * 0.3) + (i * 0.05), duration: 0.6, type: "spring", stiffness: 120 }}
                        className="relative mx-1"
                        style={{ transformOrigin: 'top center', zIndex: i }}
                      >
                        <div className="absolute left-1/2 -top-8 w-px bg-gradient-to-b from-white/50 to-transparent" style={{ height: '32px' }} />
                        <motion.div
                          className="bg-white p-2 pb-5 rounded-sm shadow-2xl cursor-pointer"
                          style={{ width: '140px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
                          whileHover={{ scale: 1.2, rotate: 0, zIndex: 100, boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                          onClick={() => setSelectedPhoto(polaroid.src)}
                        >
                          <div className="bg-gray-100 aspect-square overflow-hidden relative">
                            <Image 
                              src={polaroid.src} 
                              alt={`Memory ${polaroid.id}`} 
                              fill 
                              className="object-cover" 
                              sizes="140px"
                              loading="lazy"
                              quality={85}
                              onError={(e) => { 
                                const target = e.target as HTMLImageElement; 
                                console.log('Image failed to load:', polaroid.src);
                              }} 
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Film Roll Video Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="mt-16 w-full max-w-7xl px-4 pb-16"
          >
            <h3 className="text-xl font-serif tracking-[0.3em] uppercase text-white/60 mb-8 text-center">Video Memories</h3>

            {/* Video grid - 7 per row to fit all 77 videos */}
            <div className="grid grid-cols-7 gap-2 justify-items-center">
              {VIDEOS.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 50, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: video.rotation || 0 }}
                  transition={{ delay: 3.8 + (index * 0.05), duration: 0.6, type: "spring", stiffness: 120 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                  style={{ transformOrigin: 'top center' }}
                >
                  {/* Film roll frame container */}
                  <div className="relative bg-black shadow-2xl" style={{ width: '200px', height: '150px' }}>
                    {/* Sprocket holes top - WHITE */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-black flex justify-around items-center px-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                      ))}
                    </div>

                    {/* Sprocket holes bottom - WHITE */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-black flex justify-around items-center px-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                      ))}
                    </div>

                    {/* Side borders - thin black frames on left and right */}
                    <div className="absolute top-4 bottom-4 left-0 w-0.5 bg-black" />
                    <div className="absolute top-4 bottom-4 right-0 w-0.5 bg-black" />

                    {/* Video container - inset from sprocket holes and side borders */}
                    <div className="absolute top-4 bottom-4 left-0.5 right-0.5 bg-black overflow-hidden">
                      {/* Show poster image, load video on hover */}
                      <video
                        src={video.src}
                        poster={video.poster}
                        className="w-full h-full"
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        muted
                        preload="none"
                      />
                      
                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                        >
                          <Play size={20} className="fill-white text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} onClick={onBack}
        className="absolute top-8 left-8 z-20 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Back to Galaxy</motion.button>
    </motion.div>
  );
}
