import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "funnytravel", // unde se salvează imaginile în Cloudinary
    format: async (req, file) => "jpg", // toate imaginile le convertim în jpg
    public_id: (req, file) => `images-${Date.now()}`, // nume unic
  },
});

const upload = multer({ storage });

export default upload;
