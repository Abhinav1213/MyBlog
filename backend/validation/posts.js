import { z } from "zod";

export const sendPostSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100)
    .transform((val) => sanitizeHtml(val)),
  des: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeHtml(val) : undefined)),
});
