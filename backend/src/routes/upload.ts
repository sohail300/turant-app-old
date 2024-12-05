import { Router } from "express";
import {
  isBlocked,
  uploadArticle,
  uploadImage,
  uploadVideo,
} from "../controllers/upload";

const router = Router();

router.get("/is-blocked", isBlocked);

router.post("/article", uploadArticle);

router.post("/image", uploadImage);

router.post("/video", uploadVideo);

export default router;
