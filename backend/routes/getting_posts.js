import express from "express";
import { db_connect } from "../db/db_connect.js";
import { authentication } from "../utils/user_authentication.js";
import { validate } from "../utils/input_validation.js";
import { bearerSchema } from "../validation/header.js";
import {
  sendPostSchema,
  postsIDParamSchema,
  dateParamSchema,
  usernameParamSchema,
} from "../validation/posts.js";

const router = express.Router();

router.get("/allPosts", async (req, res) => {
  try {
    const [rows] = await db_connect.execute("SELECT * FROM posts");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Error Fetching Posts",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

//security->only author can do this:--
router.delete(
  "/post/:id",
  validate({ headers: bearerSchema }),
  authentication,
  validate({ params: postsIDParamSchema }),
  async (req, res) => {
    const { id } = req.params;
    const author = req.user.username;

    try {
      const [rows] = await db_connect.execute(
        "select author from posts where id=?",
        [id]
      );

      if (rows.length === 0) {
        const err = new Error("Post does not exist.");
        err.code = "POST_DOES_NOT_EXIST";
        throw err;
      }

      if (rows[0].author !== author) {
        const err = new Error("Post does not belong to author");
        err.code = "POST_DOES_NOT_BELONG_TO_AUTHOR";
        throw err;
      }

      await db_connect.execute("DELETE FROM posts WHERE id=? LIMIT 1", [id]);
      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.log("Error Deleting Post", err);
      if (err.code === "POST_DOES_NOT_EXIST") {
        return res.status(404).json({ message: err.message });
      }
      if (err.code === "POST_DOES_NOT_BELONG_TO_AUTHOR") {
        return res.status(403).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Error Deleting Post",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

router.get(
  "/post/by-date/:date",
  validate({ params: dateParamSchema }),
  async (req, res) => {
    const { date } = req.params;
    try {
      const [rows] = await db_connect.execute(
        "select * from posts where DATE(date)=?",
        [date]
      );
      return res.status(201).json(rows);
    } catch (err) {
      console.log("Error Fetching Posts by Date");
      return res.status(500).json({
        message: "Error Fetching Posts",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

router.get(
  "/post/by-user/:username",
  validate({ params: usernameParamSchema }),
  async (req, res) => {
    const { username } = req.params;
    console.log(username);
    try {
      const [rows] = await db_connect.execute(
        "select * from posts where author=?",
        [username]
      );
      res.status(201).json(rows);
    } catch (err) {
      console.log("Error Fetching Posts by User");
      return res.status(500).json({
        message: "Error Fetching Posts",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

//security required:--
router.put(
  "/post/by-id/:id",
  validate({ headers: bearerSchema }),
  authentication,
  validate({ body: sendPostSchema, params: postsIDParamSchema }),
  async (req, res) => {
    const { id } = req.params;
    const { title, des } = req.body;
    const username = req.user.username;
    try {
      const [rows] = await db_connect.execute(
        "SELECT author FROM posts where id=?",
        [id]
      );

      if (rows.length === 0) {
        const err = new Error("Post does not exist");
        err.code = "POST_DOES_NOT_EXIST";
        throw err;
      }

      if (rows[0].author !== username) {
        const err = new Error("Post does not belong to author");
        err.code = "POST_DOES_NOT_BELONG_TO_AUTHOR";
        throw err;
      }

      await db_connect.execute(
        `UPDATE posts SET title=?, description=? WHERE id=?`,
        [title, des ?? null, id]
      );
      return res.status(201).json({ message: "Post updated successfully." });

    } catch (err) {
      console.log("Error Updating Post", err);
      if (err.code === "POST_DOES_NOT_EXIST") {
        return res.status(404).json({ message: err.message });
      }
      if (err.code === "POST_DOES_NOT_BELONG_TO_AUTHOR") {
        return res.status(403).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Error Deleting Post",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    } 
  }
);
export default router;
