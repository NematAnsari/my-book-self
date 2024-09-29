import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_SECRET_KEY,
});

const uploadOnCloudnary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return;
    }
    // upload the file on cloudnary
    const uploadFileResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfully
    console.log("file is uploaded on cloudnary ", uploadFileResult);
    return uploadFileResult;
  } catch (error) {
    // removed the locally saved file as upload operation got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

