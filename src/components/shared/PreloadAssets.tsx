"use client";

import { useEffect, useState } from 'react';
import { POLAROID_ROWS, VIDEOS } from '@/components/shared/UnityPage';

export function PreloadAssets() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Priority 1: Preload avatars FIRST (critical for GirlIntro pages)
    const preloadAvatars = () => {
      const avatars = ['alyok', 'sabinina', 'nazken', 'molya', 'zhansiko', 'oliyash', 'ardashon'];
      const avatarPromises = avatars.map(avatar => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/avatars/${avatar}.webp`;
          img.onload = () => {
            console.log(`✅ Avatar loaded: ${avatar}`);
            resolve(true);
          };
          img.onerror = () => {
            console.warn(`⚠️ Avatar failed: ${avatar}`);
            resolve(false);
          };
        });
      });

      Promise.all(avatarPromises).then(() => {
        console.log('✅ All avatars preloaded');
      });
    };

    // Priority 2: Preload all images (including full-size for popup)
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

      Promise.all(imagePromises).then(() => {
        console.log('✅ All memories preloaded');
      });
    };

    // Priority 3: Preload video metadata (not full videos to save bandwidth)
    const preloadVideos = () => {
      const videoPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'metadata';
          videoEl.src = video.src;
          videoEl.onloadedmetadata = () => resolve(true);
          videoEl.onerror = () => resolve(false);
        });
      });

      Promise.all(videoPromises).then(() => {
        console.log('✅ All video metadata loaded');
      });
    };

    // Start preloading immediately
    preloadAvatars();
    
    // Start other preloads after a tiny delay (don't block avatar loading)
    setTimeout(() => {
      preloadImages();
      preloadVideos();
    }, 500);

    setLoaded(true);
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default PreloadAssets;
