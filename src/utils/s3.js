const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check if AWS_BUCKET_NAME exists
if (!process.env.AWS_BUCKET_NAME) {
  console.log("⚠️ S3 not configured. Using local upload folder.");
  const uploadDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

  module.exports = multer({ storage });
} else {
  const AWS = require("aws-sdk");
  const multerS3 = require("multer-s3");
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  module.exports = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, `products/${Date.now()}_${file.originalname}`);
      },
    }),
  });
}
