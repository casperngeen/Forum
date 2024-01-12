// all possible api routes go through here

import express from "express";
import { authenticateToken, logIn, registration, logOut, refreshToken } from "../controllers/auth.js";
import { getThreads, newThread, deleteThread, editThread, getSingleThread } from "../controllers/threads.js";
import { threadReplies, newReply, deleteReply, editReply } from "../controllers/replies.js";

const router = express.Router();

//authenticate everything that is user specific, so we can use it to verify + retrieve user data
router.post("/register", registration);
router.post("/login", logIn);
router.post("/refresh", authenticateToken, refreshToken);
router.delete("/logout", authenticateToken, logOut);

router.get("/threads", getThreads);
router.get("/threads/:threadID", getSingleThread);
router.post("/new", authenticateToken, newThread);

router.get("/:threadID", threadReplies);
router.put("/:threadID", authenticateToken, editThread);
router.delete("/:threadID", authenticateToken, deleteThread);
router.post("/:threadID", authenticateToken, newReply); // replying to the main thread

router.put("/:threadID/:replyID", authenticateToken, editReply);
router.delete("/:threadID/:replyID", authenticateToken, deleteReply);

export default router;

