import { PrismaClient } from "@prisma/client";
import { searchUserSchema } from "../zod/user/searchUser";
import { usernameSchema } from "../zod/user/isUsernameValid";
import { editUserProfileSchema } from "../zod/user/editUserProfile";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const searchUser = async (req: Request, res: Response) => {
  try {
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
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

    res.json({
      users,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: {
        user_id: Number(userId),
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
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOwnProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers;

    const user = await prisma.user.findUnique({
      where: {
        user_id: Number(userId),
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
      res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers;

    const posts = await prisma.user.findUnique({
      where: {
        user_id: Number(userId),
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
      res.status(404).json({ message: "Posts not found" });
    }

    res.json({
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserSavedPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers;

    const posts = await prisma.user.findUnique({
      where: {
        user_id: Number(userId),
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
      res.status(404).json({ message: "Posts not found" });
    }

    res.json({
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userFollow = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)
    const { targetUserId } = req.body; // The user to be followed

    if (!targetUserId) {
      res.status(400).json({
        message: "Target user ID is required",
      });
    }

    if (userId === targetUserId) {
      res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { user_id: targetUserId },
    });

    if (!targetUser) {
      res.status(404).json({
        message: "Target user not found",
      });
    }

    // Check if the user is already following the target user
    const existingFollow = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: targetUserId,
        },
      },
    });

    if (existingFollow) {
      res.status(400).json({
        message: "You are already following this user",
      });
    }

    // Add the follow relationship
    await prisma.follower.create({
      data: {
        follower_id: Number(userId),
        following_id: targetUserId,
      },
    });

    // Increment the following count of the current user
    await prisma.user.update({
      where: { user_id: Number(userId) },
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

    res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userUnfollow = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)
    const { targetUserId } = req.body; // The user to be unfollowed

    if (!targetUserId) {
      res.status(400).json({
        message: "Target user ID is required",
      });
    }

    if (userId === targetUserId) {
      res.status(400).json({
        message: "You cannot unfollow yourself",
      });
    }

    // Check if the follow relationship exists
    const existingFollow = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: targetUserId,
        },
      },
    });

    if (!existingFollow) {
      res.status(400).json({
        message: "You are not following this user",
      });
    }

    // Remove the follow relationship
    await prisma.follower.delete({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: targetUserId,
        },
      },
    });

    // Decrement the following count of the current user
    await prisma.user.update({
      where: { user_id: Number(userId) },
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

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const isFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)
    const { targetUserId } = req.body; // The user to check

    if (!targetUserId) {
      res.status(400).json({
        message: "Target user ID is required",
      });
    }

    // Check if the user is following the target user
    const following = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: targetUserId,
        },
      },
    });

    if (following) {
      res.status(200).json({
        success: true,
        message: "You are following this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "You are not following this user",
    });
  } catch (error) {
    console.error("Error checking if user is following:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)

    // Fetch the list of users the logged-in user is following
    const following = await prisma.follower.findMany({
      where: { follower_id: Number(userId) },
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

    res.status(200).json({
      followingList,
      // following,
    });
  } catch (error) {
    console.error("Error fetching user following list:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)

    // Fetch the list of users following the logged-in user
    const followers = await prisma.follower.findMany({
      where: { following_id: Number(userId) },
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

    res.status(200).json({
      followersList,
      // followers,
    });
  } catch (error) {
    console.error("Error fetching user followers list:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userFollowersSearch = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Assuming `req.userId` holds the logged-in user's ID
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { identifier } = inputData.data;

    // Fetch followers with search applied to their username or display name
    const followers = await prisma.follower.findMany({
      where: {
        following_id: Number(userId), // Followers of the logged-in user
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

    res.json({
      result,
    });
  } catch (error) {
    console.error("Error searching user's followers:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const userFollowingSearch = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Assuming `req.userId` holds the logged-in user's ID
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { identifier } = inputData.data;

    // Fetch following with search applied to their username or display name
    const following = await prisma.follower.findMany({
      where: {
        follower_id: Number(userId), // Users followed by the logged-in user
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

    res.json({
      result,
    });
  } catch (error) {
    console.error("Error searching user's following:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)

    const inputData = editUserProfileSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { display_name, username, phone, email, app_language, state, city } =
      inputData.data;

    // Update the user's profile
    await prisma.user.update({
      where: {
        user_id: Number(userId),
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

    res.json({
      msg: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const isValidUsername = async (req: Request, res: Response) => {
  try {
    const inputData = usernameSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
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
      res.status(400).json({
        message: "Username already in use.",
      });
    }

    // If valid
    res.json({
      msg: "Valid Profile",
    });
  } catch (error) {
    console.error("Error validating username:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
