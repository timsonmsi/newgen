'use client';

import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';

interface GirlIntroProps {
  girl: {
    id: string;
    name: string;
    color: string;
  };
  onComplete: () => void;
}

export function GirlIntro({ girl, onComplete }: GirlIntroProps) {
  // Generate particles in rings AROUND the avatar (not behind it)
  const particles = Array.from({ length: 60 }).map((_, i) => {
    // Place particles in outer rings only
    const ring = i % 3; // 3 rings
    const angle = (i / 20) * Math.PI * 2 + ring;
    const radius = 35 + ring * 15; // 35%, 50%, 65% from center
    
    return {
      id: i,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      size: Math.random() * 2 + 1,
      color: i % 3 === 0 ? girl.color : '#ffffff',
      delay: Math.random() * 3,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, ${girl.color}15 0%, #000000 70%)`,
      }}
    >
      {/* BACKGROUND LAYER - Particles and rings (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Particles in outer rings - GUARANTEED outside avatar area */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}

        {/* Rotating decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute rounded-full border"
            style={{
              width: '500px',
              height: '500px',
              borderColor: `${girl.color}20`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              width: '400px',
              height: '400px',
              borderColor: `${girl.color}30`,
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full border"
            style={{
              width: '600px',
              height: '600px',
              borderColor: `${girl.color}10`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      {/* FOREGROUND LAYER - Avatar and all content (z-10) */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* Floating sparkles around avatar */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${Math.cos((i * 60 * Math.PI) / 180) * 180}px`,
              top: `${Math.sin((i * 60 * Math.PI) / 180) * 180}px`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Sparkles size={24} style={{ color: girl.color }} />
          </motion.div>
        ))}

        {/* Avatar container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0.2,
          }}
          className="relative z-20"
        >
          {/* Outer glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${girl.color}60 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${girl.color}40 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 2.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />

          {/* Avatar frame with SOLID black background to block particles */}
          <motion.div
            className="relative w-56 h-56 rounded-full overflow-hidden bg-black"
            style={{
              boxShadow: `
                0 0 60px ${girl.color}80,
                0 0 120px ${girl.color}40,
                0 0 180px ${girl.color}20,
                inset 0 0 60px ${girl.color}40
              `,
              backgroundColor: '#000000',
            }}
          >
            {/* Animated border gradient */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(60deg, transparent, ${girl.color}, transparent, ${girl.color}, transparent)`,
                backgroundSize: '400% 400%',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Inner frame with BLACK background to block any particles */}
            <div className="absolute inset-1 rounded-full overflow-hidden bg-black">
              <img
                src={`/avatars/${girl.id}.webp`}
                alt={girl.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Name reveal section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 text-center"
        >
          {/* Top decorative line with sparkle */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${girl.color})`,
              }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
            >
              <Sparkles size={16} style={{ color: girl.color }} />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-px"
              style={{
                background: `linear-gradient(90deg, ${girl.color}, transparent)`,
              }}
            />
          </div>

          {/* Girl's name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              delay: 1.2, 
              type: 'spring', 
              stiffness: 200,
              backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
            }}
            className="text-6xl font-black mb-3 tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${girl.color}, #ffffff, ${girl.color})`,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 20px ${girl.color}80)`,
            }}
          >
            {girl.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-white/50 text-sm tracking-[0.4em] uppercase mb-2"
          >
            New Gen Star
          </motion.p>

          {/* Bottom decorative line */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${girl.color})`,
              }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2, type: 'spring', stiffness: 200 }}
            >
              <Sparkles size={12} style={{ color: girl.color }} />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="h-px"
              style={{
                background: `linear-gradient(90deg, ${girl.color}, transparent)`,
              }}
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mt-12"
        >
          <motion.button
            onClick={onComplete}
            className="group relative px-12 py-5 rounded-full font-bold text-lg tracking-wider overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${girl.color}, ${girl.color}dd)`,
              boxShadow: `
                0 10px 40px ${girl.color}60,
                0 0 80px ${girl.color}40,
                inset 0 -4px 20px rgba(0,0,0,0.3),
                inset 0 4px 20px rgba(255,255,255,0.3)
              `,
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: `
                0 15px 50px ${girl.color}80,
                0 0 100px ${girl.color}60,
                inset 0 -4px 20px rgba(0,0,0,0.3),
                inset 0 4px 20px rgba(255,255,255,0.4)
              `,
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                `0 10px 40px ${girl.color}60, 0 0 80px ${girl.color}40`,
                `0 15px 50px ${girl.color}80, 0 0 100px ${girl.color}60`,
                `0 10px 40px ${girl.color}60, 0 0 80px ${girl.color}40`,
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['-100% 0', '100% 0'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Button content */}
            <span className="relative z-10 flex items-center gap-3 text-white drop-shadow-lg">
              <Play size={24} className="fill-white" />
              BEGIN HER JOURNEY
              <Play size={24} className="fill-white rotate-180" />
            </span>
          </motion.button>

          {/* Hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-center text-white/30 text-xs tracking-wider mt-4"
          >
            Click the button above to explore her universe
          </motion.p>
        </motion.div>

        {/* Additional decorative elements */}
        <motion.div
          className="absolute -left-20 top-1/2 pointer-events-none"
          animate={{
            x: [0, 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles size={32} style={{ color: girl.color }} />
        </motion.div>
        <motion.div
          className="absolute -right-20 top-1/2 pointer-events-none"
          animate={{
            x: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          <Sparkles size={32} style={{ color: girl.color }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GirlIntro;
