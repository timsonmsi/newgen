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
        
        // STEP 3: Music start preloading
        step3_PreloadMusic();
      });
    };

    // STEP 3: Music start preloading
    const step3_PreloadMusic = () => {
      console.log('🎵 STEP 3: Music start preloading...');
      
      const musicFiles = [
        '/music/Ninety One - Aiyptama.mp3',
        '/music/BTS - I Need U (Piano).mp3'
      ];
      
      const musicPromises = musicFiles.map(src => {
        return new Promise((resolve) => {
          const audio = new Audio();
          audio.src = src;
          audio.preload = 'auto';
          audio.oncanplaythrough = () => {
            console.log(`   ✅ Music: ${src.split('/').pop()}`);
            resolve(true);
          };
          audio.onerror = () => {
            console.warn(`   ⚠️ Music failed: ${src.split('/').pop()}`);
            resolve(false);
          };
          audio.load();
        });
      });

      Promise.all(musicPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ STEP 4: ${success}/${musicFiles.length} music tracks cached`);
        
        // STEP 5: Memories start preloading
        step5_PreloadMemories();
      });
    };

    // STEP 5: Memories start preloading
    const step5_PreloadMemories = () => {
      console.log('📸 STEP 5: Memories start preloading...');
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
        console.log(`✅ STEP 6: ${success}/${allMemories.length} memories cached`);
        
        // STEP 7: Video previews start loading
        step7_PreloadVideoPreviews();
      });
    };

    // STEP 7: Video previews start loading
    const step7_PreloadVideoPreviews = () => {
      console.log('🎬 STEP 7: Video previews start loading...');
      
      const previewPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'metadata';  // Only load first frame, not full video
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
        console.log(`✅ STEP 8: ${success}/${VIDEOS.length} video previews loaded`);
        console.log('🎉 All assets preloaded! (Videos stream on-demand)\n');
      });
    };

    // Start the sequence
    step1_PreloadAvatars();
  }, []);

  return null;
}

export default PreloadAssets;
