export const setup = (req, res) => {
  return res.json({ msg: "Setup" });
};

export const searchUser = (req, res) => {
  return res.json({ msg: "Search" });
};

export const getUserProfile = (req, res) => {
  return res.json({ msg: "Profile" });
};

export const getUserPosts = (req, res) => {
  return res.json({ msg: "Posts" });
};

export const getUserSavedPosts = (req, res) => {
  return res.json({ msg: "Saved Posts" });
};

export const userFollow = (req, res) => {
  return res.json({ msg: "Follow" });
};

export const userUnfollow = (req, res) => {
  return res.json({ msg: "Unfollow" });
};

export const getUserFollowing = (req, res) => {
  return res.json({ msg: "Following" });
};

export const getUserFollowers = (req, res) => {
  return res.json({ msg: "Followers" });
};

export const userSearchFollowers = (req, res) => {
  return res.json({ msg: "Search Followers" });
};

export const userSearchFollowing = (req, res) => {
  return res.json({ msg: "Search Following" });
};

export const editUserProfile = (req, res) => {
  return res.json({ msg: "Edit Profile" });
};

export const validUserProfile = (req, res) => {
  return res.json({ msg: "Valid Profile" });
};
