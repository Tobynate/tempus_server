
const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = function (req, file, cb) {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg, and .jpeg file formats allowed'));
    }
};

const fileSizeLimit = 2 * 1024 * 1024; // 2MB


const fileSizeError = new multer.MulterError('LIMIT_FILE_SIZE', 'File size too large.');
fileSizeError.message = `File size limit is 2MB.`;

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit },
    onError: function (err, next) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                next(fileSizeError);
            } else {
                next(err);
            }
        } else {
            next(err);
        }
    }
});

// file size formatter
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
    );
};

module.exports = { upload, fileSizeFormatter };

