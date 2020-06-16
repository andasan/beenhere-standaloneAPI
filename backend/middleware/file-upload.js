const multer = require('multer');
const {v4: uuidv4 } = require('uuid');

//tells us which kind of file we are dealing with
const MIME_TYPE_MAP = {
    "image/jpg" : "jpg",
    "image/jpeg": "jpeg",
    "image/gif": "gif",
    "image/png": "png"
}

//pass a config object and return an actual file uploader middleware
const fileUpload = multer({
    limit: 3000000, //bytes
    storage: multer.diskStorage({ //control how data gets stored, storage requires a multer storage driver and multer has a built-in diskstorage driver
        destination: (req,file,cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req,file,cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]; //get the extension based on the MIME TYPE
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; //if we get undefined or null, !! converts it to false
        let error = isValid ? null : new Error('Invalid mime type');
        cb(error, isValid)
    }
}); 

module.exports = fileUpload;