// handles SQL querying for each individual thread
import { pool } from "./db.js";

export async function getAllReplies(threadID) {
    try {
        // use a recursive tree to call all replies and assign levels to them (level 1 means direct reply to thread, level 2 are the replies to level 1 replies, etc)
        const getRepliesQuery = {
            text: 
            `SELECT replies.id, users.username, replies.content, replies.created_at
                FROM replies JOIN users 
                ON replies.user_id = users.id
                WHERE thread_id = $1`,
            values: [threadID]
        }
        const { rows } = await pool.query(getRepliesQuery);
        return rows;
    } catch(error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function addNewReply(userID, threadID, content) {
    try {
        const newReplyQuery = {
            text: 
            `INSERT INTO replies(user_id, thread_id, content) 
                VALUES($1, $2, $3)`,
            values: [userID, threadID, content],
        };
        return await pool.query(newReplyQuery);
    } catch (error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function findReply(replyID) {
    try {
        const findReplyQuery = {
            text: 
            `SELECT * FROM replies
                WHERE id=$1`,
            values: [replyID],
        };
        return await pool.query(findReplyQuery);
    } catch (error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function removeReply(replyID) {
    try {
        // we set the content to null, so whenever we encounter a null value, we know that the reply was deleted (all other replies should have non-null content)
        const removeReplyQuery = {
            text: "UPDATE replies SET content = NULL WHERE id=$1",
            values: [replyID],
        };
        return await pool.query(removeReplyQuery);
    } catch(error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}