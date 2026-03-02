"use client";
// OLIYASH — color: #00ffa3
// Stage 1: Bloom garden — plant 8 flowers
// Stage 2: TikTok feed — swipe 3 cards
// Stage 3: Film shoot — hold record button
// Stage 4: Midnight Walk — deep talk choices
// Stage 5: Tribute

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { Heart, Sparkles } from "lucide-react";

const COLOR = "#00ffa3";
const BG = "#001510";

interface Props { onBack: () => void; }

const TIKTOK_CARDS = [
  { emoji: "📱", tag: "@oliyash", caption: "POV: showing Timson my 50th TikTok of the day and asking what he thinks 👀", likes: "47.2K", sound: "original sound - oliyash" },
  { emoji: "😂", tag: "Joke Time", caption: "POV: we're laughing at our own terrible jokes and neither of us cares 😆💚", likes: "23.8K", sound: "laughing vibes" },
  { emoji: "💚", tag: "newgen", caption: "she doesn't just dance. she brings a whole vibe that makes every room feel like home 🏡", likes: "102K", sound: "NewGen - Group" },
];

function StageDots({ stage }: { stage: number }) {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="w-2 h-2 rounded-full transition-all duration-500"
          style={{ backgroundColor: s <= stage ? COLOR : "rgba(255,255,255,0.15)", boxShadow: s <= stage ? `0 0 6px ${COLOR}` : "none" }} />
      ))}
    </div>
  );
}

export function OliyashInteraction({ onBack }: Props) {
  const [stage, setStage] = useState(1);
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <StageDots stage={stage} />
      <button onClick={onBack} className="absolute top-8 left-8 z-50 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Galaxy</button>
      <AnimatePresence mode="wait">
        {stage === 1 && <StageBloomGarden key="s1" onDone={() => setStage(2)} />}
        {stage === 2 && <StageTikTok     key="s2" onDone={() => setStage(3)} />}
        {stage === 3 && <StageFilmShoot  key="s3" onDone={() => setStage(4)} />}
        {stage === 4 && <StageMidnightWalk key="s4" onDone={() => setStage(5)} />}
        {stage === 5 && <StageTribute    key="s5" onBack={onBack} />}
      </AnimatePresence>
    </div>
  );
}

// ── Stage 1 (Original): Bloom Garden ──
type Flower = { id: number; x: number; y: number; rotation: number; size: number };

function StageBloomGarden({ onDone }: { onDone: () => void }) {
  const NEEDED = 8;
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  const doneRef = useRef(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (doneRef.current) return;
    const flower: Flower = {
      id: Date.now(),
      x: e.clientX, y: e.clientY,
      rotation: Math.random() * 360,
      size: 0.9 + Math.random() * 0.6,
    };
    setFlowers((prev) => {
      const next = [...prev, flower];
      if (next.length >= NEEDED && !doneRef.current) {
        doneRef.current = true;
        setCanProceed(true);
      }
      return next;
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full relative cursor-crosshair overflow-hidden"
      onClick={handleClick}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00ffa3]/5 pointer-events-none" />

      {flowers.map((flower) => (
        <motion.div key={flower.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: flower.size, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="absolute pointer-events-none select-none"
          style={{ left: flower.x - 30, top: flower.y - 30, width: 60, height: 60, rotate: flower.rotation }}>
          <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
          <motion.div className="absolute inset-0 rounded-full"
            animate={{ boxShadow: ["0 0 15px rgba(0,255,163,0.5)", "0 0 30px rgba(0,255,163,0.12)", "0 0 15px rgba(0,255,163,0.5)"] }}
            transition={{ repeat: Infinity, duration: 2 }} />
        </motion.div>
      ))}

      {/* Progress hint */}
      <AnimatePresence>
        {!canProceed && (
          <motion.div exit={{ opacity: 0 }}
            className="absolute bottom-10 w-full flex flex-col items-center gap-3 pointer-events-none">
            <p className="text-white/40 tracking-[0.3em] uppercase text-xs">
              Chapter 1 · Plant the garden ({flowers.length} / {NEEDED})
            </p>
            <div className="flex gap-2">
              {Array.from({ length: NEEDED }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: i < flowers.length ? COLOR : "rgba(255,255,255,0.2)",
                    boxShadow: i < flowers.length ? `0 0 6px ${COLOR}` : "none",
                  }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal overlay */}
      <AnimatePresence>
        {canProceed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center flex flex-col items-center gap-5">
              <h2 className="text-3xl font-bold text-white">The garden is alive 🌸</h2>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={onDone}
                className="px-8 py-3 rounded-full text-sm font-semibold"
                style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
                Continue her story →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Stage 2: TikTok Feed ──
function StageTikTok({ onDone }: { onDone: () => void }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const isLast = cardIndex === TIKTOK_CARDS.length - 1;
  const card = TIKTOK_CARDS[cardIndex];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-6">
      <div className="relative w-full max-w-xs">
        <p className="text-center text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4">Chapter 2 · TikTok Feed</p>
        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(180deg, #0a1a12 0%, #001a10 100%)", border: "1px solid rgba(0,255,163,0.15)", aspectRatio: "9/16" }}>
          <AnimatePresence mode="wait">
            <motion.div key={cardIndex}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs">For You</span>
                <span className="text-white/40 text-xs">{cardIndex + 1} / {TIKTOK_CARDS.length}</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}
                  className="text-7xl">{card.emoji}</motion.div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold" style={{ color: COLOR }}>{card.tag}</p>
                  <p className="text-white/80 text-sm leading-snug mt-1">{card.caption}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                  <p className="text-white/40 text-xs">{card.sound}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
            <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1">
              <motion.span animate={{ scale: liked ? [1, 1.3, 1] : 1 }} className="text-2xl">{liked ? "❤️" : "🤍"}</motion.span>
              <span className="text-white/50 text-[10px]">{card.likes}</span>
            </button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">💬</span>
              <span className="text-white/50 text-[10px]">418</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setLiked(false); if (isLast) onDone(); else setCardIndex((i) => i + 1); }}
            className="px-6 py-2 rounded-full text-xs tracking-[0.3em] uppercase"
            style={{ background: `${COLOR}20`, border: `1px solid ${COLOR}60`, color: COLOR }}>
            {isLast ? "Special surprise →" : "Next ↓"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stage 3: Film Shoot ──
function StageFilmShoot({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  const startRecord = useCallback(() => {
    if (done) return;
    intervalRef.current = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + 2);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) { clearInterval(intervalRef.current!); setDone(true); }
    }, 80);
  }, [done]);

  const stopRecord = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-8 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 3 · The Promised Video</p>
        <h2 className="text-2xl font-bold text-white">{done ? "That's a wrap! 🎬" : "Hold to record"}</h2>
        {!done && <p className="text-white/40 text-sm mt-1">I promised you a beautiful video. This is it.</p>}
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="128" cy="128" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle cx="128" cy="128" r="100" fill="none" stroke={COLOR} strokeWidth="8"
            strokeDasharray={2 * Math.PI * 100}
            animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - progress / 100) }} />
        </svg>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <motion.div animate={{ scale: done ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5 }}
            className="text-5xl">{done ? "🎬" : "📹"}</motion.div>
          {!done && <span className="text-3xl font-mono font-bold" style={{ color: COLOR }}>{progress}%</span>}
          {done && <span className="text-xl font-bold" style={{ color: COLOR }}>Memory saved ✨</span>}
        </div>
      </div>

      {!done ? (
        <motion.button onPointerDown={startRecord} onPointerUp={stopRecord} onPointerLeave={stopRecord}
          animate={{ scale: [1, 1.04, 1], boxShadow: [`0 0 20px ${COLOR}40`, `0 0 40px ${COLOR}80`, `0 0 20px ${COLOR}40`] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer select-none"
          style={{ background: `radial-gradient(circle, #ff0000, #cc0000)`, border: "4px solid rgba(255,0,0,0.3)" }}>
          <div className="w-6 h-6 rounded-full bg-red-600" />
        </motion.button>
      ) : (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05 }}
          onClick={onDone}
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
          Read her story →
        </motion.button>
      )}
    </motion.div>
  );
}

// Stage 4: Midnight Walk
function StageMidnightWalk({ onDone }: { onDone: () => void }) {
  const [steps, setSteps] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  const walkMessages = [
    "Talking about everything and nothing... 🌙",
    "Laughing at our own jokes even though they're not funny 😆",
    "These walks mean everything 💚",
  ];

  const walk = () => {
    if (steps < walkMessages.length) {
      setMessages(prev => [...prev, walkMessages[steps]]);
      setSteps(s => s + 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · Joke Around</p>
        <h2 className="text-2xl font-bold text-white">Making memories</h2>
      </div>

      <div className="w-full max-w-md space-y-3">
        {messages.map((msg, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4"
          >
            <p className="text-white/80">{msg}</p>
          </motion.div>
        ))}
      </div>

      {steps < walkMessages.length ? (
        <motion.button onClick={walk}
          className="px-8 py-3 rounded-full bg-green-500/20 border border-green-500/50 text-white font-medium"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Take a step 🚶
        </motion.button>
      ) : (
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }} onClick={onDone}
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
          Read her tribute →
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Stage 5: Tribute ──
function StageTribute({ onBack }: { onBack: () => void }) {
  const COLOR = "#00ffa3";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-xl glass p-10 rounded-3xl">
        <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-[#00ffa3] to-transparent" />
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-6" style={{ color: COLOR }}>
          The One Who Blooms
        </h1>
        <p className="text-white/75 text-lg leading-relaxed">
          Our walks never feel long enough — you always have something real to say about the future,
          about life, about what matters. I haven&apos;t forgotten the video I promised you.{" "}
          <span style={{ color: COLOR }} className="font-semibold">That promise stands.</span>{" "}
          You deserve to be captured as the beautiful, thoughtful, TikTok-obsessed, deeply good person you are.
        </p>
        <div className="w-full h-px mt-8 mb-6 bg-gradient-to-r from-transparent via-[#00ffa3] to-transparent" />
        <p className="text-white/40 text-sm italic mb-6">Happy Women's Day, Oliyash 💚 — w/l Timson</p>
        
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-full text-sm font-semibold tracking-wider"
          style={{
            background: `linear-gradient(135deg, ${COLOR}, ${COLOR}dd)`,
            boxShadow: `0 10px 40px ${COLOR}60, 0 0 80px ${COLOR}40`,
          }}
        >
          <span className="flex items-center gap-2 text-white">
            <Sparkles size={18} />
            RETURN TO GALAXY
            <Sparkles size={18} />
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
