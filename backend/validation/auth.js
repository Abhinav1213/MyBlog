import { z } from "zod";
import {
  user_email_schema,
  user_password_schema,
  user_username_schema,
} from "../schema/property_schema_for_validation.js";

export const signUpSchema = z.object({
  email: user_email_schema,
  password: user_password_schema,
  username: user_username_schema,
});

export const loginSchema = z.object({
  email: user_email_schema,
  password: user_password_schema,
});
