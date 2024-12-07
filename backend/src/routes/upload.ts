import { Router } from "express";
import {
  isBlocked,
  uploadArticle,
  uploadImage,
  uploadVideo,
} from "../controllers/upload";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/is-blocked", authenticate, isBlocked);

router.post("/article", authenticate, uploadArticle);

router.post("/image", authenticate, uploadImage);

router.post("/video", authenticate, uploadVideo);

export default router;
