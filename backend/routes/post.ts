import { Router } from "express";
import {
  getComments,
  getVideo,
  likePost,
  postComment,
  savePost,
  sharePost,
  showPost,
  showSinglePost,
} from "../controllers/post";

const router = Router();

router.get("/show", showPost);

router.get("/show-single", showSinglePost);

router.post("/video", getVideo);

router.get("/comment", getComments);

router.post("/comment", postComment);

router.get("/like", likePost);

router.get("/share", sharePost);

router.get("/save", savePost);

export default router;
