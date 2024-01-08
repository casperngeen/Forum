// handles all the SQL querying, database management logic
import pool from "../../mvc/solution-code/models/database";

export async function insertUser(username, hash) {
    try {
        const insertUserQuery = {
            text: "INSERT INTO users(username, password_hash) VALUES($1, $2)",
            values: [username, hash] 
        }
        return await pool.query(insertUserQuery); //returns a promise
    } catch (error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function findUser(username) {
    try {
        const findUserQuery = {
            text: "SELECT * FROM users WHERE username = $1",
            values: [username]
        }

        return await pool.query(findUserQuery); //returns a promise
    } catch (error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function insertToken(username, hash) {
    try {
        const insertTokenQuery = {
            text: "INSERT INTO activeUsers(user_id, refresh_token_hash) SELECT id, $2 FROM users WHERE username=$1",
            values: [username, hash] 
        }
        return await pool.query(insertTokenQuery);
    } catch (error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function findToken(userID) {
    try {
        const findTokenQuery = {
            text: "SELECT * FROM activeUsers user_id = $1",
            values: [userID]
        }
        return await pool.query(findTokenQuery); //returns a promise
    } catch (error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}

export async function removeToken(userID) {
    try {
        const removeTokenQuery = {
            text: 
            `DELETE FROM activeUsers WHERE user_id=$1`,
            values: [userID] 
        }
       return await pool.query(removeTokenQuery); //returns a promise
    } catch (error) {
        console.error("Error querying SQL: ", error);
        throw error;
    }
}