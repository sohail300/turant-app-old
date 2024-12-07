import { PrismaClient } from "@prisma/client";
import { searchUserSchema } from "../zod/user/searchUser";
import { usernameSchema } from "../zod/user/isUsernameValid";
import { editUserProfileSchema } from "../zod/user/editUserProfile";

const prisma = new PrismaClient();

export const searchUser = async (req, res) => {
  try {
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { identifier } = inputData.data;

    // Search for users by username or name
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: identifier, mode: "insensitive" } },
          { display_name: { contains: identifier, mode: "insensitive" } },
        ],
      },
      select: {
        user_id: true,
        username: true,
        display_name: true,
        email: true,
        phone: true,
        profile_url: true,
      },
    });

    return res.json({
      users,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        user_id: true,
        username: true,
        display_name: true,
        follower_count: true,
        following_count: true,
        image: true,
        posts: {
          select: {
            user_id: true,
            post_id: true,
            thumbnail: true,
            title: true,
            snippet: true,
            likes: true,
            comments: true,
            shares: true,
            created_at: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOwnProfile = async (req, res) => {
  try {
    const { userId } = req;

    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        user_id: true,
        username: true,
        display_name: true,
        follower_count: true,
        following_count: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req;

    const posts = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        user_id: true,
        posts: {
          select: {
            user_id: true,
            post_id: true,
            thumbnail: true,
            title: true,
            snippet: true,
            likes: true,
            comments: true,
            shares: true,
            created_at: true,
          },
        },
      },
    });

    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }

    return res.json({
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserSavedPosts = async (req, res) => {
  try {
    const { userId } = req;

    const posts = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        user_id: true,
        saved_posts: {
          select: {
            user_id: true,
            post_id: true,
            post: {
              select: {
                thumbnail: true,
                title: true,
                snippet: true,
                likes: true,
                comments: true,
                shares: true,
                created_at: true,
              },
            },
          },
        },
      },
    });

    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }

    return res.json({
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userFollow = async (req, res) => {
  try {
    const { userId } = req; // Logged-in user's ID (from middleware/auth)
    const { targetUserId } = req.body; // The user to be followed

    if (!targetUserId) {
      return res.status(400).json({
        message: "Target user ID is required",
      });
    }

    if (userId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { user_id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "Target user not found",
      });
    }

    // Check if the user is already following the target user
    const existingFollow = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "You are already following this user",
      });
    }

    // Add the follow relationship
    await prisma.follower.create({
      data: {
        follower_id: userId,
        following_id: targetUserId,
      },
    });

    // Increment the following count of the current user
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        following_count: { increment: 1 },
      },
    });

    // Increment the follower count of the target user
    await prisma.user.update({
      where: { user_id: targetUserId },
      data: {
        follower_count: { increment: 1 },
      },
    });

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userUnfollow = async (req, res) => {
  try {
    const { userId } = req; // Logged-in user's ID (from middleware/auth)
    const { targetUserId } = req.body; // The user to be unfollowed

    if (!targetUserId) {
      return res.status(400).json({
        message: "Target user ID is required",
      });
    }

    if (userId === targetUserId) {
      return res.status(400).json({
        message: "You cannot unfollow yourself",
      });
    }

    // Check if the follow relationship exists
    const existingFollow = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: targetUserId,
        },
      },
    });

    if (!existingFollow) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    // Remove the follow relationship
    await prisma.follower.delete({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: targetUserId,
        },
      },
    });

    // Decrement the following count of the current user
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        following_count: { decrement: 1 },
      },
    });

    // Decrement the follower count of the target user
    await prisma.user.update({
      where: { user_id: targetUserId },
      data: {
        follower_count: { decrement: 1 },
      },
    });

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const isFollowing = async (req, res) => {
  try {
    const { userId } = req; // Logged-in user's ID (from middleware/auth)
    const { targetUserId } = req.body; // The user to check

    if (!targetUserId) {
      return res.status(400).json({
        message: "Target user ID is required",
      });
    }

    // Check if the user is following the target user
    const following = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: targetUserId,
        },
      },
    });

    if (following) {
      return res.status(200).json({
        success: true,
        message: "You are following this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "You are not following this user",
    });
  } catch (error) {
    console.error("Error checking if user is following:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserFollowing = async (req, res) => {
  try {
    const { userId } = req; // Logged-in user's ID (from middleware/auth)

    // Fetch the list of users the logged-in user is following
    const following = await prisma.follower.findMany({
      where: { follower_id: userId },
      select: {
        following: {
          select: {
            user_id: true,
            username: true,
            display_name: true,
            image: true,
          },
        },
      },
    });

    // Transform the response to return an array of followed users
    const followingList = following.map((item) => item.following);

    return res.status(200).json({
      followingList,
      // following,
    });
  } catch (error) {
    console.error("Error fetching user following list:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req; // Logged-in user's ID (from middleware/auth)

    // Fetch the list of users following the logged-in user
    const followers = await prisma.follower.findMany({
      where: { following_id: userId },
      select: {
        follower: {
          select: {
            user_id: true,
            username: true,
            display_name: true,
            image: true,
          },
        },
      },
    });

    // Transform the response to return an array of follower users
    const followersList = followers.map((item) => item.follower);

    return res.status(200).json({
      followersList,
      // followers,
    });
  } catch (error) {
    console.error("Error fetching user followers list:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userFollowersSearch = async (req, res) => {
  try {
    const { userId } = req; // Assuming `req.userId` holds the logged-in user's ID
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { identifier } = inputData.data;

    // Fetch followers with search applied to their username or display name
    const followers = await prisma.follower.findMany({
      where: {
        following_id: userId, // Followers of the logged-in user
        follower: {
          OR: [
            { username: { contains: identifier, mode: "insensitive" } },
            { display_name: { contains: identifier, mode: "insensitive" } },
          ],
        },
      },
      select: {
        follower: {
          select: {
            user_id: true,
            username: true,
            display_name: true,
            image: true,
          },
        },
      },
    });

    // Extract follower details from the nested object
    const result = followers.map((f) => f.follower);

    return res.json({
      result,
    });
  } catch (error) {
    console.error("Error searching user's followers:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userFollowingSearch = async (req, res) => {
  try {
    const { userId } = req; // Assuming `req.userId` holds the logged-in user's ID
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { identifier } = inputData.data;

    // Fetch following with search applied to their username or display name
    const following = await prisma.follower.findMany({
      where: {
        follower_id: userId, // Users followed by the logged-in user
        following: {
          OR: [
            { username: { contains: identifier, mode: "insensitive" } },
            { display_name: { contains: identifier, mode: "insensitive" } },
          ],
        },
      },
      select: {
        following: {
          select: {
            user_id: true,
            username: true,
            display_name: true,
            email: true,
            phone: true,
            profile_url: true,
          },
        },
      },
    });

    // Extract following details from the nested object
    const result = following.map((f) => f.following);

    return res.json({
      result,
    });
  } catch (error) {
    console.error("Error searching user's following:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editUserProfile = async (req, res) => {
  try {
    const { userId } = req; // Logged-in user's ID (from middleware/auth)

    const inputData = editUserProfileSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { display_name, username, phone, email, app_language, state, city } =
      inputData.data;

    // Update the user's profile
    await prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        display_name,
        username,
        email,
        phone,
        app_language,
        state,
        city,
      },
    });

    return res.json({
      msg: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const isValidUsername = async (req, res) => {
  try {
    const inputData = usernameSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { username } = inputData.data;

    // Check if username is already taken
    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already in use.",
      });
    }

    // If valid
    return res.json({
      msg: "Valid Profile",
    });
  } catch (error) {
    console.error("Error validating username:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
