"use client";
// ZHANSIKO — color: #ff2a00
// Stage 1: F1 lights — hold to rev
// Stage 2: Dance Memory — watch then repeat the sequence
// Stage 3: F1 Pit Stop — realistic car, change tires, car drives away
// Stage 4: Deep Talk Wheel — spin and answer heartfelt questions
// Stage 5: Tribute

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Trophy, Heart, MessageCircle, Sparkles } from "lucide-react";

const COLOR = "#ff2a00";
const BG = "#0f0000";

interface Props { onBack: () => void; }

const DANCE_MOVES = ["↑", "→", "↓", "←"];

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

export function ZhansikoInteraction({ onBack }: Props) {
  const [stage, setStage] = useState(1);
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <StageDots stage={stage} />
      <button onClick={onBack} className="absolute top-8 left-8 z-50 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Galaxy</button>
      <AnimatePresence mode="wait">
        {stage === 1 && <StageF1Lights key="s1" onDone={() => setStage(2)} />}
        {stage === 2 && <StageDanceMemory key="s2" onDone={() => setStage(3)} />}
        {stage === 3 && <StagePitStop key="s3" onDone={() => setStage(4)} />}
        {stage === 4 && <StageF1Reaction key="s4" onDone={() => setStage(5)} />}
        {stage === 5 && <StageTribute key="s5" onBack={onBack} />}
      </AnimatePresence>
    </div>
  );
}

// Stage 1: F1 Lights
function StageF1Lights({ onDone }: { onDone: () => void }) {
  const [revLevel, setRevLevel] = useState(0);
  const isRacing = revLevel >= 100;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [raced, setRaced] = useState(false);

  useEffect(() => {
    if (!isRacing && revLevel > 0 && !raced) {
      const cool = setInterval(() => setRevLevel((p) => Math.max(0, p - 2)), 50);
      return () => clearInterval(cool);
    }
  }, [revLevel, isRacing, raced]);

  useEffect(() => {
    if (isRacing && !raced) { setRaced(true); }
  }, [isRacing, raced]);

  const startRev = () => { intervalRef.current = setInterval(() => setRevLevel((p) => Math.min(100, p + 5)), 50); };
  const stopRev = () => { if (intervalRef.current) clearInterval(intervalRef.current); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center relative">
      <AnimatePresence mode="wait">
        {!raced ? (
          <motion.div key="grid"
            animate={{ x: revLevel > 50 ? [-2, 2, -2] : 0, y: revLevel > 80 ? [-1, 1, -1] : 0 }}
            transition={{ repeat: Infinity, duration: 0.08 }}
            className="flex flex-col items-center gap-10 z-10">
            {/* F1 Lights */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase">F1 Start — Hold to Rev</p>
              <div className="flex gap-3">
                {[20, 40, 60, 80, 100].map((t, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-zinc-800 transition-all duration-100 ${revLevel >= t ? "bg-red-600 shadow-[0_0_20px_red]" : "bg-black"}`} />
                ))}
              </div>
            </div>
            <motion.button
              onPointerDown={startRev} onPointerUp={stopRev} onPointerLeave={stopRev}
              className="px-12 py-4 rounded-full border border-white text-white text-sm tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors select-none">
              Hold to Rev
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="race" initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 z-10 text-center px-8">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-6xl">🏎️</motion.div>
            <h2 className="text-3xl font-bold text-white">LIGHTS OUT AND AWAY WE GO!</h2>
            <p className="text-white/50 text-sm max-w-sm">Max is proud. Zhansiko is already on the podium.</p>
            <div className="glass px-6 py-3 rounded-full">
              <span className="text-sm" style={{ color: COLOR }}>🏆 P1 — MAX VERSTAPPEN · RED BULL</span>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} onClick={onDone}
              className="px-8 py-3 rounded-full text-sm font-semibold"
              style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
              Now see the choreographer →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Stage 2: Dance Memory Game
function StageDanceMemory({ onDone }: { onDone: () => void }) {
  // Fixed sequence: ↑ ↓ ↓ ← → ↑ (top-bottom-bottom-left-right-top)
  // DANCE_MOVES = ["↑", "→", "↓", "←"]
  // So: 0=↑, 2=↓, 2=↓, 3=←, 1=→, 0=↑
  const SEQUENCE = [0, 2, 2, 3, 1, 0];
  
  const [gameState, setGameState] = useState<'show' | 'input' | 'success' | 'fail'>('show');
  const [userSequence, setUserSequence] = useState<number[]>([]);

  // Show sequence for 4 seconds, then hide
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('input');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleMove = (moveIndex: number) => {
    if (gameState !== 'input' && gameState !== 'success') return;
    
    const newUserSequence = [...userSequence, moveIndex];
    setUserSequence(newUserSequence);
    
    // Check if this move matches sequence
    const currentIndex = newUserSequence.length - 1;
    if (moveIndex !== SEQUENCE[currentIndex]) {
      // Wrong move - reset
      setGameState('fail');
      setTimeout(() => {
        setUserSequence([]);
        setGameState('show');
        // Show sequence again for 4 seconds
        setTimeout(() => {
          setGameState('input');
        }, 4000);
      }, 1500);
      return;
    }
    
    // Check if sequence complete (all 6 moves correct)
    if (newUserSequence.length === SEQUENCE.length) {
      setGameState('success');
      setTimeout(onDone, 1500);
    }
    // Otherwise continue - next move will be checked on next click
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">
          {gameState === 'show' ? 'Memorize This' : gameState === 'input' ? 'Your Turn!' : gameState === 'success' ? 'Perfect!' : 'Try Again!'}
        </p>
        <h2 className="text-2xl font-bold text-white">
          {gameState === 'show' ? 'Watch the pattern' : gameState === 'input' ? 'Repeat the sequence' : ''}
        </h2>
      </div>

      {/* Sequence Display - visible during 'show' phase and 'fail' phase */}
      {(gameState === 'show' || gameState === 'fail') && (
        <div className="flex gap-3 items-center">
          {SEQUENCE.map((moveIndex, i) => (
            <motion.div key={i}
              className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold bg-red-500 text-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.3 }}
            >
              {DANCE_MOVES[moveIndex]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Progress indicators - visible during input */}
      {gameState === 'input' && (
        <div className="flex gap-2">
          {SEQUENCE.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${
              i < userSequence.length ? 'bg-red-500' : i === userSequence.length ? 'bg-red-500/50 animate-pulse' : 'bg-white/20'
            }`} />
          ))}
        </div>
      )}

      {/* Input Buttons - visible during 'input' phase */}
      {(gameState === 'input' || gameState === 'success' || gameState === 'fail') && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div />
          <motion.button
            onClick={() => handleMove(0)}
            disabled={gameState !== 'input'}
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${
              gameState === 'input' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50'
            } ${gameState === 'input' ? '' : 'cursor-not-allowed'}`}
            whileTap={gameState === 'input' ? { scale: 0.9 } : {}}
          >
            ↑
          </motion.button>
          <div />
          <motion.button
            onClick={() => handleMove(3)}
            disabled={gameState !== 'input'}
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${
              gameState === 'input' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50'
            } ${gameState === 'input' ? '' : 'cursor-not-allowed'}`}
            whileTap={gameState === 'input' ? { scale: 0.9 } : {}}
          >
            ←
          </motion.button>
          <motion.button
            onClick={() => handleMove(2)}
            disabled={gameState !== 'input'}
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${
              gameState === 'input' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50'
            } ${gameState === 'input' ? '' : 'cursor-not-allowed'}`}
            whileTap={gameState === 'input' ? { scale: 0.9 } : {}}
          >
            ↓
          </motion.button>
          <motion.button
            onClick={() => handleMove(1)}
            disabled={gameState !== 'input'}
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${
              gameState === 'input' ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50'
            } ${gameState === 'input' ? '' : 'cursor-not-allowed'}`}
            whileTap={gameState === 'input' ? { scale: 0.9 } : {}}
          >
            →
          </motion.button>
        </div>
      )}

      {gameState === 'success' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-center text-lg">
          🎉 Amazing memory! You're a natural dancer! 💃
        </motion.p>
      )}

      {gameState === 'fail' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/60 text-center">
          Wrong! Watch the pattern again...
        </motion.p>
      )}
    </motion.div>
  );
}

// Stage 3: F1 Pit Stop - Car drives in, pit stop, drives away
function StagePitStop({ onDone }: { onDone: () => void }) {
  const [carX, setCarX] = useState(-400); // Start far off-screen left
  const [phase, setPhase] = useState<'arriving' | 'waiting' | 'ready' | 'leaving'>('arriving');
  const [tiresChanged, setTiresChanged] = useState([false, false, false, false]);
  const [pitStopTime, setPitStopTime] = useState<number | null>(null);
  const pitStartTimeRef = useRef<number>(0);

  // Car drives in from left
  useEffect(() => {
    if (phase === 'arriving') {
      const timer = setTimeout(() => {
        setCarX(0); // Stop in center (x: 0 with left: 50% = perfectly centered)
        setTimeout(() => {
          setPhase('waiting');
          pitStartTimeRef.current = Date.now();
        }, 100); // Brief pause after arriving
      }, 2500); // 2.5 seconds to drive in
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const allTiresDone = tiresChanged.every(t => t);

  const changeTire = (index: number) => {
    if (phase !== 'waiting' || tiresChanged[index]) return;

    setTiresChanged(prev => {
      const newTires = [...prev];
      newTires[index] = true;
      return newTires;
    });

    if (tiresChanged.filter(t => !t).length === 1) {
      // Last tire done - calculate pit stop time
      const pitTime = Date.now() - pitStartTimeRef.current;
      setPitStopTime(pitTime);
      setTimeout(() => setPhase('ready'), 500);
    }
  };

  const goMax = () => {
    setPhase('leaving');
    setCarX(400); // Drive off to right
    setTimeout(onDone, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950 to-black" />

      {/* Road */}
      <div className="absolute bottom-20 left-0 right-0 h-40 bg-gray-800 overflow-hidden">
        {/* Road markings */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-1 bg-white/50"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, white 0 40px, transparent 40px 80px)',
          }}
          animate={phase === 'leaving' ? { backgroundPositionX: [0, 320] } : {}}
          transition={phase === 'leaving' ? { duration: 2, ease: "easeIn" } : {}}
        />
      </div>

      {/* Tire Change Indicators - CENTER of screen */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {tiresChanged.map((done, i) => (
          <motion.div
            key={i}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${
              done ? 'bg-red-500/20 border-red-500' : 'bg-white/10 border-white/20'
            }`}
            animate={done ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {done ? (
              <span className="text-red-500 font-bold">✓</span>
            ) : (
              <span className="text-white/60 font-bold">T{i + 1}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* F1 Car */}
      <motion.div
        className="absolute bottom-16 z-10"
        style={{ left: '50%', x: carX }}
        animate={phase === 'leaving' ? {
          scale: [1, 0.8, 0.6, 0.4, 0.2],
          opacity: [1, 1, 0.8, 0.5, 0],
        } : {}}
        transition={phase === 'leaving' ? { duration: 2, ease: "easeIn" } : {}}
      >
        {/* F1 Car Body */}
        <div className="relative w-80 h-24">
          {/* Main body */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-800 rounded-full"
            style={{ clipPath: 'polygon(10% 50%, 30% 20%, 70% 20%, 90% 50%, 70% 80%, 30% 80%)' }} />
          
          {/* Cockpit */}
          <div className="absolute top-2 left-1/3 w-16 h-8 bg-gray-900 rounded-full" />
          
          {/* Front wing */}
          <div className="absolute left-0 top-8 w-20 h-4 bg-red-900 rounded" />
          
          {/* Rear wing */}
          <div className="absolute right-0 top-4 w-16 h-12 bg-red-900 rounded" />
          
          {/* Side pods */}
          <div className="absolute left-20 top-10 w-40 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded" />
          
          {/* Wheels */}
          {[
            { left: 'left-4', top: 'top-0', changed: tiresChanged[0], index: 0 },
            { left: 'left-4', top: 'bottom-0', changed: tiresChanged[1], index: 1 },
            { left: 'right-4', top: 'top-0', changed: tiresChanged[2], index: 2 },
            { left: 'right-4', top: 'bottom-0', changed: tiresChanged[3], index: 3 },
          ].map((wheel, i) => (
            <motion.button
              key={i}
              onClick={() => changeTire(wheel.index)}
              disabled={phase !== 'waiting' || wheel.changed}
              className={`absolute ${wheel.left} ${wheel.top} w-14 h-14 rounded-full border-4 cursor-pointer transition-all ${
                wheel.changed
                  ? 'bg-gray-800 border-red-500 scale-105'
                  : 'bg-gray-900 border-gray-700 hover:border-red-500'
              } ${phase !== 'waiting' ? 'opacity-50' : ''}`}
              whileTap={phase === 'waiting' && !wheel.changed ? { scale: 0.9 } : {}}
              animate={wheel.changed ? { rotate: 360 } : {}}
              transition={wheel.changed ? { duration: 0.5 } : {}}
            >
              {/* Tire tread */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-gray-600" />
              {/* Wheel nut */}
              <div className={`absolute inset-0 flex items-center justify-center ${
                wheel.changed ? 'text-red-500' : 'text-gray-500'
              }`}>
                🔧
              </div>
            </motion.button>
          ))}

          {/* Driver helmet */}
          <div className="absolute top-0 left-1/3 w-6 h-6">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-red-600 rounded-full" />
          </div>
        </div>

        {/* Speed lines when leaving */}
        {phase === 'leaving' && (
          <>
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 bg-white/50"
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  left: `${-50 - Math.random() * 100}px`,
                  top: `${Math.random() * 100}px`,
                }}
                animate={{ x: [-20, -200] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Instructions */}
      <div className="absolute top-24 text-center z-20">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 3 · F1 Pit Stop</p>
        <h2 className="text-2xl font-bold text-white">
          {phase === 'arriving' ? 'Car arriving...' :
           phase === 'waiting' ? 'Change all 4 tires!' :
           phase === 'ready' ? `Pit Stop: ${pitStopTime}ms!` : '🏎️ GO MAX! 🏎️'}
        </h2>
        {phase === 'waiting' && (
          <p className="text-white/50 mt-2">Click each wheel to change the tire</p>
        )}
      </div>

      {/* Go Max Button */}
      {phase === 'ready' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goMax}
          className="absolute bottom-48 px-12 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg shadow-lg"
        >
          🏁 GO MAX! 🏁
        </motion.button>
      )}
    </motion.div>
  );
}

// Stage 4: F1 Reaction Game - Lights out reaction test (4 rows x 5 lights)
function StageF1Reaction({ onDone }: { onDone: () => void }) {
  // 4 rows, each with 5 lights (20 lights total)
  const [lights, setLights] = useState<boolean[][]>([
    [false, false, false, false, false], // Row 1 - Red
    [false, false, false, false, false], // Row 2 - Red
    [false, false, false, false, false], // Row 3 - Red
    [false, false, false, false, false], // Row 4 - Green
  ]);
  const [phase, setPhase] = useState<'waiting' | 'red' | 'green' | 'result'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const clickTimeRef = useRef<number>(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Start the lights sequence - runs once on mount
  useEffect(() => {
    console.log('F1 Reaction Game starting...');
    
    // Random delay 0-5 seconds before green light (after all reds are lit)
    const greenDelay = Math.random() * 5000;
    console.log('Green light will appear in:', greenDelay, 'ms');
    
    // Turn on red lights row by row (1500ms per row)
    
    // Row 1 at 1500ms
    timersRef.current.push(setTimeout(() => {
      console.log('Row 1 RED');
      setLights(prev => {
        const newLights = [...prev];
        newLights[0] = [true, true, true, true, true];
        return newLights;
      });
    }, 1500));
    
    // Row 2 at 3000ms
    timersRef.current.push(setTimeout(() => {
      console.log('Row 2 RED');
      setLights(prev => {
        const newLights = [...prev];
        newLights[1] = [true, true, true, true, true];
        return newLights;
      });
    }, 3000));
    
    // Row 3 at 4500ms
    timersRef.current.push(setTimeout(() => {
      console.log('Row 3 RED');
      setLights(prev => {
        const newLights = [...prev];
        newLights[2] = [true, true, true, true, true];
        return newLights;
      });
      setPhase('red');
      console.log('Phase: red');
    }, 4500));
    
    // Green row at 4500ms + random delay
    timersRef.current.push(setTimeout(() => {
      console.log('Row 4 GREEN');
      setLights(prev => {
        const newLights = [...prev];
        newLights[3] = [true, true, true, true, true];
        return newLights;
      });
      setPhase('green');
      clickTimeRef.current = Date.now();
      console.log('Phase: green - CLICK!');
    }, 4500 + greenDelay));
    
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []); // Empty array - only run once on mount

  const handleClick = () => {
    console.log('Button clicked, phase:', phase);
    if (phase !== 'green') return;
    
    const reaction = Date.now() - clickTimeRef.current;
    console.log('Reaction time:', reaction, 'ms');
    setReactionTime(reaction);
    setPhase('result');

    if (reaction <= 350) {
      // Good reaction - proceed to next game
      setTimeout(onDone, 1500);
    } else {
      // Too slow - reset and try again
      setTimeout(() => {
        // Clear all existing timers
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
        
        // Reset state
        setLights([
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
          [false, false, false, false, false],
        ]);
        setReactionTime(null);
        setPhase('waiting');
        
        // Restart the sequence
        console.log('Restarting sequence...');
        const greenDelay = Math.random() * 5000;
        
        timersRef.current.push(setTimeout(() => {
          setLights(prev => {
            const newLights = [...prev];
            newLights[0] = [true, true, true, true, true];
            return newLights;
          });
        }, 1500));
        
        timersRef.current.push(setTimeout(() => {
          setLights(prev => {
            const newLights = [...prev];
            newLights[1] = [true, true, true, true, true];
            return newLights;
          });
        }, 3000));
        
        timersRef.current.push(setTimeout(() => {
          setLights(prev => {
            const newLights = [...prev];
            newLights[2] = [true, true, true, true, true];
            return newLights;
          });
          setPhase('red');
        }, 4500));
        
        timersRef.current.push(setTimeout(() => {
          setLights(prev => {
            const newLights = [...prev];
            newLights[3] = [true, true, true, true, true];
            return newLights;
          });
          setPhase('green');
          clickTimeRef.current = Date.now();
        }, 4500 + greenDelay));
      }, 2000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · F1 Reaction Test</p>
        <h2 className="text-2xl font-bold text-white">
          {phase === 'waiting' ? 'GET READY...' :
           phase === 'red' ? 'Wait for green...' :
           phase === 'green' ? 'CLICK!' :
           reactionTime! <= 350 ? `Perfect! ${reactionTime}ms` : `Too slow! ${reactionTime}ms`}
        </h2>
        {phase === 'waiting' && (
          <p className="text-white/50 mt-2">Green light will appear randomly...</p>
        )}
        {phase === 'green' && (
          <p className="text-green-400 mt-2">Click the button NOW!</p>
        )}
        {phase === 'result' && (
          <p className={`mt-2 ${reactionTime! <= 350 ? 'text-green-400' : 'text-red-400'}`}>
            {reactionTime! <= 350 ? 'Great reaction! Proceeding...' : 'Need faster reactions! Try again...'}
          </p>
        )}
      </div>

      {/* F1 Starting Lights - 4 rows x 5 lights */}
      <div className="flex flex-col gap-3">
        {/* 3 Red rows */}
        {[0, 1, 2].map((rowIndex) => (
          <div key={rowIndex} className="flex gap-3">
            {[0, 1, 2, 3, 4].map((colIndex) => (
              <motion.div
                key={colIndex}
                className={`w-12 h-12 rounded-full border-4 ${
                  lights[rowIndex][colIndex] ? 'bg-red-600 border-red-400' : 'bg-black border-red-900'
                }`}
                animate={lights[rowIndex][colIndex] ? {
                  boxShadow: ['0 0 20px rgba(220, 38, 38, 0.5)', '0 0 60px rgba(220, 38, 38, 1)', '0 0 20px rgba(220, 38, 38, 0.5)'],
                } : {}}
                transition={lights[rowIndex][colIndex] ? { duration: 0.3, repeat: Infinity } : {}}
              />
            ))}
          </div>
        ))}
        {/* Green row */}
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((colIndex) => (
            <motion.div
              key={colIndex}
              className={`w-12 h-12 rounded-full border-4 ${
                lights[3][colIndex] ? 'bg-green-600 border-green-400' : 'bg-black border-green-900'
              }`}
              animate={lights[3][colIndex] ? {
                boxShadow: ['0 0 20px rgba(34, 197, 94, 0.5)', '0 0 60px rgba(34, 197, 94, 1)', '0 0 20px rgba(34, 197, 94, 0.5)'],
              } : {}}
              transition={lights[3][colIndex] ? { duration: 0.3, repeat: Infinity } : {}}
            />
          ))}
        </div>
      </div>

      {/* Click Button */}
      <motion.button
        onClick={handleClick}
        disabled={phase !== 'green'}
        className={`px-16 py-6 rounded-full text-xl font-bold ${
          phase === 'green' 
            ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer' 
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
        whileTap={phase === 'green' ? { scale: 0.95 } : {}}
        animate={phase === 'green' ? {
          boxShadow: ['0 0 20px rgba(34, 197, 94, 0.5)', '0 0 40px rgba(34, 197, 94, 1)', '0 0 20px rgba(34, 197, 94, 0.5)'],
        } : {}}
      >
        {phase === 'green' ? '🏁 CLICK! 🏁' : 
         phase === 'result' ? (reactionTime! <= 500 ? '✓ PASSED' : '✗ TOO SLOW') :
         '⏳ GET READY'}
      </motion.button>
    </motion.div>
  );
}

// Stage 5: Tribute
function StageTribute({ onBack }: { onBack: () => void }) {
  const COLOR = "#ff2a00";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-xl glass p-10 rounded-3xl">
        <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-[#ff2a00] to-transparent" />
        <Trophy className="w-12 h-12 mx-auto mb-4 text-[#ff2a00]" />
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-6" style={{ color: COLOR }}>
          The Choreographer
        </h1>
        <p className="text-white/75 text-lg leading-relaxed">
          NewGen moves the way it does because of{" "}
          <span style={{ color: COLOR }} className="font-semibold">you</span>.
          Every step, every count, every formation — that&apos;s your work.
          Beyond the dance, our deep talks, the REPO screams, and the watching F1 lives with Max and Oscar
          have made you one of my favourite people. You understand me in ways few do.
        </p>
        <div className="w-full h-px mt-8 mb-6 bg-gradient-to-r from-transparent via-[#ff2a00] to-transparent" />
        <MessageCircle className="w-8 h-8 mx-auto mb-4 text-[#ff2a00]" />
        <p className="text-white/40 text-sm italic mb-6">Happy Women&apos;s Day, Zhansiko ❤️ — w/l Timson</p>
        
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

export default ZhansikoInteraction;
