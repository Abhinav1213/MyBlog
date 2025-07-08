import jwt from "jsonwebtoken";
import { db_connect } from "../db/db_connect.js";

export async function authentication(req, res, next) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const jwt_decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db_connect.execute(
      "select * from user where email=?", 
      [jwt_decoded.email]
    );

    if (rows.length === 0) {
      throw new Error("Inexistent User");
    }

    req.user = rows[0];
    next();
    
  } catch (err) {
    console.log("Authentication Failed!", err);
    if (err.message === "Invalid Token") {
      return res.status(403).json({message: "Invalid or Expired Token"});
    }
    if (err.message === "Inexistent User") {
      return res.status(401).json({message: "User does not exist."})
    }
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

}
