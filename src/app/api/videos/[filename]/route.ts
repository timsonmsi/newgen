import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests to serve videos from Blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);
    
    console.log('📹 Requesting video:', decodedFilename);
    
    // Build the blob URL
    const blobUrl = `https://7vvelc927xsbk0re.private.blob.vercel-storage.com/videos/${decodedFilename}`;
    
    console.log('🔗 Fetching from:', blobUrl);
    
    // Fetch the video from Blob storage with the token
    const response = await fetch(blobUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    
    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Failed to fetch:', response.status, response.statusText);
      return new NextResponse(`Video not found: ${decodedFilename}`, { status: 404 });
    }
    
    console.log('✅ Streaming video:', decodedFilename);
    
    // Stream the video to the client
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Content-Length': response.headers.get('content-length') || '',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error: any) {
    console.error('💥 Error:', error.message);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
