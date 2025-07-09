import express from "express";
import { db_connect } from "../db/db_connect.js";
import { authentication } from "../utils/user_authentication.js";
import { validate } from "../utils/input_validation.js";
import { bearerSchema } from "../validation/header.js";
import {
  sendPostSchema,
  postsIDParamSchema,
  usernameDateQuerySchema,
} from "../validation/posts.js";

const router = express.Router();

router.post(
  "/createBlog",
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
          time: time_of_post,
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

router.get("/allBlogs", async (req, res) => {
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

router.get(
  "/",
  validate({ query: usernameDateQuerySchema }),
  async (req, res) => {
    const { username, date } = req.query;

    try {
      let query;
      let params;

      if (username && !date) {
        query = "select * from posts where author=?";
        params = [username];
      } else if (!username && date) {
        query = "select * from posts where DATE(date)=?";
        params = [date];
      } else if (username && date) {
        query = "select * from posts where author=? and DATE(date)=?";
        params = [username, date];
      } else {
        const err = new Error("No query provided");
        err.code = "NO_QUERY_PROVIDED";
        throw err;
      }

      const [rows] = await db_connect.execute(query, params);
      return res.status(200).json(rows);
    } catch (err) {
      console.log("Error Fetching Blogs", err);
      if (err.code === "NO_QUERY_PROVIDED") {
        return res
          .status(400)
          .json({ message: 'Please provide "username" or "date" as query.' });
      }
      return res.status(500).json({
        message: "Error Fetching Posts",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

router.put(
  "/updateBlog/:id",
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
        message: "Error Updating Post",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

router.delete(
  "/deleteBlog/:id",
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

export default router;
