import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Storage configuration for Multer
const baseUploadDir = '/mnt/shared_images';
const IDCardPath = path.join(baseUploadDir, 'IDCardPath');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IDCardPath); // Save files to the specified directory
  },
  filename: (req, file, cb) => {
    const { EmployeeId } = req.params;
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${EmployeeId}${ext}`); // Save with EmployeeId as filename
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error('Invalid file type'), false); // Reject non-image files
  }
};


const upload = multer({ 
  storage,
  fileFilter,
});

export default upload;
