// Upload videos to Cloudinary
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure with your Cloudinary credentials
cloudinary.config({
  cloud_name: 'dfigirqsd',
  api_key: '677453738578897',
  api_secret: 'aLIlSJS3gHPAnE-YG0aIMety01Q'
});

const VIDEOS_DIR = path.join(__dirname, '../public/videos');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/cloudinary-videos.json');

async function uploadVideos() {
  console.log('🎬 Uploading videos to Cloudinary...\n');
  
  const videoFiles = fs.readdirSync(VIDEOS_DIR).filter(f => 
    f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.mov')
  );
  
  const uploadedVideos = [];
  
  for (const filename of videoFiles) {
    const filePath = path.join(VIDEOS_DIR, filename);
    const publicId = `newgen/${path.basename(filename, path.extname(filename))}`;
    
    try {
      console.log(`⏳ Uploading: ${filename}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: publicId,
        folder: 'newgen-videos',
      });

      console.log(`✅ Uploaded: ${filename}`);
      console.log(`   URL: ${result.secure_url}`);
      console.log(`   Thumbnail: ${cloudinary.url(publicId, { 
        resource_type: 'video', 
        transformation: [{ width: 280, height: 200, crop: 'fill' }] 
      })}\n`);
      
      uploadedVideos.push({
        original: filename,
        url: result.secure_url,
        thumbnail: cloudinary.url(publicId, { 
          resource_type: 'video',
          transformation: [
            { width: 280, height: 200, crop: 'fill' },
            { fetch_format: 'jpg', quality: 'auto' }
          ]
        }),
      });
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}\n`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uploadedVideos, null, 2));
  
  console.log(`\n🎉 Complete! ${uploadedVideos.length}/${videoFiles.length} videos uploaded`);
  console.log(`📄 Saved to: ${OUTPUT_FILE}`);
  console.log('\n📋 Next steps:');
  console.log('   1. Update cloudinary config with your credentials');
  console.log('   2. Run: node scripts/upload-to-cloudinary.js');
  console.log('   3. Update UnityPage.tsx to use Cloudinary URLs');
}

uploadVideos().catch(console.error);
