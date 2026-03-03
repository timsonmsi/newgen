"use client";

import { useEffect } from 'react';
import { POLAROID_ROWS, VIDEOS } from '@/components/shared/UnityPage';

// Global caches for instant access
export const avatarCache = new Map<string, string>();
export const memoryCache = new Map<string, string>();

export function PreloadAssets() {
  useEffect(() => {
    // STEP 1: Avatars preload and cache
    const step1_PreloadAvatars = () => {
      console.log('🎯 STEP 1: Avatars preload and cache...');
      const avatars = ['alyok', 'sabinina', 'nazken', 'molya', 'zhansiko', 'oliyash', 'ardashon'];
      
      const avatarPromises = avatars.map(avatar => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/avatars/${avatar}.webp`;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/webp');
              avatarCache.set(avatar, dataUrl);
            }
            resolve(true);
          };
          img.onerror = () => resolve(false);
        });
      });

      Promise.all(avatarPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ STEP 2: ${success}/${avatars.length} avatars cached`);
        
        // STEP 3: Memories start preloading
        step3_PreloadMemories();
      });
    };

    // STEP 3: Memories start preloading
    const step3_PreloadMemories = () => {
      console.log('📸 STEP 3: Memories start preloading...');
      const allMemories = POLAROID_ROWS.flat();
      
      const memoryPromises = allMemories.map(polaroid => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = polaroid.src;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              memoryCache.set(polaroid.src, dataUrl);
            }
            resolve(true);
          };
          img.onerror = () => resolve(false);
        });
      });

      Promise.all(memoryPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ STEP 4: ${success}/${allMemories.length} memories cached`);
        
        // STEP 5: Video previews start loading
        step5_PreloadVideoPreviews();
      });
    };

    // STEP 5: Video previews start loading
    const step5_PreloadVideoPreviews = () => {
      console.log('🎬 STEP 5: Video previews start loading...');
      
      const previewPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'metadata';
          videoEl.src = video.src;
          videoEl.muted = true;
          videoEl.onloadeddata = () => {
            console.log(`   ✅ Preview: ${video.src.split('/').pop()}`);
            resolve(true);
          };
          videoEl.onerror = () => {
            console.warn(`   ⚠️ Preview failed: ${video.src.split('/').pop()}`);
            resolve(false);
          };
        });
      });

      Promise.all(previewPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ STEP 6: ${success}/${VIDEOS.length} video previews loaded`);
        
        // STEP 7: Full videos are being cached
        step7_PreloadFullVideos();
      });
    };

    // STEP 7: Full videos are being cached
    const step7_PreloadFullVideos = () => {
      console.log('🎥 STEP 7: Full videos are being cached...');
      
      const videoPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'auto';
          videoEl.src = video.src;
          videoEl.onloadeddata = () => {
            console.log(`   ✅ Full: ${video.src.split('/').pop()}`);
            resolve(true);
          };
          videoEl.onerror = () => {
            console.warn(`   ⚠️ Full failed: ${video.src.split('/').pop()}`);
            resolve(false);
          };
        });
      });

      Promise.all(videoPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ STEP 8: ${success}/${VIDEOS.length} full videos cached`);
        console.log('🎉 All assets preloaded!\n');
      });
    };

    // Start the sequence
    step1_PreloadAvatars();
  }, []);

  return null;
}

export default PreloadAssets;
