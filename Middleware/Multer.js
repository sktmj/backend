import multer from 'multer';
import path from 'path';

const baseUploadDir = '/mnt/shared_images';
const carLicenseDir = path.join(baseUploadDir, 'CarLicenseDoc');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carLicenseDir); // Save in the CarLicenseDoc directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const multipleUpload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export default multipleUpload;
