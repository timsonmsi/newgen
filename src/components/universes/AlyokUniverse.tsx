"use client";
// ALYOK — color: #ff007f
// Stage 1: Dance floor tile hover — light up 30 tiles
// Stage 2: "The Boomer Test" — her hilarious boomer choices revealed one by one
// Stage 3: "Emotions Queen" — emoji trail follows cursor
// Stage 4: Mood Tuner (ORIGINAL) - Boomer to Emotions Queen transition
// Stage 5: Tribute

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, Film, Play } from "lucide-react";

const COLOR = "#ff007f";
const BG = "#100008";

interface Props { onBack: () => void; }

const QUESTIONS = [
  { q: "How do you listen to music?", modern: "Spotify 🎧", boomer: "CD Player 💿", reaction: "\"The sound quality is just better, okay?! 💿\"" },
  { q: "What phone do you prefer?", modern: "Latest iPhone", boomer: "Nokia 3310 📱", reaction: "\"Indestructible. 5000mAh battery. Enough said. 💀\"" },
  { q: "How do you take photos?", modern: "Phone camera", boomer: "Film camera 📷", reaction: "\"The aesthetic! You wouldn't understand. 🎞️\"" },
  { q: "How do you pay?", modern: "Contactless tap", boomer: "Cash only 💸", reaction: "\"I like to FEEL my money leaving. 💸\"" },
];

type Emoji = { id: number; x: number; y: number; char: string };
const EMOJIS = ["😂", "🥺", "😤", "🤩", "😍", "🤭", "😏", "😊", "😭", "😆", "🤔", "😎"];

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

export function AlyokInteraction({ onBack }: Props) {
  const [stage, setStage] = useState(1);
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <StageDots stage={stage} />
      <button onClick={onBack} className="absolute top-8 left-8 z-50 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Galaxy</button>
      <AnimatePresence mode="wait">
        {stage === 1 && <StageDanceFloor key="s1" onDone={() => setStage(2)} />}
        {stage === 2 && <StageBoomerTest key="s2" onDone={() => setStage(3)} />}
        {stage === 3 && <StageEmotions key="s3" onDone={() => setStage(4)} />}
        {stage === 4 && <StageFlappySKUF key="s4" onDone={() => setStage(5)} />}
        {stage === 5 && <StageTribute key="s5" onBack={onBack} />}
      </AnimatePresence>
    </div>
  );
}

// ── Stage 1: Dance Floor ──
function StageDanceFloor({ onDone }: { onDone: () => void }) {
  const COLS = 10, ROWS = 8, TOTAL = COLS * ROWS;
  const [litTiles, setLitTiles] = useState<Set<number>>(new Set());
  const [canProceed, setCanProceed] = useState(false);
  const doneRef = useRef(false);

  const handleHover = useCallback((i: number) => {
    if (doneRef.current) return;
    setLitTiles((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      if (next.size >= TOTAL && !doneRef.current) {
        doneRef.current = true;
        setCanProceed(true);
      }
      return next;
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ff007f]/5 to-transparent pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-1">Chapter 1 · The Dance Floor</p>
        <h2 className="text-2xl font-bold text-white">Light up ALL the floor</h2>
      </motion.div>

      <div className="grid gap-1 z-10" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <motion.div key={i}
            className="w-9 h-9 rounded-sm cursor-pointer"
            onHoverStart={() => handleHover(i)}
            animate={{
              backgroundColor: litTiles.has(i) ? COLOR : "#1a1a1a",
              boxShadow: litTiles.has(i) ? `0 0 10px ${COLOR}, 0 0 25px ${COLOR}40` : "none",
            }}
            transition={{ duration: 0.12 }} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 z-10">
        <p className="text-white/30 text-xs font-mono">{litTiles.size} / {TOTAL}</p>
        <AnimatePresence>
          {canProceed && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={onDone}
              className="px-8 py-3 rounded-full text-sm font-semibold"
              style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
              Stage is lit! Next chapter →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Stage 2: Boomer Test ──
function StageBoomerTest({ onDone }: { onDone: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = QUESTIONS[qIndex];
  const isLast = qIndex === QUESTIONS.length - 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center px-8 gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="block text-center text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 2 · The Boomer Test</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">{current.q}</h2>
      </motion.div>

      {!revealed ? (
        <div className="flex gap-4 flex-wrap justify-center">
          {[current.modern, current.boomer].map((option, i) => (
            <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => setRevealed(true)}
              className="px-6 py-4 rounded-2xl text-sm font-semibold glass text-white/70 hover:text-white transition-colors"
              style={{ border: `1px solid ${COLOR}30` }}>
              {option}
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4">
          <div className="text-4xl">😂</div>
          <div className="text-lg sm:text-xl font-bold" style={{ color: COLOR }}>
            SKUF chose: {current.boomer}
          </div>
          <p className="text-white/60 italic text-sm max-w-xs mx-auto">{current.reaction}</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setRevealed(false); if (isLast) onDone(); else setQIndex((i) => i + 1); }}
            className="mt-4 px-6 py-2 rounded-full text-xs tracking-[0.3em] uppercase"
            style={{ background: `${COLOR}20`, border: `1px solid ${COLOR}60`, color: COLOR }}>
            {isLast ? "Next →" : "Next question →"}
          </motion.button>
        </motion.div>
      )}

      <div className="flex gap-1">
        {QUESTIONS.map((_, i) => (
          <div key={i} className="w-6 h-0.5 rounded-full transition-all duration-500"
            style={{ backgroundColor: i < qIndex ? COLOR : i === qIndex ? "#ffffff80" : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Stage 3: Emotions Queen ──
function StageEmotions({ onDone }: { onDone: () => void }) {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  const countRef = useRef(0);
  const lastEmojiTime = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    // Only spawn emoji every 100ms
    if (now - lastEmojiTime.current < 100) return;
    if (Math.random() > 0.15) return;
    
    lastEmojiTime.current = now;
    const newEmoji: Emoji = {
      id: Date.now() + Math.random(),
      x: e.clientX, y: e.clientY,
      char: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
    countRef.current += 1;
    if (countRef.current >= 25 && !canProceed) setCanProceed(true);
    setEmojis((prev) => [...prev.slice(-60), newEmoji]);
  }, [canProceed]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full relative cursor-none" onMouseMove={handleMouseMove}>
      {emojis.map((em) => (
        <motion.span key={em.id}
          initial={{ opacity: 1, scale: 0.5, y: 0 }}
          animate={{ opacity: 0, scale: 1.5, y: -40 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute pointer-events-none select-none text-8xl"
          style={{ left: em.x - 24, top: em.y - 24 }}>
          {em.char}
        </motion.span>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 3 · Emotions Queen</p>
          <h2 className="text-3xl font-bold text-white">Move your cursor across the stage</h2>
          <p className="text-white/40 mt-2 text-sm">Paint the stage with her emotions</p>
        </motion.div>
        {canProceed && (
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={onDone} className="pointer-events-auto px-8 py-3 rounded-full text-sm font-semibold"
            style={{ background: `${COLOR}30`, border: `1px solid ${COLOR}`, color: COLOR }}>
            Proceed to SKUF game →
          </motion.button>
        )}
        {!canProceed && (
          <p className="text-white/20 text-xs tracking-widest mt-8">{Math.min(countRef.current, 25)} / 25</p>
        )}
      </div>
    </motion.div>
  );
}

// ── Stage 4: Flappy SKUF ──
function StageFlappySKUF({ onDone }: { onDone: () => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [birdY, setBirdY] = useState(50);
  const [velocity, setVelocity] = useState(0);
  const [pipeX, setPipeX] = useState(100);
  const [pipeGap, setPipeGap] = useState(50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wingUp, setWingUp] = useState(true);
  const [scored, setScored] = useState(false);
  const [won, setWon] = useState(false);

  // Wing animation - flap every 200ms
  useEffect(() => {
    if (!gameStarted || gameOver || won) return;
    const wingInterval = setInterval(() => {
      setWingUp(w => !w);
    }, 200);
    return () => clearInterval(wingInterval);
  }, [gameStarted, gameOver, won]);

  // Game loop - slower speed
  useEffect(() => {
    if (!gameStarted || gameOver || won) return;

    const gameLoop = setInterval(() => {
      // Gravity (slower)
      setVelocity(v => v + 0.8);
      setBirdY(y => {
        const newY = y + velocity * 0.25;
        // Check ground collision BEFORE capping
        if (newY >= 97) {
          setGameOver(true);
          return Math.min(97, newY);
        }
        // Check ceiling collision
        if (newY <= 5) {
          setGameOver(true);
          return Math.max(5, newY);
        }
        return Math.min(97, Math.max(5, newY));
      });

      // Move pipe (slower)
      setPipeX(x => {
        const newX = x - 1.2;

        // Score when pipe passes the bird (bird is at 50%, pipe passes from right to left)
        if (!scored && newX < 50 && pipeX >= 50) {
          setScored(true);
          setScore(s => s + 1);
        }

        if (newX < -10) {
          setPipeGap(Math.random() * 40 + 35);
          setScored(false);
          return 100;
        }
        return newX;
      });

      // Collision detection
      if (pipeX > 45 && pipeX < 55) {
        if (birdY < pipeGap || birdY > pipeGap + 18) {
          setGameOver(true);
        }
      }
    }, 30);

    return () => clearInterval(gameLoop);
  }, [gameStarted, velocity, pipeX, pipeGap, birdY, gameOver, scored, won]);

  const flap = () => {
    if (!gameStarted) {
      setGameStarted(true);
    } else if (gameOver) {
      setBirdY(50);
      setVelocity(0);
      setPipeX(100);
      setScore(0);
      setPipeGap(50);
      setGameOver(false);
      setWon(false);
      setGameStarted(true);
    } else if (won) {
      onDone();
    } else {
      setVelocity(-4);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGameStarted(true);
  };

  // Show win message when score reaches 5
  useEffect(() => {
    if (score >= 5 && !gameOver && !won) {
      setWon(true);
    }
  }, [score, gameOver, won]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8 relative overflow-hidden"
      onClick={flap}
    >
      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 flex flex-col items-center gap-6"
        >
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · Flappy SKUF</p>
            <h2 className="text-2xl font-bold text-white mb-2">Flappy SKUF</h2>
            <p className="text-white/60 text-sm">Click to flap and avoid the pipes</p>
          </div>
          
          {/* Preview bird */}
          <div className="relative w-16 h-12 my-4">
            <div className="w-16 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 relative">
              <div className="absolute right-3 top-1.5 w-4 h-4 bg-white rounded-full">
                <div className="absolute right-1 top-1.5 w-2 h-2 bg-black rounded-full" />
              </div>
              <motion.div
                className="absolute left-3 top-4 w-5 h-4 bg-pink-300 rounded-full origin-bottom"
                animate={{ rotate: [-30, 30, -30] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              <div className="absolute right-0 top-4 w-4 h-2.5 bg-orange-400 rounded-full" />
            </div>
          </div>

          <motion.button
            onClick={handlePlayClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 rounded-full text-sm font-bold tracking-wider"
            style={{
              background: `linear-gradient(135deg, ${COLOR}, ${COLOR}dd)`,
              boxShadow: `0 10px 40px ${COLOR}60, 0 0 80px ${COLOR}40`,
            }}
          >
            <span className="flex items-center gap-2 text-white">
              <Play size={20} className="fill-white" />
              PLAY
              <Play size={20} className="fill-white rotate-180" />
            </span>
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Score at top */}
          <div className="absolute left-0 right-0 text-center z-10" style={{ top: '136px' }}>
            <p className="text-pink-400 text-2xl font-bold">Score: {score} / 5</p>
          </div>

          {/* Bird with flapping wings */}
          <motion.div
            className="absolute w-16 h-12"
            style={{
              left: '50%',
              top: `${birdY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Bird body */}
            <div className="w-16 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 relative">
              {/* Eye */}
              <div className="absolute right-3 top-1.5 w-4 h-4 bg-white rounded-full">
                <div className="absolute right-1 top-1.5 w-2 h-2 bg-black rounded-full" />
              </div>
              {/* Wing - flaps based on wingUp state */}
              <motion.div
                className="absolute left-3 top-4 w-5 h-4 bg-pink-300 rounded-full origin-bottom"
                animate={{ rotate: wingUp ? -45 : 45 }}
                transition={{ duration: 0.1 }}
              />
              {/* Beak */}
              <div className="absolute right-0 top-4 w-4 h-2.5 bg-orange-400 rounded-full" />
            </div>
          </motion.div>

          {/* Top pipe */}
          <motion.div
            className="absolute w-16 bg-gradient-to-b from-pink-600 to-pink-800"
            style={{
              left: `${pipeX}%`,
              top: '0%',
              height: `${pipeGap}%`,
              transform: 'translateX(-50%)',
            }}
          />

          {/* Bottom pipe */}
          <motion.div
            className="absolute w-16 bg-gradient-to-b from-pink-800 to-pink-900"
            style={{
              left: `${pipeX}%`,
              bottom: '0%',
              height: `${100 - pipeGap - 18}%`,
              transform: 'translateX(-50%)',
            }}
          />

          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white mb-2">Game Over!</p>
                <p className="text-pink-400 text-lg mb-4">Score: {score}</p>
                <p className="text-white/60 text-sm">Click to restart</p>
              </motion.div>
            </motion.div>
          )}

          {won && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white mb-2">🎉 Good Job!</p>
                <p className="text-pink-400 text-lg mb-4">You passed all 5 obstacles!</p>
                <p className="text-white/60 text-sm">Click to proceed to tribute →</p>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

// ── Stage 5: Tribute ──
function StageTribute({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-xl glass p-10 rounded-3xl">
      <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-[#ff007f] to-transparent" />
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-6" style={{ color: COLOR }}>
          MY SKUFed COLLEAGUE
        </h1>
        <p className="text-white/75 text-lg leading-relaxed">
          Even if you were born Gen-Z the Boomer blood is in your veins haha. You can listen to k-pop, q-pop, popop, but what no playlist can ever capture is what you do on stage: the way your face
          tells a thousand stories without a single word. You are the{" "}
          <span style={{ color: COLOR }} className="font-semibold">Emotions Queen</span> —
          and no algorithm could ever generate what you have naturally.
        </p>
        <div className="w-full h-px mt-8 mb-6 bg-gradient-to-r from-transparent via-[#ff007f] to-transparent" />
        <p className="text-white/40 text-sm italic mb-6">Happy Women's Day, Alyok 💗 — w/l Timson</p>
        
        {/* Return to Galaxy button */}
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
