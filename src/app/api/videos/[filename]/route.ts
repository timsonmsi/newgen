import { NextRequest } from 'next/server';
import { get } from '@vercel/blob';

// Handle GET requests to serve videos from Blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Decode the filename (handles spaces and special characters)
    const decodedFilename = decodeURIComponent(filename);
    
    // Get the video from Blob storage
    const result = await get(`videos/${decodedFilename}`, {
      access: 'private',
    });
    
    if (!result || !result.blob) {
      return new Response('Video not found', { status: 404 });
    }
    
    // Return the video stream with proper headers
    return new Response(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType || 'video/mp4',
        'Content-Length': result.blob.size?.toString() || '',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving video:', error);
    return new Response('Video not found', { status: 404 });
  }
}
