import type { Request, Response } from 'express';

export const createPractice = (req: Request, res: Response) => {
    try {
        res.cookie("inpractice", "true", {
            maxAge: 1000 * 60 * 60 * 2, // 2 hours,
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        })

        res.status(201).json({success: true, message: "Practice session created."});
    } catch (err: any) {
        console.log("Error in creating practice.", err);
        res.status(500).json({success: false, message: "Practice creation failed."});
    }
}

export const inPractice = (req: Request, res: Response) => {
    try {
        const { inpractice } = req.cookies;

        if (!inpractice) return res.status(404).json({success: false, message: "Practice session cookie not found"});

        res.status(201).json({success: true, inpractice: true});
    } catch (err: any) {
        console.log("Error in checking if user in practice.", err);
        res.status(500).json({success: false, message: "Practice checking failed."});
    }
}