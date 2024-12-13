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
  searchUserFollowers,
  searchUserFollowings,
  isUsernameAvailable,
  sendEditProfileOtp,
} from "../controllers/user";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/search-users", authenticate, searchUsers);

router.post("/others-profile", authenticate, getOtherUserProfile);

router.post("/others-posts", authenticate, getOtherUserPosts);

router.get("/own-profile", authenticate, getOwnProfile);

router.post("/own-posts", authenticate, getOwnPosts);

router.post("/saved-posts", authenticate, getUserSavedPosts);

router.post("/follow/:targetUserId", authenticate, userFollow);

// router.post("/unfollow", authenticate, userUnfollow);

router.post("/following", authenticate, getUserFollowing);

router.post("/followers", authenticate, getUserFollowers);

router.post("/search-followers", authenticate, searchUserFollowers);

router.post("/search-following", authenticate, searchUserFollowings);

router.put("/edit-profile", authenticate, editUserProfile);

router.post("/send-edit-profile-otp", authenticate, sendEditProfileOtp);

router.post("/available-username", authenticate, isUsernameAvailable);

export default router;
