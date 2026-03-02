"use client";
// ARDASHON — color: #ff8c00
// Stage 1: Beautiful Vinyl Player — drag tonearm to play
// Stage 2: Banderos Dance — hit the notes
// Stage 3: Vinyl Collection — match the records
// Stage 4: Retro Karaoke — sing along game
// Stage 5: Tribute

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Disc3, Music, Sparkles, Mic } from "lucide-react";

const COLOR = "#ff8c00";
const BG = "#140800";

interface Props { onBack: () => void; }

// Real song chorus lyrics (sequential from actual songs)
const KARAOKE_SONGS = [
  {
    artist: "Kairat Nurtas",
    title: "Almatının Tünderı",
    lyrics: [
      "🎵 Алматының түндері-ай...",
      "🎵 Махаббаттың мәңгі аралындай...",
      "🎵 Алматының түндері-ай...",
      "🎵 Аралайық бірге маралым-ай...",
    ],
  },
  {
    artist: "Band'Eros",
    title: "Columbia Pictures no presents",
    lyrics: [
      "🎵 Коламбия Пикчерз не представляет...",
      "🎵 Как хорошо мне с тобой бывает...",
      "🎵 Коламбия Пикчерз не представляет...",
      "🎵 А, а, не представляет...",
    ],
  },
  {
    artist: "Valery Meladze",
    title: "100 Shagov Nazad",
    lyrics: [
      "🎵 Сто шагов назад, тихо на пальцах...",
      "🎵 Лети, моя душа, не оставайся...",
      "🎵 Сто шагов назад...",
      "🎵 Притяженья больше нет...",
    ],
  },
  {
    artist: "Modern Talking",
    title: "No Face No Name No Number",
    lyrics: [
      "🎵 No face, no name, no number...",
      "🎵 Your love is like a thunder...",
      "🎵 I'm dancing on a fire...",
      "🎵 Burning in my heart...",
    ],
  },
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

export function ArdashonInteraction({ onBack }: Props) {
  const [stage, setStage] = useState(1);
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: BG }}>
      <StageDots stage={stage} />
      <button onClick={onBack} className="absolute top-8 left-8 z-50 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors">← Galaxy</button>
      <AnimatePresence mode="wait">
        {stage === 1 && <StageVinyl key="s1" onDone={() => setStage(2)} />}
        {stage === 2 && <StageBanderos key="s2" onDone={() => setStage(3)} />}
        {stage === 3 && <StageVinylCollection key="s3" onDone={() => setStage(4)} />}
        {stage === 4 && <StageKaraoke key="s4" onDone={() => setStage(5)} />}
        {stage === 5 && <StageTribute key="s5" onBack={onBack} />}
      </AnimatePresence>
    </div>
  );
}

// Stage 1: Beautiful Vinyl Player - tonearm pivots around fixed point
function StageVinyl({ onDone }: { onDone: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tonearmAngle, setTonearmAngle] = useState(45); // Start at 45 degrees (outside vinyl)

  const handleDrag = (_: any, info: any) => {
    // Calculate rotation based on drag (with sensitivity)
    const newAngle = Math.max(5, Math.min(60, tonearmAngle + info.delta.x * 0.3));
    setTonearmAngle(newAngle);
    
    // If rotated onto vinyl (< 20 degrees), start playing
    if (newAngle < 20 && !isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center relative px-8">
      <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-10">Retro Vibes</p>

      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* Vinyl glow */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: '400px', height: '400px', background: `radial-gradient(circle, ${COLOR}20, transparent 70%)` }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Record */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="rounded-full flex items-center justify-center relative"
          style={{
            width: '340px',
            height: '340px',
            background: "radial-gradient(circle, #0a0500 0%, #1a0a00 40%, #000000 100%)",
            boxShadow: isPlaying ? `0 0 60px ${COLOR}60, inset 0 0 40px ${COLOR}30` : "0 0 40px rgba(0,0,0,0.8)",
            border: "4px solid #2a1500"
          }}
        >
          {/* Vinyl grooves */}
          {[0.45, 0.55, 0.65, 0.75, 0.85, 0.92].map((r, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: `${r * 100}%`,
                height: `${r * 100}%`,
                border: `1px solid ${i % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)'}`,
              }} />
          ))}

          {/* Record label */}
          <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-center relative z-10"
            style={{
              background: `radial-gradient(circle, ${COLOR}, #ff6600, #c06000)`,
              border: "4px solid #1a0800",
              boxShadow: "0 0 20px rgba(255,140,0,0.5)"
            }}>
            <span className="text-black font-serif italic font-bold text-sm">SOULMATE</span>
            <span className="text-black/70 text-[9px] mt-1">Retro Collection</span>
            <Sparkles className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 text-black" />
          </div>

          {/* Vinyl shine */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)" }}
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
        </motion.div>

        {/* Tonearm base (pivot point) - COMPLETELY OUTSIDE vinyl */}
        <div className="absolute z-20" style={{ right: '-10px', top: '40px' }}>
          {/* Base circle - fixed pivot point */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-2xl flex items-center justify-center border-2 border-gray-600">
            {/* Center pivot - smaller circle */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-inner flex items-center justify-center">
              {/* Tiny center dot - the actual pivot */}
              <div className="w-3 h-3 rounded-full bg-gray-700" />
            </div>
          </div>
        </div>

        {/* Tonearm - rotates around pivot point (attached to pivot) */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -60, right: 40 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          className="absolute z-30 cursor-grab active:cursor-grabbing"
          style={{
            right: '-3px', // Pivot point position (aligned with center of base) - OUTSIDE VINYL
            top: '47px',   // Aligned with pivot center
            transformOrigin: 'right center', // Rotate around RIGHT end (pivot point)
            rotate: tonearmAngle,
          }}
        >
          {/* Tonearm shaft - rotates around pivot, LONGER to reach vinyl */}
          <div className="w-52 h-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 rounded-full shadow-md" />
          
          {/* Tonearm head with needle - at the END of shaft (left side) */}
          <div className="absolute left-0 -top-2.5 w-9 h-11 bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm shadow-lg flex items-end justify-center">
            {/* Needle extends down to touch vinyl surface */}
            <div className="w-1 h-9 bg-gradient-to-b from-gray-500 to-black rounded-b mb-1" />
          </div>
        </motion.div>

        {!isPlaying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute -bottom-12 text-white/40 text-sm">
            Drag the tonearm onto the vinyl →
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center space-y-4">
            <Disc3 className="w-6 h-6 mx-auto animate-pulse" style={{ color: COLOR }} />
            <p className="text-white/60 text-sm">The retro vibes are playing... discover the full collection</p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={onDone}
              className="px-8 py-3 rounded-full text-sm font-semibold"
              style={{ background: `${COLOR}25`, border: `1px solid ${COLOR}`, color: COLOR }}>
              Explore the collection →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Stage 2: Banderos Dance Game
function StageBanderos({ onDone }: { onDone: () => void }) {
  const [score, setScore] = useState(0);
  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (score >= 5) {
      setTimeout(() => onDone(), 1000);
      return;
    }
    const interval = setInterval(() => {
      setCurrentNote(Math.floor(Math.random() * 7));
    }, 1200);
    return () => clearInterval(interval);
  }, [score, onDone]);

  const hitNote = (index: number) => {
    if (index === currentNote) {
      setScore(s => s + 1);
      setCombo(c => c + 1);
      setCurrentNote(null);
    } else {
      setCombo(0);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Banderos Dance Party</p>
        <h2 className="text-2xl font-bold text-white">Hit the notes!</h2>
        <p className="text-white/40 text-sm mt-1">🎵 Old Russian songs dance challenge</p>
      </div>

      <div className="flex gap-8 items-center">
        <div className="text-center">
          <p className="text-white/40 text-xs">Score</p>
          <p className="text-2xl font-bold" style={{ color: COLOR }}>{score} / 5</p>
        </div>
        {combo > 1 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
            <p className="text-orange-400 text-xs">Combo!</p>
            <p className="text-xl font-bold text-orange-400">x{combo}</p>
          </motion.div>
        )}
      </div>

      <div className="w-64 h-32 bg-orange-900/20 rounded-2xl border-2 border-orange-500/30 flex items-center justify-center">
        {currentNote !== null ? (
          <motion.div key={currentNote} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="text-6xl font-bold" style={{ color: COLOR }}>
            {["C", "D", "E", "F", "G", "A", "B"][currentNote]}
          </motion.div>
        ) : (
          <p className="text-white/30">Wait for the note...</p>
        )}
      </div>

      <div className="flex gap-1">
        {["C", "D", "E", "F", "G", "A", "B"].map((note, i) => (
          <motion.button key={note} onClick={() => hitNote(i)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`w-10 h-32 rounded-b-lg flex items-end justify-center pb-2 font-bold text-sm transition-all ${
              i === currentNote ? 'bg-orange-500 text-black' : 'bg-white text-black'
            }`}>
            {note}
          </motion.button>
        ))}
      </div>

      {score >= 5 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-400 text-center">
          🎉 Perfect! You know all the Banderos hits! 💃
        </motion.p>
      )}
    </motion.div>
  );
}

// Stage 3: Vinyl Collection Match
function StageVinylCollection({ onDone }: { onDone: () => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const records = [
    { id: 1, emoji: "🎵", name: "Kazakh Classics" },
    { id: 2, emoji: "💃", name: "Dance Hits" },
    { id: 3, emoji: "🌙", name: "Night Vibes" },
    { id: 4, emoji: "🧡", name: "Love Songs" },
  ];

  const [cards] = useState(() => {
    return [...records, ...records]
      .sort(() => Math.random() - 0.5)
      .map((record, index) => ({ ...record, cardId: index }));
  });

  const handleCardClick = (cardId: number) => {
    if (selected.length >= 2 || selected.includes(cardId) || matched.includes(cardId)) return;
    
    const newSelected = [...selected, cardId];
    setSelected(newSelected);
    
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newSelected;
      if (cards[first].id === cards[second].id) {
        setMatched([...matched, first, second]);
        setSelected([]);
      } else {
        setTimeout(() => setSelected([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === 8) {
      setTimeout(() => onDone(), 1000);
    }
  }, [matched, onDone]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 3 · Vinyl Collection</p>
        <h2 className="text-2xl font-bold text-white">Match the records</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const isSelected = selected.includes(i);
          const isMatched = matched.includes(i);
          
          return (
            <motion.button
              key={i}
              onClick={() => handleCardClick(i)}
              disabled={isMatched}
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                isMatched ? 'bg-orange-500/30 scale-105' : isSelected ? 'bg-orange-500 text-black' : 'bg-white/10 hover:bg-white/20'
              }`}
              whileHover={!isMatched ? { scale: 1.05 } : {}}
              whileTap={!isMatched ? { scale: 0.95 } : {}}
            >
              {isSelected || isMatched ? (
                <>
                  <span className="text-3xl">{card.emoji}</span>
                  <span className="text-[9px] text-center leading-tight">{card.name}</span>
                </>
              ) : (
                <Disc3 className="w-8 h-8 text-white/30" />
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-white/40 text-sm">Moves: {moves}</p>

      {matched.length === 8 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-400 text-center">
          🎵 Collection complete! All vinyls matched! 🧡
        </motion.p>
      )}
    </motion.div>
  );
}

// Stage 4: Retro Karaoke with real songs - smaller mic
function StageKaraoke({ onDone }: { onDone: () => void }) {
  const [currentSong, setCurrentSong] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [sung, setSung] = useState<number[]>([]);
  const [completedSongs, setCompletedSongs] = useState<number[]>([]);

  const handleSing = () => {
    if (currentLine < KARAOKE_SONGS[currentSong].lyrics.length && !sung.includes(currentLine)) {
      const newSung = [...sung, currentLine];
      setSung(newSung);
      
      if (currentLine < KARAOKE_SONGS[currentSong].lyrics.length - 1) {
        setTimeout(() => setCurrentLine(currentLine + 1), 1200);
      } else {
        // Song completed
        setTimeout(() => {
          const newCompleted = [...completedSongs, currentSong];
          setCompletedSongs(newCompleted);
          if (currentSong < KARAOKE_SONGS.length - 1) {
            setCurrentSong(currentSong + 1);
            setCurrentLine(0);
            setSung([]);
          } else {
            onDone();
          }
        }, 1500);
      }
    }
  };

  const song = KARAOKE_SONGS[currentSong];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-2">Chapter 4 · Retro Karaoke</p>
        <h2 className="text-2xl font-bold text-white">Sing along!</h2>
      </div>

      {/* Song info */}
      <div className="text-center">
        <p className="text-orange-400 font-semibold">{song.artist}</p>
        <p className="text-white/60 text-sm">{song.title}</p>
        <div className="flex gap-2 mt-2 justify-center">
          {KARAOKE_SONGS.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${
              completedSongs.includes(i) ? 'bg-orange-500' : i === currentSong ? 'bg-orange-500/50' : 'bg-white/20'
            }`} />
          ))}
        </div>
      </div>

      {/* Microphone - SMALLER to not overlap lyrics */}
      <div className="relative">
        <motion.div
          className="relative w-24 h-36 bg-gradient-to-b from-gray-200 via-gray-400 to-gray-600 rounded-full shadow-2xl flex items-center justify-center"
          animate={sung.includes(currentLine) ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Mic className="w-12 h-12 text-gray-700" />
          
          {/* Grille pattern */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-3 border-gray-500/30" 
            style={{ background: 'repeating-radial-gradient(circle, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px)' }} />
          
          {/* Sound waves when singing */}
          {sung.includes(currentLine) && (
            <>
              <motion.div
                className="absolute w-32 h-32 border-4 border-orange-500/40 rounded-full"
                animate={{ scale: [1, 1.6], opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-40 h-40 border-4 border-orange-500/25 rounded-full"
                animate={{ scale: [1, 1.6], opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
            </>
          )}
        </motion.div>
        
        {/* Mic stand */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3 h-12 bg-gradient-to-b from-gray-500 to-gray-700" />
      </div>

      {/* Lyrics display - beautiful card */}
      <div className="w-96 bg-gradient-to-br from-orange-900/40 to-orange-900/20 rounded-3xl border border-orange-500/30 p-6 shadow-2xl">
        <div className="text-center space-y-3">
          {song.lyrics.map((line, i) => (
            <motion.p
              key={i}
              className={`text-base transition-all ${
                i === currentLine 
                  ? 'text-orange-400 font-bold text-lg drop-shadow-lg' 
                  : sung.includes(i) 
                  ? 'text-white/50' 
                  : 'text-white/20'
              }`}
              animate={i === currentLine ? { 
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 10px rgba(255,140,0,0.5)',
                  '0 0 20px rgba(255,140,0,0.8)',
                  '0 0 10px rgba(255,140,0,0.5)',
                ]
              } : {}}
              transition={{ duration: 0.8, repeat: i === currentLine ? Infinity : 0 }}
            >
              {sung.includes(i) ? (
                <span className="text-green-400">✓ {line.replace('🎵 ', '')}</span>
              ) : (
                line
              )}
            </motion.p>
          ))}
        </div>
      </div>

      {/* Sing button */}
      <motion.button
        onClick={handleSing}
        disabled={sung.includes(currentLine)}
        className={`px-16 py-4 rounded-full text-lg font-semibold transition-all ${
          sung.includes(currentLine) 
            ? 'bg-orange-500/30 text-orange-500/50' 
            : 'bg-gradient-to-r from-orange-500/30 to-orange-600/30 text-orange-400 hover:from-orange-500/50 hover:to-orange-600/50 border border-orange-500'
        }`}
        whileHover={!sung.includes(currentLine) ? { scale: 1.05 } : {}}
        whileTap={!sung.includes(currentLine) ? { scale: 0.95 } : {}}
      >
        {sung.includes(currentLine) ? (
          <span className="flex items-center gap-2">Great! ✨</span>
        ) : currentLine === song.lyrics.length - 1 ? (
          <span className="flex items-center gap-2">Finish Song! 🎤</span>
        ) : (
          <span className="flex items-center gap-2">Sing! 🎤</span>
        )}
      </motion.button>

      {completedSongs.length === KARAOKE_SONGS.length && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-400 text-center text-lg">
          🎤 Karaoke legend! All songs completed! 🧡
        </motion.p>
      )}
    </motion.div>
  );
}

// Stage 5: Tribute
function StageTribute({ onBack }: { onBack: () => void }) {
  const COLOR = "#ff8c00";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center max-w-xl glass p-10 rounded-3xl">
        <div className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent" />
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tighter mb-6" style={{ color: COLOR }}>
          My Soulmate
        </h1>
        <p className="text-white/75 text-lg leading-relaxed">
          Our playlists match. Our humor matches. Our silences are comfortable.
          From Banderos dance parties to deep retro vibes, from old Russian songs to Kazakh classics —
          every moment with you feels like coming home.
          <span style={{ color: COLOR }} className="font-semibold"> That&apos;s what a soulmate is.</span>
        </p>
        <div className="w-full h-px mt-8 mb-6 bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent" />
        <p className="text-white/40 text-sm italic mb-6">Happy Women&apos;s Day, Ardashon 🧡 — w/l Timson</p>
        
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

export default ArdashonInteraction;
