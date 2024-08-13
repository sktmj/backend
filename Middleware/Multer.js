import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // You may need to install uuid package

const baseUploadDir = '/mnt/shared_images';
const LeaveImageDir = path.join(baseUploadDir, 'LeaveImage');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, LeaveImageDir); // Save in the LeaveImage directory
  },
  filename: (req, file, cb) => {
    const { EmployeeId } = req.params;
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('-'); // Format date as dd-mm-yyyy
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${EmployeeId}-${formattedDate}${ext}`); // Save with EmployeeId and formatted date
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
