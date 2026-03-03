"use client";

import { useEffect } from 'react';
import { POLAROID_ROWS, VIDEOS } from '@/components/shared/UnityPage';

// Global caches for instant access
export const avatarCache = new Map<string, string>();
export const memoryCache = new Map<string, string>();
export const videoCache = new Map<number, HTMLVideoElement>();

export function PreloadAssets() {
  useEffect(() => {
    // Priority 1: Preload avatars FIRST and cache in memory
    const preloadAvatars = () => {
      const avatars = ['alyok', 'sabinina', 'nazken', 'molya', 'zhansiko', 'oliyash', 'ardashon'];
      console.log('🎯 Starting avatar preload...');

      const avatarPromises = avatars.map(avatar => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/avatars/${avatar}.webp`;
          img.onload = () => {
            // Convert to data URL for instant in-memory access
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/webp');
              avatarCache.set(avatar, dataUrl);
              console.log(`✅ Avatar cached in memory: ${avatar}`);
            }
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
        console.log(`✅ ${success}/${avatars.length} avatars preloaded and cached`);
        
        // Priority 2: Preload video thumbnails ONLY (first frame for preview)
        preloadVideoThumbnails();
      });
    };

    // Priority 2: Preload video thumbnails (first frame for preview)
    const preloadVideoThumbnails = () => {
      console.log('🎬 Starting video thumbnail preload...');
      const thumbnailPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'metadata';
          videoEl.src = video.src;
          videoEl.muted = true;
          videoEl.onloadeddata = () => {
            console.log(`✅ Video thumbnail ready: ${video.src.split('/').pop()}`);
            // Cache the video element for instant playback
            videoCache.set(video.id, videoEl);
            resolve(true);
          };
          videoEl.onerror = () => {
            console.warn(`⚠️ Video thumbnail failed: ${video.src}`);
            resolve(false);
          };
        });
      });

      Promise.all(thumbnailPromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ ${success}/${VIDEOS.length} video thumbnails ready`);
        
        // Priority 3: Preload all memories (full images for popup)
        preloadImages();
      });
    };

    // Priority 3: Preload all images (including full-size for popup)
    const preloadImages = () => {
      console.log('📸 Starting memories preload...');
      const imagePromises = POLAROID_ROWS.flatMap(row =>
        row.map(polaroid => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = polaroid.src;
            img.onload = () => {
              // Convert to data URL for instant popup display
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
        })
      );

      Promise.all(imagePromises).then((results) => {
        const success = results.filter(r => r).length;
        console.log(`✅ ${success}/${POLAROID_ROWS.flat().length} memories preloaded and cached`);
        
        // Priority 4: Preload full videos (after photos are cached)
        preloadVideos();
      });
    };

    // Priority 4: Preload full videos (after photos are cached)
    const preloadVideos = () => {
      console.log('🎥 Starting full video preload...');
      const videoPromises = VIDEOS.map(video => {
        return new Promise((resolve) => {
          const videoEl = document.createElement('video');
          videoEl.preload = 'auto';
          videoEl.src = video.src;
          videoEl.onloadeddata = () => {
            console.log(`✅ Full video loaded: ${video.src.split('/').pop()}`);
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
        console.log(`✅ ${success}/${VIDEOS.length} full videos preloaded`);
      });
    };

    // Start the chain: Avatars → Video Thumbnails → Memories → Full Videos
    preloadAvatars();
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default PreloadAssets;
