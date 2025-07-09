import { z } from "zod";

export const user_id_schema = z
  .string()
  .regex(/^\d+$/, "ID must be a positive integer");

export const user_email_schema = z.string().email();

export const user_password_schema = z.string().min(6);

export const user_username_schema = z
  .string()
  .min(3)
  .max(50)
  .regex(
    /^[a-zA-Z0-9.-]+$/,
    "Username can only contain alphanumerals, . and -"
  );

export const posts_id_schema = z
  .string()
  .regex(/^\d+$/, "ID must be a positive integer");

export const posts_title_schema = z.string().min(3).max(255);

export const posts_date_schema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date value",
  });

export const posts_author_schema = user_username_schema;

export const posts_description_schema = z.string().optional();
