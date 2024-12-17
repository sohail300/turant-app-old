import { PrismaClient } from "@prisma/client";
import { searchUserSchema } from "../zod/user/searchUser";
import { Request, Response } from "express";
import { paginationSchema } from "../zod/user/pagination";
import bcrypt from "bcrypt";
import { actionUserSchema } from "../zod/user/actionUser";

const prisma = new PrismaClient();

export const getTotalUsers = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalVerifiedUsers = await prisma.user.count({
      where: {
        verifiedByFollowersCount: true,
      },
    });

    res.json({
      totalUsers,
      totalVerifiedUsers,
    });
  } catch (error) {
    console.error("Error getting total users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

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
        image: true,
        city: true,
        state: true,
        created_at: true,
        verifiedByFollowersCount: true,
        follower_count: true,
        app_language: true,
        banTill: true,
        lastBan: true,
        _count: {
          select: {
            posts: true, // Total post count for the user
          },
        },
      },
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

export const userAction = async (req: Request, res: Response) => {
  try {
    const inputData = actionUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { userId, postId, message, days, deletePost } = inputData.data;
    console.log(userId);

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        user_id: Number(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: {
        post_id: Number(postId),
      },
    });

    if (!post) {
      res.status(404).json({
        message: "Post not found",
      });
      return;
    }

    // Check if the user is the owner of the post
    if (user.user_id !== post.user_id) {
      res.status(403).json({
        message: "This user is not the owner of this post",
      });
      return;
    }

    if (deletePost) {
      await prisma.post.delete({
        where: {
          post_id: Number(postId),
        },
      });
    }

    await prisma.user.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        violationMessage: message,
        violationPostId: Number(postId),
        banTill: new Date(
          new Date().getTime() +
            (days === "3"
              ? 3 * 24 * 60 * 60 * 1000
              : days === "7"
              ? 7 * 24 * 60 * 60 * 1000
              : 37000 * 24 * 60 * 60 * 1000)
        ),
        lastBan: days,
      },
    });

    res.json({
      msg: "Action performed successfully",
    });
  } catch (error) {
    console.error("Error performing user action:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getActionDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const details = await prisma.user.findFirst({
      where: {
        user_id: Number(userId),
      },
      select: {
        violationMessage: true,
        violationPostId: true,
      },
    });

    res.status(200).json({
      details,
    });
  } catch (error) {
    console.error("Error getting action details:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
