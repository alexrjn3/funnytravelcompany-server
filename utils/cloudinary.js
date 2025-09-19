import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.clouldinary_api_secret, // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;
