import express, { type Request, type Response } from 'express'
import { login, register } from '../controllers/auth/auth.controller.ts';
import type AuthorizedUserRequest from "../types/AuthorizedUserRequest.ts";
import { authorizeUser } from '../middleware/authorization.ts';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", authorizeUser, (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    });

    res.status(200).json({success: true, message: "Successfully logged out"});
})

router.get("/", authorizeUser, (req: AuthorizedUserRequest, res: Response ) => {
    res.status(200).json({success: true, user: req.user})
})

export default router;