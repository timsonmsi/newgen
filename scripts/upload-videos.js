// Upload videos to Vercel Blob
// Run with: node scripts/upload-videos.js

require('dotenv').config({ path: '.env.local' });
const Blob = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const VIDEO_FILES = [
  'DJI_20240330191842_0045_D.mp4',
  'DJI_20240330191842_0045_D_2.mp4',
  'IMG_1710.MP4',
  'IMG_1961.MOV',
  'IMG_3179.MP4',
  'IMG_3180.MP4',
  'IMG_6853.MP4',
  'IMG_8345.MOV',
  'IMG_8346.MOV',
  'IMG_8347.MOV',
  'IMG_8348.MOV',
  'IMG_8350.MOV',
  'IMG_8351.MOV',
  'IMG_8352.MOV',
  'IMG_8542.MOV',
];

async function uploadVideos() {
  console.log('🎬 Starting video upload to Vercel Blob...\n');
  
  const uploadedVideos = [];

  for (const filename of VIDEO_FILES) {
    const filePath = path.join(VIDEOS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      continue;
    }

    try {
      console.log(`⏳ Uploading: ${filename}...`);
      
      const blobData = await Blob.put(
        `videos/${filename}`,
        fs.createReadStream(filePath),
        {
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: true,
        }
      );

      console.log(`✅ Uploaded: ${filename}`);
      console.log(`   URL: ${blobData.url}\n`);
      
      uploadedVideos.push({
        original: filename,
        url: blobData.url,
      });
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
    }
  }

  // Save uploaded URLs to a JSON file
  const outputPath = path.join(__dirname, '../src/lib/video-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedVideos, null, 2));
  
  console.log('\n🎉 Upload complete!');
  console.log(`📄 Video URLs saved to: ${outputPath}`);
  console.log('\n📋 URLs:', JSON.stringify(uploadedVideos.map(v => v.url), null, 2));
}

uploadVideos().catch(console.error);
