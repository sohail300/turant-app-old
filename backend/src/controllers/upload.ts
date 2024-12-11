import { PrismaClient } from "@prisma/client";
import { uploadArticleSchema } from "../zod/upload/uploadArticle";
import { Request, Response } from "express";
import { checkIfBlocked } from "../utils/checkIfBlocked";

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

export const uploadImage = (req: Request, res: Response) => {
  res.json({ msg: "Image" });
};

export const uploadVideo = (req: Request, res: Response) => {
  res.json({ msg: "Video" });
};
