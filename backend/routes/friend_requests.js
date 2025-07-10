import express from "express";
import { db_connect } from "../db/db_connect.js";
import { authentication } from "../utils/user_authentication.js";
import { validate } from "../utils/input_validation.js";
import { bearerSchema } from "../validation/header.js";
import { send_fr_userid_schema } from "../validation/fr.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("FR route reached");
  return res.status(200).json({ message: "friend request route" });
});

router.post(
  "/:user_id",
  validate({ params: send_fr_userid_schema, headers: bearerSchema }),
  authentication,
  async (req, res) => {
    const receiver_id = req.params.user_id;
    const sender_id = req.user.id;

    try {
      if (Number(receiver_id) === sender_id) {
        const err = new Error("Cant Send Friend Request to yourself");
        err.code = "SENDER_RECEIVER_ARE_SAME";
        throw err;
      }

      const [rows] = await db_connect.execute(
        "SELECT * FROM friend_request where (sender_id=? and receiver_id=?) or (sender_id=? and receiver_id=?)",
        [sender_id, receiver_id, receiver_id, sender_id]
      );

      if (rows.length !== 0) {
        const err = new Error("Request Already Exists");
        err.code = "REQUEST_ALREADY_EXISTS";
        throw err;
      }

      await db_connect.execute(
        "INSERT INTO friend_request (sender_id, receiver_id) VALUES (?, ?)",
        [sender_id, receiver_id]
      );

      return res.status(201).json({ message: "Request Sent" });
    } catch (err) {
      console.log("Error Sending Friend Request");

      if (err.code === "SENDER_RECEIVER_ARE_SAME") {
        return res.status(403).json({ message: err.message });
      }
      if (err.code === "REQUEST_ALREADY_EXISTS") {
        return res.status(403).json({ message: err.message });
      }

      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

export default router;

// SELECT u.id, u.username
// FROM users u
// JOIN friend_requests f
//   ON (
//     (f.sender_id = u.id AND f.receiver_id = 5)
//     OR
//     (f.receiver_id = u.id AND f.sender_id = 5)
//   )
// WHERE f.status = 'accepted';
