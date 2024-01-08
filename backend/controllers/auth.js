// contains handlers (functions) for all login/logout related HTTP requests

import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { insertUser, findUser, insertToken, findToken, removeToken } from "../models/auth";
import CustomError from "../error";

export async function registration(req, res) {
    try {
        const { username, password } = req.body;
        const existingUser = findUser(username);
      
        if (existingUser.rows.length > 0) {
            throw CustomError(400, "Username is already taken");
        }

        const hashedPassword = await bcrypt.hash(password, 10); //10 corresponds to the salt generated
        await insertUser(username, hashedPassword);
        res.status(201).send("User registered successfully");
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}

export async function logIn(req, res) {
    try {
        const { username, password } = req.body;
        const user = await findUser(username);

        //compare the input pw and the hashed pw stored in the db
        if (user.rows.length === 0 || !await bcrypt.compare(password, user.rows[0].password_hash)) {
            throw CustomError(401, "Invalid username or password");
        }
        
        // payload that is attached to the jwt
        const jwtUser = { name: username, id: user.rows[0].id };

        const accessToken = generateAccessToken(jwtUser); //short-term use, expires after some set time
        const refreshToken = jsonwebtoken.sign(jwtUser, process.env.REFRESH_TOKEN_SECRET); //longer-term, valid until the user chooses to logout

        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await insertToken(username, hashedToken); // stores the refresh token in the database

        //stores both JWTs as cookies
        res.cookie("accessToken", accessToken, {httpOnly: true, secure: true});
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});

        //returns user data as JSON in response body
        res.status(204).json(user.rows[0]);
    } catch(error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        }
    }
}

export function authenticateToken(req, res, next) {
    const token = req.cookies.accessToken; // retrieve the jwt stored in a cookie in the HTTP request

    if (token == null) {
        throw CustomError(401, "Invalid username or password");
    }

    jsonwebtoken.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err) {
            throw CustomError(403, "Permission denied: Invalid token");
        }
        req.user = user; // stores the user data in the request object which will be passed to the next middleware
        next();
    })
}

export async function refreshToken (req, res) {
    try {
        const refreshToken = req.cookie.refreshToken;
        const userID = req.user.id;
        if (refreshToken === null) {
            throw CustomError(401, "Invalid user token");
        }

        // find the refreshToken stored in db
        const token = await findToken(userID);

        // if token cannot be found or token is incorrect, deny new access token
        if (token.rows.length === 0 || !await bcrypt.compare(refreshToken, token.rows[0].refresh_token_hash)) {
            throw CustomError(403, "Permission denied: Invalid token");
        }

        // if token is the same as the one stored in the db, verify it with the secret key and return a new access token if verified
        jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                throw CustomError(403, "Permission denied: Invalid token");
            }
            const newAccessToken = generateAccessToken({name: user.name, id: user.id});
            
            //writes over the old access JWT with the new one
            res.cookie("accessToken", newAccessToken, {httpOnly: true, secure: true}); 
            res.status(201).send("Session extended successfully")
        });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}

export async function logOut(req, res) {
    try {
        const userID = req.user.id;

        // delete refresh token and user details from active user table
        await removeToken(userID);
        res.status(204).send("Logout successful");
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).json({error: error.message});
        } else {
            res.status(500).json({error: error.message});
        } 
    }
}

function generateAccessToken(user) {
    return jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
  }