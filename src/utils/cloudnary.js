import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET_KEY, 
});

const uploadOnCloudnary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    // Upload the file to Cloudinary
    const uploadFileResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully
    // console.log("File uploaded to Cloudinary:", uploadFileResult);
    return uploadFileResult;
  } catch (error) {
    console.error("Upload failed:", error.message); 
    try {
      await fs.unlink(localFilePath); 
      console.log("Local file deleted after failed upload.");
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError.message);
    }
    return null;
  }
};

export { uploadOnCloudnary };
