import { Router } from "express";
import {
  editUserProfile,
  getUserFollowers,
  getUserFollowing,
  getUserPosts,
  getUserProfile,
  getOwnProfile,
  getUserSavedPosts,
  searchUser,
  userFollow,
  userFollowersSearch,
  userFollowingSearch,
  userUnfollow,
  isValidUsername,
  isFollowing,
} from "../controllers/user";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/search", authenticate, searchUser);

router.get("/profile", authenticate, getUserProfile);

router.get("/own-profile", authenticate, getOwnProfile);

router.post("/posts", authenticate, getUserPosts);

router.get("/saved-posts", authenticate, getUserSavedPosts);

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
