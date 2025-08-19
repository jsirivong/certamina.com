import type { Request, Response } from "express";
import type { RegisterData, User } from "./auth.types.ts";
import sql from "../../config/database.ts";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { hashPassword } from "../../services.ts/hashpassword.ts";

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

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, email }: RegisterData = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: "Please provide all credentials." });
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
            secure: true, 
            httpOnly: false, // only in development, true for production
            maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
            sameSite: "strict" // stops XSS attacks (cross-site scripting)
        })

        res.status(201).json({ success: true, user: user })
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error." })
        console.error("Error in auth controller.\n", err);
    }
}