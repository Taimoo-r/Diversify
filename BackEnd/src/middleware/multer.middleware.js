import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the directory path
const uploadDir = 'uploads/resumes';

// Check if directory exists, create if it doesn't
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Set destination for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept all file formats
        cb(null, true);
    }
});
