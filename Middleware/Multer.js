import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // You may need to install uuid package

const baseUploadDir = '/mnt/shared_images';
const carLicenseDir = path.join(baseUploadDir, 'CarLicenseDoc');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carLicenseDir); // Save in the CarLicenseDoc directory
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + uuidv4(); // Unique identifier for the file
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${uniqueName}${ext}`); // Save with unique name and original extension
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
