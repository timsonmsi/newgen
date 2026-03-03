import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests to serve videos from Blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);
    
    // Direct Blob URL
    const blobUrl = `https://7vvelc927xsbk0re.private.blob.vercel-storage.com/videos/${decodedFilename}`;
    
    console.log('📹 Fetching video:', decodedFilename);
    
    // Fetch from Blob with auth token
    const blobResponse = await fetch(blobUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    
    if (!blobResponse.ok) {
      console.error('❌ Blob fetch failed:', blobResponse.status, blobResponse.statusText);
      return new NextResponse(`Video not found: ${decodedFilename}`, { 
        status: blobResponse.status 
      });
    }
    
    // Get content type
    const contentType = blobResponse.headers.get('content-type') || 'video/mp4';
    
    console.log('✅ Streaming video:', decodedFilename, contentType);
    
    // Stream the video
    return new NextResponse(blobResponse.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
      },
    });
    
  } catch (error: any) {
    console.error('💥 API Error:', error.message);
    console.error('Stack:', error.stack);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
