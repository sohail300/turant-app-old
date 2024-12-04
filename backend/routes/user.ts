import { Router } from "express";
import {
  editUserProfile,
  getUserFollowers,
  getUserFollowing,
  getUserPosts,
  getUserProfile,
  getUserSavedPosts,
  searchUser,
  setup,
  userFollow,
  userSearchFollowers,
  userSearchFollowing,
  userUnfollow,
  validUserProfile,
} from "../controllers/user";

const router = Router();

router.post("/setup", setup);

router.post("/search", searchUser);

router.get("/profile", getUserProfile);

router.post("/posts", getUserPosts);

router.get("/saved-posts", getUserSavedPosts);

router.get("/follow", userFollow);

router.get("/unfollow", userUnfollow);

router.get("/following", getUserFollowing);

router.get("/followers", getUserFollowers);

router.get("/search-followers", userSearchFollowers);

router.get("/search-following", userSearchFollowing);

router.put("/edit-profile", editUserProfile);

router.put("/valid-profile", validUserProfile);

export default router;
