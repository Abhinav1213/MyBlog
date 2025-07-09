import { z } from "zod";

export const sendPostSchema = z.object({
  title: z.string().min(3).max(100),
  des: z.string().optional(),
});

export const postsIDParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a positive integer"),
});

export const dateParamSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date value",
    }),
});

export const usernameParamSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[^\s]+$/, "Username must not contain spaces"),
});
