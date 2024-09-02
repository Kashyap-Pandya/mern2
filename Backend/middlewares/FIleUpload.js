import multer from "multer";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";

// Multer storage configuration to keep files in memory
const storage = multer.memoryStorage();

// Multer configuration
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only image files (jpeg, jpg, png)
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
});

// Middleware function to handle file upload and upload to Cloudinary
export const handleFileUpload = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // Upload buffer to Cloudinary
    const result = await uploadOnCloudinary(req.file.buffer);
    req.file.cloudinaryUrl = result.secure_url; // Attach URL to request object for further use
    next();
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({
      message: "Error uploading image to Cloudinary",
      error: error.message,
    });
  }
};

export { upload };
