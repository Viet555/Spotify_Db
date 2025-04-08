// const { GridFsStorage } = require('multer-gridfs-storage');
// const multer = require('multer');
// const crypto = require('crypto');
// const path = require('path');

// const mongoURI = 'mongodb://localhost:27017/spotify';

// let upload;

// const initGridFS = async () => {
//     try {
//         const storage = new GridFsStorage({
//             url: mongoURI,
//             file: (req, file) => {
//                 return new Promise((resolve, reject) => {
//                     const ext = path.extname(file.originalname).toLowerCase();
//                     const isMP3 = file.mimetype === 'audio/mpeg' || ext === '.mp3';
//                     const isImage = file.mimetype.startsWith('image/');
//                     if (!isMP3 && !isImage) {
//                         return reject(new Error('Only MP3 and image files are allowed.'));
//                     }

//                     crypto.randomBytes(16, (err, buf) => {
//                         if (err) return reject(err);
//                         const filename = buf.toString('hex') + ext;
//                         resolve({
//                             filename: filename,
//                             bucketName: 'uploads',
//                             metadata: {
//                                 originalname: file.originalname,
//                                 mimetype: file.mimetype,
//                             },
//                         });
//                     });
//                 });
//             },
//         });

//         upload = multer({ storage });
//         console.log('✅ GridFS storage initialized');
//     } catch (err) {
//         console.error('❌ Failed to initialize GridFS:', err);
//     }
// };

// module.exports = {
//     initGridFS,
//     getUpload: () => upload,
// };
