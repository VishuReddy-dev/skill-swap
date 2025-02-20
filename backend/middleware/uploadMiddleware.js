import multer from "multer";
import path from "path";

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|avif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Export Multer Middleware
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter,
});
