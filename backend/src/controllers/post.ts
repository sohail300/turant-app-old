import { PrismaClient } from "@prisma/client";
import { postCommentSchema } from "../zod/post/postComment";

const prisma = new PrismaClient();

export const showPost = (req, res) => {
  return res.json({ msg: "Show Post" });
};

export const showSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        post_id: postId,
      },
      select: {
        user_id: true,
        photo: true,
        video: true,
        content: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({
      post,
    });
  } catch (error) {
    console.error("Error fetching single post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getVideo = async (req, res) => {};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.post.findUnique({
      where: {
        post_id: postId,
      },
      select: {
        post_comments: {
          select: {
            comment: true,
            created_at: true,
            user: {
              select: {
                display_name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!comments) {
      return res.status(404).json({ message: "Comments not found" });
    }

    return res.json({
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const postComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const inputData = postCommentSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { comment } = inputData.data;

    // Create a new comment for the post
    await prisma.post.update({
      where: {
        post_id: postId,
      },
      data: {
        comments: {
          increment: 1,
        },
      },
    });

    // Add the comment to the post
    await prisma.post.update({
      where: {
        post_id: postId,
      },
      data: {
        post_comments: {
          create: {
            comment,
            user_id: req.userId,
            created_at: new Date(),
          },
        },
      },
    });

    return res.json({
      msg: "Comment posted successfully",
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the post ID from the URL parameters
    const { userId } = req; // Assume `userId` is added to the request by middleware after authentication

    // Check if the user has already liked the post
    const existingLike = await prisma.postLike.findFirst({
      where: {
        post_id: parseInt(postId, 10),
        user_id: userId,
      },
    });

    if (existingLike) {
      // If already liked, unlike the post
      await prisma.postLike.delete({
        where: {
          like_id: existingLike.like_id,
        },
      });

      // Decrement the like count on the post
      await prisma.post.update({
        where: {
          post_id: parseInt(postId, 10),
        },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      return res.json({
        message: "Post unliked successfully.",
      });
    } else {
      // If not liked, add a like
      await prisma.postLike.create({
        data: {
          post_id: parseInt(postId, 10),
          user_id: userId,
        },
      });

      // Increment the like count on the post
      await prisma.post.update({
        where: {
          post_id: parseInt(postId, 10),
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return res.json({
        message: "Post liked successfully.",
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const hasLikedPost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the post ID from the URL parameters
    const { userId } = req; // Assume `userId` is added to the request by middleware after authentication

    // Check if the user has liked the post
    const existingLike = await prisma.postLike.findFirst({
      where: {
        post_id: parseInt(postId, 10),
        user_id: userId,
      },
    });

    if (existingLike) {
      return res.json({
        hasLiked: true,
        message: "User has liked the post.",
      });
    } else {
      return res.json({
        hasLiked: false,
        message: "User has not liked the post.",
      });
    }
  } catch (error) {
    console.error("Error checking if post has been liked:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the user has already shared the post
    const post = await prisma.post.findUnique({
      where: {
        post_id: postId,
      },
    });

    if (post) {
      return res.status(400).json({
        message: "You have already shared this post",
      });
    }

    await prisma.post.update({
      where: {
        post_id: postId,
      },
      data: {
        shares: {
          increment: 1,
        },
      },
    });

    return res.json({
      msg: "Post shared successfully",
    });
  } catch (error) {
    console.error("Error sharing post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the post ID from request params
    const { userId } = req; // Assume `userId` is added by middleware after authentication

    // Check if the user has already saved the post
    const existingSavedPost = await prisma.savedPost.findFirst({
      where: {
        user_id: userId,
        post_id: parseInt(postId, 10),
      },
    });

    if (existingSavedPost) {
      // If the post is already saved, unsave it
      await prisma.savedPost.delete({
        where: {
          saved_post_id: existingSavedPost.saved_post_id,
        },
      });

      return res.status(200).json({
        message: "Post unsaved successfully.",
        saved: false,
      });
    } else {
      // If the post is not saved, save it
      await prisma.savedPost.create({
        data: {
          user_id: userId,
          post_id: parseInt(postId, 10),
        },
      });

      return res.status(201).json({
        message: "Post saved successfully.",
        saved: true,
      });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const hasSavedPost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the post ID from request params
    const { userId } = req; // Assume `userId` is added by middleware after authentication

    // Check if the user has already saved the post
    const savedPost = await prisma.savedPost.findFirst({
      where: {
        user_id: userId,
        post_id: parseInt(postId, 10),
      },
    });

    if (savedPost) {
      return res.status(200).json({
        message: "Post has been saved.",
        saved: true,
      });
    } else {
      return res.status(200).json({
        message: "Post has not been saved.",
        saved: false,
      });
    }
  } catch (error) {
    console.error("Error checking if post has been saved:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
