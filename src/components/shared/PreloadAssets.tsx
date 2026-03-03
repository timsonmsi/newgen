"use client";

import { useEffect, useState } from 'react';
import { POLAROID_ROWS, VIDEOS } from '@/components/shared/UnityPage';

export function PreloadAssets() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Preload all images
    const preloadImages = () => {
      const imagePromises = POLAROID_ROWS.flatMap(row =>
        row.map(polaroid => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = polaroid.src;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
          });
        })
      );

      // Preload avatars
      const avatars = ['alyok', 'sabinina', 'nazken', 'molya', 'zhansiko', 'oliyash', 'ardashon'];
      const avatarPromises = avatars.map(avatar => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/avatars/${avatar}.webp`;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      });

      // Preload videos (just metadata, not full download to save bandwidth)
      const videoPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'metadata';
          videoEl.src = video.src;
          videoEl.onloadedmetadata = () => resolve(true);
          videoEl.onerror = () => resolve(false);
        });
      });

      // Wait for all assets to preload
      Promise.all([...imagePromises, ...avatarPromises, ...videoPromises])
        .then(() => {
          setLoaded(true);
          console.log('✅ All assets preloaded');
        })
        .catch((err) => {
          console.log('⚠️ Some assets failed to preload:', err);
          setLoaded(true);
        });
    };

    // Start preloading after a short delay (don't block initial render)
    const timer = setTimeout(preloadImages, 1000);
    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default PreloadAssets;
