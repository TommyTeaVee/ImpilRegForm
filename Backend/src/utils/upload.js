const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;
const s3 = new S3Client({ region: process.env.AWS_REGION });

// Helper to normalize S3 URL → CDN URL
const toCDN = (s3Url) => {
  if (!s3Url) return null;
  return s3Url.replace(/^https?:\/\/[^/]+/, CLOUDFRONT_URL);
};

const storage = multerS3({
  s3,
  bucket: process.env.S3_BUCKET,
 // acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const key = `registrations/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    cb(null, key);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB per file
});

// Patch multer so every file returns CDN instead of raw S3 URL
upload._handleFile = ((orig) => (req, file, cb) => {
  orig.call(upload, req, file, (err, info) => {
    if (info && info.location) {
      info.location = toCDN(info.location);
    }
    cb(err, info);
  });
})(upload._handleFile);

module.exports = { upload, toCDN };
