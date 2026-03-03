import { NextRequest, NextResponse } from 'next/server';
import { getDownloadUrl } from '@vercel/blob';

// Handle GET requests to serve videos from Blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);
    
    console.log('📹 Serving video:', decodedFilename);
    
    // Get the download URL (this handles authentication internally)
    const downloadUrl = await getDownloadUrl(`videos/${decodedFilename}`);
    
    console.log('🔗 Redirecting to:', downloadUrl.substring(0, 80) + '...');
    
    // Redirect directly to Blob storage URL
    return NextResponse.redirect(downloadUrl);
    
  } catch (error: any) {
    console.error('💥 Error serving video:', error.message);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
