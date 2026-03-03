import { NextRequest, NextResponse } from 'next/server';
import { getDownloadUrl } from '@vercel/blob';

// Handle GET requests to serve videos from Blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Decode the filename (handles spaces and special characters)
    const decodedFilename = decodeURIComponent(filename);
    
    console.log('Serving video:', decodedFilename);
    
    // Get the download URL for the video (works with private blobs)
    const downloadUrl = await getDownloadUrl(`videos/${decodedFilename}`);
    
    console.log('Redirecting to:', downloadUrl);
    
    // Redirect to the Blob download URL
    return NextResponse.redirect(downloadUrl);
  } catch (error: any) {
    console.error('Error serving video:', error.message);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
