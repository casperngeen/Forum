// all possible api routes go through here

import express from "express";
import "dotenv/config"; // to allow the file to read variables from the .env file
import { authenticateToken, logIn, registration, logOut, refreshToken } from "../controllers/auth";
import { getThreads, newThread, deleteThread } from "../controllers/threads";
import { threadReplies, newReply, deleteReply } from "../controllers/replies";

const router = express.Router();

//authenticate everything that is user specific, so we can use it to verify + retrieve user data
router.post("/register", registration);
router.post("/login", logIn);
router.post("/refresh", authenticateToken, refreshToken);
router.delete("/logout", authenticateToken, logOut);

router.get("/threads", getThreads);
router.post("/new", authenticateToken, newThread);

router.get("/:threadID", threadReplies);
router.delete("/:threadID", authenticateToken, deleteThread);
router.post("/:threadID", authenticateToken, newReply); // replying to the main thread

router.post(":/threadID/:replyID", authenticateToken, newReply); // replying to another reply
router.put(":/threadID/:replyID", authenticateToken, deleteReply);

export default router;

