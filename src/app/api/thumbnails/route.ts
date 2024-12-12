// app/api/thumbnails/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import AWS from 'aws-sdk';

export async function GET(request: NextRequest) {
  try {
    // Ensure user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Configure AWS (redundant if already done in lib/s3.ts, but ensures configuration)
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();

    // Prepare S3 list objects parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: `${user.id}/`, // Scoped to user's directory
      MaxKeys: 10 // Limit to 10 most recent thumbnails
    };

    // Fetch objects from S3
    const data = await s3.listObjectsV2(params).promise();

    // Transform S3 objects to thumbnail URLs
    const thumbnails = (data.Contents || [])
      .filter(item => item.Key && !item.Key.endsWith('/')) // Exclude directory markers
      .map(item => ({
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
        createdAt: item.LastModified || new Date()
      }))
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json(thumbnails, {
      headers: { 
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    console.error('Thumbnail fetch error:', error);
    return NextResponse.json({ 
      error: "Failed to fetch thumbnails" 
    }, { status: 500 });
  }
}