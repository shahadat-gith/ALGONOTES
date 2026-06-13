import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

const uploadImageToCloudinary = (file, folder = "algonotes") => {
  return new Promise((resolve, reject) => {
    // 1. Create the Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          // Explicitly reject the promise so your controller catch block triggers
          return reject(error); 
        }
        // Explicitly resolve with the successful upload result metadata
        resolve(result);
      }
    );

    // 2. Convert file buffer into a readable stream and pipe it to Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export default uploadImageToCloudinary;