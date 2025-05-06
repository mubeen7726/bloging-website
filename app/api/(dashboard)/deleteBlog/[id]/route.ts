import { v2 as cloudinary } from 'cloudinary';
import Post from '@/models/PostArtical';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/DBconnect';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { id } = params;

    // 🔍 Parse body for imagePublicId (in case it’s sent from client)
    let imagePublicId = '';
    try {
      const body = await req.json();
      imagePublicId = body.imagePublicId;
    } catch {
      console.warn('No body provided or failed to parse JSON.');
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const publicIdToDelete = imagePublicId || post.imagePublicId;

    console.log('Public ID to delete:', publicIdToDelete);

    // ✅ Delete from Cloudinary
    if (publicIdToDelete) {
      try {
        const result = await cloudinary.uploader.destroy(publicIdToDelete);
        console.log('Cloudinary delete result:', result);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
      }
    }

    // ✅ Delete post from MongoDB
    await Post.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Post and image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
