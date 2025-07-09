import express from "express";
const router = express.Router();
import { db_connect } from "../db/db_connect.js";
import { authentication } from "../utils/user_authentication.js";
import { validate } from "../utils/input_validation.js";
import { bearerSchema } from "../validation/header.js";
import { sendPostSchema } from "../validation/posts.js";

router.post(
  "/postBlog",
  validate({ headers: bearerSchema }),
  authentication,
  validate({ body: sendPostSchema }),
  async (req, res) => {
    const { title, des } = req.body;
    const author = req.user.username;

    try {
      const time_of_post = new Date().toUTCString();
      const post = await db_connect.execute(
        "INSERT INTO posts(title,author, description) values (?,?,?)",
        [title, author, des ?? null]
      );
      return res.status(201).json({
        message: "Post Created.",
        post: {
          id: post.insertId,
          title: title,
          author: author,
          description: des ?? null,
          time: time_of_post
        },
      });
    } catch (err) {
      console.log("Error in creating post", err);
      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

export default router;
