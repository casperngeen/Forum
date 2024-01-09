// handles SQL querying for threads

import { pool } from "./db.js";

export async function getThreadsQuery() {
    try {
        const getThreadsQuery = {
            text: `SELECT threads.id, threads.title, threads.content, threads.created_at, users.username
             FROM threads JOIN users 
             ON threads.user_id = users.id`
        };
        const { rows } = await pool.query(getThreadsQuery);
        return rows;
    } catch (error) {
        console.error("Error executing SQL query: ", error);
        throw error; //error is thrown to be caught in the promise above
    }
}

export async function newThreadQuery(userID, title, content) {
    try {
        const newThreadQuery = {
            text: 
            `INSERT INTO threads (user_id, title, content) 
                VALUES ($1, $2, $3)`,
            values: [userID, title, content]
        };
        return await pool.query(newThreadQuery);
    } catch (error) {
        console.error("Error executing SQL query: ", error);
        throw error; //error is thrown to be caught in the promise above
    }
}

export async function removeThreadQuery(threadID) {
    try {
        const removeThreadQuery = {
            text: 'DELETE FROM threads WHERE id=$1',
            values: [threadID]
        };
        return await pool.query(removeThreadQuery);
    } catch (error) {
        console.error("Error executing SQL query: ", error);
        throw error; //error is thrown to be caught in the promise above
    }
}

export async function removeRepliesOfThread(threadID) {
    try {
        const removeRepliesOfThreadQuery = {
            text: 
            `DELETE r 
            FROM replies r JOIN threads t 
            ON r.thread_id = t.id 
            WHERE t.id = $1`,
            values: [threadID]
        };
        return await pool.query(removeRepliesOfThreadQuery);
    } catch (error) {
        console.error("Error executing SQL query: ", error);
        throw error; //error is thrown to be caught in the promise above
    }
}

export async function findThread(threadID) {
    try {
        const findThreadQuery = {
            text: 
            `SELECT * FROM threads WHERE id = $1`,
            values: [threadID]
        };
        return await pool.query(findThreadQuery);
    } catch (error) {
        console.error("Error executing SQL query: ", error);
        throw error; //error is thrown to be caught in the promise above
    }
}