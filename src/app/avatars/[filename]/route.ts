import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Serve avatar images with aggressive caching
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Only allow webp files for security
    if (!filename.endsWith('.webp')) {
      return new NextResponse('Not found', { status: 404 });
    }
    
    const filePath = path.join(process.cwd(), 'public', 'avatars', filename);
    const file = await fs.readFile(filePath);
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving avatar:', error);
    return new NextResponse('Not found', { status: 404 });
  }
}
