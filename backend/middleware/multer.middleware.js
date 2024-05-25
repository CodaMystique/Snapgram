import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

const uploadMiddleware = upload.single("image");

export default uploadMiddleware;
