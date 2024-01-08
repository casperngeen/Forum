// handles SQL querying for each individual thread
import pool from "../../mvc/solution-code/models/database";

export async function getAllReplies(threadID) {
    try {
        // use a recursive tree to call all replies and assign levels to them (level 1 means direct reply to thread, level 2 are the replies to level 1 replies, etc)
        const getRepliesQuery = {
            text: 
            `WITH RECURSIVE ReplyTree AS (
                SELECT replies.id, users.username, replies.parent_id, replies.content, replies.created_at, 1 AS level
                FROM replies
                JOIN users ON replies.user_id = users.id
                WHERE thread_id = $1 AND parent_id IS NULL
                
                UNION ALL
                
                SELECT r.id, u.username, r.parent_id, r.content, r.created_at, rt.level + 1
                FROM replies r
                JOIN ReplyTree rt ON r.parent_id = rt.id
                JOIN users u ON r.user_id = u.id
            ) 
            SELECT id, username, parent_id, content, created_at, level
            FROM ReplyTree
            ORDER BY level, created_at;`,
            values: [threadID]
        }
        return await pool.query(getRepliesQuery);
    } catch(error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function addNewReply(userID, threadID, parentID, content) {
    try {
        const newReplyQuery = {
            text: 
            `INSERT INTO replies(user_id, thread_id, parent_id, content) 
                VALUES($1, $2, $3, $4)`,
            values: [userID, threadID, parentID, content],
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