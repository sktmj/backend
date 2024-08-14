// multerConfig.js
import multer from 'multer';
import path from 'path';

const baseUploadDir = '/mnt/shared_images';
const IDCardPath = path.join(baseUploadDir, 'IDCardPath');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IDCardPath); // Directory to store files
  },
  filename: (req, file, cb) => {
    const { EmployeeId } = req.params;
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${EmployeeId}${ext}`); // Save file with EmployeeId and original extension
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type'), false); // Reject file
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
