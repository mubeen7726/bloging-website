import cloudinary from "./cloudinary";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export async function SingleImageUpload(
  file: File,
  folder: string = 'uploads'
): Promise<CloudinaryResponse> {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG and GIF are allowed.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
          transformation: [
            { width: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error || !result) {
            reject(new Error('Failed to upload image: ' + error?.message));
            return;
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id
          });
        }
      );

      // Handle upload stream errors
      uploadStream.on('error', (error) => {
        reject(new Error('Stream upload failed: ' + error.message));
      });

      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new Error(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}