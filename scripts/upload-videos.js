// Force re-upload all videos to Vercel Blob
require('dotenv').config({ path: '.env.local' });
const Blob = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/video-urls.json');

async function uploadAllVideos() {
  console.log('🎬 Force uploading ALL videos to Vercel Blob...\n');
  
  const videoFiles = fs.readdirSync(VIDEOS_DIR).filter(f => 
    f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.mov')
  );
  
  const uploadedVideos = [];
  
  for (const filename of videoFiles) {
    const filePath = path.join(VIDEOS_DIR, filename);
    
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
      console.error(`❌ Failed: ${filename} - ${error.message}\n`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uploadedVideos, null, 2));
  
  console.log(`\n🎉 Complete! ${uploadedVideos.length}/${videoFiles.length} videos uploaded`);
  console.log(`📄 Saved to: ${OUTPUT_FILE}`);
}

uploadAllVideos().catch(console.error);
