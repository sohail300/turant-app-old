import { PrismaClient } from "@prisma/client";
import { searchUserSchema } from "../zod/user/searchUser";
import { usernameSchema } from "../zod/user/isUsernameValid";
import { editUserProfileSchema } from "../zod/user/editUserProfile";
import { Request, Response } from "express";
import { paginationSchema } from "../zod/user/pagination";
import bcrypt from "bcrypt";
import { sendEditProfileOtpSchema } from "../zod/user/sendEditProfileOtp";
import otpGenerator from "otp-generator";
import path from "path";
import fs from "fs";
import { uploadToS3 } from "../utils/uploadToS3";

const prisma = new PrismaClient();

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { identifier, limit, offset } = inputData.data;

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
        image: true,
      },
      take: limit,
      skip: offset,
    });

    // Search for users by username or name
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { username: { contains: identifier, mode: "insensitive" } },
          { display_name: { contains: identifier, mode: "insensitive" } },
        ],
      },
    });

    res.json({
      users,
      totalUsers,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOtherUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const loggedInUserId = req.headers.userId;

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

    // See if the user is followed by the logged in user
    const isFollowing = await prisma.follower.findFirst({
      where: {
        follower_id: Number(loggedInUserId),
        following_id: Number(userId),
      },
    });

    let isFollowingBoolean;

    if (isFollowing) {
      isFollowingBoolean = true;
    } else {
      isFollowingBoolean = false;
    }

    res.json({
      user,
      isFollowing: isFollowingBoolean,
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
    console.log(userId);

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
        phone: true,
        email: true,
        verified: true,
      },
    });

    console.log(user);

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

export const getOtherUserPosts = async (req: Request, res: Response) => {
  try {
    const inputData = paginationSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { limit, offset } = inputData.data;

    const { userId } = req.body;

    const posts = await prisma.user.findMany({
      where: {
        user_id: Number(userId),
      },
      select: {
        posts: {
          select: {
            post_id: true,
            type: true,
            title: true,
            snippet: true,
            likes: true,
            comments: true,
            shares: true,
            video_views: true,
            created_at: true,
            thumbnail: true,
            user: {
              select: {
                user_id: true,
                display_name: true,
                image: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
    });

    if (!posts) {
      res.status(404).json({ message: "Posts not found" });
      return;
    }

    const totalPosts = await prisma.post.count({
      where: {
        user_id: Number(userId),
      },
    });

    res.json({
      posts,
      totalPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getOwnPosts = async (req: Request, res: Response) => {
  try {
    const inputData = paginationSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { limit, offset } = inputData.data;

    const { userId } = req.headers;

    const posts = await prisma.user.findMany({
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
            type: true,
            video_views: true, // Directly select the scalar field
            user: {
              select: {
                user_id: true,
                display_name: true,
                image: true,
              },
            },
            post_likes: {
              where: { user_id: Number(userId) }, // Check if the user has liked the post
              select: { like_id: true },
            },
            saved_posts: {
              where: { user_id: Number(userId) }, // Check if the user has saved the post
              select: { saved_post_id: true },
            },
          },
        },
      },
      take: limit,
      skip: offset,
    });

    if (!posts) {
      res.status(404).json({ message: "Posts not found" });
    }

    const formattedPosts = posts.map((user) => ({
      user_id: user.user_id,
      posts: user.posts.map((post) => ({
        ...post,
        liked: post.post_likes.length > 0, // True if the user has liked the post
        saved: post.saved_posts.length > 0, // True if the user has saved the post
      })),
    }));

    const totalPosts = await prisma.post.count({
      where: {
        user_id: Number(userId),
      },
    });

    res.json({
      formattedPosts,
      totalPosts,
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
    const inputData = paginationSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { limit, offset } = inputData.data;

    const { userId } = req.headers;

    const posts = await prisma.user.findMany({
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
                type: true,
                video_views: true, // Directly select the scalar field
                user: {
                  select: {
                    user_id: true,
                    display_name: true,
                    image: true,
                  },
                },
                post_likes: {
                  where: { user_id: Number(userId) }, // Check if the user has liked the post
                  select: { like_id: true },
                },
                saved_posts: {
                  where: { user_id: Number(userId) }, // Check if the user has saved the post
                  select: { saved_post_id: true },
                },
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
    });

    if (!posts) {
      res.status(404).json({ message: "Posts not found" });
    }

    const formattedPosts = posts.map((user) => ({
      user_id: user.user_id,
      saved_posts: user.saved_posts.map((savedPost) => ({
        ...savedPost.post,
        liked: savedPost.post.post_likes.length > 0, // True if the user has liked the post
        saved: savedPost.post.saved_posts.length > 0, // True if the user has saved the post
      })),
    }));

    const totalPosts = await prisma.post.count({
      where: {
        user_id: Number(userId),
      },
    });

    res.json({
      formattedPosts,
      totalPosts,
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
    const { targetUserId } = req.params; // The user to be followed

    if (!targetUserId) {
      res.status(400).json({
        message: "Target user ID is required",
      });
      return;
    }

    if (userId === targetUserId) {
      res.status(400).json({
        message: "You cannot follow yourself",
      });
      return;
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { user_id: Number(targetUserId) },
    });

    if (!targetUser) {
      res.status(404).json({
        message: "Target user not found",
      });
      return;
    }

    // Check if the user is already following the target user
    const existingFollow = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: Number(targetUserId),
        },
      },
    });

    // If already following, then unfollow
    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          follower_id_following_id: {
            follower_id: Number(userId),
            following_id: Number(targetUserId),
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
        where: { user_id: Number(targetUserId) },
        data: {
          follower_count: { decrement: 1 },
        },
      });

      res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
      return;
    }

    // Add the follow relationship
    await prisma.follower.create({
      data: {
        follower_id: Number(userId),
        following_id: Number(targetUserId),
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
      where: { user_id: Number(targetUserId) },
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
      return;
    }

    if (userId === targetUserId) {
      res.status(400).json({
        message: "You cannot unfollow yourself",
      });
      return;
    }

    // Check if the follow relationship exists
    const existingFollow = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: Number(targetUserId),
        },
      },
    });

    if (!existingFollow) {
      res.status(400).json({
        message: "You are not following this user",
      });
      return;
    }

    // Remove the follow relationship
    await prisma.follower.delete({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: Number(targetUserId),
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
      where: { user_id: Number(targetUserId) },
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

export const getUserFollowing = async (req: Request, res: Response) => {
  try {
    const inputData = paginationSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { limit, offset } = inputData.data;

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
      take: limit,
      skip: offset,
    });

    if (!following) {
      res.status(404).json({ message: "Following not found" });
      return;
    }

    const totalFollowing = await prisma.follower.count({
      where: { follower_id: Number(userId) },
    });

    // Transform the response to return an array of followed users
    const followingList = following.map((item) => item.following);

    res.status(200).json({
      followingList,
      totalFollowing,
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
    const inputData = paginationSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { limit, offset } = inputData.data;

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
      take: limit,
      skip: offset,
    });

    if (!followers) {
      res.status(404).json({ message: "Followers not found" });
      return;
    }

    const totalFollowers = await prisma.follower.count({
      where: { following_id: Number(userId) },
    });

    // Transform the response to return an array of follower users
    const followersList = followers.map((item) => item.follower);

    res.status(200).json({
      followersList,
      totalFollowers,
    });
  } catch (error) {
    console.error("Error fetching user followers list:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const searchUserFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Assuming `req.userId` holds the logged-in user's ID
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { identifier, limit, offset } = inputData.data;

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
      take: limit,
      skip: offset,
    });

    if (!followers) {
      res.status(404).json({ message: "Followers not found" });
      return;
    }

    const totalFollowers = await prisma.follower.count({
      where: { following_id: Number(userId) },
    });

    // Extract follower details from the nested object
    const result = followers.map((f) => f.follower);

    res.json({
      result,
      totalFollowers,
    });
  } catch (error) {
    console.error("Error searching user's followers:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const searchUserFollowings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Assuming `req.userId` holds the logged-in user's ID
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { identifier, limit, offset } = inputData.data;

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
      take: limit,
      skip: offset,
    });

    if (!following) {
      res.status(404).json({ message: "Following not found" });
      return;
    }

    const totalFollowing = await prisma.follower.count({
      where: { follower_id: Number(userId) },
    });

    // Extract following details from the nested object
    const result = following.map((f) => f.following);

    res.json({
      result,
      totalFollowing,
    });
  } catch (error) {
    console.error("Error searching user's following:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendEditProfileOtp = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Assuming `req.userId` holds the logged-in user's ID
    const inputData = sendEditProfileOtpSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { phone } = inputData.data;

    const otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    if (!phone) {
      res
        .status(400)
        .json({ message: "Phone Number is required for OTP generation" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { user_id: Number(userId) },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // ! TODO: Send OTP to phone

    await prisma.otp.create({
      data: {
        user_id: user.user_id,
        related: "forgot_password", // OTP type
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    console.log(`Sending phone OTP to ${phone}: ${otp}`);
    const request = await fetch(
      `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${process.env.MESSAGE_CENTRAL_CUSTOMER_ID}&flowType=SMS&mobileNumber=${phone}`,
      {
        method: "POST",
        headers: {
          authToken: `${process.env.MESSAGE_CENTRAL_AUTH_TOKEN}`,
        },
      }
    );
    if (!request.ok) {
      throw new Error(`Error sending OTP to ${phone}: ${request.statusText}`);
    }
    const response = await request.json();
    const verificationId = response.data.verificationId;
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)

    // Ensure userId is provided and valid
    if (!userId || isNaN(Number(userId))) {
      res.status(400).json({
        message: "Invalid user ID",
      });
      return;
    }

    // Fetch the logged-in user's profile
    const user = await prisma.user.findUnique({
      where: { user_id: Number(userId) },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // Validate the input data
    const inputData = editUserProfileSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { display_name, username, email, app_language, state, city } =
      inputData.data;

    console.log(display_name, username, email, app_language, state, city);

    // Check if the username is taken by another user
    if (username && username !== user.username) {
      const usernameAlreadyTaken = await prisma.user.findFirst({
        where: {
          username,
          user_id: { not: Number(userId) }, // Exclude the current user's ID
        },
      });

      if (usernameAlreadyTaken) {
        res.status(400).json({
          message: "Username is already taken. Please choose another one.",
        });
        return;
      }
    }

    // Check if the email is taken by another user
    if (email && email !== user.email) {
      const emailAlreadyTaken = await prisma.user.findFirst({
        where: {
          email,
          user_id: { not: Number(userId) }, // Exclude the current user's ID
        },
      });

      if (emailAlreadyTaken) {
        res.status(400).json({
          message: "Email is already in use. Please use a different email.",
        });
        return;
      }
    }

    // Build the update data dynamically to avoid overwriting fields with undefined
    const updateData: any = {};
    if (display_name !== undefined) updateData.display_name = display_name;
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (app_language !== undefined) updateData.app_language = app_language;
    if (state !== undefined) updateData.state = state;
    if (city !== undefined) updateData.city = city;

    // Update the user's profile
    await prisma.user.update({
      where: {
        user_id: Number(userId),
      },
      data: updateData,
    });

    res.json({
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

export const isUsernameAvailable = async (req: Request, res: Response) => {
  try {
    const inputData = usernameSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { username } = inputData.data;

    // Check if username is already taken
    const alreadyInUse = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (alreadyInUse) {
      res.status(200).json({
        available: false,
      });
      return;
    } else {
      res.status(200).json({
        available: true,
      });
      return;
    }
  } catch (error) {
    console.error("Error validating username:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const changeProfilePic = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers; // Logged-in user's ID (from middleware/auth)

    const user = await prisma.user.findUnique({
      where: { user_id: Number(userId) },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const file = req.file;
    console.log(file);
    const filePath = req.file.path;
    const originalExtension = path.extname(req.file.originalname); // e.g., ".jpg"
    const compressedImagePath = `uploads/compressed_${Date.now()}${originalExtension}`;

    let s3Url;

    fs.renameSync(filePath, compressedImagePath);

    s3Url = await uploadToS3(compressedImagePath, file.mimetype);
    console.log(s3Url);

    // Save Ad data in the database
    await prisma.user.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        image: s3Url,
      },
    });

    fs.unlinkSync(compressedImagePath);

    res.json({
      msg: "Profile picture updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile picture:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
