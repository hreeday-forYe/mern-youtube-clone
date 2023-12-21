import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary config helps us to upload and delete files
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file on the cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    // response holds information about the file that has been uploaded
    // File has been uploaded successfully
    console.log('File is uploaded on cloudinary', response.url);

    return response;
  } catch (error) {
    // Cleaning the file from the server
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export {uploadOnCloudinary}