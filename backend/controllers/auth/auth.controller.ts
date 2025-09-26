import type { NextFunction, Request, Response } from "express";
import type { LoginData, RegisterData } from "./auth.types.ts";
import type User from "../../types/User.ts";
import { sql } from "../../lib/database.ts";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { hashPassword, comparePassword } from "../../services/password.ts";

const validateEmailFormat = (email: string): boolean => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    return emailRegex.test(email);
}

const verifyEmailUniqueness = async (email: string): Promise<boolean> => {
    const [user] = await sql`SELECT * FROM users WHERE email=${email};`;

    if (user) {
        return false;
    }

    return true;
}

const verifyUsernameUniqueness = async (username: string): Promise<boolean> => {
    const [user] = await sql`SELECT * FROM users WHERE username=${username};`;

    if (user) {
        return false;
    }

    return true;
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password }: LoginData = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all credentials." });
        }

        const [user] = await sql`SELECT * FROM users WHERE email=${email};` as User[];

        if (!user) { return res.status(404).json({ success: false, message: "Email does not exist." }) }

        if (!await comparePassword(password, user.password)) return res.status(404).json({ success: false, message: "Password does not match." });

        const payload: JwtPayload = {
            sub: user.id.toString()
        }

        const options: jwt.SignOptions = {
            // automatically adds "iat" and "exp" claims in payload
            expiresIn: "1d"
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, options)

        res.cookie("token", token, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: process.env.NODE_ENV === "production", // only in development, true for production
            maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
            sameSite: "none", // "strict" stops XSS attacks (cross-site scripting)
        })

        res.status(200).json({ success: true, user: user })
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error." });
        console.log("Error in login controller.\n", err);
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, email }: RegisterData = req.body;

        if (username.length < 6) {
            return res.status(400).json({ success: false, message: "Username must be at least 6 characters long." });
        }

        if (username.length > 25) {
            return res.status(400).json({ success: false, message: "Username cannot be more than 25 characters long." })
        }

        if (username.length > 25){
            return res.status(400).json({ success: false, message: "Username cannot be more than 25 characters long."})
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
        }

        if (!validateEmailFormat(email)) {
            return res.status(400).json({ success: false, message: "Provide a proper email format." });
        }

        if (!await verifyEmailUniqueness(email)) {
            return res.status(400).json({ success: false, message: "Email is already taken." });
        }

        if (!await verifyUsernameUniqueness(username)) {
            return res.status(400).json({ success: false, message: "Username is already taken." });
        }

        const hashedPassword = await hashPassword(password);

        const [user] = await sql`INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${hashedPassword}) RETURNING *` as User[]

        const payload: JwtPayload = {
            sub: user.id.toString()
        }

        const options: jwt.SignOptions = {
            // automatically adds "iat" and "exp" claims in payload
            expiresIn: "1d"
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, options)

        res.cookie("token", token, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: process.env.NODE_ENV === "production", // only in development, true for production
            maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
            sameSite: "none", // "strict" stops XSS attacks (cross-site scripting)
        })

        return res.status(201).json({ success: true, user: user })
    } catch (err) {
        console.error("Error in auth controller.\n", err);
        return res.status(500).json({ success: false, message: "Internal server error.", error: err })
    }
}