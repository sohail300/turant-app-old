import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const addAdSchema = z.object({
  name: z.string().min(1, "Name is required"),
  media_type: z.enum(["text", "image", "video"]),
  target_url: z.string().min(1, "Target URL is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  duration: z.string().min(1, "Duration is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  cost: z.string().min(1, "Cost is required"),
  image: z
    .array(
      z.object({
        originalname: z.string(),
        mimetype: z
          .string()
          .refine((type) => ACCEPTED_IMAGE_TYPES.includes(type), {
            message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
          }),
        size: z.number().refine((size) => size <= MAX_FILE_SIZE, {
          message: "Image must be less than 5MB",
        }),
      })
    )
    .min(1, { message: "At least one image is required" }),
});
