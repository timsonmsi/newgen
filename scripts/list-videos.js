// List all videos in Blob storage
require('dotenv').config({ path: '.env.local' });
const { list } = require('@vercel/blob');

async function listVideos() {
  try {
    console.log('📋 Listing all videos in Blob storage...\n');
    
    const result = await list({ prefix: 'videos/' });
    
    console.log(`Found ${result.blobs.length} videos:\n`);
    
    result.blobs.forEach(blob => {
      console.log(`✅ ${blob.pathname} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`   URL: ${blob.url}`);
      console.log(`   Uploaded: ${blob.uploadedAt}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listVideos();
