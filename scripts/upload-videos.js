// Auto-upload videos to Vercel Blob during build
// This script checks for new videos and uploads them

require('dotenv').config({ path: '.env.local' });
const Blob = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/video-urls.json');

async function uploadNewVideos() {
  console.log('🎬 Checking for new videos to upload...\n');
  
  // Get existing uploaded videos
  let uploadedVideos = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    uploadedVideos = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  }
  
  const uploadedNames = uploadedVideos.map(v => v.original);
  
  // Get all video files in directory
  const allFiles = fs.readdirSync(VIDEOS_DIR);
  const videoFiles = allFiles.filter(f => 
    f.endsWith('.mp4') || f.endsWith('.MOV') || f.endsWith('.MOV')
  );
  
  // Find new videos
  const newVideos = videoFiles.filter(f => !uploadedNames.includes(f));
  
  if (newVideos.length === 0) {
    console.log('✅ All videos already uploaded!');
    return;
  }
  
  console.log(`📹 Found ${newVideos.length} new video(s):\n`);
  
  // Upload new videos
  for (const filename of newVideos) {
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
      console.error(`❌ Failed to upload ${filename}:`, error.message);
    }
  }

  // Save updated URLs
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uploadedVideos, null, 2));
  
  console.log(`\n🎉 Upload complete! Total videos: ${uploadedVideos.length}`);
  console.log(`📄 URLs saved to: ${OUTPUT_FILE}`);
}

uploadNewVideos().catch(console.error);
