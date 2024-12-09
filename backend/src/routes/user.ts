import { Router } from "express";
import {
  editUserProfile,
  getUserFollowers,
  getUserFollowing,
  getOtherUserProfile,
  getOtherUserPosts,
  getOwnProfile,
  getOwnPosts,
  getUserSavedPosts,
  searchUsers,
  userFollow,
  userUnfollow,
  userFollowersSearch,
  userFollowingSearch,
  isValidUsername,
  isFollowing,
} from "../controllers/user";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/search-users", authenticate, searchUsers);

router.post("/others-profile", authenticate, getOtherUserProfile);

router.post("/others-posts", authenticate, getOtherUserPosts);

router.get("/own-profile", authenticate, getOwnProfile);

router.post("/own-posts", authenticate, getOwnPosts);

router.post("/saved-posts", authenticate, getUserSavedPosts);

router.get("/follow", authenticate, userFollow);

router.get("/unfollow", authenticate, userUnfollow);

router.get("is-following", authenticate, isFollowing);

router.get("/following", authenticate, getUserFollowing);

router.get("/followers", authenticate, getUserFollowers);

router.get("/search-followers", authenticate, userFollowersSearch);

router.get("/search-following", authenticate, userFollowingSearch);

router.put("/edit-profile", authenticate, editUserProfile);

router.put("/valid-profile", authenticate, isValidUsername);

export default router;
