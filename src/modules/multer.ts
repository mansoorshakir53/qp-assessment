/** import packages [start] */
import path from 'path';
import multer from 'multer';
import config from 'config';
/** import packages [end] */

// Configure storage engine and filename
const storage = multer.diskStorage({
    destination: path.resolve(config.get<string>(`ExternalServer.publicFolderPath`), 'images'),
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images only! (jpeg, jpg, png, gif)'));
    }
}

// Initialize upload middleware and add file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB file size limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

export default upload;
