"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { startGlobalAudio } from "./MusicPlayer";

const BG_STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  dur: 2 + Math.random() * 3,
}));

const TITLE_LETTERS = "NEWGEN".split("");

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    const timings = [300, 800, 1400, 2400, 3200];
    const timers = timings.map((t, i) =>
      setTimeout(() => setStep(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Start audio on first user interaction
  useEffect(() => {
    const startAudio = async () => {
      if (audioStarted) return;
      const started = await startGlobalAudio();
      if (started) setAudioStarted(true);
    };

    const handleClick = () => startAudio();
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleClick);
    };
  }, [audioStarted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#02020a]"
    >
      {/* ── Nebula background ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, #0d0822 0%, #020208 60%, #000000 100%)",
        }}
      />

      {/* ── Background star field ── */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none"
          >
            {BG_STARS.map((s) => (
              <div
                key={s.id}
                className="absolute rounded-full bg-white twinkle"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.dur}s`,
                  opacity: 0.4,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Central aura ── */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(140,80,255,0.25) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Title ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 select-none">
        {/* Letters */}
        <div className="flex gap-3 sm:gap-5">
          {TITLE_LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={
                step >= 3
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 40 }
              }
              transition={{
                delay: i * 0.12,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-7xl sm:text-9xl font-bold tracking-widest text-white"
              style={{
                textShadow:
                  step >= 3
                    ? "0 0 60px rgba(200,160,255,0.6), 0 0 120px rgba(140,80,255,0.3)"
                    : "none",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={step >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <span className="text-sm sm:text-base tracking-[0.5em] uppercase text-white/50">
            The Constellation
          </span>
          <span className="text-xs tracking-[0.3em] text-white/30">
            7 Stars
          </span>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </motion.div>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={step >= 5 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={onComplete}
          className="mt-6 px-10 py-3 rounded-full border border-white/20 text-white/70 text-sm tracking-[0.3em] uppercase hover:border-white/50 hover:text-white transition-colors"
          style={{ backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.04)" }}
        >
          Enter the Universe
        </motion.button>
      </div>

      {/* ── Orbiting accent rings ── */}
      <AnimatePresence>
        {step >= 3 && (
          <>
            {[1, 1.6, 2.2].map((scale, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.06 + i * 0.03, scale, rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
                transition={{
                  opacity: { duration: 1, delay: i * 0.2 },
                  scale: { duration: 1, delay: i * 0.2 },
                  rotate: { repeat: Infinity, duration: 20 + i * 8, ease: "linear" },
                }}
                className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ border: "1px solid rgba(200,160,255,0.4)" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
