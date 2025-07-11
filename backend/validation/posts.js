import { z } from "zod";
import {
  user_username_schema,
  posts_id_schema,
  posts_title_schema,
  posts_description_schema,
  posts_date_schema,
} from "../schema/property_schema_for_validation.js";

export const sendPostSchema = z.object({
  title: posts_title_schema,
  des: posts_description_schema,
});

export const postsIDParamSchema = z.object({
  id: posts_id_schema,
});

export const dateParamSchema = z.object({
  date: posts_date_schema,
});

export const usernameParamSchema = z.object({
  username: user_username_schema,
});

export const usernameDateQuerySchema = z
  .object({
    username: user_username_schema.optional(),
    date: posts_date_schema.optional(),
  })
  .strict();
