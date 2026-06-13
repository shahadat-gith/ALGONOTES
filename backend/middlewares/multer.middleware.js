import multer from "multer";

// Store file in memory as a Buffer stream for Cloudinary service compatibility
const storage = multer.memoryStorage();

// Validate file types before accepting upload stream
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    // Creating a standard error object
    const error = new Error("Validation Error: Only image files (.jpg, .jpeg, .png, etc.) are allowed.");
    error.statusCode = 400; // Explicit bad request status code
    cb(error, false);
  }
};

const limits = {
  fileSize: 15 * 1024 * 1024, // 15 MB max file limit
};

const upload = multer({ storage, fileFilter, limits });

export default upload;