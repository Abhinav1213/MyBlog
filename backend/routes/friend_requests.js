import express from "express";
import { db_connect } from "../db/db_connect.js";
import { authentication } from "../utils/user_authentication.js";
import { validate } from "../utils/input_validation.js";
import { bearerSchema } from "../validation/header.js";
import {
  // send_fr_userid_schema,
  send_fr_username_schema,
  update_fr_schema,
  get_fr_schema,
} from "../validation/friend_requests.js";

const router = express.Router();

router.post(
  // "/:user_id",
  // validate({ params: send_fr_userid_schema, headers: bearerSchema }),
  "/:user_name",
  validate({ params: send_fr_username_schema, headers: bearerSchema }),
  authentication,
  async (req, res) => {
    // const receiver_id = req.params.user_id;
    const receiver_name = req.params.user_name;
    const sender_name = req.user.username;

    try {
      if (receiver_name === sender_name) {
        const err = new Error("Cant Send Friend Request to yourself");
        err.code = "SENDER_RECEIVER_ARE_SAME";
        throw err;
      }

      const [rows] = await db_connect.execute(
        "SELECT * FROM friend_request where (sender_name=? and receiver_name=?) or (sender_name=? and receiver_name=?)",
        [sender_name, receiver_name, receiver_name, sender_name]
      );

      if (rows.length !== 0 && rows[0].status === "pending") {
        const err = new Error("Request Already Exists");
        err.code = "REQUEST_ALREADY_EXISTS";
        throw err;
      }

      if (rows.length !== 0 && rows[0].status === "accepted") {
        const err = new Error("Already Friends!");
        err.code = "ALREADY_FRIENDS";
        throw err;
      }

      const req_id = await db_connect.execute(
        "INSERT INTO friend_request (sender_name, receiver_name) VALUES (?, ?)",
        [sender_name, receiver_name]
      );

      return res.status(201).json({
        message: "Request Sent",
        request: {
          id: req_id[0].insertId,
          sender: sender_name,
          receiver: receiver_name,
        },
      });
    } catch (err) {
      console.log("Error Sending Friend Request", err);

      if (err.code === "SENDER_RECEIVER_ARE_SAME") {
        return res.status(403).json({ message: err.message });
      }
      if (err.code === "REQUEST_ALREADY_EXISTS") {
        return res.status(403).json({ message: err.message });
      }
      if (err.code === "ALREADY_FRIENDS") {
        return res.status(403).json({ message: err.message });
      }

      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

router.put(
  "/",
  validate({ query: update_fr_schema, headers: bearerSchema }),
  authentication,
  async (req, res) => {
    const { action, request_id } = req.query;
    // console.log(sender)
    // const user_id = req.user.id;
    const receiver_name = req.user.username;

    try {
      const [rows] = await db_connect.execute(
        "select * from friend_request where request_id=?",
        [request_id]
      );
      console.log(rows);

      if (rows.length === 0) {
        const err = new Error("Request ID does not exist");
        err.code = "INVALID_REQUEST_ID";
        throw err;
      }

      if (rows[0].receiver_name !== receiver_name) {
        const err = new Error("Request not meant for given user");
        err.code = "UNAUTHORISED";
        throw err;
      }

      if (rows[0].status === "accepted" && action === "accept") {
        const err = new Error("Request already accepted");
        err.code = "DEALT_WITH";
        throw err;
      }

      if (rows[0].status === "rejected" && action === "reject") {
        const err = new Error("Request already rejected");
        err.code = "DEALT_WITH";
        throw err;
      }
      console.log(`${action}ed`);
      await db_connect.execute(
        "UPDATE friend_request SET status=? where request_id=?",
        [`${action}ed`, request_id]
      );

      if (action === "reject") {
        await db_connect.execute(
          "DELETE FROM friend_request WHERE request_id=? LIMIT 1",
          [request_id]
        );
      }

      return res.status(200).json({ message: `Request ${action}ed` });
    } catch (err) {
      console.log("Error Accepting Request", err);

      if (err.code === "INVALID_REQUEST_ID") {
        return res.status(400).json({ message: err.message });
      }

      if (err.code === "UNAUTHORISED") {
        return res.status(403).json({ message: err.message });
      }

      if (err.code === "DEALT_WITH") {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

router.get(
  "/allRequests",
  validate({ query: get_fr_schema, headers: bearerSchema }),
  authentication,
  async (req, res) => {
    // const user_id = req.user.id;
    const username = req.user.username;
    const { action } = req.query;
    try {
      let query;
      if (action === "sent") {
        query =
          "SELECT request_id, email, username,created_at FROM user u JOIN friend_request f ON (f.sender_name = ? AND f.receiver_name = u.username) WHERE f.status = 'pending'";
      } else if (action === "received") {
        query =
          "SELECT request_id, email, username,created_at FROM user u JOIN friend_request f ON (f.sender_name = u.username AND f.receiver_name = ?) WHERE f.status = 'pending'";
      } else {
        const err = new Error("No query received");
        err.code = "QUERY_ABSENT";
        throw err;
      }
      const [rows] = await db_connect.execute(query, [username]);
      // console.log(rows);

      return res.status(200).json(rows);
    } catch (err) {
      console.log("Error Fetching Friends List", err);
      if (err.code === "QUERY_ABSENT") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);

router.get(
  "/accept",
  async (req, res) => {
    // const user_id = req.user.id;
    const username = req.query.username;
    try {
      const [rows] = await db_connect.execute(
        "SELECT u.id, u.username FROM user u JOIN friend_request f ON ((f.sender_name = u.username AND f.receiver_name = ?) OR (f.sender_name = ? AND f.receiver_name = u.username)) WHERE f.status = 'accepted';",
        [username, username]
      );

      return res.status(200).json(rows);
    } catch (err) {
      console.log("Error Fetching Friends List", err);
      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);
router.get(
  "/status",
  validate({ headers: bearerSchema }),
  authentication,
  async (req, res) => {
    // const user_id = req.user.id;
    const username = req.user.username;
    const {name}=req.query
    try {
      const [rows] = await db_connect.execute(
        "SELECT status from friend_request where (sender_name=? and receiver_name=?) OR (receiver_name=? and sender_name=?)",
        [username,name, username,name]
      );

      return res.status(200).json(rows);
    } catch (err) {
      console.log("Error Fetching Friends List", err);
      return res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
);


export default router;
