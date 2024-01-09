// all possible api routes go through here

import express from "express";
import { authenticateToken, logIn, registration, logOut, refreshToken } from "../controllers/auth.js";
import { getThreads, newThread, deleteThread } from "../controllers/threads.js";
import { threadReplies, newReply, deleteReply } from "../controllers/replies.js";

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

