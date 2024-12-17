import { Router } from "express";
import {
  getComments,
  hasLikedSavedFollowingPost,
  likePost,
  postComment,
  savePost,
  sharePost,
  showPosts,
  showImagePost,
  showVideoPost,
  showSinglePost,
} from "../controllers/post";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/show-posts", showPosts);

router.get("/post/single-post/:postId", showSinglePost);

router.get("/single-image/:postId", showImagePost);

router.get("/video", showImagePost);

router.get("/single-video/:postId", showVideoPost);

router.get("/comment", authenticate, getComments);

router.post("/comment/:postId", authenticate, postComment);

router.get("/like/:postId", authenticate, likePost);

router.get(
  "/has-liked-saved-following/",
  authenticate,
  hasLikedSavedFollowingPost
);

router.get("/share/:postId", authenticate, sharePost);

router.get("/save/:postId", authenticate, savePost);

export default router;
