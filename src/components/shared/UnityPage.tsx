"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { switchTrack } from "./MusicPlayer";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

const GIRLS = [
  { name: "Alyok",    color: "#ff007f", emoji: "💗" },
  { name: "Sabinina", color: "#00f0ff", emoji: "💙" },
  { name: "Nazken",   color: "#ffb800", emoji: "💛" },
  { name: "Molya",    color: "#b500ff", emoji: "💜" },
  { name: "Zhansiko", color: "#ff2a00", emoji: "❤️" },
  { name: "Oliyash",  color: "#00ffa3", emoji: "💚" },
  { name: "Ardashon", color: "#ff8c00", emoji: "🧡" },
];

const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  id: i, x: Math.random() * 100, color: GIRLS[i % GIRLS.length].color,
  size: 6 + Math.random() * 8, delay: Math.random() * 4, dur: 3 + Math.random() * 4, drift: (Math.random() - 0.5) * 80,
}));

const BURST = Array.from({ length: 40 }, (_, i) => ({
  id: i, angle: (i / 40) * 360, color: GIRLS[i % GIRLS.length].color, dist: 150 + Math.random() * 200,
}));

const POLAROID_ROWS = [
  [{ id: 1, src: "/memories/20230212_222942.webp", rotation: -5 }, { id: 2, src: "/memories/20230302_225341.webp", rotation: 3 }, { id: 3, src: "/memories/20230429_010315.webp", rotation: -2 }, { id: 4, src: "/memories/20230530_195736.webp", rotation: 4 }, { id: 5, src: "/memories/20230625_123347.webp", rotation: -4 }, { id: 6, src: "/memories/20230701_235147.webp", rotation: 3 }],
  [{ id: 7, src: "/memories/20231014_151529.webp", rotation: -3 }, { id: 8, src: "/memories/20240204_170451.webp", rotation: 2 }, { id: 9, src: "/memories/20240217_175354.webp", rotation: -4 }, { id: 10, src: "/memories/20240224_172616.webp", rotation: 5 }, { id: 11, src: "/memories/20240224_180233.webp", rotation: -3 }, { id: 12, src: "/memories/20240224_180238.webp", rotation: 4 }],
  [{ id: 13, src: "/memories/20240224_180244.webp", rotation: -2 }, { id: 14, src: "/memories/20240401_194531.webp", rotation: 3 }, { id: 15, src: "/memories/20240506_155343.webp", rotation: -5 }, { id: 16, src: "/memories/20240910_160847(0).webp", rotation: 4 }, { id: 17, src: "/memories/20250205_160151.webp", rotation: -3 }, { id: 18, src: "/memories/20250405_193634.webp", rotation: 2 }],
  [{ id: 19, src: "/memories/20250612_095517.webp", rotation: -4 }, { id: 20, src: "/memories/20250629_131417.webp", rotation: 5 }, { id: 21, src: "/memories/20251212_223319.webp", rotation: -3 }, { id: 22, src: "/memories/20260302_113814.webp", rotation: 3 }, { id: 23, src: "/memories/20260302_113824.webp", rotation: -2 }, { id: 24, src: "/memories/20260302_113854.webp", rotation: 4 }],
  [{ id: 25, src: "/memories/Collage (Photo budka).webp", rotation: -4 }, { id: 26, src: "/memories/DSC09666.webp", rotation: 3 }, { id: 27, src: "/memories/IMG_1267.webp", rotation: -3 }, { id: 28, src: "/memories/IMG_20250216_111400_549.webp", rotation: 2 }, { id: 29, src: "/memories/IMG_20250905_222750_848.webp", rotation: -5 }, { id: 30, src: "/memories/IMG_3776.webp", rotation: 4 }],
  [{ id: 31, src: "/memories/IMG_3896.webp", rotation: -3 }, { id: 32, src: "/memories/IMG_6162.webp", rotation: 3 }, { id: 33, src: "/memories/IMG_8408.webp", rotation: -2 }, { id: 34, src: "/memories/IMG_8465.webp", rotation: 4 }, { id: 35, src: "/memories/IMG_8565.webp", rotation: -3 }, { id: 36, src: "/memories/IMG_9536.webp", rotation: 3 }],
  [{ id: 37, src: "/memories/photo_2026-03-02 18.09.41.webp", rotation: -2 }, { id: 38, src: "/memories/photo_2026-03-02 18.10.06.webp", rotation: 4 }, { id: 39, src: "/memories/photo_2026-03-02 18.10.15.webp", rotation: -5 }, { id: 40, src: "/memories/photo_2026-03-02 18.10.18.webp", rotation: 3 }, { id: 41, src: "/memories/photo_2026-03-02 18.11.08.webp", rotation: -3 }, { id: 42, src: "/memories/photo_2026-03-02 18.11.09.webp", rotation: 2 }],
  [{ id: 43, src: "/memories/photo_2026-03-02 18.11.10.webp", rotation: -4 }, { id: 44, src: "/memories/photo_2026-03-02 18.11.11 (1).webp", rotation: 4 }, { id: 45, src: "/memories/photo_2026-03-02 18.11.11.webp", rotation: -3 }, { id: 46, src: "/memories/photo_2026-03-02 18.11.12.webp", rotation: 3 }, { id: 47, src: "/memories/photo_2026-03-02 18.11.13.webp", rotation: -2 }, { id: 48, src: "/memories/photo_2026-03-02 18.11.14.webp", rotation: 4 }],
  [{ id: 49, src: "/memories/photo_2026-03-02 18.11.18.webp", rotation: -3 }, { id: 50, src: "/memories/photo_2026-03-02 18.11.20.webp", rotation: 3 }, { id: 51, src: "/memories/Screenshot 2026-03-02 at 18.25.01.webp", rotation: -2 }, { id: 52, src: "/memories/Screenshot 2026-03-02 at 18.25.51.webp", rotation: 4 }, { id: 53, src: "/memories/YBS - Vogue (God of Music).webp", rotation: -5 }],
];

const VIDEOS = [
  { id: 1, src: "/videos/DJI_20240330191842_0045_D.mp4", rotation: 11 },
  { id: 2, src: "/videos/DJI_20240330191842_0045_D_2.mp4", rotation: -8 },
  { id: 3, src: "/videos/IMG_1710.MP4", rotation: 14 },
  { id: 4, src: "/videos/IMG_1961.MOV", rotation: -5 },
  { id: 5, src: "/videos/IMG_3179.MP4", rotation: 9 },
  { id: 6, src: "/videos/IMG_3180.MP4", rotation: -13 },
  { id: 7, src: "/videos/IMG_6853.MP4", rotation: 6 },
  { id: 8, src: "/videos/IMG_8345.MOV", rotation: -10 },
  { id: 9, src: "/videos/IMG_8346.MOV", rotation: 15 },
  { id: 10, src: "/videos/IMG_8347.MOV", rotation: -3 },
  { id: 11, src: "/videos/IMG_8348.MOV", rotation: 12 },
  { id: 12, src: "/videos/IMG_8350.MOV", rotation: -7 },
  { id: 13, src: "/videos/IMG_8351.MOV", rotation: 4 },
  { id: 14, src: "/videos/IMG_8352.MOV", rotation: -14 },
  { id: 15, src: "/videos/IMG_8542.MOV", rotation: 8 },
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
  
  // Switch to BTS music when entering Unity page
  useEffect(() => {
    switchTrack('bts');
    return () => {
      // Switch back to Ninety One when leaving
      switchTrack('ninety-one');
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
  }, []);

  // Handle video click
  const handleVideoClick = useCallback((video: { src: string; id: number }) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    setIsMuted(false); // Unmute when opening popup
    setProgress(0);
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
              <Image
                src={selectedPhoto}
                alt="Memory"
                width={1200}
                height={1200}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                quality={90}
                priority
              />
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
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                              onError={(e) => { const target = e.target as HTMLImageElement; target.src = '/memories/20230212_222942.jpg'; }} />
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

            {/* Video grid - 4 per row */}
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              {VIDEOS.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 50, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: video.rotation }}
                  transition={{ delay: 3.8 + (index * 0.1), duration: 0.6, type: "spring", stiffness: 120 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                  style={{ transformOrigin: 'top center' }}
                >
                  {/* Cinematic film roll frame */}
                  <div className="relative bg-black shadow-2xl" style={{ width: '280px', height: '200px' }}>
                    {/* Thick black border frame with sharp corners */}
                    <div className="absolute inset-0 border-8 border-black bg-black" />

                    {/* White sprocket holes top - rectangular, evenly spaced */}
                    <div className="absolute top-1 left-0 right-0 h-2 z-20 flex justify-around px-3">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-2 bg-white" />
                      ))}
                    </div>

                    {/* White sprocket holes bottom - rectangular, evenly spaced */}
                    <div className="absolute bottom-1 left-0 right-0 h-2 z-20 flex justify-around px-3">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-2 bg-white" />
                      ))}
                    </div>

                    {/* Video area (inside film frame) - sharp corners */}
                    <div className="absolute inset-6 bg-black overflow-hidden">
                      {/* Video preview (muted, looping, autoplay) */}
                      <video
                        src={video.src}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />

                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                        >
                          <Play size={28} className="fill-white text-white ml-1" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Film frame number - sharp corners */}
                    <div className="absolute bottom-8 left-2 text-white/70 text-xs font-mono bg-black/80 px-2 py-0.5 z-20">
                      #{video.id.toString().padStart(2, '0')}
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
