'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Star as StarIcon, Sparkles } from "lucide-react";
import Image from "next/image";

export interface Girl {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  orbitSpeed: number;
}

const GIRLS: Girl[] = [
  { id: "alyok", name: "Alyok", color: "#ff007f", x: 0, y: -15, orbitSpeed: 300 },
  { id: "sabinina", name: "Sabinina", color: "#00f0ff", x: 13, y: -8, orbitSpeed: 300 },
  { id: "nazken", name: "Nazken", color: "#ffb800", x: -13, y: -8, orbitSpeed: 300 },
  { id: "molya", name: "Molya", color: "#b500ff", x: -11, y: 12, orbitSpeed: 450 },
  { id: "zhansiko", name: "Zhansiko", color: "#ff2a00", x: 11, y: 12, orbitSpeed: 450 },
  { id: "oliyash", name: "Oliyash", color: "#00ffa3", x: -20, y: 20, orbitSpeed: 450 },
  { id: "ardashon", name: "Ardashon", color: "#ff8c00", x: 20, y: 20, orbitSpeed: 450 },
];

interface Props {
  visited: Set<string>;
  onSelect: (g: Girl) => void;
  onUnity: () => void;
}

export function Constellation({ visited, onSelect, onUnity }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  // Animation loop for orbit
  useState(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.5);
    }, 50);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0, filter: "blur(12px)" }}
      transition={{ duration: 1.2 }}
      className="relative w-full h-full overflow-hidden pointer-events-none"
      style={{ background: "radial-gradient(ellipse 100% 80% at 50% 40%, #0d0a1f 0%, #07060f 50%, #030208 100%)" }}
    >
      {/* SUN with sunlight rays animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,200,0,0.3) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Sun rays */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '4px',
              height: '60px',
              background: 'linear-gradient(to top, #ffd700, transparent)',
              left: '50%',
              top: '50%',
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
            }}
            animate={{
              scaleY: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}

        {/* Sun core */}
        <motion.div
          className="relative rounded-full"
          style={{
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, #fff7e6 0%, #ffd700 30%, #ff8c00 70%, #ff4500 100%)',
            boxShadow: '0 0 60px #ff8c00, 0 0 120px #ff6600, 0 0 180px #ff4500',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* ORBIT PATHS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Inner orbit path */}
        <motion.div
          className="absolute rounded-full border border-yellow-500/10"
          style={{ width: '280px', height: '280px' }}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Outer orbit path */}
        <motion.div
          className="absolute rounded-full border border-orange-500/10"
          style={{ width: '440px', height: '440px' }}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* GIRL STARS - Orbiting around sun */}
      {GIRLS.map((girl) => {
        const isHovered = hovered === girl.id;
        const isVisited = visited.has(girl.id);

        // Calculate orbit position based on time
        const angle = (time / girl.orbitSpeed) * 360;
        const rad = (angle * Math.PI) / 180;
        
        // Calculate distance from center based on original x,y
        const distance = Math.sqrt(girl.x * girl.x + girl.y * girl.y);
        const startAngle = Math.atan2(girl.y, girl.x) * (180 / Math.PI);
        
        // Current position
        const currentAngle = angle + startAngle;
        const currentRad = (currentAngle * Math.PI) / 180;
        const currentX = Math.cos(currentRad) * distance;
        const currentY = Math.sin(currentRad) * distance;

        return (
          <motion.button
            key={girl.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('⭐ CLICKED:', girl.id, girl.name);
              onSelect(girl);
            }}
            onMouseEnter={() => setHovered(girl.id)}
            onMouseLeave={() => setHovered(null)}
            className="absolute flex flex-col items-center justify-center bg-transparent border-none outline-none cursor-pointer p-0 pointer-events-auto"
            style={{
              left: `calc(50% + ${currentX}%)`,
              top: `calc(50% + ${currentY}%)`,
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              zIndex: 100,
            }}
          >
            {/* Avatar on hover */}
            {isHovered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                }}
              >
                <div className="relative w-32 h-32" style={{ boxShadow: `0 0 40px ${girl.color}` }}>
                  <Image
                    src={`/avatars/${girl.id}.jpg`}
                    alt={girl.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority={girl.id === 'alyok'}
                    quality={90}
                  />
                </div>
              </motion.div>
            )}

            {/* Star when not hovered */}
            {!isHovered && (
              <>
                {/* Glow */}
                <div className="absolute w-10 h-10 rounded-full"
                  style={{ backgroundColor: girl.color, filter: 'blur(20px)' }}
                />

                {/* Star icon */}
                <div className="relative z-10 flex items-center justify-center">
                  <StarIcon
                    className="fill-current"
                    size={isVisited ? 32 : 28}
                    style={{ color: girl.color }}
                  />
                  {isVisited && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: '#000', lineHeight: 1 }}>✓</span>
                  )}
                </div>
              </>
            )}

            {/* Name - disappears on hover */}
            {!isHovered && (
              <span className="mt-2 text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: girl.color }}>
                {girl.name}
              </span>
            )}
          </motion.button>
        );
      })}

      {/* TITLE */}
      <div className="absolute top-6 left-0 right-0 flex justify-center z-[500] pointer-events-auto select-none">
        <div className="text-center">
          <span className="block text-[10px] sm:text-xs tracking-[0.5em] uppercase text-white/30 mb-1">
            International Women&apos;s Day · March 8
          </span>
          <span className="block text-xl sm:text-2xl tracking-[0.25em] uppercase font-light text-white/60">
            The Constellation of NewGen
          </span>
        </div>
      </div>

      {/* BOTTOM UI */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-[500] pointer-events-auto">
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 select-none">
            {visited.size === 0 ? "Choose your star" : `${visited.size} / ${GIRLS.length} explored`}
          </p>
          <div className="flex gap-1.5">
            {GIRLS.map((g) => (
              <div key={g.id} className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: visited.has(g.id) ? g.color : "rgba(255,255,255,0.15)", boxShadow: visited.has(g.id) ? `0 0 6px ${g.color}` : "none" }} />
            ))}
          </div>
          {/* Celebrate button */}
          <AnimatePresence>
            {visited.size >= 1 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    "0 0 20px rgba(255,0,127,0.4), 0 0 40px rgba(0,240,255,0.3), 0 0 60px rgba(181,0,255,0.2)",
                    "0 0 30px rgba(255,0,127,0.6), 0 0 60px rgba(0,240,255,0.5), 0 0 90px rgba(181,0,255,0.4)",
                    "0 0 20px rgba(255,0,127,0.4), 0 0 40px rgba(0,240,255,0.3), 0 0 60px rgba(181,0,255,0.2)",
                  ]
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={onUnity}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="mt-1 px-8 py-3 rounded-full text-xs tracking-[0.3em] uppercase font-semibold"
                style={{
                  background: "linear-gradient(135deg, rgba(255,0,127,0.3), rgba(0,240,255,0.3), rgba(181,0,255,0.3))",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.9)",
                  boxShadow: "0 0 20px rgba(255,0,127,0.4), 0 0 40px rgba(0,240,255,0.3), 0 0 60px rgba(181,0,255,0.2)",
                }}
              >
                🌸 Celebrate Together
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default Constellation;
