const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION });

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      const key = `registrations/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      cb(null, key);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

module.exports = { upload };
