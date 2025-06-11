const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createDirectories = () => {
  const dirs = ["uploads/portfolio/certifications", "uploads/portfolio/cnic"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "uploads/portfolio/cnic";
    if (file.fieldname === "certImages") {
      dest = "uploads/portfolio/certifications";
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
}).fields([
  { name: "certImages", maxCount: 5 },
  { name: "cnicImages", maxCount: 2 },
]);

module.exports = upload;
