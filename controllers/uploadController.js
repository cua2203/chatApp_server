const multer = require("multer");
const cloudinary = require('../config/config.cloudinary')
// const cloudinary = require("../config/config.cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// Cấu hình Multer với Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my_images", // Tên thư mục trên Cloudinary
    allowedFormats: ["jpg", "png"],
  },
});

const upload = multer({ storage });

const uploadSingle = (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    res.status(200).json({
      message: "Image uploaded successfully",
      url: file.path, // URL của ảnh trên Cloudinary
      public_id: file.filename, // public_id của ảnh
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
};

module.exports = {uploadSingle, upload};
