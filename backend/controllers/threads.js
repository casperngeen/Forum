import { getThreadsQuery, newThreadQuery, findThread, removeThreadQuery, removeRepliesOfThread } from "../models/threads.js";
import CustomError from "../error.js";

export async function getThreads(req, res) {
    try {
        const result = await getThreadsQuery();
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}

export async function newThread(req, res) {
    try {
        const userID = req.user.id;
        const { title, content } = req.body;
        await newThreadQuery(userID, title, content);
        res.status(201).send("Thread successfully created");
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}

export async function deleteThread(req, res) {
    try {
        const threadID = req.params.threadID;
        const userID = req.user.id;

        const thread = await findThread(threadID);
        
        //thread does not exist
        if (thread.rows.length === 0) {
            throw new CustomError(404, "Thread not found");
        }

        // thread does not belong to user accessing api route
        if (thread.rows[0].user_id !== userID) {
            throw new CustomError(403, "Forbidden access");
        }

        await removeThreadQuery(threadID);
        await removeRepliesOfThread(threadID);
        res.status(204).send("Thread successfully deleted");
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}