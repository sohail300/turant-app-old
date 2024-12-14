import { PrismaClient } from "@prisma/client";
import { uploadArticleSchema } from "../zod/upload/uploadArticle";
import { Request, Response } from "express";
import { checkIfBlocked } from "../utils/checkIfBlocked";
import { uploadToS3 } from "../utils/uploadToS3";
import fs from "fs";
import { compressVideo } from "../utils/compressVideo";
import { checkPostLimit } from "../utils/limitReached";
import { uploadToS3Video } from "../utils/uploadToS3Video";

const prisma = new PrismaClient();

export const isBlockedHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = Number(req.headers.userId);

    if (isNaN(userId)) {
      res.status(400).json({
        message: "Invalid user ID.",
      });
      return;
    }

    const blocked = await checkIfBlocked(userId);

    res.json({
      blocked,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// If the last 3 posts from the user are made on the same day, then block them from uploading more posts

export const uploadArticle = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers;

    // Check if the user is blocked from uploading articles
    const blocked = await checkIfBlocked(Number(userId));
    if (blocked) {
      res.status(403).json({
        message: "You are blocked from uploading articles.",
      });
      return;
    }

    const reachedPostLimit = await checkPostLimit(Number(userId));
    if (reachedPostLimit) {
      res.status(403).json({
        message: "You have reached the post limit.",
      });
      return;
    }

    const inputData = uploadArticleSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { language, title, content } = inputData.data;

    // Create the article in the database
    const newArticle = await prisma.post.create({
      data: {
        user_id: Number(userId),
        language,
        title,
        type: "text",
        content,
        snippet: content.split(" ").slice(0, 30).join(" "),
      },
    });

    res.status(201).json({
      message: "Article uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading article:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers;
    console.log(userId);
    console.log(req.files);

    // the number of imags cant be more than 5
    console.log(req.files.length);
    if ((req.files.length as number) > 5) {
      res.status(400).json({
        message: "You can only upload 5 images at a time.",
      });
      return;
    }

    // Check if the user is blocked from uploading images
    const blocked = await checkIfBlocked(Number(userId));
    if (blocked) {
      res.status(403).json({
        message: "You are blocked from uploading images.",
      });
      return;
    }

    const reachedPostLimit = await checkPostLimit(Number(userId));
    if (reachedPostLimit) {
      res.status(403).json({
        message: "You have reached the post limit.",
      });
      return;
    }

    const inputData = uploadArticleSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { language, title, content } = inputData.data;
    console.log(language);
    console.log(title);
    console.log(content);

    let imageUrls;
    // Upload the images to S3
    if (req.files && Array.isArray(req.files)) {
      imageUrls = await Promise.all(
        req.files.map((file) => uploadToS3(file.path, file.mimetype))
      );
    } else {
      res
        .status(400)
        .json({ error: "No files uploaded or invalid file format." });
    }

    console.log(imageUrls);

    // Create the article in the database
    const newArticle = await prisma.post.create({
      data: {
        user_id: Number(userId),
        language,
        title,
        type: "image", // Assuming this is for an image post
        thumbnail: imageUrls[0], // Use the first image as the thumbnail
        content,
        snippet: content.split(" ").slice(0, 30).join(" "), // Extract snippet from content
      },
    });

    // Create entries in the Photo model and associate them with the post
    const photoEntries = await Promise.all(
      imageUrls.map((url) =>
        prisma.photo.create({
          data: {
            post_id: newArticle.post_id, // Reference the post_id of the newly created article
            url, // URL of the image uploaded to S3
          },
        })
      )
    );

    // Now, associate the photos with the new article
    await prisma.post.update({
      where: {
        post_id: newArticle.post_id,
      },
      data: {
        photo: {
          connect: photoEntries.map((entry) => ({ id: entry.id })),
        },
      },
    });

    if (req.files && Array.isArray(req.files)) {
      imageUrls = await Promise.all(
        req.files.map((file) => fs.unlinkSync(file.path))
      );
    }

    res.status(201).json({
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers;
    console.log(userId);

    // Check if the user is blocked from uploading images
    const blocked = await checkIfBlocked(Number(userId));
    if (blocked) {
      res.status(403).json({
        message: "You are blocked from uploading videos.",
      });
      return;
    }

    const reachedPostLimit = await checkPostLimit(Number(userId));
    if (reachedPostLimit) {
      res.status(403).json({
        message: "You have reached the post limit.",
      });
      return;
    }

    const inputData = uploadArticleSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { language, title, content } = inputData.data;
    console.log(language);
    console.log(title);
    console.log(content);

    let s3Url;
    const file = req.file;
    const filePath = req.file.path;
    const outputFilePath = `compressed_${Date.now()}_${req.file.originalname}`;
    const completeOutputFilePath = `uploads/${outputFilePath}`;
    const thumbnailPath = `uploads/thumbnail_${Date.now()}.jpg`;

    await new Promise((resolve, reject) => {
      compressVideo(filePath, outputFilePath, thumbnailPath, (err) => {
        if (err) reject(err); // Reject the promise on error
        resolve(undefined); // Resolve when compression finishes
      });
    });

    // Upload the compressed video to S3

    s3Url = await uploadToS3(completeOutputFilePath, file.mimetype);
    const thumbnailUrl = await uploadToS3(thumbnailPath, file.mimetype);

    console.log(s3Url);
    console.log(thumbnailUrl);

    // Create the article in the database
    const newArticle = await prisma.post.create({
      data: {
        user_id: Number(userId),
        language,
        title,
        type: "video", // Assuming this is for a video post
        content,
        video: s3Url,
        thumbnail: thumbnailUrl,
        snippet: content.split(" ").slice(0, 30).join(" "), // Extract snippet from content
      },
    });

    // Clean up local files
    fs.unlinkSync(filePath);
    fs.unlinkSync(completeOutputFilePath);

    res.status(201).json({
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
