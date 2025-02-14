import { NextResponse } from 'next/server';
import { list, uploadData } from 'aws-amplify/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await list({
      path: 'blog-images/',
      options: {
        listAll: true,
      }
    });
    
    const map = result.items.map((item) => ({
      path: item.path,
      contentType: item.contentType,
      contentLength: item.size,
      eTag: item.eTag,
      lastModified: item.lastModified,
    }));

    return NextResponse.json(map);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name.split(/\.\w+$/)[0];
    const fileExtension = file.name.split('.').pop();
    const key = `blog-images/${fileName}.${fileExtension}`;

    const result = await uploadData({
      key,
      data: buffer,
      options: {
        contentType: file.type,
        metadata: {
          uploadedAt: new Date().toISOString()
        }
      }
    }).result;

    return NextResponse.json({
      path: key,
      contentType: file.type,
      contentLength: buffer.length,
      eTag: result.eTag,
      lastModified: new Date(),
      metadata: result.metadata || {}
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}