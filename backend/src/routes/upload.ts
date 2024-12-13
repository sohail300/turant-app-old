import { Router } from "express";
import {
  isBlockedHandler,
  uploadArticle,
  uploadImage,
  uploadVideo,
} from "../controllers/upload";
import { authenticate } from "../middlewares/authenticate";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.get("/is-blocked", authenticate, isBlockedHandler);

router.post("/article", authenticate, uploadArticle);

router.post("/image", authenticate, upload.array("image"), uploadImage);

router.post("/video", authenticate, upload.single("video"), uploadVideo);

export default router;
