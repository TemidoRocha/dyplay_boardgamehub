const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  resource_type: 'raw'
});

const storage = multerStorageCloudinary({
  cloudinary,
  folder: 'jan20',
  resource_type: 'raw',
  allowedFormats: ['jpg', 'png', 'mov', 'mp4']
});

const uploader = multer({ storage });

module.exports = uploader;
