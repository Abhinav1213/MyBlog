import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import { WebSocketServer } from "ws";

import { CREATE_POSTS_TABLE, USER_TABLE } from "./schema/post_schema.js";
import { db_connect } from "./db/db_connect.js";

import GettingPosts from "./routes/getting_posts.js";
import PostingPosts from "./routes/posting_posts.js";
import authProcess from "./routes/auth.js";

dotenv.config();
try {
  await db_connect.execute(CREATE_POSTS_TABLE);
  await db_connect.execute(USER_TABLE);
  console.log("Posts table created successfully");
} catch (err) {
  console.error("Error creating posts table:", err);
}

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(compression());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 429,
    error: "Too many requests",
    message: "Please try again later",
  },
  skip: (req) => {
    return req.ip === "127.0.0.1";
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate Limit Exceeded!",
      details: "You have made too many requests",
    });
  },
});
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello!",
  });
});

app.use("/get", GettingPosts);
app.use("/post", PostingPosts);
app.use("/auth", authProcess);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found!",
  });
});

const httpServer = app.listen(8080, () => {
  console.log("app started on port 8080");
});

const wss = new WebSocketServer({ server: httpServer });
wss.on("connection", (ws) => {
  ws.on("error", (err) => console.log(err));
  console.log("connection established!!");
  ws.on("message", (data) => {
    console.log("Server one!!!");
  });
  ws.send("hello from server");
});
