import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Determine __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the directories exist
const profilePicDir = join(__dirname, '../public/uploads');
const mobilePicDir = join(__dirname, '../public/mobilepics');
const resumeDir = join(__dirname, '../public/resumes');
const CarLicenseDocDir = join(__dirname, '../public/license');

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory ${dir} created`);
  } else {
    console.log(`Directory ${dir} already exists`);
  }
};

ensureDirExists(profilePicDir);
ensureDirExists(mobilePicDir);
ensureDirExists(resumeDir);
ensureDirExists(CarLicenseDocDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = profilePicDir; // Default directory
    if (req.originalUrl.includes('mobilepic')) {
      uploadDir = mobilePicDir;
    } else if (req.originalUrl.includes('resume')) {
      uploadDir = resumeDir;
    } else if (req.originalUrl.includes('CarLicenseDoc')) {
      uploadDir = CarLicenseDocDir;
    }
    console.log("Saving file to:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("Saving file as:", file.originalname);
    cb(null, file.originalname);
  }
});

const multipleUpload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log("Received file with fieldname:", file.fieldname);
    cb(null, true);
  }
});

export default multipleUpload;
 