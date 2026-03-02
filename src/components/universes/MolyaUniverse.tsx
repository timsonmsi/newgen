"use client";
// MOLYA — color: #b500ff
// Stage 1: REPO Night — flashlight horror game
// Stage 2: Crystal ball — unlock Trainee vision
// Stage 3: Loot Drop — collect 3 items
// Stage 4: K-Pop Audition — rhythm game
// Stage 5: Tribute

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { Book, Mic, Flashlight, Trophy, Sparkles, Music } from "lucide-react";

const COLOR = "#b500ff";
const BG = "#0a0012";

interface Props { onBack: () => void; }

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

export function MolyaInteraction({ onBack }: Props) {
  const [stage, setStage] = useState(1);
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <StageDots stage={stage} />
      <button onClick={onBack} className="absolute top-8 left-8 z-50 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Galaxy</button>
      <AnimatePresence mode="wait">
        {stage === 1 && <Stage1 key="s1" onDone={() => setStage(2)} />}
        {stage === 2 && <Stage2 key="s2" onDone={() => setStage(3)} />}
        {stage === 3 && <StageCatchStars key="s3" onDone={() => setStage(4)} />}
        {stage === 4 && <StageAudition key="s4" onDone={() => setStage(5)} />}
        {stage === 5 && <Stage3 key="s5" onBack={onBack} />}
      </AnimatePresence>
    </div>
  );
}

const SCARES = [
  { emoji: "👻", x: "15%", y: "20%", msg: "THE REPO GHOST APPEARED!" },
  { emoji: "💀", x: "80%", y: "65%", msg: "IT'S BEHIND YOU!!" },
  { emoji: "🕷️", x: "45%", y: "75%", msg: "WHAT WAS THAT?!" },
];

function Stage1({ onDone }: { onDone: () => void }) {
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [scareIndex, setScareIndex] = useState(0);
  const [showScare, setShowScare] = useState(false);
  const [survived, setSurvived] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scareIndex >= SCARES.length) return;
    const delay = 1500 + scareIndex * 800;
    timerRef.current = setTimeout(() => setShowScare(true), delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scareIndex]);

  const handleScare = useCallback(() => {
    if (!showScare) return;
    setShowScare(false);
    const next = scareIndex + 1;
    if (next >= SCARES.length) { setSurvived(true); }
    else { setScareIndex(next); }
  }, [showScare, scareIndex]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full relative cursor-none select-none"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      onClick={handleScare}>
      {/* Flashlight mask */}
      {!survived && (
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: `radial-gradient(circle 130px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.97) 60%)` }} />
      )}
      {/* Room texture */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/5 text-6xl font-serif italic select-none">REPO</p>
      </div>

      {/* Scare */}
      <AnimatePresence>
        {showScare && !survived && (
          <motion.div key={scareIndex}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute z-20 flex flex-col items-center pointer-events-none"
            style={{ left: SCARES[scareIndex].x, top: SCARES[scareIndex].y, transform: "translate(-50%,-50%)" }}>
            <span className="text-7xl">{SCARES[scareIndex].emoji}</span>
            <span className="text-red-400 text-xs font-bold tracking-widest mt-2 uppercase">
              {SCARES[scareIndex].msg}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions overlay */}
      {!survived && (
        <div className="absolute bottom-10 w-full flex flex-col items-center z-30 pointer-events-none">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-1">REPO Night</p>
          <p className="text-white/20 text-xs">Move your flashlight · Click when you see something</p>
          <div className="flex gap-1.5 mt-3">
            {SCARES.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < scareIndex ? "bg-[#b500ff]" : "bg-white/20"}`} />
            ))}
          </div>
        </div>
      )}

      {/* Survived */}
      {survived && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 text-center px-8">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-6">🎮</motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">You survived the REPO session!</h2>
          <p className="text-white/50 text-sm mb-8 max-w-xs">Molya carried you the whole time. She always does.</p>
          <motion.button whileHover={{ scale: 1.05 }} onClick={onDone}
            className="px-8 py-3 rounded-full text-sm font-semibold"
            style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
            Discover her real magic →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

function Stage2({ onDone }: { onDone: () => void }) {
  const [charge, setCharge] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number | null>(null);
  const accRef = useRef(0);
  const revealedRef = useRef(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (revealedRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    if (lastAngleRef.current !== null) {
      let diff = angle - lastAngleRef.current;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      if (diff < -Math.PI) diff += 2 * Math.PI;
      if (Math.abs(diff) < 0.25) {
        accRef.current += Math.abs(diff);
        const nc = Math.min(100, Math.floor((accRef.current / (6 * Math.PI)) * 100));
        setCharge(nc);
        if (nc >= 100 && !revealedRef.current) { revealedRef.current = true; setTimeout(() => setRevealed(true), 600); }
      }
    }
    lastAngleRef.current = angle;
  }, []);

  return (
    <motion.div ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center relative" onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(181,0,255,${charge / 600}) 0%, transparent 70%)` }} />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div key="orb" exit={{ opacity: 0, scale: 3 }} className="flex flex-col items-center z-10">
            <p className="mb-10 text-white/30 tracking-[0.3em] uppercase text-xs text-center">
              Circle the orb to unlock the Trainee Vision
            </p>
            <div className="relative w-56 h-56 sm:w-64 sm:h-64">
              <motion.div className="w-full h-full rounded-full" animate={{
                boxShadow: `0 0 ${30 + charge * 2}px ${charge / 3}px rgba(181,0,255,${0.15 + charge / 300})`,
                background: `radial-gradient(circle at 35% 35%, rgba(220,180,255,${0.2 + charge / 200}), rgba(181,0,255,${0.3 + charge / 200}), rgba(30,0,60,0.95))`,
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-mono font-bold text-white/60">{charge}%</span>
              </div>
            </div>
            <div className="mt-6 w-40 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" animate={{ width: `${charge}%`, boxShadow: `0 0 8px ${COLOR}` }}
                style={{ backgroundColor: COLOR }} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="vision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            className="text-center px-8 z-10 space-y-4">
            <div className="text-5xl">🔮</div>
            <p className="text-xs tracking-[0.4em] uppercase" style={{ color: COLOR }}>K-Pop Trainee — Accepted ✓</p>
            <h2 className="text-3xl font-bold text-white">The Vision is Clear</h2>
            <p className="text-white/60 text-sm max-w-sm mx-auto">
              Clean technique. Emotional depth. A visual that commands attention. She was chosen for a reason.
            </p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={onDone}
              className="mt-4 px-8 py-3 rounded-full text-sm font-semibold"
              style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
              Read her story →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Stage 3: Loot Drop (ORIGINAL) ──
interface LootItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  collected: boolean;
}

// Stage 3: Catch the Stars - Interactive catching game
function StageCatchStars({ onDone }: { onDone: () => void }) {
  const [caught, setCaught] = useState(0);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; speed: number }>>([]);
  const [mouseX, setMouseX] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Spawn stars
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setStars(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: -10,
        speed: Math.random() * 2 + 2,
      }]);
    }, 800);
    return () => clearInterval(interval);
  }, [completed]);

  // Move stars down
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setStars(prev => prev
        .map(star => ({ ...star, y: star.y + star.speed }))
        .filter(star => star.y < 110)
      );
    }, 30);
    return () => clearInterval(moveInterval);
  }, []);

  // Check if star is caught by mouse
  useEffect(() => {
    stars.forEach(star => {
      if (star.y > 85 && star.y < 95 && Math.abs(star.x - mouseX) < 15) {
        setCaught(prev => {
          const newCaught = prev + 1;
          if (newCaught >= 10) setCompleted(true);
          return newCaught;
        });
        setStars(prev => prev.filter(s => s.id !== star.id));
      }
    });
  }, [stars, mouseX]);

  // Proceed to next game when completed
  useEffect(() => {
    if (completed) {
      setTimeout(() => onDone(), 1500);
    }
  }, [completed, onDone]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8 relative overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouseX(((e.clientX - rect.left) / rect.width) * 100);
      }}
    >
      <div className="text-center z-10">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 3 · Catch the Stars</p>
        <h2 className="text-2xl font-bold text-white">Catch 10 falling stars</h2>
        <p className="text-white/50 text-sm">Move your mouse to catch the stars</p>
        <p className="text-purple-400 text-lg mt-2">Caught: {caught} / 10</p>
      </div>

      {/* Falling stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute text-3xl pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
        >
          ⭐
        </motion.div>
      ))}

      {/* Mouse catcher indicator */}
      <motion.div
        className="absolute w-16 h-4 rounded-full border-2 border-purple-500 pointer-events-none"
        style={{
          left: `${mouseX}%`,
          bottom: '10%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {completed && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-400 text-center z-10">
          ✨ All stars caught!
        </motion.p>
      )}
    </motion.div>
  );
}

// Stage 4: K-Pop Audition Rhythm Game
function StageAudition({ onDone }: { onDone: () => void }) {
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState<Array<{ id: number; lane: number; y: number; hit: boolean }>>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (completed) return;
      setNotes(prev => [...prev, { id: Date.now(), lane: Math.floor(Math.random() * 4), y: 0, hit: false }]);
    }, 800);
    return () => clearInterval(interval);
  }, [completed]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setNotes(prev => prev.map(note => ({ ...note, y: note.y + 3 })));
    }, 30);
    return () => clearInterval(moveInterval);
  }, []);

  const hitNote = (lane: number) => {
    const hitNote = notes.find(n => n.lane === lane && n.y > 70 && n.y < 100 && !n.hit);
    if (hitNote) {
      setNotes(prev => prev.map(n => n.id === hitNote.id ? { ...n, hit: true } : n));
      setScore(s => s + 10);
      if (score + 10 >= 100) setCompleted(true);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-4 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · K-Pop Audition</p>
        <h2 className="text-2xl font-bold text-white">Hit the notes!</h2>
        <p className="text-white/50 text-sm">Score: {score} / 100</p>
      </div>
      
      <div className="relative w-64 h-96 bg-purple-900/30 rounded-lg overflow-hidden border border-purple-500/30">
        {/* Lanes */}
        <div className="absolute inset-0 flex">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex-1 border-r border-purple-500/20" />
          ))}
        </div>
        
        {/* Hit line */}
        <div className="absolute bottom-24 left-0 right-0 h-1 bg-purple-500/50" />
        
        {/* Notes */}
        {notes.map(note => !note.hit && (
          <motion.div key={note.id}
            className="absolute w-14 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"
            style={{ left: `${note.lane * 25 + 2}%`, top: `${note.y}%` }}
          />
        ))}
        
        {/* Hit buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex gap-1 px-2">
          {[0, 1, 2, 3].map(i => (
            <button key={i} onClick={() => hitNote(i)}
              className="flex-1 h-16 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg border border-purple-500/50 active:scale-95 transition-transform" />
          ))}
        </div>
      </div>
      
      {completed && (
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }} onClick={onDone}
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
          Audition Passed! →
        </motion.button>
      )}
    </motion.div>
  );
}

function Stage3({ onBack }: { onBack: () => void }) {
  const COLOR = "#b500ff";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-xl glass p-10 rounded-3xl">
        <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-[#b500ff] to-transparent" />
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-6" style={{ color: COLOR }}>
          My Sister
        </h1>
        <p className="text-white/75 text-lg leading-relaxed">
          We share a grandfather — the great{" "}
          <span style={{ color: COLOR }} className="font-semibold">Abay Kunanbayev</span> —
          and I see his spirit in everything you do: the quiet strength, the expressive art,
          the soul that moves people. You were invited to train as a K-pop idol for a reason.
          And when you play REPO with me, that fearless energy? That&apos;s pure Molya.
          My little Semskaya sister.
        </p>
        <div className="w-full h-px mt-8 mb-6 bg-gradient-to-r from-transparent via-[#b500ff] to-transparent" />
        <p className="text-white/40 text-sm italic mb-6">Happy Women's Day, Molya 💜 — w/l Timson</p>
        
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
