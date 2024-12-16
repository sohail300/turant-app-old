import { PrismaClient } from "@prisma/client";
import { postCommentSchema } from "../zod/post/postComment";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { verifyAccessToken } from "../utils/jwtMethods";

const prisma = new PrismaClient();

export const showPosts = async (req: Request, res: Response) => {
  try {
    let isLoggedIn = false;
    let userId;
    const { limit, offset } = req.query;
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = verifyAccessToken(token);

        if (decoded) {
          isLoggedIn = true;
          userId = decoded.userId.toString();
        }

        if (isLoggedIn) {

          // Fetch posts from followed users
          const followedPosts = await prisma.post.findMany({
            where: {
              user: {
                followers: { some: { follower_id: Number(userId) } }, // Only posts from followed users
              },
            },
            orderBy: { created_at: "desc" },
            select: {
              post_id: true,
              user_id: true,
              title: true,
              type: true,
              thumbnail: true,
              snippet: true,
              created_at: true,
              likes: true, // Directly select the scalar field
              shares: true, // Directly select the scalar field
              comments: true, // Directly select the scalar field
              video_views: true, // Directly select the scalar field
              user: {
                select: {
                  user_id: true,
                  display_name: true,
                  image: true,
                  followers: {
                    where: { follower_id: Number(userId) }, // Check if the logged-in user follows this user
                    select: { follower_id: true },
                  },
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
            take: Number(limit),
            skip: Number(offset),
          });

          // Fetch posts from unfollowed users (excluding followed ones)
          const unfollowedPosts = await prisma.post.findMany({
            where: {
              user: {
                followers: { none: { follower_id: Number(userId) } }, // Exclude posts from followed users
              },
            },
            orderBy: { created_at: "desc" },
            select: {
              post_id: true,
              user_id: true,
              title: true,
              type: true,
              thumbnail: true,
              snippet: true,
              created_at: true,
              likes: true, // Directly select the scalar field
              shares: true, // Directly select the scalar field
              comments: true, // Directly select the scalar field
              video_views: true, // Directly select the scalar field
              user: {
                select: {
                  user_id: true,
                  display_name: true,
                  image: true,
                  followers: {
                    where: { follower_id: Number(userId) }, // Check if the logged-in user follows this user
                    select: { follower_id: true },
                  },
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
            take: Number(limit),
            skip: Number(offset),
          });

          // Merge and sort posts
          const posts = [...followedPosts, ...unfollowedPosts].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

          const formattedPosts = posts.map((post) => ({
              ...post,
              liked: post.post_likes.length > 0, // True if the user has liked the post
              saved: post.saved_posts.length > 0,
              following: post.user.followers.length > 0,
          }))

          console.log("login post");
          
          res.json(formattedPosts);
          return;
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    }

    const posts = await prisma.post.findMany({
      select: {
        post_id: true,
        user_id: true,
        title: true,
        type: true,
        thumbnail: true,
        snippet: true,
        created_at: true,
        likes: true, // Directly select the scalar field
        shares: true, // Directly select the scalar field
        comments: true, // Directly select the scalar field
        video_views: true, // Directly select the scalar field
        user: {
          select: {
            user_id: true,
            display_name: true,
            image: true,
          },
        },
      },
      take: Number(limit),
      skip: Number(offset),
    });

    console.log("not login post");
    
    res.status(200).json(posts);
    return;
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const showImagePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        post_id: Number(postId),
      },
      select: {
        user_id: true,
        photo: true,
        content: true,
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json({
      post,
    });
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const showVideoPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        post_id: Number(postId),
      },
      select: {
        user_id: true,
        video: true,
        content: true,
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json({
      post,
    });
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const video = async (req: Request, res: Response) => {
  const videoPath = "/film.mkv";

  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    console.error("Video file not found:", videoPath);
    return res.status(404).send("Video not found");
  }

  // Get video stats
  let videoStat;
  try {
    videoStat = fs.statSync(videoPath);
  } catch (err) {
    console.error("Error reading video stats:", err);
    return res.status(500).send("Error reading video");
  }

  const fileSize = videoStat.size;
  const range = req.headers.range;

  if (range) {
    try {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range
      if (start >= fileSize || end >= fileSize) {
        console.error("Invalid range requested:", range);
        return res.status(416).send("Requested range not satisfiable");
      }

      const chunksize = end - start + 1;
      const stream = fs.createReadStream(videoPath, { start, end });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);

      // Handle stream errors
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).send("Error streaming video");
        }
      });

      stream.pipe(res);

      // Log successful range request
      console.log(`Serving bytes ${start}-${end}/${fileSize}`);
    } catch (err) {
      console.error("Error handling range request:", err);
      res.status(500).send("Error processing video request");
    }
  } else {
    try {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(200, head);
      const stream = fs.createReadStream(videoPath);

      // Handle stream errors
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).send("Error streaming video");
        }
      });

      stream.pipe(res);

      // Log full file request
      console.log(`Serving full video file: ${fileSize} bytes`);
    } catch (err) {
      console.error("Error streaming full video:", err);
      res.status(500).send("Error streaming video");
    }
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId, limit, offset } = req.query;

    const comments = await prisma.post.findUnique({
      where: {
        post_id: Number(postId),
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
          take: Number(limit),
          skip: Number(offset),
        },
      },
    });

    res.json({
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const postComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId } = req.headers;

    const inputData = postCommentSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { comment } = inputData.data;

    // Create a new comment for the post
    await prisma.post.update({
      where: {
        post_id: Number(postId),
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
        post_id: Number(postId),
      },
      data: {
        post_comments: {
          create: {
            comment,
            user_id: Number(userId),
            created_at: new Date(),
          },
        },
      },
    });

    res.json({
      msg: "Comment posted successfully",
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params; // Get the post ID from the URL parameters
    const { userId } = req.headers; // Assume `userId` is added to the request by middleware after authentication

    // Check if the user has already liked the post
    const existingLike = await prisma.postLike.findFirst({
      where: {
        post_id: parseInt(postId, 10),
        user_id: Number(userId),
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

      res.json({
        message: "Post unliked successfully.",
      });
    } else {
      // If not liked, add a like
      await prisma.postLike.create({
        data: {
          post_id: parseInt(postId, 10),
          user_id: Number(userId),
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

      res.json({
        message: "Post liked successfully.",
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const hasLikedSavedFollowingPost = async (
  req: Request,
  res: Response
) => {
  try {
    const { postId, authorId } = req.query; // Get the post ID from the URL parameters
    const { userId } = req.headers; // Assume `userId` is added to the request by middleware after authentication
    console.log(userId);

    // Check if the user has liked the post
    const existingLike = await prisma.postLike.findFirst({
      where: {
        post_id: Number(postId),
        user_id: Number(userId),
      },
    });

    const savedPost = await prisma.savedPost.findFirst({
      where: {
        user_id: Number(userId),
        post_id: Number(postId),
      },
    });

    // See if the user is following the author of the post
    const isFollowing = await prisma.follower.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: Number(userId),
          following_id: Number(authorId),
        },
      },
    });

    res.json({
      hasLiked: existingLike ? true : false,
      hasSaved: savedPost ? true : false,
      isFollowing: isFollowing ? true : false,
    });
  } catch (error) {
    console.error("Error checking if post has been liked:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sharePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    // Check if the user has already shared the post
    const post = await prisma.post.findUnique({
      where: {
        post_id: Number(postId),
      },
    });

    // if (post) {
    //   res.status(400).json({
    //     message: "You have already shared this post",
    //   });
    // }

    await prisma.post.update({
      where: {
        post_id: Number(postId),
      },
      data: {
        shares: {
          increment: 1,
        },
      },
    });

    res.json({
      msg: "Post shared successfully",
    });
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const savePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params; // Get the post ID from request params
    const { userId } = req.headers; // Assume `userId` is added by middleware after authentication

    // Check if the user has already saved the post
    const existingSavedPost = await prisma.savedPost.findFirst({
      where: {
        user_id: Number(userId),
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

      res.status(200).json({
        message: "Post unsaved successfully.",
        saved: false,
      });
    } else {
      // If the post is not saved, save it
      await prisma.savedPost.create({
        data: {
          user_id: Number(userId),
          post_id: parseInt(postId, 10),
        },
      });

      res.status(201).json({
        message: "Post saved successfully.",
        saved: true,
      });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
