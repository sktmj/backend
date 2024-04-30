import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = './public/uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const multipleUpload = multer({ storage });
export default multipleUpload;
