import multer from 'multer';
import path from 'path';

// Define the base path to your mounted directory
const baseUploadDir = '/mnt/shared_images';
const applicationImageDir = path.join(baseUploadDir, 'ApplicationImage');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = baseUploadDir; // Default directory

    // Determine the specific folder based on the request path or type
    if (req.originalUrl.includes('CarLicenseDoc')) {
      uploadDir = path.join(baseUploadDir, 'CarLicenseDoc');
    } else if (req.originalUrl.includes('profilepic')) {
      uploadDir = path.join(applicationImageDir, 'ProfilePics');
    } else if (req.originalUrl.includes('resume')) {
      uploadDir = path.join(applicationImageDir, 'Resume');
    } else if (req.originalUrl.includes('mobile')) {
      uploadDir = path.join(applicationImageDir, 'MobilePics');
    }

    // Ensure the directory exists
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("Saving file as:", file.originalname);
    cb(null, file.originalname);
  }
});

// Initialize multer with storage configuration
const multipleUpload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log("Received file with fieldname:", file.fieldname);
    cb(null, true);
  }
});

export default multipleUpload;
