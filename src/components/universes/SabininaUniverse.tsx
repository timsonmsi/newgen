"use client";
// SABININA — color: #00f0ff
// Stage 1: FM tuner 99.9 — "Find the Signal"
// Stage 2: AI terminal — animated profile generation
// Stage 3: Generate True Energy - K-pop visualizer
// Stage 4: AI Video Generator - create Instagram content
// Stage 5: Tribute

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, Video, Image, Wand2, Instagram } from "lucide-react";

const COLOR = "#00f0ff";
const BG = "#00101a";

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

export function SabininaInteraction({ onBack }: Props) {
  const [stage, setStage] = useState(1);
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <StageDots stage={stage} />
      <button onClick={onBack} className="absolute top-8 left-8 z-50 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Galaxy</button>
      <AnimatePresence mode="wait">
        {stage === 1 && <StageFMOriginal key="s1" onDone={() => setStage(2)} />}
        {stage === 2 && <StageTerminal key="s2" onDone={() => setStage(3)} />}
        {stage === 3 && <StageVisualizer key="s3" onDone={() => setStage(4)} />}
        {stage === 4 && <StageAIVideo key="s4" onDone={() => setStage(5)} />}
        {stage === 5 && <StageTribute key="s5" onBack={onBack} />}
      </AnimatePresence>
    </div>
  );
}

// ── Stage 1 (Original): FM Tuner 99.9 ──
function StageFMOriginal({ onDone }: { onDone: () => void }) {
  const [freq, setFreq] = useState(88.0);
  const TARGET = 99.9;
  const isLocked = Math.abs(freq - TARGET) <= 0.3;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isLocked) { const t = setTimeout(() => setRevealed(true), 900); return () => clearTimeout(t); }
  }, [isLocked]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-8 px-8">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div key="tuner" exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg">
            <p className="text-center text-white/30 tracking-[0.4em] uppercase text-xs mb-10">
              Chapter 1 · Find the Signal
            </p>
            <motion.div className="text-center mb-8" animate={{
              color: isLocked ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              textShadow: isLocked ? "0 0 30px rgba(255,255,255,0.8)" : "none",
            }}>
              <span className="text-7xl sm:text-8xl font-mono font-bold">{freq.toFixed(1)}</span>
              <span className="text-xl ml-2 text-white/30">FM</span>
            </motion.div>

            {/* Static noise bars */}
            <div className="h-14 mb-8 flex items-end gap-0.5 justify-center overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div key={i} className="w-1 rounded-full"
                  animate={{
                    height: isLocked ? [6, 8 + Math.abs(Math.sin(i * 0.7)) * 28, 6] : [2, Math.random() * 18 + 2, 2],
                    backgroundColor: isLocked ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ repeat: Infinity, duration: isLocked ? 1 + (i % 4) * 0.15 : 0.08 + Math.random() * 0.1 }} />
              ))}
            </div>

            <input type="range" min="880" max="1080" step="1"
              value={Math.round(freq * 10)}
              onChange={(e) => setFreq(parseInt(e.target.value) / 10)}
              style={{ "--thumb-color": "rgba(255,255,255,0.8)" } as React.CSSProperties} />
            <div className="flex justify-between text-white/20 text-xs mt-2 font-mono"><span>88.0</span><span>108.0</span></div>

            {isLocked && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center text-white/70 text-xs mt-4 tracking-[0.3em] font-mono">
                ◆ SIGNAL LOCKED · 99.9 FM ◆
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div key="found" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4">
            <div className="text-5xl">📻</div>
            <p className="text-xl font-bold text-white">Signal found.</p>
            <p className="text-white/50 text-sm max-w-xs mx-auto">But there&apos;s a hidden frequency only she broadcasts on...</p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={onDone}
              className="mt-4 px-6 py-2 rounded-full text-xs tracking-[0.3em] uppercase"
              style={{ background: `${COLOR}20`, border: `1px solid ${COLOR}60`, color: COLOR }}>
              Find her station →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Stage 4: Dance Floor - Light up tiles ──
function StageDanceFloor({ onDone }: { onDone: () => void }) {
  const COLS = 8, ROWS = 6, TOTAL = COLS * ROWS, NEEDED = 20;
  const [litTiles, setLitTiles] = useState<Set<number>>(new Set());
  const [canProceed, setCanProceed] = useState(false);
  const doneRef = useRef(false);

  const handleHover = useCallback((i: number) => {
    if (doneRef.current) return;
    setLitTiles((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      if (next.size >= NEEDED && !doneRef.current) {
        doneRef.current = true;
        setCanProceed(true);
      }
      return next;
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 to-transparent pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-1">Chapter 4 · Dance Floor</p>
        <h2 className="text-2xl font-bold text-white">Light up the dance floor</h2>
      </motion.div>

      <div className="grid gap-1 z-10" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <motion.div key={i}
            className="w-10 h-10 rounded-sm cursor-pointer"
            onHoverStart={() => handleHover(i)}
            animate={{
              backgroundColor: litTiles.has(i) ? COLOR : "#1a1a1a",
              boxShadow: litTiles.has(i) ? `0 0 10px ${COLOR}, 0 0 25px ${COLOR}40` : "none",
            }}
            transition={{ duration: 0.12 }} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 z-10">
        <p className="text-white/30 text-xs font-mono">{Math.min(litTiles.size, NEEDED)} / {NEEDED}</p>
        <AnimatePresence>
          {canProceed && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={onDone}
              className="px-8 py-3 rounded-full text-sm font-semibold"
              style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
              Dance floor lit! Next →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Stage 4: AI Video Generator
function StageAIVideo({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  
  const steps = [
    { icon: Wand2, label: "Generate Idea", text: "AI is thinking of a concept..." },
    { icon: Image, label: "Generate Photo", text: "Creating the perfect image..." },
    { icon: Video, label: "Generate Video", text: "Rendering video frames..." },
    { icon: Wand2, label: "Edit & Enhance", text: "Adding filters and effects..." },
    { icon: Instagram, label: "Ready to Post", text: "Your Instagram content is ready!" },
  ];

  const handleGenerate = () => {
    if (generating || step >= steps.length) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStep(s => s + 1);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · AI Video Generator</p>
        <h2 className="text-2xl font-bold text-white">Create Instagram content</h2>
      </div>
      
      {/* Progress indicator */}
      <div className="flex gap-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                i < step ? 'bg-cyan-500 text-black' : i === step ? 'bg-cyan-500/30 text-cyan-400' : 'bg-white/10 text-white/30'
              }`}
              animate={i === step && generating ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: generating ? Infinity : 0 }}
            >
              <Icon size={20} />
            </motion.div>
          );
        })}
      </div>
      
      {/* Generation display */}
      <div className="w-64 h-64 bg-cyan-900/20 rounded-2xl border-2 border-cyan-500/30 flex flex-col items-center justify-center gap-4">
        {step < steps.length ? (
          <>
            {(() => {
              const Icon = steps[step].icon;
              return <Icon size={48} className={generating ? 'text-cyan-400' : 'text-white/30'} />;
            })()}
            <p className="text-white/60 text-sm text-center px-4">
              {generating ? steps[step].text : `Ready to ${steps[step].label.toLowerCase()}`}
            </p>
            {generating && (
              <motion.div
                className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <Instagram size={48} className="text-cyan-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Ready for Instagram!</p>
          </motion.div>
        )}
      </div>
      
      {/* Action button */}
      {step < steps.length ? (
        <motion.button
          onClick={handleGenerate}
          disabled={generating}
          className={`px-8 py-3 rounded-full text-sm font-semibold ${
            generating ? 'bg-cyan-500/20 text-cyan-500/50' : 'bg-cyan-500/25 text-cyan-400 hover:bg-cyan-500/40'
          } border border-cyan-500`}
          whileHover={!generating ? { scale: 1.05 } : {}}
          whileTap={!generating ? { scale: 0.95 } : {}}
        >
          {generating ? 'Generating...' : steps[step].label}
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={onDone}
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}
        >
          Post it! →
        </motion.button>
      )}
      
      <p className="text-white/40 text-sm mt-2">
        Step {Math.min(step + 1, steps.length)} of {steps.length}
      </p>
    </motion.div>
  );
}

// Stage 4: Neural Network - Connect the nodes
function StageNeuralNetwork({ onDone }: { onDone: () => void }) {
  const [activated, setActivated] = useState<boolean[]>(Array(9).fill(false));
  const allActivated = activated.every(a => a);

  const nodes = [
    { id: 0, x: '50%', y: '15%', label: 'AI' },
    { id: 1, x: '25%', y: '35%', label: 'SMM' },
    { id: 2, x: '75%', y: '35%', label: 'K-pop' },
    { id: 3, x: '15%', y: '60%', label: 'Calm' },
    { id: 4, x: '50%', y: '50%', label: '✨' },
    { id: 5, x: '85%', y: '60%', label: 'Tech' },
    { id: 6, x: '30%', y: '80%', label: 'Art' },
    { id: 7, x: '50%', y: '85%', label: '💙' },
    { id: 8, x: '70%', y: '80%', label: 'Future' },
  ];

  const handleClick = (id: number) => {
    if (allActivated) return;
    setActivated(prev => {
      const newActivated = [...prev];
      // Activate this node and all connected nodes
      const connections: Record<number, number[]> = {
        0: [1, 2, 4],
        1: [0, 3, 4, 6],
        2: [0, 4, 5, 8],
        3: [1, 4, 6, 7],
        4: [0, 1, 2, 3, 5, 6, 7, 8], // Center connects to all
        5: [2, 4, 7, 8],
        6: [1, 3, 4, 7],
        7: [3, 4, 5, 6, 8],
        8: [2, 4, 5, 7],
      };
      newActivated[id] = true;
      connections[id].forEach(connId => {
        if (prev[connId]) newActivated[connId] = true;
      });
      return newActivated;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-4 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · Neural Network</p>
        <h2 className="text-2xl font-bold text-white">Connect all nodes</h2>
      </div>
      
      <div className="relative w-80 h-80">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activated[4] && activated.map((active, i) => active && i !== 4 && (
            <motion.line
              key={i}
              x1="50%" y1="50%"
              x2={nodes[i].x} y2={nodes[i].y}
              stroke={COLOR}
              strokeWidth="2"
              strokeOpacity="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </svg>
        
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.button
            key={node.id}
            onClick={() => handleClick(node.id)}
            disabled={allActivated}
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              activated[node.id] ? 'bg-cyan-500 text-black scale-110' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40'
            }`}
            style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
            whileHover={!allActivated ? { scale: 1.1 } : {}}
            whileTap={!allActivated ? { scale: 0.9 } : {}}
          >
            {node.label}
          </motion.button>
        ))}
      </div>
      
      <p className="text-white/40 text-sm mt-4">
        {allActivated ? 'Neural network synchronized! 💙' : `Nodes activated: ${activated.filter(a => a).length} / 9`}
      </p>
      
      {allActivated && (
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }} onClick={onDone}
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
          Network complete! →
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Stage 3: AI Terminal ──
const TERMINAL_LINES = [
  { delay: 0,   text: "> Connecting to NewGen_Database..." },
  { delay: 0.6, text: "> Loading sabinina.personality.json ..." },
  { delay: 1.2, text: "" },
  { delay: 1.4, text: "  CALM_LEVEL:          ████████████  99.9%" },
  { delay: 1.9, text: "  DANCE_ENERGY:         ████████████  ∞ OVERFLOW" },
  { delay: 2.4, text: "  KPOP_KNOWLEDGE:       ████████████  LEGENDARY" },
  { delay: 2.9, text: "  SMM_SKILLS:           ████████████  GROWING FAST" },
  { delay: 3.4, text: "  AI_TOOLS:             ████████████  ACCELERATING" },
  { delay: 3.9, text: "" },
  { delay: 4.1, text: "> STATUS: EXCEPTIONAL HUMAN DETECTED" },
  { delay: 4.6, text: "> VERDICT: The calmest storm you'll ever meet." },
];

function StageTerminal({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const done = visibleLines >= TERMINAL_LINES.length;

  useEffect(() => {
    const timers = TERMINAL_LINES.map((l, i) =>
      setTimeout(() => setVisibleLines(i + 1), l.delay * 1000 + 300)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <div className="w-full max-w-lg glass p-8 rounded-2xl font-mono text-sm"
        style={{ border: `1px solid ${COLOR}25` }}>
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-white/30 text-xs">Chapter 3 · sabinina_profile.sh</span>
        </div>

        <div className="space-y-1 min-h-[220px]">
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="leading-relaxed"
              style={{ color: line.text.startsWith(">") ? COLOR : line.text.includes("████") ? "#00ffa3" : "rgba(255,255,255,0.6)" }}>
              {line.text || "\u00A0"}
            </motion.p>
          ))}
          {!done && <span className="inline-block w-2 h-4 bg-current animate-pulse" style={{ color: COLOR }} />}
        </div>

        {done && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.04 }} onClick={onDone}
            className="mt-6 w-full py-2 rounded-lg text-xs tracking-[0.3em] uppercase"
            style={{ background: `${COLOR}20`, border: `1px solid ${COLOR}50`, color: COLOR }}>
            Generate: True Energy →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ── Stage 4: K-pop Visualizer ──
function StageVisualizer({ onDone }: { onDone: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0221 0%, #1a0533 50%, #2d0a4a 100%)' }}>
      {/* Central visualizer */}
      <motion.div className="relative z-10" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <Sparkles size={80} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Message */}
      <motion.div className="mt-12 text-center z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 drop-shadow-lg">True Energy Unleashed! ⚡</h2>
        <p className="text-cyan-300 text-lg">The AI Zen Garden has transformed</p>
        <motion.button whileHover={{ scale: 1.05 }} onClick={onDone}
          className="mt-6 px-8 py-3 rounded-full text-sm font-semibold"
          style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
          Read her story →
        </motion.button>
      </motion.div>

      {/* Audio visualizer bars */}
      <div className="flex items-end gap-1 mt-12 z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="w-2 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
            animate={{ height: [20, Math.random() * 100 + 40, 20] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Stage 5: Tribute ──
function StageTribute({ onBack }: { onBack: () => void }) {
  const COLOR = "#00f0ff";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-xl glass p-10 rounded-3xl">
        <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-6" style={{ color: COLOR }}>
          On Her Own Frequency
        </h1>
        <p className="text-white/75 text-lg leading-relaxed">
          Still waters run deep — and then{" "}
          <span style={{ color: COLOR }} className="font-semibold">explode into the dance floor</span>.
          Sabinina carries a quiet power that makes people lean in. She masters SMM,
          explores AI tools, stans K-pop — all with the same unhurried grace.
          There&apos;s a whole universe running behind those calm eyes.
        </p>
        <div className="w-full h-px mt-8 mb-6 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />
        <p className="text-white/40 text-sm italic mb-6">Happy Women's Day, Sabinina 💙 — w/l Timson</p>
        
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
