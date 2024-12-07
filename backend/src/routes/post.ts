import { Router } from "express";
import {
  getComments,
  getVideo,
  hasLikedPost,
  hasSavedPost,
  likePost,
  postComment,
  savePost,
  sharePost,
  showPost,
  showSinglePost,
} from "../controllers/post";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/show", showPost);

router.get("/show-single/:postId", showSinglePost);

router.get("/video/:postId", getVideo);

router.get("/comment/:postId", authenticate, getComments);

router.post("/comment/:postId", authenticate, postComment);

router.get("/like/:postId", authenticate, likePost);

router.get("/has-liked/:postId", authenticate, hasLikedPost);

router.get("/share/:postId", sharePost);

router.get("/save/:postId", authenticate, savePost);

router.get("/has-saved/:postId", authenticate, hasSavedPost);

export default router;
