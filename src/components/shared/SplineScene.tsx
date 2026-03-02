'use client';

import { Suspense, lazy, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import Spline with proper webpack chunk handling
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (app: any) => void;
  onError?: (error: any) => void;
}

/**
 * Production-ready Spline 3D scene wrapper with error handling
 */
export function SplineScene({
  scene,
  className = '',
  onLoad,
  onError,
}: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback((app: any) => {
    setLoaded(true);
    onLoad?.(app);
  }, [onLoad]);

  const handleError = useCallback((err: any) => {
    console.error('Spline scene error:', err);
    setError(true);
    onError?.(err);
  }, [onError]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-deep-space ${className}`}>
        <div className="text-center text-white/40">
          <p className="text-sm">3D scene unavailable</p>
          <p className="text-xs mt-1">Interactive 3D content failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-pink-500/40"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-2 border-cyan-500/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
              <p className="text-white/60 text-sm tracking-wider">Loading 3D Experience...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <Spline
          scene={scene}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        />
      </Suspense>
    </div>
  );
}

export default SplineScene;
