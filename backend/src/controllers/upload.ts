import { PrismaClient } from "@prisma/client";
import { uploadArticleSchema } from "../zod/upload/uploadArticle";

const prisma = new PrismaClient();

export const isBlocked = async (req, res) => {
  try {
    const { userId } = req;

    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blocked = user.status === "ban";

    return res.json({
      blocked,
    });
  } catch (error) {
    console.error("Error checking if user is blocked:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const uploadArticle = async (req, res) => {
  try {
    const { userId } = req;

    // Check if the user is blocked from uploading articles
    const blocked = await isBlocked(req, res);
    if (blocked) {
      return res.status(403).json({
        message: "You are blocked from uploading articles.",
      });
    }

    const inputData = uploadArticleSchema.safeParse(req.body);
    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { language, title, content } = inputData.data;

    // Create the article in the database
    const newArticle = await prisma.post.create({
      data: {
        user_id: userId,
        language,
        title,
        type: "text", // Assuming articles are represented by the type "ARTICLE"
        content,
      },
    });

    return res.status(201).json({
      message: "Article uploaded successfully.",
      article: newArticle,
    });
  } catch (error) {
    console.error("Error uploading article:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const uploadImage = (req, res) => {
  return res.json({ msg: "Image" });
};

export const uploadVideo = (req, res) => {
  return res.json({ msg: "Video" });
};
