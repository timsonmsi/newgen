"use client";
// NAZKEN — color: #ffb800
// Stage 1: Camera mask reveal — the shy intern
// Stage 2: Media Lead dashboard — approve 3 posts
// Stage 3: Find the Dancers — camera viewport game
// Stage 4: Memory Lane — heartfelt interactive timeline
// Stage 5: Tribute

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { Camera, CheckCircle, Video, Heart, Sparkles } from "lucide-react";

const COLOR = "#ffb800";
const BG = "#0f0a00";

interface Props { onBack: () => void; }

const POSTS = [
  { id: 1, tag: "September — Day 1", title: "New Intern Joins the Media Team", body: "She was quiet. A little nervous. But she watched everything, learned fast, and asked the right questions. Something told us she'd go far. 📸", icon: "🎬" },
  { id: 2, tag: "One Year Later", title: "K-Pop Dancer Discovers Her Stage Presence", body: "Watching her dance was like watching someone finally come home. Clean moves, deep presence. The shyness? Gone the moment the music started. 💃", icon: "🎵" },
  { id: 3, tag: "YBS Media Team", title: "The Intern Becomes the Leader", body: "She took what she was taught and built something bigger. She became Media Lead — managing, creating, inspiring. This is what growth looks like. 🏆", icon: "⭐" },
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

export function NazkenInteraction({ onBack }: Props) {
  const [stage, setStage] = useState(1);
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <StageDots stage={stage} />
      <button onClick={onBack} className="absolute top-8 left-8 z-50 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Galaxy</button>
      <AnimatePresence mode="wait">
        {stage === 1 && <Stage1 key="s1" onDone={() => setStage(2)} />}
        {stage === 2 && <Stage2 key="s2" onDone={() => setStage(3)} />}
        {stage === 3 && <StageFindDancers key="s3" onDone={() => setStage(4)} />}
        {stage === 4 && <StageMemoryLane key="s4" onDone={() => setStage(5)} />}
        {stage === 5 && <StageTribute key="s5" onBack={onBack} />}
      </AnimatePresence>
    </div>
  );
}

function Stage1({ onDone }: { onDone: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (!clicked) { setClicked(true); setTimeout(onDone, 2000); }
  }, [clicked, onDone]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full relative cursor-none overflow-hidden"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      onClick={handleClick}>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 filter blur-sm">
        <h2 className="text-5xl text-white/15 font-serif italic">Day One...</h2>
        <p className="text-white/10 mt-4 tracking-widest text-sm">September · Year One</p>
      </div>
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-black"
        animate={{ clipPath: clicked ? `circle(200% at ${mousePos.x}px ${mousePos.y}px)` : `circle(90px at ${mousePos.x}px ${mousePos.y}px)` }}
        transition={{ type: "spring", bounce: 0, duration: clicked ? 1.8 : 0.08 }}
        style={{ backgroundColor: COLOR }}>
        <Camera className="w-16 h-16 mb-5 opacity-60" />
        <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter text-center px-8">
          {clicked ? "Three years later..." : "The Shy Intern"}
        </h2>
        {!clicked && <p className="mt-3 text-black/60 text-sm">Click to reveal her story</p>}
        {clicked && <p className="mt-3 text-black/60 text-sm font-medium">Media Lead. Main Dancer. Little Sister.</p>}
      </motion.div>
      {!clicked && (
        <p className="absolute bottom-10 w-full text-center text-white/40 text-xs tracking-widest pointer-events-none">
          Move the camera lens · Click to reveal
        </p>
      )}
    </motion.div>
  );
}

function Stage2({ onDone }: { onDone: () => void }) {
  const [approved, setApproved] = useState<Set<number>>(new Set());
  const allDone = approved.size >= POSTS.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center px-6 gap-6">
      <div className="text-center mb-2">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-1">YBS Media Team — Archive</p>
        <h2 className="text-xl font-bold text-white">Approve her milestones</h2>
      </div>
      <div className="w-full max-w-lg space-y-3">
        {POSTS.map((post) => {
          const isApproved = approved.has(post.id);
          return (
            <motion.div key={post.id}
              animate={{ borderColor: isApproved ? `${COLOR}60` : "rgba(255,255,255,0.08)", backgroundColor: isApproved ? `${COLOR}10` : "rgba(255,255,255,0.03)" }}
              className="rounded-2xl p-5 border transition-all duration-500">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{post.icon}</span>
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: `${COLOR}80` }}>{post.tag}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{post.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{post.body}</p>
                </div>
                <button
                  onClick={() => setApproved((prev) => new Set([...prev, post.id]))}
                  disabled={isApproved}
                  className="shrink-0 mt-1 transition-all duration-300">
                  <CheckCircle className={`w-6 h-6 transition-all ${isApproved ? "text-[#ffb800]" : "text-white/20 hover:text-white/50"}`} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      {allDone && (
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }} onClick={onDone}
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
          Read the full story →
        </motion.button>
      )}
    </motion.div>
  );
}

// Stage 3: Find the Dancers - Camera viewport game
function StageFindDancers({ onDone }: { onDone: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [captured, setCaptured] = useState<number[]>([]);
  
  // 5 dancers at random fixed positions on screen (pixels from top-left)
  const dancers = useRef([
    { id: 0, x: 300, y: 200, emoji: "💃" },
    { id: 1, x: 800, y: 200, emoji: "🕺" },
    { id: 2, x: 300, y: 500, emoji: "💃" },
    { id: 3, x: 800, y: 500, emoji: "🕺" },
    { id: 4, x: 550, y: 100, emoji: "💃" },
  ]).current;

  const allCaptured = captured.length >= 5;

  useEffect(() => {
    if (allCaptured) {
      setTimeout(() => onDone(), 1500);
    }
  }, [allCaptured, onDone]);

  const captureDancer = (id: number) => {
    if (!captured.includes(id)) {
      setCaptured([...captured, id]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8 relative overflow-hidden"
      onMouseMove={(e) => {
        // Camera follows mouse exactly - use raw mouse coordinates
        setMousePos({ x: e.clientX, y: e.clientY });
      }}
    >
      <div className="text-center z-10">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 3 · Find the Dancers</p>
        <h2 className="text-2xl font-bold text-white">Move camera to find all 5 dancers</h2>
        <p className="text-white/50 text-sm mt-1">Click to capture when you find them</p>
      </div>

      {/* Dancers - hidden until camera is over them */}
      {dancers.map((dancer) => {
        const isCaptured = captured.includes(dancer.id);
        // Check if dancer is inside camera frame (96px radius from mouse)
        const dx = dancer.x - mousePos.x;
        const dy = dancer.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isVisible = distance < 96 && !isCaptured;

        return (
          <motion.button
            key={dancer.id}
            onClick={() => isVisible && captureDancer(dancer.id)}
            disabled={!isVisible || isCaptured}
            className="absolute text-6xl pointer-events-auto"
            style={{
              left: dancer.x,
              top: dancer.y,
              opacity: isVisible ? 1 : 0,
              cursor: isVisible ? 'pointer' : 'default',
              zIndex: isVisible ? 20 : 1,
            }}
            animate={isCaptured ? {} : {
              y: [0, -20, 0],
              rotate: [0, -10, 10, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            whileHover={isVisible ? { scale: 1.2 } : {}}
            whileTap={isVisible ? { scale: 0.9 } : {}}
          >
            {dancer.emoji}
          </motion.button>
        );
      })}

      {/* Camera viewport frame - follows mouse exactly */}
      <div
        className="absolute w-48 h-48 border-4 border-yellow-500/50 rounded-lg pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}
      >
        {/* Viewfinder corners */}
        <div className="absolute top-0 left-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-l-2 border-t-2 border-yellow-500" />
        <div className="absolute top-0 right-0 w-4 h-4 translate-x-1/2 -translate-y-1/2 border-r-2 border-t-2 border-yellow-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 -translate-x-1/2 translate-y-1/2 border-l-2 border-b-2 border-yellow-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 translate-x-1/2 translate-y-1/2 border-r-2 border-b-2 border-yellow-500" />
      </div>

      {/* Captured counter */}
      <div className="flex gap-2 z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
              captured.includes(i) ? 'bg-yellow-500/20 border-yellow-500' : 'bg-white/10 border-white/20'
            }`}
            animate={captured.includes(i) ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {captured.includes(i) ? (
              <span className="text-yellow-500 text-xl">✓</span>
            ) : (
              <span className="text-white/40 text-lg">{i + 1}</span>
            )}
          </motion.div>
        ))}
      </div>

      {allCaptured && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-center z-10">
          🎉 All dancers captured!
        </motion.p>
      )}
    </motion.div>
  );
}

// Stage 4: Memory Lane - Heartfelt interactive timeline
function StageMemoryLane({ onDone }: { onDone: () => void }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const allRevealed = revealed.length >= 4;

  const memories = [
    { id: 0, label: "Chapter 1", title: "The Beginning", text: "When you first joined us, shy and nervous, but with fire in your eyes. We knew you were special.", emoji: "🌟" },
    { id: 1, label: "Chapter 2", title: "First Dance", text: "The moment you stepped on stage and transformed. The shy intern was gone, a star was born.", emoji: "💃" },
    { id: 2, label: "Chapter 3", title: "Taking the Lead", text: "You became Media Lead. From following to leading. From learning to teaching. Pure growth.", emoji: "👑" },
    { id: 3, label: "Chapter 4", title: "Our Little Sister", text: "More than a teammate. Family. You became the little sister we all needed.", emoji: "💛" },
  ];

  const revealMemory = (id: number) => {
    if (!revealed.includes(id)) {
      setRevealed([...revealed, id]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · Memory Lane</p>
        <h2 className="text-2xl font-bold text-white">Our journey together</h2>
        <p className="text-white/50 text-sm mt-1">Click each memory to reveal</p>
      </div>

      {/* Timeline */}
      <div className="relative w-full max-w-2xl">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-500/30 -translate-x-1/2" />

        {/* Memory cards */}
        <div className="space-y-8">
          {memories.map((memory, index) => {
            const isRevealed = revealed.includes(memory.id);
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={memory.id}
                className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Card */}
                <motion.button
                  onClick={() => revealMemory(memory.id)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    isRevealed 
                      ? 'bg-yellow-500/20 border-yellow-500' 
                      : 'bg-white/5 border-white/20 hover:border-yellow-500/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{memory.emoji}</span>
                    <div className="text-left">
                      <p className="text-yellow-500 font-bold">{memory.label}</p>
                      {isRevealed ? (
                        <>
                          <p className="text-white font-semibold">{memory.title}</p>
                          <p className="text-white/60 text-sm">{memory.text}</p>
                        </>
                      ) : (
                        <p className="text-white/40 text-sm">Click to reveal...</p>
                      )}
                    </div>
                  </div>
                </motion.button>

                {/* Timeline dot */}
                <motion.div
                  className={`w-4 h-4 rounded-full border-2 ${
                    isRevealed ? 'bg-yellow-500 border-yellow-500' : 'bg-white/20 border-white/40'
                  }`}
                  animate={isRevealed ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />

                {/* Spacer for alignment */}
                <div className="flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {allRevealed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={onDone}
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}
        >
          Beautiful memories! →
        </motion.button>
      )}
    </motion.div>
  );
}

function StageTribute({ onBack }: { onBack: () => void }) {
  const COLOR = "#ffb800";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-xl glass p-10 rounded-3xl">
        <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-[#ffb800] to-transparent" />
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-6" style={{ color: COLOR }}>
          My Little Sister
        </h1>
        <p className="text-white/75 text-lg leading-relaxed">
          From the first time you nervously held a camera to leading the YBS Media Team —
          watching you grow has been one of my greatest joys. You didn&apos;t just learn to dance,
          you learned to{" "}
          <span style={{ color: COLOR }} className="font-semibold">lead with your whole heart</span>.
          You are proof that quiet people make the loudest impact.
        </p>
        <div className="w-full h-px mt-8 mb-6 bg-gradient-to-r from-transparent via-[#ffb800] to-transparent" />
        <p className="text-white/40 text-sm italic mb-6">Happy Women&apos;s Day, Nazken 💛 — w/l Timson</p>
        
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

export default NazkenInteraction;
