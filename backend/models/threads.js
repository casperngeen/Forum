// handles SQL querying for threads

import { pool } from "./db.js";

export async function getThreadsQuery() {
    try {
        const getThreadsQuery = {
            text: `SELECT threads.id, threads.title, threads.content, threads.created_at, threads.edited, users.username
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

export async function getSingleThreadQuery(threadID) {
    try {
        const getThreadsQuery = {
            text: `SELECT threads.id, threads.title, threads.content, threads.created_at, threads.edited, users.username
             FROM threads JOIN users
             ON threads.user_id = users.id
             WHERE threads.id=$1`,
             values: [threadID]
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

export async function addEditedThread(threadID, newContent) {
    try {
        const newThreadQuery = {
            text: 
            `UPDATE threads
                SET content=$2, edited=true
                WHERE id=$1`,
            values: [threadID, newContent]
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
            `DELETE FROM replies r 
            WHERE thread_id = $1`,
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