// multer.js
import multer from 'multer';
import path from 'path';

// Define the base upload directory
const baseUploadDir = '/mnt/shared_images';
const IDCardPath = path.join(baseUploadDir, 'IDCardPath');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IDCardPath); // Specify the directory to store files
  },
  filename: (req, file, cb) => {
    const { EmployeeId } = req.params;
    const ext = path.extname(file.originalname);
    cb(null, `${EmployeeId}${ext}`); // Save file with EmployeeId as the filename
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
