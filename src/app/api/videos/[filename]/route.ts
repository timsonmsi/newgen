import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests to serve videos from Blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Decode the filename
    const decodedFilename = decodeURIComponent(filename);
    
    console.log('Serving video:', decodedFilename);
    
    // Build the blob URL
    const blobUrl = `https://7vvelc927xsbk0re.private.blob.vercel-storage.com/videos/${decodedFilename}`;
    
    // Fetch the video from Blob storage with the token
    const response = await fetch(blobUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch video:', response.status, response.statusText);
      return new NextResponse('Video not found', { status: 404 });
    }
    
    // Get the content type
    const contentType = response.headers.get('content-type') || 'video/mp4';
    
    console.log('Streaming video:', decodedFilename, 'Type:', contentType);
    
    // Stream the video to the client
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': response.headers.get('content-length') || '',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error: any) {
    console.error('Error serving video:', error.message);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
