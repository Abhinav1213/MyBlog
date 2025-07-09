import { z } from "zod";

export const sendPostSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100),
  des: z
    .string()
    .optional(),
});

export const deletePostsParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a positive integer"),
})