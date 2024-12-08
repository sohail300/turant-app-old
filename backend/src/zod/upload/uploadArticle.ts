import { z } from "zod";

export const contentSchema = z
  .string()
  .min(1, "Article must be at least 1 characters")
  .max(50000);

export const titleSchema = z
  .string()
  .min(1, "Title must be at least 1 characters")
  .max(100);

export const languageSchema = z.enum(["english", "hindi"]);

export const uploadArticleSchema = z.object({
  content: contentSchema,
  title: titleSchema,
  language: languageSchema,
});
