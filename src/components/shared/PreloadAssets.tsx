"use client";

import { useEffect, useState } from 'react';
import { POLAROID_ROWS, VIDEOS } from '@/components/shared/UnityPage';

export function PreloadAssets() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Priority 1: Preload avatars FIRST (critical for GirlIntro pages)
    const preloadAvatars = () => {
      const avatars = ['alyok', 'sabinina', 'nazken', 'molya', 'zhansiko', 'oliyash', 'ardashon'];
      console.log('🎯 Starting avatar preload...');
      
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

      Promise.all(avatarPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ ${success}/${avatars.length} avatars preloaded successfully`);
      });
    };

    // Priority 2: Preload all images (including full-size for popup)
    const preloadImages = () => {
      console.log('📸 Starting memories preload...');
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

      Promise.all(imagePromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ ${success}/${POLAROID_ROWS.flat().length} memories preloaded`);
      });
    };

    // Priority 3: Preload videos (full files for instant playback)
    const preloadVideos = () => {
      console.log('🎬 Starting video preload...');
      const videoPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'auto';  // Preload entire video
          videoEl.src = video.src;
          videoEl.onloadeddata = () => {
            console.log(`✅ Video loaded: ${video.src.split('/').pop()}`);
            resolve(true);
          };
          videoEl.onerror = () => {
            console.warn(`⚠️ Video failed: ${video.src}`);
            resolve(false);
          };
        });
      });

      Promise.all(videoPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ ${success}/${VIDEOS.length} videos preloaded`);
      });
    };

    // Start preloading IMMEDIATELY - no delay for avatars
    preloadAvatars();
    
    // Start other preloads after a tiny delay (don't block avatar loading)
    setTimeout(() => {
      preloadImages();
      preloadVideos();
    }, 300);

    setLoaded(true);
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default PreloadAssets;
