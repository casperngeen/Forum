// contains all HTTP request handlers for requesting for rpelies of each individual thread

import { getAllReplies, addNewReply, findReply, removeReply } from "../models/replies";
import CustomError from "../error";

export async function threadReplies (req, res) {
    try {
        const threadID = req.body.threadID;
        // result -> Promise, result.rows -> an array containing multiple js objects
        const result = await getAllReplies(threadID);
        // convert the array into JSON data type 
        return res.json(result.rows);
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}

export async function newReply (req, res) {
    try {
        const threadID = req.params.threadID;
        let parentID = req.params.replyID;
        if (req.params.replyID === undefined) {
            parentID = null;
        }
        const userID = req.user.id;
        const content = req.body.reply;
        //insert the reply into replies table
        await addNewReply(userID, threadID, parentID, content);
        return res.status(201).send("Reply was recorded")
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}

export async function deleteReply (req, res) {
    try {
        // req.params since the replyID is in the url
        const replyID = req.params.replyID; 
        const userID = req.user.id;

        const reply = await findReply(replyID);
        
        //reply does not exist
        if (reply.rows.length === 0) {
            throw CustomError(404, "Reply not found");
        }

        // reply does not belong to user accessing api route
        if (reply.rows[0].user_id !== userID) {
            throw CustomError(403, "Permission denied.");
        }

        //insert the reply into replies table
        await removeReply(replyID);
        res.status(204).send("Reply was deleted")
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}