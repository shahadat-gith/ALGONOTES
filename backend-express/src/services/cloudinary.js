import { cloudinary } from '../config/cloudinary.js';

export const uploadToCloudinary = (fileBuffer, folder = 'algonotes/users') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error(`Cloudinary Core Upload Crash: ${error.message}`);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary Core Destruction Crash: ${error.message}`);
    return {};
  }
};