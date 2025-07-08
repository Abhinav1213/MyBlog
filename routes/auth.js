import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db_connect } from "../db/db_connect.js";
import { authentication } from "../utils/utils1.js";
import { signUpSchema, loginSchema } from "../validation/auth.js";
import { bearerSchema } from "../validation/header.js";
import { validate } from "../utils/input_validation.js";

const router = express.Router();

router.post("/signUp", validate({ body: signUpSchema }), async (req, res) => {
  const { email, password, username } = req.body;
  if (!process.env.JWT_SECRET) {
    console.log("JWT SECRET not configured!");
    return res.status(400).json({ message: "Internal Failure" });
  }
  try {
    const saltRounds = 10;
    const hash_password = await bcrypt.hash(password, saltRounds);

    await db_connect.execute(
      "INSERT into user (username,email,password) values (?,?,?)",
      [username, email, hash_password]
    );

    const token = jwt.sign({ email: email, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(201)
      .json({ message: "User Created", token, user: { username, email } });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      const field = err.sqlMessage.includes("email") ? "Email" : "Username";
      return res.status(400).json({ message: `${field} already exists` });
    }
    console.log("Error in signUp", err);
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.post("/login", validate({ body: loginSchema }), async (req, res) => {
  const { email, password } = req.body;
  if (!process.env.JWT_SECRET) {
    console.log("JWT SECRET not configured!");
    return res.status(400).json({ message: "Internal Failure" });
  }
  try {
    const [rows] = await db_connect.execute(
      "select * from user where email=?",
      [email]
    );
    if (rows.length === 0) {
      throw new Error("Invalid Credentials");
    }

    const is_password_valid = await bcrypt.compare(password, rows[0].password);
    if (!is_password_valid) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      {
        email: rows[0].email,
        username: rows[0].username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Login Successful!",
      token,
      user: { username: rows[0].username, email: rows[0].email },
    });
  } catch (err) {
    console.log("Error in Login", err);

    if (err.message === "Invalid Credentials") {
      return res
        .status(401)
        .json({ message: "User not found! Please verify the credentials." });
    }

    return res.status(500).json({
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.delete(
  "/deleteAccount",
  validate({ headers: bearerSchema }),
  authentication,
  async (req, res) => {
    const user = req.user;
    try {
      await db_connect.execute("delete from user where email=?", [user.email]);
      return res.status(201).json({ message: "User Deleted Successfully" });
    } catch (err) {
      console.log("Error in deleteAccount:", err);
      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

export default router;
