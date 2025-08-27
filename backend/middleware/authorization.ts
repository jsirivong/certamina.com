import { type Request, type Response, type NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import sql from '../config/database.ts';
import type User from '../types/User.ts';
import type AuthorizedUserRequest from '../types/AuthorizedUserRequest.ts';

export const authorizeUser = async (req: AuthorizedUserRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ success: false, message: "Token does not exist." });

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

        if (!decoded?.sub) {
            return res.status(401).json({ success: false, message: "Token is not valid." });
        }

        const [user] = await sql`SELECT username, email FROM users WHERE id=${decoded.sub};` as User[];

        if (!user) return res.status(401).json({success: false, message: "User not found in database."});

        req.user = user;

        next();
    } catch (err) {
        console.log("Error in authorizing user.\n", err);
        next(err);
    }
}